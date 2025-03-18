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
  console.log(data);
  return data.filter((sighting) => {
    return sighting.confirmation_count > 10;
  });
};
