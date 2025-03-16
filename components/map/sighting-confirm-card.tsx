import { useEffect, useState } from "react";
import { Sighting, Truck } from "../global-component-types";
import {
  addSightingConfirmation,
  getFoodTruckDataById,
} from "@/app/database-actions";
import Link from "next/link";
import Image from "next/image";
type SightingConfirmCardProps = {
  sighting: Sighting;
  setSelectedSighting: Function;
};
export default function SightingConfirmCard({
  sighting,
  setSelectedSighting,
  //   set toggle this card display
}: SightingConfirmCardProps) {
  const [truck, setTruck] = useState<Truck>();
  useEffect(() => {
    const getTruck = async () => {
      const truck = await getFoodTruckDataById(sighting.food_truck_id);
      setTruck(truck);
      // console.log(truck);
    };
    getTruck();
  });
  return (
    <div className="h-64 w-80 justify-center items-center">
      <div className="justify-center items-center bg-primary mt-3 mb-3 ml-3 mr-3 rounded-xl">
        <Link
          className="justify-center items-center h-full w-full"
          href={`/truck-profile/${sighting.id}`}
        >
          <p className="justify-center items-center text-center">Go TO Truck</p>
        </Link>
      </div>
      <div className="bg-primary mt-3 mb-3 ml-3 mr-3 rounded-xl">
        <button
          className="h-full w-full"
          onClick={async () => {
            const data = await addSightingConfirmation(
              sighting.id,
              sighting.food_truck_id
            );
            console.log(data);
            setSelectedSighting(null);
            // TOAST
          }}
        >
          <p className="justify-center items-center text-center">
            Confirm Sighting
          </p>
        </button>
      </div>
      <div className="h-36 w-full flex justify-center justify-self-center items-center">
        <img className="object-cover h-36 w-48 " src={truck?.avatar} alt="" />
      </div>
    </div>
  );
}
