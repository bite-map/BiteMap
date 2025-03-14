import React from "react";
import { Truck } from "./../global-component-types";
import Image from "next/image";

type FoodTruckCardProps = {
  foodTruck: Truck;
  context: string;
};
// uunused
export default function FoodTruckCard({
  foodTruck,
  context,
}: FoodTruckCardProps) {
  return (
    <div className="mx-2">
      <h2>{foodTruck.name}</h2>
      <Image
        className="h-[300px] object-cover"
        src={foodTruck.avatar}
        alt="Picture of a food truck"
        width={600}
        height={600}
      ></Image>
      {/* <></FOODTRUCKSIGHTING> */}
    </div>
  );
}
