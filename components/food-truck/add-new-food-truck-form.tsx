"use client";

import React from "react";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { SubmitButton } from "../submit-button";
import { addFoodTruck, addSighting } from "@/app/database-actions";
import { useState } from "react";
import { Location } from "../global-component-types";
import { FaArrowLeft } from "react-icons/fa";
import { handleImageUpload } from "@/utils/file-compress";

type AddNewFoodTruckFormProps = {
  setToastMessage: (params: { message: string; type: string }) => void;
  handleToggleAddTruck: () => void;
  handleToggleAddSighting: () => void;
  location: Location;
  geocoder: google.maps.Geocoder | null;
};

export default function AddNewFoodTruckForm({
  setToastMessage,
  handleToggleAddTruck,
  handleToggleAddSighting,
  location,
  geocoder,
}: AddNewFoodTruckFormProps) {
  const [file, setFile] = useState<File | undefined>();

  return (
    <div className="relative pt-2 w-80">
      <button
        onClick={() => {
          handleToggleAddTruck();
          handleToggleAddSighting();
        }}
        className="absolute top-1 right-1 bg-primary p-2 text-primary-foreground rounded-xl flex-none w-9 h-9 flex justify-center items-center"
      >
        <FaArrowLeft />
      </button>
      <form className="flex flex-col min-w-64 max-w-64 mx-auto">
        <h1 className="text-2xl font-medium">Add food truck</h1>
        <p className="text-sm text-foreground">
          Add a new truck and sighting.{" "}
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="truck-name"
          >
            Name
          </Label>
          <Input name="truck-name" placeholder="Food truck name" required />
          <Label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="food-style"
          >
            Food style
          </Label>
          <Input name="food-style" placeholder="What kind of food?" required />
          <Label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="truck-profile-picture"
          >
            Profile Picture
          </Label>
          <Input
            required
            type="file"
            accept="image/*"
            name="truck-profile-picture"
            onChange={async (e) => {
              if (e.target.files) {
                const compressedImage = await handleImageUpload(e);
                //setFile(e.target.files[0]);
                setFile(compressedImage);
              }
            }}
          />
          <SubmitButton
            formAction={async (formData) => {
              const truckData = await addFoodTruck(
                formData.get("truck-name") as string,
                formData.get("food-style") as string,
                file as File
              );
              // add initial sighting
              if (truckData && geocoder) {
                const address = await geocoder.geocode(
                  {
                    location: {
                      lat: location.lat,
                      lng: location.lng,
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

                const sighitng = await addSighting(
                  location,
                  truckData[0].id,
                  addressFormatted
                );
                if (sighitng) {
                  setToastMessage({
                    message: "Successfully added a new truck",
                    type: "success",
                  });
                }
              }
              handleToggleAddTruck();
            }}
            pendingText="Submitting..."
          >
            Submit
          </SubmitButton>
          <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8"></div>
        </div>
      </form>
    </div>
  );
}
