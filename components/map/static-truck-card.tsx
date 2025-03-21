"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { GiConfirmed } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
type StaticTruckProps = {
  place: any;
  setSelectedStatic: (param: any) => void;
};

export default function StaticTruckCard({
  place,
  setSelectedStatic,
  //   set toggle this card display
}: StaticTruckProps) {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    //
    console.log(place);
    setUrl(`https://www.google.com/maps/place/?q=place_id:${place.id}`);
  }, [place]);

  return (
    <div className="relative  w-80 flex flex-col">
      <button
        className="absolute right-1 bg-primary top-1 p-2 text-primary-foreground rounded-xl flex-none w-9 h-9 flex justify-center items-center"
        onClick={() => {
          setSelectedStatic(null);
        }}
      >
        <IoMdClose />
      </button>

      <div className="flex bg-muted">
        {/* <img className="object-cover w-32 " src={truck?.avatar} alt="" /> */}
        <div className="ml-2 flex flex-col justify-center">
          {/* <p className="text-lg text-primary font-semibold truncate w-[140px]">
            {truck?.name}
          </p>
          <p className="-mt-1 text-sm">{truck?.food_style}</p>
          {sighting.address_formatted && (
            <p className="text-sm mt-2">{sighting.address_formatted}</p>
          )} */}
        </div>
      </div>

      <div className="flex flex-col items-center p-2">
        <button
          onClick={() => {
            window.open(url, "_blank");
          }}
          className="w-64 bg-primary my-1 mx-3 rounded-xl text-background py-[0.1rem]"
        >
          <p className="justify-center items-center text-center">Go to Truck</p>
        </button>
      </div>
    </div>
  );
}
