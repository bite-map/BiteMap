import React, { useState, useEffect } from "react";
import { Favorite } from "./../global-component-types";
import Image from "next/image";
import { TiArrowForward } from "react-icons/ti";
import Link from "next/link";
import { IoMdHeart } from "react-icons/io";
import { FaArrowRight } from "react-icons/fa";
import { getFavoriteTruck, toggleFavorite } from "@/app/database-actions";
import { UserMetadata } from "@supabase/supabase-js";

type FoodTruckCardProps = {
  foodTruck: Favorite;
  setFavoriteTrucks: React.Dispatch<React.SetStateAction<any[]>>;
  favoriteTrucks: any[];
  user: UserMetadata | undefined;
};

export default function FoodTruckCardProfile({
  foodTruck,
  setFavoriteTrucks,
  favoriteTrucks,
  user,
}: FoodTruckCardProps) {
  // const [isFavorited, setIsFavorited] = useState(true);
  const [isFavorite, setIsFavorite] = useState<boolean>(true);

  useEffect(() => {
    //
  }, [isFavorite]);

  return (
    <div className="relative flex flex-col rounded-xl bg-background overflow-clip shadow-md ring-1 ring-primary">
      <button
        className="flex-col-reverse justify-items-end w-auto pr-1"
        style={{ color: isFavorite ? "#ef6262" : "#D1D5DB" }}
        onClick={async (e) => {
          try {
            const data = await toggleFavorite(foodTruck.food_truck_id);
            setIsFavorite(data);
          } catch (error) {
            console.error(error);
          }

          // refresh favorites
          (async () => {
            const favoriteTruckData = await getFavoriteTruck(user?.sub);
            setFavoriteTrucks(favoriteTruckData);
          })();
        }}
      >
        <IoMdHeart
          size={32}
          className={`absolute right-1 top-1 text-xl shadow-lg`}
        />
      </button>

      <Image
        className="h-[100px] object-cover"
        src={foodTruck.food_truck_profiles.avatar}
        alt="Picture of a food truck"
        width={600}
        height={600}
      ></Image>
      <Link href={`/truck-profile/${foodTruck.food_truck_id}`}>
        <div className="flex flex-col grow">
          <div className="px-3 py-2 truncate">
            <h2 className="text-xl font-semibold truncate">
              {foodTruck.food_truck_profiles.name}
            </h2>
            <p className="text-sm text-gray-500">
              {foodTruck.food_truck_profiles.food_style}
            </p>
          </div>

          <div className=" flex justify-center items-center text-background text-2xl mt-auto bg-primary w-full h-8">
            <FaArrowRight size={24} />
          </div>
        </div>
      </Link>
    </div>
  );
}
