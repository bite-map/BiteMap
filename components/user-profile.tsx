"use client";

import React, { useState, useEffect } from "react";
import { signOutAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/client";
import { UserMetadata } from "@supabase/supabase-js";
import { getFavoriteTruck } from "@/app/database-actions";
import FavoriteTruckCard from "./food-truck/favorite-truck-card";
import { IoHeart } from "react-icons/io5";
import { MdOutlineRateReview } from "react-icons/md";
import { LuHistory } from "react-icons/lu";

export default function UserProfile() {
  const supabase = createClient();

  const [user, setUser] = useState<UserMetadata | undefined>(undefined);
  const [favoriteTrucks, setFavoriteTrucks] = useState<any[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    (async () => {
      const session = await supabase.auth.getSession();
      setUser(session.data.session?.user.user_metadata);
    })();
  }, []);

  const handleFavorite = async () => {
    const session = await supabase.auth.getSession();
    const profileId = session.data?.session?.user.id;

    // if user is connected, will retrieve the favorites trucks from the user
    if (profileId) {
      const favoriteTruckData = await getFavoriteTruck(profileId);
      setFavoriteTrucks(favoriteTruckData);
      setShowFavorites(true);
    }

    // if we click the favorite button after displaying it, it will return and hide the favorite trucks
    if (showFavorites) {
      setShowFavorites(false);
      return;
    }
  };

  const handleReviews = () => {
    console.log("Reviews clicked");
  };

  const handleSightingHistory = () => {
    console.log("Sighting History clicked");
  };

  return (
    <div className="p-1">
      <h2 className="text-xl font-semibold text-primary">Personal Details</h2>
      <div>
        <p>
          {" "}
          <span className="font-semibold">Name:</span>{" "}
          {user && user.display_name}
        </p>
        <p>
          {" "}
          <span className="font-semibold">Email:</span> {user && user.email}
        </p>
      </div>
      <div className="flex flex-wrap justify-evenly gap-1 p-2">
        <button
          className="flex jusitfy-center items-center gap-1 bg-muted text-primary font-semibold hover:text-white py-0.5 px-1 border border-primary hover:border-transparent rounded"
          onClick={handleFavorite}
        >
          <IoHeart /> Favorite
        </button>
        <button
          className="flex jusitfy-center items-center gap-1 bg-muted text-primary font-semibold hover:text-white py-0.5 px-1 border border-primary hover:border-transparent rounded"
          onClick={handleReviews}
        >
          <MdOutlineRateReview /> Reviews
        </button>
        <button
          className="flex jusitfy-center items-center gap-1 bg-muted text-primary font-semibold hover:text-white py-0.5 px-1 border border-primary hover:border-transparent rounded"
          onClick={handleSightingHistory}
        >
          <LuHistory /> Sighting History
        </button>
        <button
          className="bg-muted text-primary font-semibold hover:text-white py-0.5 px-1 border border-primary hover:border-transparent rounded"
          onClick={signOutAction}
        >
          Log Out
        </button>
      </div>

      {showFavorites && (
        <div>
          <h1>Favorite Trucks</h1>
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
    </div>
  );
}
