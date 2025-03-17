"use client";
import React, { useEffect, useState } from "react";
import { Truck, Location } from "./../global-component-types";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { getNearbyTruck } from "@/app/database-actions";
import { getLocation } from "../map/geo-utils";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLocation(setLocation);
  }, []);

  useEffect(() => {
    const fetchTruck = async () => {
      if (location) {
        setLoading(true);
        const trucks = await getNearbyTruck(
          location?.lat,
          location?.lng,
          100000
        );

        setTrucks(trucks);
        setLoading(false);
      }
    };
    fetchTruck();
  }, [location]);
  return (
    <div className="flex flex-col gap-4 p-3 bg-muted">
      <h1 className="text-xl text-primary">
        <strong>Nearby Food Trucks You Might Like</strong>
      </h1>
      {loading ? (
        <p>Loading nearby food trucks ...</p>
      ) : trucks?.length === 0 || !trucks ? (
        <p>No food trucks found in your area.</p>
      ) : (
        trucks.map((truck) => {
          return (
            <div key={truck.id}>
              <Link href={`/truck-profile/${truck.id}`}>
                <div className="rounded-xl bg-background overflow-clip shadow-md ring-1 ring-primary">
                  <Image
                    className="h-[200px] object-cover"
                    src={truck.avatar}
                    alt="Picture of a food truck"
                    width={600}
                    height={600}
                  ></Image>
                  <div className="flex flex-row">
                    {/* <div className="p-3"> */}
                    <div className="relative w-1/2 pt-3 pb-3 pl-3">
                      <h2 className="text-lg font-semibold text-primary">
                        {truck.name}
                      </h2>
                      <p>{truck.food_style}</p>
                    </div>
                    <div className="relative w-1/2 pt-3 pb-3 pr-3">
                      <p className="text-sm m-1">{`${Math.floor(truck.nearest_dist_meters)} meters from you`}</p>
                    </div>
                    {/* we need to fix the link here currently just the map */}
                    <div className="flex justify-center items-center text-background text-2xl ml-auto bg-primary w-16">
                      <FaArrowRight />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })
      )}
    </div>
  );
}
