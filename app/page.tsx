import React from "react";
import { getFoodTruckData } from "@/app/database-actions";
import FoodTruckCardLanding from "@/components/food-truck/food-truck-card-landing";

export default async function Home() {
  const foodTruckData = await getFoodTruckData();

  return (
    <div className="flex flex-col gap-4 p-3 bg-muted">
      <h1 className="text-xl text-primary">
        <strong>Nearby Food Trucks You Might Like</strong>
      </h1>
      {Array.isArray(foodTruckData)
        ? foodTruckData?.map((foodTruck) => (
            <FoodTruckCardLanding key={foodTruck.id} foodTruck={foodTruck} />
          ))
        : null}
    </div>
  );
}
