import React, { useEffect, useState } from "react";
import { Favorite, Truck } from "./../global-component-types";
import Image from "next/image";
import { TiArrowForward } from "react-icons/ti";
import Link from "next/link";
import { IoMdHeart } from "react-icons/io";
import { toggleFavorite } from "@/app/database-actions";

type FoodTruckCardProps = {
  foodTruck: Favorite;
};

export default function FoodTruckCardProfile({
  foodTruck,
}: FoodTruckCardProps) {
  const [isFavorite, setIsFavorite] = useState<boolean>(true);

  useEffect(() => {
    //
  }, [isFavorite]);
  return (
    <div className="relative flex flex-col rounded-xl bg-background overflow-clip shadow-md ring-1 ring-primary">
      <IoMdHeart className="absolute left-1 top-1 text-primary text-xl shadow-lg" />
      <Image
        className="h-[100px] object-cover"
        src={foodTruck.food_truck_profiles.avatar}
        alt="Picture of a food truck"
        width={600}
        height={600}
      ></Image>
      <div className="flex flex-col grow">
        <div className="p-3">
          <h2 className="text-md font-semibold text-primary">
            {foodTruck.food_truck_profiles.name}
          </h2>
          <p className="text-sm">{foodTruck.food_truck_profiles.food_style}</p>
        </div>
        <button
          onClick={async () => {
            try {
              const data = await toggleFavorite(foodTruck.food_truck_id);
              setIsFavorite(data);
            } catch (error) {
              console.error(error);
            }
          }}
        >
          {isFavorite ? "(colored heart)" : "(empty heart)"}
        </button>
        <Link
          href={`/truck-profile/${foodTruck.food_truck_id}`}
          className=" flex justify-center items-center text-background text-2xl mt-auto bg-primary w-full h-8"
        >
          <TiArrowForward />
        </Link>
      </div>
    </div>
  );
}
