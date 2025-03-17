"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { UserMetadata } from "@supabase/supabase-js";
import { getFavoriteTruck } from "@/app/database-actions";
import {
  getSightingData,
  getSightingsOfUser,
  getSightingBySightingId,
} from "@/app/database-actions";
import { getReviewsData } from "@/app/database-actions";
import Image from "next/image";
import SightingCard from "./food-truck/sighting-card";
import FoodTruckCardProfile from "./food-truck/food-truck-card-profile";
import ReviewCard from "./food-truck/reviews-card";

export default function UserProfile() {
  const supabase = createClient();

  const [user, setUser] = useState<UserMetadata | undefined>(undefined);
  const [favoriteTrucks, setFavoriteTrucks] = useState<any[]>([]);
  const [sightingData, setSightingData] = useState<any[]>([]);
  const [reviewsData, setReviewsData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<
    "favorites" | "sightings" | "reviews"
  >("favorites");

  useEffect(() => {
    (async () => {
      const session = await supabase.auth.getSession();
      setUser(session.data.session?.user.user_metadata);
    })();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      const session = await supabase.auth.getSession();
      const profileId = session.data?.session?.user.id;
      if (profileId) {
        const favoriteTruckData = await getFavoriteTruck(profileId);
        setFavoriteTrucks(favoriteTruckData);
      }
    };

    const fetchSightings = async () => {
      const data = await getSightingsOfUser();

      setSightingData(data);
    };

    const fetchReviews = async () => {
      const session = await supabase.auth.getSession();
      const profileId = session.data?.session?.user.id;

      if (profileId) {
        const reviewsData = await getReviewsData(profileId);
        setReviewsData(reviewsData);
      }
    };
    // Call the async function
    fetchReviews();
    fetchSightings();
    fetchFavorites();
  }, []);

  return (
    <div className="p-4">
      {/* center profile image */}
      <div className="flex justify-center mb-2">
        {/* from joe code (food truck card) */}
        <Image
          className="rounded-full items-center h-[125px] w-[125px] object-cover"
          src={
            "https://qieslzondvbkbokewujq.supabase.co/storage/v1/object/public/BiteMap//avatar.png"
          }
          alt="Profile picture"
          width={200}
          height={200}
        ></Image>
      </div>
      <div>
        <p className="flex justify-center text-2xl font-semibold text-primary">
          {user && user.display_name}
        </p>
        <p className="flex justify-center mb-2">{user && user.email}</p>
      </div>

      <div className="border-b border-gray-200 mt-4">
        <nav className="flex -mb-px">
          {["favorites", "reviews", "sightings"].map((tab) => (
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
      <div className="relative pt-3">
        {activeTab === "favorites" && (
          <div className="grid grid-cols-2 gap-4">
            {favoriteTrucks.length > 0 ? (
              favoriteTrucks.map((truck) => (
                <FoodTruckCardProfile
                  key={truck.food_truck_id}
                  foodTruck={truck}
                />
              ))
            ) : (
              <p>No favorite trucks found</p>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="grid grid-cols-1 gap-y-3">
            {reviewsData.length > 0 ? (
              reviewsData.map((review) => (
                <ReviewCard key={review.id} reviewsData={review} />
              ))
            ) : (
              <p>No reviews available</p>
            )}
          </div>
        )}

        {activeTab === "sightings" && (
          <div className="grid grid-cols-1 gap-y-2">
            {sightingData.length > 0 ? (
              sightingData.map((sighting) => (
                <SightingCard key={sighting.id} sightingData={sighting} />
              ))
            ) : (
              <p>No sighting available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
