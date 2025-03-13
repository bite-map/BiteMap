"use server";

import { ProfileImage } from "@/components/global-component-types";
import { createClient } from "@/utils/supabase/server";

// gets all files in the bucket root
export const getAllFilesInBucketRoot = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.storage.from("BiteMap").list("", {
    limit: 100,
    offset: 0,
    sortBy: { column: "name", order: "asc" },
  });

  if (error) console.error(error);

  console.log("Bucket contents:", data);

  return data;
};

export const addFoodTruckProfileImage = async (truckId: number, file: File) => {
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from("BiteMap")
    .upload(`truck_images/truck_profile_${truckId}`, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) console.error(error);

  return data;
};

// gets the public url of an image in storage
export const getPublicUrlForImage = async (img: ProfileImage) => {
  const supabase = await createClient();

  const { data } = supabase.storage.from("BiteMap").getPublicUrl(img.path);

  return data;
};
