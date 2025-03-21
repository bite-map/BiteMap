"use client";
import React, { useEffect, useState } from "react";
import { Truck, Location } from "./../global-component-types";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaSpinner, FaMapMarkerAlt } from "react-icons/fa";
import {
  getNearbyTruckFullInfo,
  getNewFoodTrucks,
  getAllSighConfirmationsByDayLocationId,
  getSightingsByLastActiveOfTruck,
} from "@/app/database-actions";
import { getLocation } from "../map/geo-utils";
import { createToast } from "@/utils/toast";
import { ToastContainer } from "react-toastify";
import FoodTruckCardRecent from "./food-truck-card-recent";
import { montserrat, ranchers } from "../fonts";

type FoodTruckCardProps = {};

export default function FoodTruckCardLanding({}: FoodTruckCardProps) {
  const [location, setLocation] = useState<Location | null>(null);
  const [trucks, setTrucks] = useState<any[]>([]);
  const [newTrucks, setNewTrucks] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationDenied, setLocationDenied] = useState<boolean>(false);
  // Store chances by truck ID and location
  const [truckLocationChances, setTruckLocationChances] = useState<
    Map<number, Map<string, number>>
  >(new Map());

  const locationToast = createToast(
    "Location permissions denied! This app relies heavily on geolocation. Please consider refreshing to grant location access.",
    "error",
    10000
  );

  useEffect(() => {
    getLocation(setLocation, setLocationDenied);
  }, []);

  // Fetch nearby trucks based on user location
  useEffect(() => {
    const fetchTruck = async () => {
      if (location) {
        setLoading(true); // set loading state while getting data

        // get nearby trucks using the users location(lat, lng) with radius os 2500 meters
        const trucksWithFullInfo = await getNearbyTruckFullInfo(
          location.lat,
          location.lng,
          2500
        );
        console.log("Fetched trucks: ", trucksWithFullInfo);
        setTrucks(trucksWithFullInfo); // update state with the nearby trucks
        setLoading(false); // reset
      }
    };

    fetchTruck();

    // if the location changes, will reset the trucks and trucks location
    return () => {
      setTrucks([]);
      setTruckLocationChances(new Map());
    };
  }, [location]); // if location update, will run the code

  // calculate the changes of the food truck being in the determined location on a given day
  useEffect(() => {
    const calculateChancesForTrucks = async () => {
      if (trucks.length > 0) {
        const newTruckLocationChances = new Map<number, Map<string, number>>(); // store chances per truck and locations
        const dayOfWeek = new Date().getDay(); // get the current day of the week

        // iterate and check each truck to analyze this way the past sightings
        for (let truck of trucks) {
          const truckId = truck.truck_id;

          // Get all sightings for this truck (to get all possible locations)
          const sightings = await getSightingsByLastActiveOfTruck(truckId);

          if (sightings && sightings.length > 0) {
            const locationChancesMap = new Map<string, number>();

            // go through each sighting location for this truck to check for confimations
            for (let sighting of sightings) {
              const locationAddress = sighting.address_formatted;

              // Get confirmations for this truck at this location on this day
              const confirmations =
                await getAllSighConfirmationsByDayLocationId(
                  truckId,
                  locationAddress,
                  dayOfWeek
                );

              const confirmationCount = confirmations?.length || 0; // if no confimations is found, default is 0

              if (confirmationCount > 0) {
                // stores the confimation count per location
                locationChancesMap.set(locationAddress, confirmationCount);
              }
            }

            // Normalize chances for this truck's locations
            const totalConfirmations = Array.from(
              locationChancesMap.values()
            ).reduce((acc, val) => acc + val, 0);

            if (totalConfirmations > 0) {
              // get the chances for each location based on the total confirmations
              locationChancesMap.forEach((count, locationAddress) => {
                const maxChance = Math.min(count / totalConfirmations, 0.9); // chance will be max 90% to prevent overconfidence
                locationChancesMap.set(locationAddress, maxChance); // update the chances
              });

              // Store the chances map for this truck
              newTruckLocationChances.set(truckId, locationChancesMap);
            }
          }
        }

        console.log(
          "Setting truck location chances map:",
          newTruckLocationChances
        );
        setTruckLocationChances(newTruckLocationChances);
      }
    };

    calculateChancesForTrucks();
  }, [trucks]); // if the truck data is update, will trigger this code

  useEffect(() => {
    (async () => {
      setNewTrucks(await getNewFoodTrucks());
    })();

    if (locationDenied && locationToast) {
      locationToast();
    }
  }, [locationDenied]);

  return (
    <>
      <div className="flex flex-col gap-4 p-3 bg-muted min-h-screen">
        {!locationDenied ? (
          loading ? (
            <p className="flex items-center gap-2 h-full w-full">
              Loading Nearby Food Trucks{" "}
              <FaSpinner className="animate-[spin_2s_ease-in-out_infinite] text-primary" />
            </p>
          ) : trucks?.length === 0 || !trucks ? (
            <FoodTruckCardRecent trucks={newTrucks} />
          ) : (
            <>
              <h1
                className={`${montserrat.className} text-3xl text-primary tracking-tight`}
              >
                <strong>Nearby Food Trucks</strong>
              </h1>
              {/* Display nearby trucks */}
              {trucks.map((truck) => {
                const truckId = truck.truck_id;
                const locationAddress = truck.sighting_address_formatted;
                const chancesForTruck = truckLocationChances.get(truckId);
                const chanceForThisLocation =
                  chancesForTruck?.get(locationAddress);

                return (
                  <div key={`${truckId}_${locationAddress}`}>
                    <Link href={`/truck-profile/${truckId}`}>
                      <div className="rounded-xl bg-background overflow-clip shadow-md ring-1 ring-primary width-full">
                        <Image
                          className="h-[200px] object-cover"
                          src={truck.truck_avatar}
                          alt="Picture of a food truck"
                          width={600}
                          height={600}
                        />
                        <div className="flex flex-row">
                          <div className="px-3 py-2 truncate">
                            <h2 className="text-xl font-semibold truncate">
                              {truck.truck_name}
                            </h2>
                            <p className="-mt-1 text-sm text-gray-500">
                              {truck.truck_food_style}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {locationAddress}
                            </p>
                            {Math.floor(truck.nearest_dist_meters) < 1000 ? (
                              Math.floor(truck.nearest_dist_meters) <= 5 ? (
                                <span className="flex gap-1 items-center mt-1">
                                  <FaMapMarkerAlt className="text-primary mr-1" />
                                  <p>You are here</p>
                                </span>
                              ) : (
                                <span className="flex gap-1 items-center mt-1">
                                  <FaMapMarkerAlt className="text-primary mr-1" />
                                  <p>{`${Math.floor(truck.nearest_dist_meters)}m from you`}</p>
                                </span>
                              )
                            ) : (
                              <span className="flex gap-1 items-center mt-1">
                                <FaMapMarkerAlt className="text-primary mr-1" />
                                <p>{`${(truck.nearest_dist_meters / 1000).toFixed(1)}km from you`}</p>
                              </span>
                            )}
                            {/* display the chance of sighting for the specific location */}
                            {chanceForThisLocation !== undefined && (
                              <div className="mt-2 text-sm text-primary">
                                <strong>
                                  Chance of being at this location:{" "}
                                </strong>
                                {Math.round(chanceForThisLocation * 100)}%
                              </div>
                            )}
                          </div>
                          <div className="flex justify-center items-center text-background text-2xl ml-auto bg-primary w-16 min-w-16">
                            <FaArrowRight size={24} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </>
          )
        ) : (
          <FoodTruckCardRecent trucks={newTrucks} />
        )}
      </div>
      <ToastContainer />
    </>
  );
}
