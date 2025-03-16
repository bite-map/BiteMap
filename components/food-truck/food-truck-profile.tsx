"use client";

import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
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
  const [activeTab, setActiveTab] = useState<"sightings" | "reviews">(
    "sightings"
  );
  const [foodTruck, setFoodTruck] = useState<Truck | null>(null);
  const [sightings, setSightings] = useState<any[] | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isDisplayedAddReview, setIsDisplayedAddReview] = useState(false);

  const handleToggleAddReview = () => {
    console.log("Toggling review form:", !isDisplayedAddReview);
    setIsDisplayedAddReview((prev) => !prev)
  }

  useEffect(() => {
    (async () => {
      setFoodTruck(await getFoodTruckDataById(truckId));
      // get current favorite state
      setIsFavorite(await getIsFavorite(truckId));
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setSightings(await getSightingByTruckId(truckId));
    })();
  }, [foodTruck]);

  useEffect(() => {
    // reload to switch btn
  }, [isFavorite]);

  // incoming

  // const handleToggleFavorite = () => {
  // setIsFavorited((previous) => !previous);
  // };

  return (
    <div className="p-3">
      {foodTruck && (
        <div className="rounded-xl bg-background overflow-clip shadow-md">
          <Image
            className="h-[200px] object-cover"
            src={foodTruck.profile.avatar as string}
            alt="Picture of a food truck"
            width={600}
            height={600}
          ></Image>

          <div className="flex justify-between p-3">
            <div>
              <h2 className="text-lg font-semibold text-primary">
                {foodTruck.name}
              </h2>
              <p>{foodTruck.food_style}</p>
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
          Add Review(TEST)
        </button>

        {isDisplayedAddReview && (
          <AddReviewFoodTruckForm handleToggle={handleToggleAddReview} truckId={truckId}/>
        )}
    </div>
  );
}
