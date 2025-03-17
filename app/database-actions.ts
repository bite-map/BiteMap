"use server";

import { createClient } from "@/utils/supabase/server";
import { Location } from "@/components/global-component-types";
import { Truck, ProfileImage } from "../components/global-component-types";
import {
  addFoodTruckProfileImageToBucket,
  getPublicUrlForImage,
} from "./storage-actions";

// -------------- FOOD TRUCK (START) --------------
// adds a food truck to the database
export const addFoodTruck = async (
  truckName: string,
  foodStyle: string,
  file: File
) => {
  const supabase = await createClient();

  // gets the currently logged in user so we can assign them as creator
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // add new food truck to the database
  const { data, error } = await supabase
    .from("food_truck_profiles")
    .insert({
      name: truckName,
      food_style: foodStyle,
      created_by_profile_id: user?.id,
    })
    .select();

  if (error) console.error(error);

  let truckId;

  if (data) {
    truckId = data[0].id;
  }

  // add profile image to storage and store returned data
  const profileImage = await addFoodTruckProfileImageToBucket(truckId, file);

  // get the public url for the profile image
  const { publicUrl } = await getPublicUrlForImage(
    profileImage as ProfileImage
  );

  // update food truck profile with public url for profile image
  addProfileImageToFoodTruck(truckId, publicUrl);

  if (error) console.error("Error adding food truck to database: ", error);

  return data;
};

// adds a profile image to an existing food truck profile
export const addProfileImageToFoodTruck = async (
  truckId: number,
  url: string
) => {
  const supabase = await createClient();

  // update food truck profile with public url for profile image
  const { error } = await supabase
    .from("food_truck_profiles")
    .update({ avatar: url })
    .eq("id", truckId);

  if (error)
    console.error(
      `Error updating profile picture for food truck ${truckId}: `,
      error
    );
};

// gets information about all food trucks
export const getFoodTruckData = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("food_truck_profiles").select();

  if (error) console.error("Error fetching all food truck data", error);

  return data;
};

// gets information for a given food truck by ID
export const getFoodTruckDataById = async (truckId: number) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("food_truck_profiles")
    .select()
    .eq("id", truckId);

  if (error)
    console.error(`Error fetching data for food truck ${truckId}: `, error);

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
    .eq("id", sighitngId)
    .single();
  const truckId = data.food_truck_id;
  if (data) {
    const { data, error } = await supabase
      .from("food_truck_profiles")
      .select()
      .eq("id", truckId)
      .single();
    if (data) {
      return data;
    }
  }
};

// an alternative way to implement fetch trucks by nearby sightings:
export const getNearbyTruck = async (
  lat: number,
  lng: number,
  radius: number | null = null
) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .rpc("get_nearby_truck", {
        lat: lat,
        lng: lng,
        radius: radius,
      })
      .select();
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

// -------------- FOOD TRUCK (END) --------------

// -------------- SIGHTING (START) --------------
// get specific user's sighting
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

export const getSightingByTruckId = async (truckId: number) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("food_truck_sightings")
    .select(
      "id, created_by_profile_id, food_truck_id, location, food_truck_profiles(name)"
    )
    .eq("food_truck_id", truckId);
  return data;
};

export const getSightingBySightingId = async (sighting_id: number = 17) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .rpc("select_sightings_id", { sighting_id: sighting_id })
    .select()
    .single();
  if (error) return error;

  return data;
};

// get all sightings on a specific day
export const getDayOfWeekSighting = async (dayOfWeek: number) => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_sightings_by_day", {
    dayofweek: dayOfWeek,
  });

  if (error) return error;

  return data;
};

export const addSighting = async (
  location: Location,
  food_truck_id: number,
  address: string | null
) => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    // query if there is any near sighting of the same truck id exists
    // db function 1: detect if nearby sightings exists
    // if there are sightings where dist < 200, return the nearest one of them, done't add new sighting, insert confirmation of that sighting, return the confirmation
    // else, dist > 200, insert a new sighting
    const { data, error } = await supabase.rpc("detect_duplicated_sighting", {
      lat: location.lat,
      lng: location.lng,
      truck_id: food_truck_id,
      radius: 200,
    });
    if (data && data.length > 0) {
      // inert to confirmation, return number of duplicated sightings
      const nearestSightingId = data[0].id;
      const count = data.length;
      const { data: confirmationData, error: confirmationError } =
        await supabase
          .from("sighting_confirmations")
          .insert([
            {
              food_truck_sighting_id: nearestSightingId,
              food_truck_id: food_truck_id,
              confirmed_by_profile_id: user?.id,
            },
          ])
          .select();
      if (error) {
        throw error;
      }
      return { data: data, duplicatedSightingCount: count };
    }
    // const { data: sd, error: se } = await supabase
    //   .from("food_truck_sightings")
    //   .insert([
    //     {
    //       food_truck_id: food_truck_id,
    //       location: `POINT(${location.lng} ${location.lat})`,
    //       created_by_profile_id: user?.id,
    //       address_formatted: address,
    //     },
    //   ])
    //   .select()
    //   .single();
    if (error) return error;
    console.log(data, error);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// current: get all s c, then partion by s id (last active of each s)
export const getSightingsByLastActive = async (truckId: number) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .rpc("get_sightings_ordered_by_last_active")
      .select();
    if (error) {
      return [error];
    }
    return data.filter((sighting) => {
      return sighting.food_truck_id == truckId;
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// -------------- SIGHTING CONFIRMATION (START)--------------
export const addSightingConfirmation = async (
  sightingId: number,
  truckId: number
) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("sighting_confirmations")
    .insert([
      {
        food_truck_sighting_id: sightingId,
        food_truck_id: truckId,
        confirmed_by_profile_id: user?.id,
      },
    ])
    .select();
  if (error) return error;

  return data;
};

export const getConfirmationBySightingId = async (sightingId: number) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sighting_confirmations")
    .select()
    .eq("food_truck_sighting_id", sightingId);

  if (error) return error;

  return data;
};
// -------------- SIGHTING CONFIRMATION (END)--------------

// -------------- SIGHTING (END) --------------

// -------------- REVIEW (START) --------------
export const getReviewsData = async (profileId: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select(
      "id, food_truck_profile_id, content, created_by_profile_id, food_truck_profiles(name)"
    )
    .eq("created_by_profile_id", profileId);

  if (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
  return data;
};
// -------------- REVIEW (END) --------------

// -------------- REVIEW --------------
// adds a review the database

export const AddFoodTruckReview = async (
  formData: FormData,
  truckId: number
) => {
  // const truckId = formData.get("truckId") as string;
  const rating = formData.get("rating") as string;
  const content = formData.get("content") as string;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("reviews")
    .insert([
      {
        food_truck_profile_id: truckId,
        created_by_profile_id: user?.id,
        rating: rating,
        content: content,
      },
    ])
    .select();

  if (error) throw error;

  console.log("New review added:", data);
  return data;
};

// -------------- FAVORITE --------------

export const toggleFavorite = async (truckId: number) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase.rpc("toggle_favorite", {
    user_id: user?.id,
    truck_id: truckId,
  });
  if (error) {
    console.error("Error toggle favorite :", error);
    return [];
  }

  return data;
};

export const getIsFavorite = async (truckId: number) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("favorite_trucks")
    .select()
    .eq("food_truck_id", truckId)
    .eq("profiles_id", user?.id)
    .maybeSingle();
  if (error) {
    console.error("Error toggle favorite :", error);
    return [];
  }
  // return the whole favorite obj
  return data;
};
// -------------- FAVORITE (END) --------------
