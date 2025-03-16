import { useEffect, useState } from "react";
import { Sighting } from "../global-component-types";
import { addSightingConfirmation } from "@/app/database-actions";
import Link from "next/link";
type SightingConfirmCardProps = {
  sighting: Sighting;
};
export default function SightingConfirmCard({
  sighting,
  //   set toggle this card display
}: SightingConfirmCardProps) {
  return (
    <div>
      <Link href={`/truck-profile/${sighting.id}`}>Go TO Truck</Link>
      <div>
        <button
          onClick={async () => {
            addSightingConfirmation(sighting.id, sighting.food_truck_id);
          }}
        >
          Confirm Sighting
        </button>
      </div>
    </div>
  );
}
