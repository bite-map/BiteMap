import React from "react";
import { Truck } from "./../global-component-types";
import Image from "next/image";
import { TiArrowForward } from "react-icons/ti";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

type FoodTruckCardProps = {
  foodTruck: Truck;
};

export default function FoodTruckCardLanding({
  foodTruck,
}: FoodTruckCardProps) {
  return (
    <div>
      <Link
          href={`/truck-profile/${foodTruck.id}`}

          >
    <div className="rounded-xl bg-background overflow-clip shadow-md ring-1 ring-primary">
      <Image
        className="h-[200px] object-cover"
        src={foodTruck.avatar}
        alt="Picture of a food truck"
        width={600}
        height={600}
      ></Image>
      <div className="flex">
        <div className="p-3">
          <h2 className="text-lg font-semibold text-primary">
            {foodTruck.name}
          </h2>
          <p>{foodTruck.food_style}</p>
        </div>
        {/* we need to fix the link here currently just the map */}
        <div className="flex justify-center items-center text-background text-2xl ml-auto bg-primary w-16">
          <FaArrowRight/>
        </div>
      </div>
    </div>
    </Link>
    </div>
  );
}
