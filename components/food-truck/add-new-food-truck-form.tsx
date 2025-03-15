"use client";

import React from "react";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { SubmitButton } from "../submit-button";
import { addFoodTruck, addSighting } from "@/app/database-actions";
import { useState } from "react";
import { Location } from "../global-component-types";

type AddNewFoodTruckFormProps = {
  handleToggle: () => void;
  location: Location;
};

export default function AddNewFoodTruckForm({
  handleToggle,
  location,
}: AddNewFoodTruckFormProps) {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="pt-2">
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
            type="file"
            name="truck-profile-picture"
            onChange={(e) => {
              if (e.target.files) {
                setFile(e.target.files[0]);
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
              console.log(truckData);
              // sighting
              if (truckData) {
                const sighitng = addSighting(location, truckData[0].id);
              }
              handleToggle();
            }}
            pendingText="Adding truck..."
          >
            Add Truck & Sighting
          </SubmitButton>
          <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8"></div>
        </div>
      </form>
    </div>
  );
}
