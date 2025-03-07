"use client";
import { signOutAction } from "@/app/actions";
import React, {useState} from "react";

export default function UserProfile() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isEditing, setIsEditing] = useState(false);


    const user = {
        firstName:  name ,
        email: email,

    }

    const handleEditProfile = () => {
        setIsEditing(!isEditing);
      };
    
      const handleSaveProfile = () => {
        // Save edited profile details to backend or state
        setIsEditing(false);
      };
    
      const handleFavorite = () => {
        // Navigate to wishlist page or show wishlist data
      };
    
      const handleHistory = () => {
        // Navigate to order history page or show order history data
      };

    return (

    <div>
      <h1>Personal Details</h1>
      <div>
        <input
          type="text"
          placeholder="First Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={!isEditing}
        />
        <p> Email: {user.email}</p> 

        {isEditing ? (
          <button onClick={handleSaveProfile}>
            Save Profile
          </button>
        ) : (
          <button onClick={handleEditProfile}>
            Edit Profile
          </button>
        )}
      </div>
      <div>
        <button onClick={handleFavorite}>
          ⭐️ Favorite
        </button>
        <button onClick={handleHistory}>
          ↺ History
        </button>
        <button onClick={signOutAction}>
          Log Out
        </button>
      </div>
    </div>
    );
}
  