import React from "react";
import { useState, useEffect } from "react";
import { Sighting } from "../global-component-types";
import Link from "next/link";
import { GiConfirmed } from "react-icons/gi";
import { FaSpinner } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";

import { usePathname } from "next/navigation";

type SightingCardProps = {
  sightingData: any;
};

export default function SightingCard({ sightingData }: SightingCardProps) {
  const pathname = usePathname();
  const [localTime, setLocalTime] = useState<string>();

  // TODO: calculate sighting frequency, using db function
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

  return (
    <div className="flex rounded-xl bg-background overflow-clip shadow-md ring-1 ring-primary">
      <div className="grow overflow-hidden px-2 py-1">
        {sightingData ? (
          <div className="flex flex-row ">
            <Link href={`/truck-map?sighting-id=${sightingData.id}`}>
              <div className="flex flex-col w-80">
                {sightingData.address_formatted ? (
                  <p className="truncate overflow-auto mb-1">
                    {sightingData.address_formatted}
                  </p>
                ) : (
                  <p className="truncate">{`lat: ${sightingData.lat}, lng: ${sightingData.lng}`}</p>
                )}
                {pathname === "/user-profile" ? (
                  <p>{`Created at: ${sightingData.created_at}`}</p>
                ) : (
                  <p>{`Last sighted at: ${localTime}`}</p>
                )}
              </div>
            </Link>
            <div className="flex items-center justify-center w-full">
              {/* show how many  confirmation the sighting has, may need to change icon if it's confusing */}
              <p className="text-center mr-1">
                {sightingData.confirmation_count}
              </p>
              <GiConfirmed></GiConfirmed>
            </div>
          </div>
        ) : (
          <p className="flex items-center gap-2 h-full w-full">
            Loading Sighting{" "}
            <FaSpinner className="animate-[spin_2s_ease-in-out_infinite] text-primary" />
          </p>
        )}
      </div>
      {pathname === "/user-profile" && (
        <Link
          href={`/truck-profile/${sightingData.food_truck_id}`}
          className=" flex justify-center items-center text-background text-2xl bg-primary w-20"
        >
          <FaArrowRight />
        </Link>
      )}
    </div>
  );
}
