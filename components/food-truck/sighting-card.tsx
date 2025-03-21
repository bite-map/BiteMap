import React from "react";
import { useState, useEffect } from "react";
import { Sighting } from "../global-component-types";
import Link from "next/link";
import { GiConfirmed } from "react-icons/gi";
import { FaSpinner } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { usePathname } from "next/navigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

type SightingCardProps = {
  sightingData: any;
};

export default function SightingCard({ sightingData }: SightingCardProps) {
  dayjs.extend(relativeTime);

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
          <div className="flex flex-row items-center px-2 h-16">
            <div className="flex flex-col truncate grow">
              {sightingData.address_formatted ? (
                <p className="truncate overflow-auto mb-1 font-semibold">
                  {sightingData.address_formatted}
                </p>
              ) : (
                <p className="truncate font-semibold">{`lat: ${sightingData.lat}, lng: ${sightingData.lng}`}</p>
              )}

              <p>Last seen: {dayjs(localTime).fromNow()}</p>
            </div>
            <div className="flex items-center justify-center ml-2">

              {/* show how many  confirmation the sighting has, may need to change icon if it's confusing */}
              <GiConfirmed size={22} className="text-primary" />
              <p className="text-center ml-1">
                {sightingData.confirmation_count}
              </p>
            </div>
          </div>
        ) : (
          <p className="flex items-center gap-2 h-full w-full">
            Loading Sighting{" "}
            <FaSpinner className="animate-[spin_2s_ease-in-out_infinite] text-primary" />
          </p>
        )}
      </div>
    </div>
  );
}
