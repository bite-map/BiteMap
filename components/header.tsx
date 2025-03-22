"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "../public/logo.svg";
import SidebarMobile from "./sidebar-mobile";
import {
  LuMenu,
  LuLogIn,
  LuHouse,
  LuUserRound,
  LuMap,
  LuShieldAlert,
  LuX,
} from "react-icons/lu";
import { useState } from "react";
import { User } from "@supabase/supabase-js";

type HeaderProps = {
  user: User | null;
};

export default function Header({ user }: HeaderProps) {
  const [isDisplayed, setIsDisplayed] = useState<boolean>(false);

  const handleToggle = () => {
    setIsDisplayed(!isDisplayed);
  };

  return (
    <>
      <button
        className="fixed top-3 right-2 z-30 text-gray-700 text-2xl border-2 border-primary bg-muted rounded-xl text-primary w-10 h-10 mr-[3px] flex justify-center items-center"
        onClick={handleToggle}
      >
        {!isDisplayed ? <LuMenu /> : <LuX />}
      </button>
      <header className="fixed top-0 left-0 z-10 bg-background w-full flex shrink-0 justify-between items-center h-16 px-2 drop-shadow-sm ">
        {/* displays the logo */}
        <Link href="/">
          <Image
            className="w-[100px]"
            src={logo}
            alt="BiteMap's Logo"
            width={400}
            height={140}
          ></Image>
        </Link>
        {/* menu button */}
      </header>
      {/* displays a different sidebar depending on login satus */}
      {user ? (
        <SidebarMobile
          NavButtons={[
            { icon: LuHouse, text: "Home", href: "/", marginTop: "" },
            {
              icon: LuMap,
              text: "Map",
              href: "/truck-map?init=active",
              marginTop: "",
            },
            {
              icon: LuUserRound,
              text: "Account",
              href: "/user-profile",
              marginTop: "",
            },
            {
              icon: LuShieldAlert,
              text: "Privacy Policy",
              href: "/privacy-policy",
              marginTop: "auto",
            },
          ]}
          isDisplayed={isDisplayed}
          handleToggle={handleToggle}
          user={user}
        ></SidebarMobile>
      ) : (
        <SidebarMobile
          NavButtons={[
            { icon: LuHouse, text: "Home", href: "/", marginTop: "" },
            {
              icon: LuMap,
              text: "Map",
              href: "/truck-map?init=active",
              marginTop: "",
            },
            { icon: LuLogIn, text: "Login", href: "/sign-in", marginTop: "" },
            {
              icon: LuShieldAlert,
              text: "Privacy Policy",
              href: "/privacy-policy",
              marginTop: "auto",
            },
          ]}
          isDisplayed={isDisplayed}
          handleToggle={handleToggle}
          user={user}
        ></SidebarMobile>
      )}
    </>
  );
}
