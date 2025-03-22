import { Url } from "next/dist/shared/lib/router/router";

type NavButton = {
  icon: React.ElementType;
  text: string;
  href: Url;
  marginTop: string;
};

type Truck = {
  id: number;
  name: string;
  food_style: string;
  created_by_profile_id: string;
  avatar: string;
};

type Favorite = {
  food_truck_id: number;
  profile_id: string;
  food_truck_profiles: Truck;
};

type Location = {
  lat: number;
  lng: number;
};

type Sighting = {
  id: number;
  food_truck_id: number;
  location: geography;
  created_by_profile_id: string;
  address_formated: string;
  created_at: Date;
  food_truck_profiles: { name: string };
};

type Review = {
  id: number;
  food_truck_profile_id: number;
  content: string;
  created_by_profile_id: string;
  food_truck_profiles: { name: string };
  image: string;
  rating: number;
};

type ProfileImage = {
  id: string;
  path: string;
  fullPath: string;
};
