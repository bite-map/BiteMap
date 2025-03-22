"use client";
import React, { useEffect, useState } from "react";
import { Truck, Location } from "./../global-component-types";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaSpinner, FaMapMarkerAlt } from "react-icons/fa";
import { getNearbyTruckFullInfo, getFoodNewTrucks, getAllSighConfirmationsByDayLocationId } from "@/app/database-actions";
import { getLocation } from "../map/geo-utils";
import { createToast } from "@/utils/toast";
import { ToastContainer } from "react-toastify";
import FoodTruckCardRecent from "./food-truck-card-recent";
import { montserrat } from "../fonts";

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

  useEffect(() => {
    const calculateChancesForTrucks = async () => {
      if (trucks.length > 0 && location) {
        const chancesMap = new Map<string, number>();
        const dayOfWeek = new Date().getDay();

        for (let truck of trucks) {
          const confirmations = await getAllSighConfirmationsByDayLocationId(
            truck.truck_id,
            truck.sighting_address_formatted,
            dayOfWeek
          );

          const confirmationCount = confirmations.length;

          if (confirmationCount > 0) {
            const currentChance = chancesMap.get(truck.sighting_address_formatted) || 0;
            chancesMap.set(
              truck.sighting_address_formatted,
              currentChance + confirmationCount
            );
          }
        }

        // Normalize chances
        const totalConfirmations = Array.from(chancesMap.values()).reduce((acc, val) => acc + val, 0);

        if (totalConfirmations > 0) {
          chancesMap.forEach((count, address) => {
            const maxChance = Math.min(count / totalConfirmations, 0.9);
            chancesMap.set(address, maxChance);
          });
        }

        console.log("Setting chances map:", chancesMap);
        setLocationsChance(chancesMap);
      }
    };

    calculateChancesForTrucks();
  }, [trucks, location]); // This will run whenever trucks or location changes

  useEffect(() => {
    const fetchTruck = async () => {
      if (location) {
        setLoading(true);
        
        // Fetch full info of nearby trucks
        const trucksWithFullInfo = await getNearbyTruckFullInfo(location?.lat, location?.lng, 2500);
        console.log("Fetched trucks: ", trucksWithFullInfo);

        // Reset the trucks state if the location changes
        setTrucks(trucksWithFullInfo);
        setLoading(false); // Set loading to false after data is fetched
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
              {/* Display nearby trucks with chance calculations */}
              {trucks.map((truck) => {
                const chance = locationsChance.get(truck.sighting_address_formatted);
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
                          <div className="relative w-1/2 pt-3 pb-3 pl-3">
                            <h2 className="text-lg font-semibold text-primary">{truck.truck_name}</h2>
                            <p>{truck.truck_food_style}</p>
                          </div>
                          <div className="relative w-1/2 pt-3 pb-3 pr-3">
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
                          </div>
                          <div className="flex justify-center items-center text-background text-2xl ml-auto bg-primary w-16 min-w-16">
                            <FaArrowRight size={24} />
                          </div>
                        </div>
                        {/* Display the chance of sighting */}
                        {chance && (
                          <div className="mt-2 text-center text-sm text-primary">
                            <strong>Chance: </strong>{Math.round(chance * 100)}%
                          </div>
                        )}
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
