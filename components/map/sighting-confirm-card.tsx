"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Truck } from "../global-component-types";
import {
  addSightingConfirmation,
  getFoodTruckDataById,
} from "@/app/database-actions";
import Link from "next/link";
import { UserMetadata } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { GiConfirmed } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { fetchSighting } from "./geo-utils";
type SightingConfirmCardProps = {
  location: any;
  map: google.maps.Map;
  setSighting: Dispatch<SetStateAction<any[] | undefined>>;

  setToastMessage: (params: { message: string; type: string }) => void;
  sighting: any;
  setSelectedSighting: Function;
  user: UserMetadata | undefined;
};

export default function SightingConfirmCard({
  location,
  map,
  setSighting,
  setToastMessage,
  sighting,
  setSelectedSighting,
  user,
  //   set toggle this card display
}: SightingConfirmCardProps) {
  const router = useRouter();

  const [truck, setTruck] = useState<Truck>();

  useEffect(() => {
    const getTruck = async () => {
      const truck = await getFoodTruckDataById(sighting.food_truck_id);
      setTruck(truck);
    };
    getTruck();
  }, [sighting]);

  return (
    <div className="relative  w-80 flex flex-col">
      <button
        className="absolute right-1 bg-primary top-1 p-2 text-primary-foreground rounded-xl flex-none w-9 h-9 flex justify-center items-center"
        onClick={() => {
          setSelectedSighting(null);
        }}
      >
        <IoMdClose />
      </button>

      <div className="absolute left-2 top-1 flex items-center text-primary drop-shadow-lg text-xl font-bold ">
        <GiConfirmed size={22} />
        <p className="text-center ml-1">{sighting.confirmation_count}</p>
      </div>

      <div className="flex bg-muted">
        <img className="object-cover w-32 " src={truck?.avatar} alt="" />
        <div className="ml-2 flex flex-col justify-center">
          <p className="text-lg text-primary font-semibold truncate w-[140px]">
            {truck?.name}
          </p>
          <p className="-mt-1 text-sm">{truck?.food_style}</p>
          {sighting.address_formatted && (
            <p className="text-sm mt-2">{sighting.address_formatted}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center p-2">
        <div className="w-64 bg-primary my-1 mx-3 rounded-xl text-background py-[0.1rem]">
          <Link
            className="justify-center items-center h-full w-full "
            onClick={() => {
              setSelectedSighting(null);
            }}
            href={`/truck-profile/${truck?.id}`}
          >
            <p className="justify-center items-center text-center">
              Go to Truck
            </p>
          </Link>
        </div>

        <div className="w-64 bg-primary mt-1 mb-1 ml-3 mr-3 rounded-xl text-background py-[0.1rem]">
          <button
            className="h-full w-full"
            onClick={async () => {
              if (!user) {
                return router.push("/sign-in?error=Not signed in");
              }
              const data = await addSightingConfirmation(
                sighting.id,
                sighting.food_truck_id
              );

              // This is sort of working but it seems to cause issues with the filtering <----- Yizhen
              // updates the sightings so confirmations show without a refresh
              // fetchSighting(
              //   location,
              //   map as google.maps.Map,
              //   setSighting,
              //   setSelectedSighting
              // );

              if (data) {
                // toast
                setToastMessage({
                  message: "successfully confirmed",
                  type: "success",
                });
              }

              setSelectedSighting(null);
            }}
          >
            <p className="justify-center items-center text-center">
              Confirm Sighting
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
