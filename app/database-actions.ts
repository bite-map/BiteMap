"use server";

import { createClient } from "@/utils/supabase/server";
import { Location } from "@/components/global-component-types";
import { Truck } from "../components/global-component-types";

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
// gets information about sightings made by the user
export const getSightingData = async (profileId: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("food_truck_sightings")
    .select(
      "id, created_by_profile_id, food_truck_id, location, food_truck_profiles(name)"
    )
    .eq("created_by_profile_id", profileId);

  if (error) return [];

  return data;
};

export const addTruck = async (truck: Truck) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("food_truck_profiles")
    .insert({
      name: truck.name,
      food_style: truck.food_style,
      created_by_profile_id: user?.id,
      avatar: null,
    })
    .select();

  if (error) return error;

  return data;
};

export const getTruckBySightingId = async (sighitngId: number) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("food_truck_sightings")
    .select()
    .eq("id", sighitngId);
  if (data) {
    console.log(data);
  }
  // TODO
};

export const getSightingByTruckId = async () => {
  const supabase = await createClient();
  // TODO
};

export const addSighting = async (location: Location) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("food_truck_sightings")
    .insert([
      { food_truck_id: 3, location: `POINT(${location.lng} ${location.lat})` },
    ])
    .select();

  if (error) return error;

  return data;
};

// get all sightings
export const getSighting = async (location: Location) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .rpc("nearby_sightings", { lat: location.lat, lng: location.lng })
    .select();
  if (error) return error;

  return data;
};
