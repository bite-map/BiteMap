"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Sighting, Truck } from "../global-component-types";
import {
  getFoodTruckDataById,
  getSightingByTruckId,
  toggleFavorite,
  getIsFavorite,
} from "@/app/database-actions";
import SightingCard from "./sighting-card";
import { IoMdHeart } from "react-icons/io";
import AddReviewFoodTruckForm from "./add-or-edit-reviews";

type FoodTruckProfileProps = {
  truckId: number;
};

export default function FoodTruckProfile({ truckId }: FoodTruckProfileProps) {
  const [activeTab, setActiveTab] = useState<"sightings" | "reviews">("sightings");
  const [foodTruck, setFoodTruck] = useState<Truck | null>(null);
  const [sightings, setSightings] = useState<any[] | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isDisplayedAddReview, setIsDisplayedAddReview] = useState(false);

  const handleToggleAddReview = () => {
    setIsDisplayedAddReview((prev) => !prev);
  };

  useEffect(() => {
    (async () => {
      const truckData = await getFoodTruckDataById(truckId);

      // Assuming foodTruckData is the structure we receive
      if (truckData) {
        const structuredTruck = {
          ...truckData,
          profile: {      // the problem we were having is because was trying to access the avatar directly, so i create this function to do manually
            avatar: truckData.avatar,  // attach avatar directly if present
            name: truckData.name,
            food_style: truckData.food_style,
          },
        };
        setFoodTruck(structuredTruck);
      }

      // Get current favorite state
      setIsFavorite(await getIsFavorite(truckId));
    })();
  }, [truckId]);

  useEffect(() => {
    (async () => {
      setSightings(await getSightingByTruckId(truckId));
    })();
  }, [foodTruck]);

  useEffect(() => {
    // Reload or handle the switch button for favorites
  }, [isFavorite]);

  return (
    <div className="p-3">
      {foodTruck && (
        <div className="rounded-xl bg-background overflow-clip shadow-md">
          <Image
            className="h-[200px] object-cover"
            src={foodTruck.profile?.avatar || "/default-food-truck.jpg"} // Access avatar here
            alt={foodTruck.profile?.name || "Food Truck"}
            width={600}
            height={600}
          />

          <div className="flex justify-between p-3">
            <div>
              <h2 className="text-lg font-semibold text-primary">
                {foodTruck.profile?.name}
              </h2>
              <p>{foodTruck.profile?.food_style}</p>
            </div>
            <button
              style={{
                color: isFavorite ? "red" : "gray",
              }}
              onClick={async () => {
                try {
                  const data = await toggleFavorite(truckId);
                  setIsFavorite(data);
                } catch (error) {
                  console.error(error);
                }
              }}
            >
              <IoMdHeart />
            </button>
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
          <div className="flex flex-col gap-y-2">
            {sightings ? (
              sightings.map((sighting) => (
                <SightingCard key={sighting.id} sightingData={sighting} />
              ))
            ) : (
              <p>No sighting available</p>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            <p>No reviews available</p>
          </div>
        )}
      </div>
      <button
        className="bg-primary text-background py-2 px-4 rounded mt-4"
        onClick={handleToggleAddReview}
      >
        Add Review (TEST)
      </button>

      {isDisplayedAddReview && (
        <AddReviewFoodTruckForm handleToggle={handleToggleAddReview} truckId={truckId} />
      )}
    </div>
  );
}
