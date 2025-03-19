"use server";
import { addFoodTruck } from "@/app/database-actions";
import { createClient } from "@/utils/supabase/server";

// get each truck's nearest sightings
export const getMinDistanceSightingTruck = async (lat: number, lng: number) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("get_min_distance_sighting_truck", { lat: lat, lng: lng })
    .select();
  if (error) return error;
  return data;
};

export const getSightingActiveInLastWeek = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("get_sightings_ordered_by_last_active_count_confirm")
    .select();
  if (error) return error;
  return data.filter((sighting) => {
    const sightingDate = new Date(sighting.last_active_time);
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);
    return sightingDate >= oneWeekAgo && sightingDate <= now;
  });
};

export const getSightingsOrderedByLastActiveCountConfirm = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("get_sightings_ordered_by_last_active_count_confirm")
    .select();
  if (error) return error;
  return data.filter((sighting) => {
    return sighting.confirmation_count > 10;
  });
};

// ----------- Dev tool: for fetch and populate datas into db (START) -----------
// const fetchImg = async (url: string) => {
//   try {
//     const response = await fetch(url);
//     const arrayBuffer = await response.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);

//     const imgBase64 = buffer.toString("base64");
//     const byteCharacters = atob(imgBase64 as string);
//     const byteArrays = [];
//     for (let i = 0; i < byteCharacters.length; i++) {
//       byteArrays.push(byteCharacters.charCodeAt(i));
//     }

//     const blob = new Blob([new Uint8Array(byteArrays)], { type: "image/jpeg" });
//     const file = new File([blob], "place-photo.jpg", { type: "image/jpeg" });

//     return file;
//   } catch (error) {
//     console.error(error);
//   }
// };

// export const populateData = async (
//   truck: { name: string; avatarUrl: string; formatted_address: string },
//   location: { lat: number; lng: number }
// ) => {
//   const supabase = await createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   const imgFile = await fetchImg(truck.avatarUrl);

//   const data = await addFoodTruck(
//     truck.name,
//     generateRandomFoodStyle(),
//     imgFile as File
//   );

//   if (data && data[0] && data[0].id) {
//     const truckId = data[0].id;
//     const sighting = await addSighting(
//       location,
//       truckId,
//       truck.formatted_address
//     );
//     console.log(sighting);
//   }

//   // };
// };
// const generateRandomFoodStyle = () => {
//   //  random food type
//   const styles = [
//     "American",
//     "Italian",
//     "Mexican",
//     "Chinese",
//     "Japanese",
//     "Indian",
//     "Thai",
//     "Mediterranean",
//     "Greek",
//     "Korean",
//     "Vietnamese",
//     "French",
//     "Caribbean",
//     "BBQ",
//     "Middle Eastern",
//     "Spanish",
//     "German",
//     "Brazilian",
//     "Fusion",
//     "Seafood",
//     "Vegetarian",
//     "Soul Food",
//     "Tex-Mex",
//     "Southern",
//     "Lebanese",
//     "Hawaiian",
//     "Peruvian",
//     "Turkish",
//     "Ethiopian",
//     "Street Food",
//   ];
//   const randomIndex = Math.floor(Math.random() * styles.length);

//   // Return one random style
//   return styles[randomIndex];
//   // Pick a random one from array
//   // return one random style;
// };

// const generateRandomTime = () => {
//   //
//   const startDate = new Date("2025-03-10");
//   const endDate = new Date("2025-03-20");
//   const openHour = 9;
//   const closeHour = 23;

//   const startTime = startDate.getTime();
//   const endTime = endDate.getTime();
//   const randomTime = startTime + Math.random() * (endTime - startTime);
//   const randomDate = new Date(randomTime);
//   const randomHour =
//     Math.floor(Math.random() * (closeHour - openHour)) + openHour;
//   const randomMinute = Math.floor(Math.random() * 60);
//   const randomSecond = Math.floor(Math.random() * 60);
//   randomDate.setHours(randomHour, randomMinute, randomSecond);
//   return randomDate.toISOString();
// };

// export const addSighting = async (
//   location: { lat: number; lng: number },
//   food_truck_id: number,
//   address: string | null
// ) => {
//   try {
//     const supabase = await createClient();
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     // generate random time
//     const { data, error } = await supabase.rpc("detect_duplicated_sighting", {
//       lat: location.lat,
//       lng: location.lng,
//       truck_id: food_truck_id,
//       radius: 200,
//     });
//     const randomTime = generateRandomTime();
//     if (data && data.length > 0) {
//       // inert to confirmation, return number of duplicated sightings
//       const nearestSightingId = data[0].id;
//       const count = data.length;
//       const { data: confirmationData, error: confirmationError } =
//         await supabase
//           .from("sighting_confirmations")
//           .insert([
//             {
//               food_truck_sighting_id: nearestSightingId,
//               food_truck_id: food_truck_id,
//               confirmed_by_profile_id: user?.id,
//             },
//           ])
//           .select();
//       if (confirmationError) {
//         throw error;
//       }
//       return { data: confirmationData, duplicatedSightingCount: count };
//     }
//     const { data: sightingData, error: sightingError } = await supabase
//       .from("food_truck_sightings")
//       .insert([
//         {
//           food_truck_id: food_truck_id,
//           location: `POINT(${location.lng} ${location.lat})`,
//           created_by_profile_id: user?.id,
//           address_formatted: address,
//           created_at: randomTime,
//         },
//       ])
//       .select()
//       .single();
//     return sightingData;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };

// ----------- Dev tool: for fetch and populate datas into db (END) -----------
