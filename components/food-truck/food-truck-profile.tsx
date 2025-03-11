import Image from "next/image";
import Link from "next/link";
import React from "react";

// type FoodTruckProfileProps = {
//   // location
//   // review
//   setTruckProfile: Function;
// };

export default function FoodTruckProfile({}) {
  return (
    <div className="rounded-xl bg-background overflow-clip shadow-md">
      <Image
        className="h-[200px] object-cover"
        src={
          "https://qieslzondvbkbokewujq.supabase.co/storage/v1/object/public/BiteMap//foodtruck.webp"
        }
        alt="Picture of a food truck"
        width={600}
        height={600}
      ></Image>
      <div className="flex">
        <div className="p-3">
          <h2 className="text-lg font-semibold text-primary">{"Test Truck"}</h2>
          <p>{"Test Style"}</p>
        </div>
      </div>
    </div>
  );
}
