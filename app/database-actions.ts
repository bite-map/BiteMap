"use server";

import { createClient } from "@/utils/supabase/server";

// gets information about all food trucks
export const getFoodTruckData = async () => {
  const supabase = await createClient();
  const { data } = await supabase.from("food_truck_profiles").select();
  return data;
};
