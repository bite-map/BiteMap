"use server";

import { ProfileImage } from "@/components/global-component-types";
import { createClient } from "@/utils/supabase/server";

// gets all files in the bucket's root directory
// we probably won't use this but it might be a good reference
export const getAllFilesInBucketRoot = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.storage.from("BiteMap").list("", {
    limit: 100,
    offset: 0,
    sortBy: { column: "name", order: "asc" },
  });

  if (error)
    console.error("Error getting files from bucket's root directory: ", error);

  return data;
};

// adds a profile image associated with a trucks id to the bucket
export const addFoodTruckProfileImageToBucket = async (
  truckId: number,
  file: File
) => {
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from("BiteMap")
    .upload(`truck_images/truck_profile_${truckId}`, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error)
    console.error("Error adding food truck profile picture to bucket: ", error);

  return data;
};

// adds a profile image associated with a trucks id to the bucket
export const addReviewImageToBucket = async (
  truckId: number,
  reviewId: number,
  file: File
) => {
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from("BiteMap")
    .upload(`review_images/truck_profile_${truckId}_review_${reviewId}`, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) console.error("Error adding review picture to bucket: ", error);

  return data;
};

// gets the public url of an image in storage
export const getPublicUrlForImage = async (img: ProfileImage) => {
  const supabase = await createClient();

  const { data } = supabase.storage.from("BiteMap").getPublicUrl(img.path);

  return data;
};
