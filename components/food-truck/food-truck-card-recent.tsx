import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Truck } from "../global-component-types";
import { montserrat } from "../fonts";

type FoodTruckCardRecentProps = {
  trucks: any[] | null | undefined;
};

export default function FoodTruckCardRecent({
  trucks,
}: FoodTruckCardRecentProps) {
  return (
    <>
      <h1
        className={` ${montserrat.className} text-3xl text-primary tracking-tight`}
      >
        <strong>Recent Food Trucks</strong>
      </h1>
      {/* display recent trucks */}
      {trucks?.map((truck) => {
        return (
          <div key={truck.id}>
            <Link href={`/truck-profile/${truck.id}`}>
              <div className="rounded-xl bg-background overflow-clip shadow-md ring-1 ring-primary">
                <Image
                  className="h-[200px] object-cover"
                  src={truck.avatar}
                  alt="Picture of a food truck"
                  width={600}
                  height={600}
                ></Image>
                <div className="flex flex-row">
                  <div className="px-3 py-2 truncate">
                    <h2 className="text-xl font-semibold truncate w-full">
                      {truck.name}
                    </h2>
                    <p className="-mt-1 text-sm text-gray-500">
                      {truck.food_style}
                    </p>
                  </div>
                  <div className="flex justify-center items-center text-background text-2xl ml-auto bg-primary w-16 min-w-16 min-h-16">
                    <FaArrowRight />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </>
  );
}
