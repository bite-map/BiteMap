"use client";

import React from "react";
import SidebarMobile from "./sidebar-nav-mobile";

// Icons
import { AiOutlineHome } from "react-icons/ai";
import { GrMapLocation } from "react-icons/gr";
import { GrLogin } from "react-icons/gr";


export default function SidebarNavMobileLoggedOut() {
  return (
    <SidebarMobile
      NavButtons={[
        { icon: AiOutlineHome, text: "Home", href: "/" },
        { icon: GrMapLocation, text: "Map", href: "/truck-map" },
        {
          icon: GrLogin,
          text: "Login",
          href: "/sign-in",
        },
      ]}
    />
  );
}
