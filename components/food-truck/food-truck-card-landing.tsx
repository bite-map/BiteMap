import React from "react";
import { Truck } from "./../global-component-types";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";

type FoodTruckCardProps = {
  foodTruck: Truck;
};

export default function FoodTruckCardLanding({ foodTruck }: FoodTruckCardProps) {
  const avatarUrl = foodTruck.profile?.avatar || "/default-food-truck.jpg"; // Access the avatar from profile
  return (
      <Link href={`/truck-profile/${foodTruck.profile.id}`} legacyBehavior>
        <a className="block">
          <div className="rounded-xl bg-background overflow-clip shadow-md ring-1 ring-primary">
            <Image
              className="h-[200px] object-cover"
              src={avatarUrl} // ✅ Default image if no avatar is found
              alt={foodTruck.profile?.name || "Food Truck"} // Alt text for the image
              width={600}
              height={600}
            />
            <div className="flex">
              <div className="p-3">
                <h2 className="text-lg font-semibold text-primary">
                  {foodTruck.profile?.name}
                </h2>
                <p>{foodTruck.profile?.food_style}</p>
              </div>
              <div className="flex justify-center items-center text-background text-2xl ml-auto bg-primary w-16 flex-shrink-0">
                <FaArrowRight />
              </div>
            </div>
          </div>
        </a>
      </Link>
  );
}
