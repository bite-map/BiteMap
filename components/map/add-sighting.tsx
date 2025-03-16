import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
//helpers
import {
  getSightingBySightingId,
  addSightingConfirmation,
  addSighting,
  getTruckBySightingId,
  getFoodTruckData,
} from "@/app/database-actions";
import { getLocation } from "./geo-utils";
import { Truck, Location } from "../global-component-types";

type AddSightingProps = {
  handleToggleAddSighting: Function;
};

export default function AddSighting({
  handleToggleAddSighting,
}: AddSightingProps) {
  //use this location when adding sighting
  const [sightingLocation, setSightingLocation] = useState<Location>();
  const [trucks, setTrucks] = useState<Truck[]>();
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
  const [searchResult, setSearchResult] = useState<any[]>();
  const [activeTab, setActiveTab] = useState<"listView" | "searchView">(
    "listView"
  );
  //   use this and effect cleanup to popup toast message
  const [success, setSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    getLocation(setSightingLocation);
  }, []);

  useEffect(() => {
    const fetchTruck = async () => {
      const data = (await getFoodTruckData()) as Truck[];
      if (data?.length) {
        setTrucks(data);
      }
    };
    fetchTruck();
  }, []);

  return (
    <div className="absolute bottom-[-5.6rem] top-full  flex flex-col justify-center items-center gap-1 p-2 left-0 z-10 h-[24rem] bg-muted w-full border-y-[1.5px] border-primary">
      <div className="flex flex-row w-full h-1/6 top-0">
        <nav className="flex w-full -mb-px">
          {["listView", "searchView"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 w-1/2 px-4 py-3 text-center text-sm font-medium ${
                activeTab === tab
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } transition-colors duration-200`}
            >
              {tab === "listView" ? "Truck list" : "Search a truck"}
            </button>
          ))}
        </nav>
      </div>
      <div className="justify-center items-center overflow-scroll h-full w-full mb-1">
        {activeTab === "listView" && (
          <div className="overflow-scroll h-full w-full ">
            <ul className="h-full w-full ">
              {/* map */}
              {trucks?.length &&
                trucks.map((truck) => {
                  return (
                    <li
                      key={truck.id}
                      className="h-1/3 mb-1"
                      onClick={() => {
                        setSelectedTruck(truck);
                      }}
                    >
                      {/* link go to truck profile or get all sighitng? */}
                      <div className="flex flex-row items-start h-full w-full  bg-white border border-gray-200 rounded-lg shadow-sm   hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                        <Image
                          className="object-cover rounded-t-lg h-full w-auto md:h-auto md:w-48 md:rounded-none md:rounded-s-lg items-start"
                          src={truck.profile?.avatar || "/default-food-truck.jpg"}
                          alt="image of a food truck"
                          width={60}
                          height={60}
                        ></Image>
                        <div className="flex flex-col justify-between leading-normal relative w-full">
                          <h5 className="mb-2 text-2xl font-bold className-tight text-gray-900 dark:text-white">
                            {truck.name}
                          </h5>
                          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                            {truck.food_style}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
        )}
        {activeTab === "searchView" && (
          <div className=" h-full w-full">
            <div className="w-full">
              <input
                type="text"
                className="w-full"
                placeholder="Search by truck name"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-row w-full ml-1 mr-1 items-center justify-center ">
        <button
          onClick={async () => {
            if (sightingLocation && selectedTruck) {
              const data = await addSighting(
                sightingLocation,
                selectedTruck.id
              );
              if (data) {
                setSelectedTruck(null);
                setSuccess(true);
              }
            }
            handleToggleAddSighting();
          }}
          className={
            (sightingLocation ? "" : "disabled:") +
            " ml-2 mr-2 bg-primary p-2 text-primary-foreground rounded-xl flex-none h-9 w-2/5 flex justify-center items-center"
          }
        >
          Submit Sighting
        </button>
        <button
          onClick={() => {
            handleToggleAddSighting();
          }}
          className=" ml-2 mr-2 bg-primary p-2 text-primary-foreground rounded-xl flex-none h-9 w-2/5 flex justify-center items-center"
        >
          Close
        </button>
      </div>
    </div>
  );
}
