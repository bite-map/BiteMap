"use client";

import React from "react";
import BottomNavMobile from "./bottom-nav-mobile";

// Icons
import { HomeIcon } from "@heroicons/react/24/outline";
import { MapIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/outline";

export default function BottomNavMobileLoggedIn() {
  return (
    <BottomNavMobile
      NavButtons={[
        { icon: HomeIcon, text: "Home", href: "/" },
        { icon: MapIcon, text: "Map", href: "/truckmap" },
        { icon: UserIcon, text: "Account", href: "/user-profile" },
      ]}
    />
  );
}
