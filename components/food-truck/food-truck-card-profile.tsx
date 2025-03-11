import React from "react";
import { Favorite, Truck } from "./../global-component-types";
import Image from "next/image";
import { TiArrowForward } from "react-icons/ti";
import Link from "next/link";
import { IoMdHeart } from "react-icons/io";

type FoodTruckCardProps = {
  foodTruck: Favorite;
};

export default function FoodTruckCardProfile({
  foodTruck,
}: FoodTruckCardProps) {
  return (
    <div className="relative flex flex-col rounded-xl bg-background overflow-clip shadow-md">
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
        {/* we need to fix the link here currently just the map */}
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
