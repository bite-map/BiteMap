"use client";

import React from "react";
import SidebarMobile from "./sidebar-mobile";

// Icons
import { AiOutlineHome } from "react-icons/ai";
import { GrMapLocation } from "react-icons/gr";
import { AiOutlineUser } from "react-icons/ai";

export default function SidebarNavMobileLoggedIn() {
  return (
    <SidebarMobile
      NavButtons={[
        { icon: AiOutlineHome, text: "Home", href: "/" },
        { icon: GrMapLocation, text: "Map", href: "/truck-map" },
        { icon: AiOutlineUser, text: "Account", href: "/user-profile" },
      ]}
    />
  );
}
