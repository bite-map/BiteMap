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
  sightingData: any;
};

export default function SightingCard({ sightingData }: SightingCardProps) {
  const pathname = usePathname();
  const [localTime, setLocalTime] = useState<string>();

  // TODO: calculate sighting frequency, change db function
  // TODO: parse latlng to address
  // parse to human readable str
  useEffect(() => {
    const localTime = new Date(sightingData.last_active_time);
    const year = localTime.getFullYear().toString().slice(-2);
    const month = (localTime.getMonth() + 1).toString().padStart(2, "0");
    const day = localTime.getDate().toString().padStart(2, "0");
    const dayOfWeek = localTime.toString().split(" ")[0];
    const hours = localTime.getHours().toString().padStart(2, "0");
    const minutes = localTime.getMinutes().toString().padStart(2, "0");
    const seconds = localTime.getSeconds().toString().padStart(2, "0");
    setLocalTime(
      `${year}-${month}-${day} ${dayOfWeek} ${hours}:${minutes}:${seconds}`
    );
  }, []);
  useEffect(() => {
    console.log(sightingData);
    console.log(localTime);
  }, [localTime]);
  return (
    <div className="flex rounded-xl bg-background overflow-clip shadow-md ring-1 ring-primary">
      <div className="grow overflow-hidden px-2 py-1">
        {sightingData ? (
          <div className="">
            {sightingData.address_formatted ? (
              <p className="truncate overflow-auto mb-1">
                {sightingData.address_formatted}
              </p>
            ) : (
              <p className="truncate">{`lat: ${sightingData.lat}, lng: ${sightingData.lng}`}</p>
            )}
            <p>{`Last sighted at: ${localTime}`}</p>
          </div>
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
