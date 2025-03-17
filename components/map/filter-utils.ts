"use server";

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
