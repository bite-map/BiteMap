import React from "react";
import { Favorite } from "./global-component-types";

type FavoriteTruckCardProps = {
  favoriteTruck: Favorite;
};

export default function FavoriteTruckCard({ favoriteTruck }: FavoriteTruckCardProps) {
  return (
    <div>
      <h2>{favoriteTruck.food_truck_profiles.name}</h2>
    </div>
  );
}