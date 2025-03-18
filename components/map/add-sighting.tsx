import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
//helpers
import { addSighting } from "@/app/database-actions";
import { getLocation } from "./geo-utils";
import { Truck, Location } from "../global-component-types";
import { getNearbyTruck, getFoodTruckData } from "@/app/database-actions";
import { Input } from "../ui/input";
import { FaSpinner } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { SubmitButton } from "../submit-button";

type AddSightingProps = {
  setToastMessage: (params: { message: string; type: string }) => void;
  handleToggleAddSighting: () => void;
  handleToggleAddTruck: () => void;
  geocoder: google.maps.Geocoder | null;
};

export default function AddSighting({
  setToastMessage,
  handleToggleAddSighting,
  handleToggleAddTruck,
  geocoder,
}: AddSightingProps) {
  //use this location when adding sighting
  const [sightingLocation, setSightingLocation] = useState<Location>();

  const [trucks, setTrucks] = useState<any[]>();
  const [selectedTruck, setSelectedTruck] = useState<any | null>(null);
  const [loadingTrucks, setLoadingTrucks] = useState<boolean>(true);

  const [searchItem, setSearchItem] = useState<string>("");
  const [filteredTrucks, setFilteredTrucks] = useState<any[]>();

  //   use this and effect cleanup to popup toast message
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    setSearchItem(searchTerm);

    const filteredItems = trucks?.filter((truck) =>
      truck.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTrucks(filteredItems);
  };

  useEffect(() => {
    getLocation(setSightingLocation);
  }, []);

  useEffect(() => {
    // default to fetch a large radius
    const fetchTruck = async () => {
      if (sightingLocation) {
        //

        const data = (await getFoodTruckData()) as Truck[];

        if (data?.length) {
          setTrucks(data);
        }
      }
    };
    fetchTruck();
  }, [sightingLocation]);

  useEffect(() => {
    if (typeof trucks !== "undefined") {
      setLoadingTrucks(false);
    }
    setFilteredTrucks(trucks);
  }, [trucks]);

  return (
    <div className="relative pt-2">
      <button
        onClick={handleToggleAddSighting}
        className="absolute top-1 right-1 bg-primary p-2 text-primary-foreground rounded-xl flex-none w-9 h-9 flex justify-center items-center"
      >
        <IoMdClose />
      </button>
      <h1 className="text-2xl font-medium pl-2">Add sighitng</h1>
      <div className="p-2 flex justify-between items-center gap-4 font-semibold text-xl">
        <Input
          type="text"
          onChange={handleInputChange}
          placeholder="Search by truck name"
          className="h-9 font-normal"
        />
      </div>
      <div className="overflow-scroll h-full w-full mb-2">
        <ul className="flex flex-col items-center h-96 w-full">
          {/* map */}
          {filteredTrucks?.length ? (
            <>
              {filteredTrucks.map((truck) => {
                return (
                  <li
                    key={truck.id}
                    className="h-1/4 mb-1 w-full justify-center items-center"
                    onClick={() => {
                      setSelectedTruck(truck);
                    }}
                  >
                    {/* link go to truck profile or get all sighitng? */}
                    <div className="flex flex-row items-start h-full w-full  bg-white border border-gray-200 rounded-xl shadow-sm   hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                      <Image
                        className="m-3 h-[60px] w-[60px] object-cover rounded-t-lg  md:h-auto md:w-48 md:rounded-none md:rounded-s-lg items-start"
                        src={truck.avatar}
                        alt="Image of a food truck"
                        width={60}
                        height={60}
                      />
                      <div className="flex flex-col justify-between leading-normal relative w-full">
                        <h5 className="mb-2 text-2xl font-bold className-tight text-gray-900 dark:text-white">
                          {truck.name}
                        </h5>
                        <p className="mb-1 font-normal text-gray-700 dark:text-gray-400">
                          {truck.food_style}
                        </p>
                        {/* <p className="mb-1 font-normal text-gray-700 dark:text-gray-400">
                          {` ${Math.floor(truck.nearest_dist_meters)} meters`}
                        </p> */}
                      </div>
                    </div>
                  </li>
                );
              })}
              {searchItem === "" && (
                <>
                  <p>
                    Can't find the truck you're looking for? You can add one
                    below.
                  </p>
                  <button
                    className="mt-3 relative ml-2 mr-2 bg-primary p-2 text-background border border-gray-300 rounded-xl flex-none h-9 w-64 flex justify-center items-center text-sm"
                    onClick={() => {
                      handleToggleAddSighting();
                      handleToggleAddTruck();
                    }}
                  >
                    Add truck
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              {!loadingTrucks ? (
                <>
                  <p>No trucks match your search. You can add one below.</p>
                  <button
                    className="mt-3 relative ml-2 mr-2 bg-primary p-2 text-background border border-gray-300 rounded-xl flex-none h-9 w-64 flex justify-center items-center text-sm"
                    onClick={() => {
                      handleToggleAddSighting();
                      handleToggleAddTruck();
                    }}
                  >
                    Add truck
                  </button>
                </>
              ) : (
                <p className="flex items-center gap-2">
                  Loading location{" "}
                  <FaSpinner className="animate-[spin_2s_ease-in-out_infinite] text-primary" />
                </p>
              )}
            </>
          )}
        </ul>
      </div>

      <div className="flex flex-row w-full ml-1 mr-1 items-center justify-center ">
        <SubmitButton
          pendingText="Submitting..."
          onClick={async () => {
            if (sightingLocation && selectedTruck && geocoder) {
              const address = await geocoder.geocode(
                {
                  location: {
                    lat: sightingLocation.lat,
                    lng: sightingLocation.lng,
                  },
                },
                (result, status) => {
                  if (status === "OK" && result && result[0]) {
                    return result;
                  }
                  return null;
                }
              );
              const addressFormatted = address.results[0].formatted_address;

              const data = await addSighting(
                sightingLocation,
                selectedTruck.id,
                addressFormatted
              );
              if (data) {
                if (data.duplicatedSightingCount) {
                  setToastMessage({
                    message:
                      "Found an existing sighting, automatically confirming..",
                    type: "info",
                  });
                } else {
                  setToastMessage({
                    message: "successfully add new sighting",
                    type: "success",
                  });
                }
                setSelectedTruck(null);
                setSuccess(true);
              }
            }
            handleToggleAddSighting();
          }}
          className={
            (sightingLocation ? "" : "disabled:") +
            "mt-3 relative mr-2 bg-primary p-2 text-background border border-gray-300 rounded-xl flex-none h-9 w-64 flex justify-center items-center"
          }
        >
          Submit
        </SubmitButton>
      </div>
    </div>
  );
}
