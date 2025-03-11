import React from "react";
import { Sighting } from "../global-component-types";
import Link from "next/link";
import { TiArrowForward } from "react-icons/ti";
import { FaPlus } from "react-icons/fa";
import { usePathname } from "next/navigation";

type SightingCardProps = {
  sightingData: Sighting;
};

export default function SightingCard({ sightingData }: SightingCardProps) {
  const pathname = usePathname();

  return (
    <div className="flex rounded-xl bg-background overflow-clip shadow-md ring-1 ring-primary">
      <div className="grow overflow-hidden px-2 py-1">
        <h2 className="text-lg font-semibold text-primary">
          {sightingData.food_truck_profiles.name}
        </h2>
        <p className="truncate">{sightingData.location}</p>
      </div>
      {pathname === "/user-profile" ? (
        <Link
          href={`/truck-profile/${sightingData.food_truck_id}`}
          className=" flex justify-center items-center text-background text-2xl bg-primary w-20"
        >
          <TiArrowForward />
        </Link>
      ) : (
        <button
          onClick={() => {
            console.log("Confirm Sighting");
          }}
          className=" flex justify-center items-center text-background text-2xl bg-primary w-20"
        >
          <FaPlus size={16} />
        </button>
      )}
    </div>
  );
}
