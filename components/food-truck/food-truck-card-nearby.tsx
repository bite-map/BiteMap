"use client"
import React, { useEffect, useState } from "react";
import { getNearbyFoodTrucks } from "@/app/database-actions";
import { getLocation } from "@/utils/location";
import FoodTruckCardLanding from "@/components/food-truck/food-truck-card-landing";

export default function NearbyFoodTrucks() {
  const [location, setLocation] = useState<{ lat:number; lng:number } | null>(null);
  const [foodTruckData, setFoodTruckData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // const [shownFoodTruckIds, setShownFoodTruckIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    getLocation(setLocation);
  }, []);

  useEffect(() => {
    if (location) {
      console.log("Fetching trucks for location:", location);
      setLoading(true);
      getNearbyFoodTrucks(location)
        .then((trucks) => {
          console.log("Fetched trucks:", trucks);
          setFoodTruckData(trucks);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching trucks:", error);
          setLoading(false);
        });
    }
  }, [location]);
  
  
// IF WE USE THIS CODE WILL BREAK, HOWEVER I WILL LET COMMENT OUT, IN CASE WE WANT TO USE SOME KINDA OF FILTER LATER 

  // const uniqueFoodTrucks = foodTruckData.filter((foodTruck) => {
  //   if(!shownFoodTruckIds.has(foodTruck.id)) {
  //     setShownFoodTruckIds(prev => new Set(prev).add(foodTruck.id));
  //     return true;
  //   }
  //   return false;
  // })

  return (
    <div className="flex flex-col gap-4 p-3 bg-muted">
      <h1 className="text-xl text-primary">
        <strong>Nearby Food Trucks You Might Like</strong>
      </h1>
      {loading ? (
        <p>Loading nearby food trucks ...</p>
      ) :  foodTruckData.length === 0 ? (
        <p>No food trucks found in your area.</p>
      ) : (
        foodTruckData?.map((foodTruck) => (
          
            <FoodTruckCardLanding key={foodTruck.id} foodTruck={foodTruck} />
          ))   
         )}
    </div>
  );
}