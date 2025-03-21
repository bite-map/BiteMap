"use client";
import React, { useEffect, useState } from "react";
import { Truck, Location } from "./../global-component-types";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaSpinner, FaMapMarkerAlt } from "react-icons/fa";
import { getNearbyTruck, getFoodNewTrucks } from "@/app/database-actions";
import { getLocation } from "../map/geo-utils";
import { createToast } from "@/utils/toast";
import { ToastContainer } from "react-toastify";
import FoodTruckCardRecent from "./food-truck-card-recent";
import { montserrat, ranchers } from "../fonts";

type FoodTruckCardProps = {
  // foodTruck: Truck;
};

export default function FoodTruckCardLanding(
  {
    // foodTruck,
  }: FoodTruckCardProps
) {
  const [location, setLocation] = useState<Location | null>();
  const [trucks, setTrucks] = useState<any[]>();
  const [newTrucks, setNewTrucks] = useState<any[] | null>();
  const [loading, setLoading] = useState(true);
  const [locationDenied, setLocationDenied] = useState<boolean>(false);

  const locationToast = createToast(
    "Location permissions denied! This app relies heavily on geolocation. Please consider refreshing to grant location access.",
    "error",
    10000
  );

  useEffect(() => {
    getLocation(setLocation, setLocationDenied);
  }, []);

  useEffect(() => {
    const fetchTruck = async () => {
      if (location) {
        setLoading(true);
        const trucks = await getNearbyTruck(location?.lat, location?.lng, 2500);

        setTrucks(trucks);
        setLoading(false);
      }
    };
    fetchTruck();
  }, [location]);

  useEffect(() => {
    (async () => {
      setNewTrucks(await getFoodNewTrucks());
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
                className={` ${montserrat.className} text-3xl text-primary tracking-tight`}
              >
                <strong>Nearby Food Trucks</strong>
              </h1>
              {/* display nearby trucks */}
              {trucks.map((truck) => {
                return (
                  <div key={truck.id}>
                    <Link href={`/truck-profile/${truck.id}`}>
                      <div className="rounded-xl bg-background overflow-clip shadow-md ring-1 ring-primary width-full">
                        <Image
                          className="h-[200px] object-cover"
                          src={truck.avatar}
                          alt="Picture of a food truck"
                          width={600}
                          height={600}
                        ></Image>
                        <div className="flex flex-row">
                          <div className="px-3 py-2 truncate">
                            <h2 className="text-xl font-semibold truncate">
                              {truck.name}
                            </h2>
                            <p className="-mt-1 text-sm">{truck.food_style}</p>

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
                            <FaArrowRight />
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
