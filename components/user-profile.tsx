"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { UserMetadata } from "@supabase/supabase-js";
import { getFavoriteTruck } from "@/app/database-actions";
import FavoriteTruckCard from "./food-truck/favorite-truck-card";
import Image from "next/image";


export default function UserProfile() {
  const supabase = createClient();

  const [user, setUser] = useState<UserMetadata | undefined>(undefined);
  const [favoriteTrucks, setFavoriteTrucks] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"favorites" | "sightings" | "reviews">("favorites");

  useEffect(() => {
    (async () => {
      const session = await supabase.auth.getSession();
      setUser(session.data.session?.user.user_metadata);
    })();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (activeTab === "favorites") {
        const session = await supabase.auth.getSession();
        const profileId = session.data?.session?.user.id;
        if (profileId) {
          const favoriteTruckData = await getFavoriteTruck(profileId);
          setFavoriteTrucks(favoriteTruckData);
        }
      }
    };
  
    fetchFavorites(); // Call the async function
  }, [activeTab]);

  return (
    <div className="p-4">
      {/* center profile image */}
      <div className="flex justify-center mb-2">

        {/* from joe code (food truck card) */}
      <Image
        className="rounded-full items-center h-[125px] w-[125px] object-cover"
        src={"https://qieslzondvbkbokewujq.supabase.co/storage/v1/object/public/BiteMap//avatar.png"}
        alt="Profile picture"
        width={200}
        height={200}
      ></Image>
      </div>
      {/* <h1>Personal Details</h1> */}
      <div>
        <p className="flex justify-center mb-2">
          {" "}
          <span className="font-semibold">Name:</span>{" "}
          {user && user.display_name}
        </p>
        <p className="flex justify-center mb-2">
          {" "}
          <span className="font-semibold">Email:</span> {user && user.email}
        </p>
      </div>

      <div className="border-b border-gray-200 mt-4">
    <nav className="flex -mb-px">
      {["favorites", "sightings", "reviews"].map((tab) => (
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
  <div className="p-6">
      {activeTab === "favorites" && (
        <div>
          {favoriteTrucks.length > 0 ? (
            favoriteTrucks.map((truck) => (
              <FavoriteTruckCard
                key={truck.food_truck_id}
                favoriteTruck={truck}
              />
            ))
          ) : (
            <p>No favorite trucks found</p>
          )}
          </div>
      )}

      {activeTab === "sightings" && (
        <div>
            <p>No sighting available</p>
        </div>
      )}

      {activeTab === "reviews" && (
        <div>
          <p>No reviews available</p>
        </div>
      )}
    </div>
</div>
)}

