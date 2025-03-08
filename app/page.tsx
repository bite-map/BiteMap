import FoodTruckCard from "@/components/food-truck-card";
import React from "react";
import { getFoodTruckData } from "@/app/database-actions";

export default async function Home() {
  const foodTruckData = await getFoodTruckData();

  console.log(foodTruckData);

  return (
    <div className="pb-16">
      {foodTruckData?.map((foodTruck) => (
        <FoodTruckCard key={foodTruck.id} foodTruck={foodTruck} />
      ))}
    </div>
  );
}
