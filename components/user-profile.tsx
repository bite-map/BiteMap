"use client";
import React, { useState, useEffect } from "react";
import { signOutAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/client";
import { UserMetadata } from "@supabase/supabase-js";
import { getFavoriteTruck } from "@/app/database-actions";
import FavoriteTruckCard from "./favorite-truck-card";


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
    if(profileId) {
      const favoriteTruckData = await getFavoriteTruck(profileId);
      setFavoriteTrucks(favoriteTruckData);
      setShowFavorites(true);
    }

    // if we click the favorite button after displaying it, it will return and hide the favorite trucks
    if(showFavorites) {
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
    <div>
      <h1>Personal Details</h1>
      <div>
        <p> Name: {user && user.display_name}</p>
        <p> Email: {user && user.email}</p>
      </div>
      <div>
        <button className = "bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-0.5 px-1 border border-blue-500 hover:border-transparent rounded" onClick={handleFavorite}>⭐️ Favorite</button>
        <button className = "bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-0.5 px-1 border border-blue-500 hover:border-transparent rounded" onClick={handleReviews}>Reviews</button>
        <button className = "bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-0.5 px-1 border border-blue-500 hover:border-transparent rounded" onClick={handleSightingHistory}>↺ Sighting History</button>
        <button className = "bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-0.5 px-1 border border-blue-500 hover:border-transparent rounded" onClick={signOutAction}>Log Out</button>
      </div>
      
      {showFavorites && (
        <div>
          <h1>Favorite Trucks</h1>
          {favoriteTrucks.length > 0 ? (
            favoriteTrucks.map((truck) => (
              <FavoriteTruckCard key={truck.food_truck_id} favoriteTruck={truck} />
            ))
          ) : (
            <p>No favorite trucks found</p>
          )}
          </div>
      )}
    </div>
  );
}
