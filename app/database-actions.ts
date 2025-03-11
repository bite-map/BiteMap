"use server";

import { createClient } from "@/utils/supabase/server";
import { Location } from "@/components/global-component-types";
import { Truck } from "../components/global-component-types";

// gets information about all food trucks
export const getFoodTruckData = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("food_truck_profiles").select();

  if (error) console.error(error);

  return data;
};

// gets information for a given food truck by ID
export const getFoodTruckDataById = async (truckId: number) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("food_truck_profiles")
    .select()
    .eq("id", truckId);

  if (error) console.error(error);

  return data ? data[0] : null;
};

// gets information about the respective favorites from determined user
export const getFavoriteTruck = async (profileId: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("favorite_trucks")
    .select(
      "food_truck_id, profiles_id, food_truck_profiles(name, food_style, avatar)"
    )
    .eq("profiles_id", profileId);

  if (error) return [];

  return data;
};

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
}

export const getReviewsData = async(profileId: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select("id, food_truck_profile_id, content, created_by_profile_id, food_truck_profiles(name)")
    .eq("created_by_profile_id", profileId);

    if(error) {
      console.error("Error fetching reviews:", error);
    return [];
    }

    console.log("Supabase Reviews Data:", data);
    return data;
}

export const getTruckBySightingId = async (sighitngId: number) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("food_truck_sightings")
    .select()
    .eq("id", sighitngId)
    .single();
  console.log(data);
  const truckId = data.food_truck_id;
  if (data) {
    const { data, error } = await supabase
      .from("food_truck_profiles")
      .select()
      .eq("id", truckId)
      .single();
    console.log(data);
    if (data) {
      return data;
    }
  }
};

export const getSightingByTruckId = async (truckId: number) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("food_truck_sightings")
    .select()
    .eq("food_truck_id", truckId);
  return data;
};

export const addSighting = async (
  location: Location,
  food_truck_id: number
) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("food_truck_sightings")
    .insert([
      {
        food_truck_id: food_truck_id,
        location: `POINT(${location.lng} ${location.lat})`,
        created_by_profile_id: user?.id,
      },
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

export const getSightingBySightingId = async (sighting_id: number = 17) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .rpc("select_sightings_id", { sighting_id: sighting_id })
    .select();
  if (error) return error;

  return data;
};
