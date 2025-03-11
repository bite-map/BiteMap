import React from "react";
import { Sighting } from "../global-component-types";

type SightingCardProps = {
  sightingData: Sighting;
};

export default function SightingCard({
  sightingData,
}: SightingCardProps) {
  return (
    <table className="table-fixed">
      <thead>
        <tr>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{sightingData.food_truck_profiles.name}</td>
        </tr>
      </tbody>
    </table>
  );
}