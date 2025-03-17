import { useEffect, useState } from "react";
import { Sighting, Truck } from "../global-component-types";
import {
  addSightingConfirmation,
  getFoodTruckDataById,
} from "@/app/database-actions";
import Link from "next/link";
import { IoMdClose } from "react-icons/io";
type SightingConfirmCardProps = {
  setToastMessage: (params: { message: string; type: string }) => void;
  sighting: Sighting;
  setSelectedSighting: Function;
};
export default function SightingConfirmCard({
  setToastMessage,
  sighting,
  setSelectedSighting,
  //   set toggle this card display
}: SightingConfirmCardProps) {
  const [truck, setTruck] = useState<Truck>();
  useEffect(() => {
    const getTruck = async () => {
      const truck = await getFoodTruckDataById(sighting.food_truck_id);
      setTruck(truck);
    };
    getTruck();
  }, []);
  return (
    <div className="h-64 w-80 justify-center items-center flex flex-col">
      <div className="w-full absolute h-9 top-0 flex flex-row-reverse ">
        <button
          className="relative right-1 bg-primary top-1 p-2 text-primary-foreground rounded-xl flex-none w-9 h-9 flex justify-center items-center"
          onClick={() => {
            setSelectedSighting(null);
          }}
        >
          <IoMdClose />
        </button>
      </div>
      <div className=" w-64 justify-center items-center bg-primary mt-1 mb-1  rounded-xl">
        <Link
          className="justify-center items-center h-full w-full "
          onClick={() => {
            setSelectedSighting(null);
          }}
          href={`/truck-profile/${truck?.id}`}
        >
          <p className="justify-center items-center text-center">Go TO Truck</p>
        </Link>
      </div>
      <div className="w-64 bg-primary mt-1 mb-1 ml-3 mr-3 rounded-xl">
        <button
          className="h-full w-full"
          onClick={async () => {
            const data = await addSightingConfirmation(
              sighting.id,
              sighting.food_truck_id
            );
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
      <div className="flex h-24 w-30 overflow-hidden justify-center justify-self-center items-center object-cover mt-2">
        <img className="object-cover h-36 w-48 " src={truck?.avatar} alt="" />
      </div>
    </div>
  );
}
