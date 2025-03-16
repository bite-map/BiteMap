"use server";

import { createClient } from "@/utils/supabase/server";
import { Location } from "../global-component-types";

// get each truck's nearest sightings
export const getMinDistanceSightingTruck = async (lat: number, lng: number) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("get_min_distance_sighting_truck", { lat: lat, lng: lng })
    .select();
  if (error) return error;
  console.log(data);
  return data;
};

// get nearest truck by current location
// optional: radius default to 10 km
export const getNearbyTruck = async (lat: number, lng: number) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("get_nearby_truck", { lat: lat, lng: lng, radius: 90000 })
    .select();
  if (error) return error;
  console.log(data);
  return data;
};
