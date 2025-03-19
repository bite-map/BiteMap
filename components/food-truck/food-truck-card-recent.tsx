import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Truck } from "../global-component-types";

type FoodTruckCardRecentProps = {
  trucks: any[] | null | undefined;
};

export default function FoodTruckCardRecent({
  trucks,
}: FoodTruckCardRecentProps) {
  return (
    <>
      <h1 className="text-xl text-primary">
        <strong>Recently Added Food Trucks You Might Like</strong>
      </h1>
      {/* display recently added trucks */}
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
                  <div className="relative w-1/2 pt-3 pb-3 pl-3">
                    <h2 className="text-lg font-semibold text-primary">
                      {truck.name}
                    </h2>
                    <p>{truck.food_style}</p>
                  </div>
                  <div className="flex justify-center items-center text-background text-2xl ml-auto bg-primary w-16">
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
