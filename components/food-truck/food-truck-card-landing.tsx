"use client";
import React, { useEffect, useState } from "react";
import { Truck, Location } from "./../global-component-types";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaSpinner, FaMapMarkerAlt } from "react-icons/fa";
import { getNearbyTruckFullInfo, getNewFoodTrucks, getAllSighConfirmationsByDayLocationId } from "@/app/database-actions";
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
  const [locationsChance, setLocationsChance] = useState<Map<string, number>>(new Map());

  const locationToast = createToast(
    "Location permissions denied! This app relies heavily on geolocation. Please consider refreshing to grant location access.",
    "error",
    10000
  );

  useEffect(() => {
    getLocation(setLocation, setLocationDenied);
  }, []);

  // Calculate chances using the provided logic
  useEffect(() => {
    const calculateChancesForTrucks = async () => {
      if (trucks.length > 0 && location) {
        const chancesMap = new Map<string, number>();
        const dayOfWeek = new Date().getDay();

        // Group confirmations by truck ID to calculate percentages per truck
        const truckConfirmations = new Map<number, Map<string, number>>();

        // First pass: collect confirmation counts by truck and location
        for (let truck of trucks) {
          const truckId = truck.truck_id;
          const locationAddress = truck.sighting_address_formatted;

          if (!truckConfirmations.has(truckId)) {
            truckConfirmations.set(truckId, new Map<string, number>());
          }

          const confirmations = await getAllSighConfirmationsByDayLocationId(
            truckId,
            locationAddress,
            dayOfWeek
          );

          const confirmationCount = confirmations.length;

          if (confirmationCount > 0) {
            truckConfirmations.get(truckId)?.set(locationAddress, confirmationCount);
          }
        }

        // Second pass: normalize chances for each truck individually
        for (const [truckId, locationCounts] of truckConfirmations.entries()) {
          if(!locationCounts || locationCounts.size === 0) continue;

          const totalTruckConfirmations = Array.from(locationCounts.values()).reduce((sum, count) => sum + count, 0);

          if (totalTruckConfirmations > 0) {
            for (const [location, count] of locationCounts.entries()) {
              const normalizedChance = Math.min(count / totalTruckConfirmations, 0.9);
              const truckLocationKey = `${truckId}_${location}`;
              chancesMap.set(truckLocationKey, normalizedChance);
            }
          }
        }

        console.log("Setting chances map:", chancesMap);
        setLocationsChance(chancesMap);
      }
    };

    calculateChancesForTrucks();
  }, [trucks, location]);

  // Fetch nearby trucks
  useEffect(() => {
    const fetchTruck = async () => {
      if (location) {
        setLoading(true);
        const trucksWithFullInfo = await getNearbyTruckFullInfo(location?.lat, location?.lng, 2500);
        console.log("Fetched trucks: ", trucksWithFullInfo);
        setTrucks(trucksWithFullInfo);
        setLoading(false);
      }
    };

    fetchTruck();
    return () => {
      setTrucks([]);
      setLocationsChance(new Map());
    };
  }, [location]);

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
              <h1 className={`${montserrat.className} text-3xl text-primary tracking-tight`}>
                <strong>Nearby Food Trucks</strong>
              </h1>
              {/* display nearby trucks */}
              {trucks.map((truck) => {
                const truckLocationKey = `${truck.truck_id}_${truck.sighting_address_formatted}`;
                const chance = locationsChance.get(truckLocationKey);
                return (
                  <div key={truck.truck_id}>
                    <Link href={`/truck-profile/${truck.truck_id}`}>
                      <div className="rounded-xl bg-background overflow-clip shadow-md ring-1 ring-primary width-full">
                        <Image
                          className="h-[200px] object-cover"
                          src={truck.truck_avatar}
                          alt="Picture of a food truck"
                          width={600}
                          height={600}
                        />
                        <div className="flex flex-row">      
                          <div className="px-3 py-2 truncate ">
                              <h2 className="text-xl font-semibold truncate">
                                {truck.truck_name}
                              </h2>
                              <p className="-mt-1 text-sm text-gray-500">
                                {truck.truck_food_style}
                              </p>
                              {Math.floor(truck.nearest_dist_meters) < 1000 ? (
                                Math.floor(truck.nearest_dist_meters) <= 5 ? (
                                  <span className="flex gap-1 items-center mt-1">
                                    <FaMapMarkerAlt className="text-primary mr-1" />
                                    <p>{"You are here"}</p>
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
                              {/* Display the chance of sighting */}
                              {chance !== undefined && (
                                <div className="mt-2 text-center text-sm text-primary">
                                  <strong>Chance: </strong>{Math.round(chance * 100)}%
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
