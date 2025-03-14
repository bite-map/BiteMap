import React from "react";
import { Favorite } from "../global-component-types";
import { toggleFavorite } from "@/app/database-actions";

type FavoriteTruckCardProps = {
  favoriteTruck: Favorite;
};
// unused
export default function FavoriteTruckCard({
  favoriteTruck,
}: FavoriteTruckCardProps) {
  return (
    <table className="table-fixed">
      <thead>
        <tr>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{favoriteTruck.food_truck_profiles.name}</td>
          <td>
            <button
              onClick={async () => {
                toggleFavorite(favoriteTruck.food_truck_id);
              }}
            >
              favorite / unfavorite
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
