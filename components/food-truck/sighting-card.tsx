import React from "react";
import { useState, useEffect } from "react";
import { Sighting } from "../global-component-types";
import Link from "next/link";
import { TiArrowForward } from "react-icons/ti";
import { FaSpinner } from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";
import { usePathname } from "next/navigation";
import {
  getSightingBySightingId,
  addSightingConfirmation,
} from "@/app/database-actions";

type SightingCardProps = {
  sightingData: Sighting;
};

export default function SightingCard({ sightingData }: SightingCardProps) {
  const pathname = usePathname();
  const [location, setLocation] = useState<any>();
  useEffect(() => {
    const parseSighting = async () => {
      const parsedSighting = await getSightingBySightingId(sightingData.id);
      setLocation(parsedSighting);
    };
    parseSighting();
  }, []);
  return (
    <div className="flex rounded-xl bg-background overflow-clip shadow-md ring-1 ring-primary">
      <div className="grow overflow-hidden px-2 py-1">
        <h2 className="text-lg font-semibold text-primary">
          {sightingData.food_truck_profiles.name}
        </h2>
        {location ? (
          <p className="truncate">{`lat: ${location.lat}, lng: ${location.lng}`}</p>
        ) : (
          <p className="flex items-center gap-2">
            Loading location{" "}
            <FaSpinner className="animate-[spin_2s_ease-in-out_infinite] text-primary" />
          </p>
        )}
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
            const truckId = Number(pathname.split("/").pop());
            addSightingConfirmation(sightingData.id, truckId);
          }}
          className=" flex flex-none justify-center items-center text-background text-2xl bg-primary w-16"
        >
          <GiCheckMark size={20} />
        </button>
      )}
    </div>
  );
}
