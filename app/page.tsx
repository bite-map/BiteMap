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

// "use client"
// import React, { useEffect, useState } from "react";
// import { getNearbyFoodTrucks } from "@/app/database-actions";
// import { getLocation } from "@/utils/location";
// import FoodTruckCardLanding from "@/components/food-truck/food-truck-card-landing";

// export default function Home() {
//   const [location, setLocation] = useState<{ lat:number; lng:number } | null>(null);
//   const [foodTruckData, setFoodTruckData] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     getLocation(setLocation);
//   }, []);

//   useEffect(() => {
//     if(location) {
//       (async() => {
//         setLoading(true);
//         const trucks = await getNearbyFoodTrucks(location.lat, location.lng);
//         setFoodTruckData(trucks);
//         setLoading(false);
//       })();
//     }
//   }, [location])

//   return (
//     <div className="flex flex-col gap-4 p-3 bg-muted">
//       <h1 className="text-xl text-primary">
//         <strong>Nearby Food Trucks You Might Like</strong>
//       </h1>
//       {loading ? (
//         <p>Loading nearby food trucks ...</p>
//       ) :  foodTruckData.length === 0 ? (
//         <p>No food trucks found in your area.</p>
//       ) : (
//         foodTruckData?.map((foodTruck) => (
//             <FoodTruckCardLanding key={foodTruck.id} foodTruck={foodTruck} />
//           ))   
//          )}
//     </div>
//   );
// }
