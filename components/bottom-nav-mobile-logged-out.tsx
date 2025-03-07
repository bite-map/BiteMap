"use client";

import React from "react";
import BottomNavMobile from "./bottom-nav-mobile";

// Icons
import { HomeIcon } from "@heroicons/react/24/outline";
import { MapIcon } from "@heroicons/react/24/outline";
import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline";

export default function BottomNavMobileLoggedOut() {
  return (
    <BottomNavMobile
      NavButtons={[
        { icon: HomeIcon, text: "Home", href: "/" },
        { icon: MapIcon, text: "Map", href: "/truckmap" },
        {
          icon: ArrowLeftEndOnRectangleIcon,
          text: "Login",
          href: "/sign-in",
        },
      ]}
    />
  );
}
