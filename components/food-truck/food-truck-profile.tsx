"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Sighting, Truck } from "../global-component-types";
import {
  getFoodTruckDataById,
  getSightingByTruckId,
} from "@/app/database-actions";

type FoodTruckProfileProps = {
  truckId: number;
};

export default function FoodTruckProfile({ truckId }: FoodTruckProfileProps) {
  const [activeTab, setActiveTab] = useState<"sightings" | "reviews">(
    "sightings"
  );
  const [foodTruck, setFoodTruck] = useState<Truck | null>(null);
  const [sightings, setSightings] = useState<Sighting[] | null>(null);

  useEffect(() => {
    (async () => {
      setFoodTruck(await getFoodTruckDataById(truckId));
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setSightings(await getSightingByTruckId(truckId));
    })();
  }, [foodTruck]);

  useEffect(() => {
    console.log(sightings);
  }, [sightings]);

  return (
    <div className="p-3">
      {foodTruck && (
        <div className="rounded-xl bg-background overflow-clip shadow-md">
          <Image
            className="h-[200px] object-cover"
            src={foodTruck.avatar as string}
            alt="Picture of a food truck"
            width={600}
            height={600}
          ></Image>

          <div className="flex">
            <div className="p-3">
              <h2 className="text-lg font-semibold text-primary">
                {foodTruck.name}
              </h2>
              <p>{foodTruck.food_style}</p>
            </div>
          </div>
        </div>
      )}
      <div className="border-b border-gray-200 mt-4">
        <nav className="flex -mb-px">
          {["sightings", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 px-4 py-3 text-center text-sm font-medium ${
                activeTab === tab
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } transition-colors duration-200`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>
      <div className="pt-3">
        {activeTab === "sightings" && (
          <div>
            {/* need to fetch sighting data */}
            {/* {sightingData.length > 0 ? (
              sightingData.map((sighting) => (
                <SightingCard key={sighting.id} sightingData={sighting} />
              ))
            ) : (
              <p>No sighting available</p>
            )} */}
            <p>TEST TAB 1</p>
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            <p>TEST TAB 2</p>
          </div>
        )}
      </div>
    </div>
  );
}
