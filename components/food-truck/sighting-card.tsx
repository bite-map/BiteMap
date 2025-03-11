import React from "react";
import { Sighting } from "../global-component-types";

type SightingCardProps = {
  sightingData: Sighting;
};

export default function SightingCard({ sightingData }: SightingCardProps) {
  return (
    <div className="rounded-xl bg-background overflow-clip shadow-md ring-1 ring-primary">
      <div className="flex">
        <div className="p-2">
          <h2 className="text-lg font-semibold text-primary">
            {sightingData.food_truck_profiles.name}
          </h2>
          <p>{sightingData.location}</p>
        </div>
      </div>
    </div>
  );
}
