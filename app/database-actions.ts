"use server";

import { createClient } from "@/utils/supabase/server";

// gets information about all food trucks
export const getFoodTruckData = async () => {
  const supabase = await createClient();
  const { data } = await supabase.from("food_truck_profiles").select();
  return data;
};

// gets information about the respective favorites from determined user
export const getFavoriteTruck = async (profileId: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
      .from("favorite_trucks")
      .select("food_truck_id, profiles_id, food_truck_profiles(name)")
      .eq("profiles_id", profileId);

      if (error) return [];

  return data;  

};