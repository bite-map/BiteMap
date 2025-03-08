"use client";

import { signOutAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/client";
import { UserMetadata } from "@supabase/supabase-js";
import React, { useState, useEffect } from "react";

export default function UserProfile() {
  const supabase = createClient();

  const [user, setUser] = useState<UserMetadata | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const session = await supabase.auth.getSession();
      setUser(session.data.session?.user.user_metadata);
    })();
  }, []);

  const handleFavorite = () => {
    // Navigate to wishlist page or show wishlist data
    console.log("Favorites clicked");
  };

  const handleHistory = () => {
    // Navigate to order history page or show order history data
    console.log("History clicked");
  };

  return (
    <div>
      <h1>Personal Details</h1>
      <div>
        <p> Name: {user && user.display_name}</p>
        <p> Email: {user && user.email}</p>
      </div>
      <div>
        <button onClick={handleFavorite}>⭐️ Favorite</button>
        <button onClick={handleHistory}>↺ History</button>
        <button onClick={signOutAction}>Log Out</button>
      </div>
    </div>
  );
}
