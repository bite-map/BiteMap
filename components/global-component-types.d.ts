import { Url } from "next/dist/shared/lib/router/router";

type NavButton = {
  icon: React.ElementType;
  text: string;
  href: Url;
};

type Truck = {
  id: number;
  name: string;
  food_style: string;
  created_by_profile_id: string;
  avatar: string;
};
