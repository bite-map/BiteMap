"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "../public/logo.svg";
import { LuMenu } from "react-icons/lu";
import SidebarMobile from "./sidebar-mobile";
import { AiOutlineHome, AiOutlineUser } from "react-icons/ai";
import { GrMapLocation } from "react-icons/gr";
import { MdClose } from "react-icons/md";
import { GrLogin } from "react-icons/gr";
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
      <header className="fixed top-0 left-0 z-10 bg-background w-full flex shrink-0 justify-between items-center h-16 px-2 drop-shadow-sm">
        <Link href="/">
          <Image
            className="w-[100px]"
            src={logo}
            alt="BiteMap's Logo"
            width={400}
            height={140}
          ></Image>
        </Link>
        <button
          className="text-gray-700 text-2xl bg-muted w-12 h-12 flex justify-center items-center"
          onClick={handleToggle}
        >
          {!isDisplayed ? <LuMenu /> : <MdClose />}
        </button>
      </header>
      {user ? (
        <SidebarMobile
          NavButtons={[
            { icon: AiOutlineHome, text: "Home", href: "/" },
            { icon: GrMapLocation, text: "Map", href: "/truck-map" },
            { icon: AiOutlineUser, text: "Account", href: "/user-profile" },
          ]}
          isDisplayed={isDisplayed}
          handleToggle={handleToggle}
        ></SidebarMobile>
      ) : (
        <SidebarMobile
          NavButtons={[
            { icon: AiOutlineHome, text: "Home", href: "/" },
            { icon: GrMapLocation, text: "Map", href: "/truck-map" },
            { icon: GrLogin, text: "Login", href: "/sign-in" },
          ]}
          isDisplayed={isDisplayed}
          handleToggle={handleToggle}
        ></SidebarMobile>
      )}
    </>
  );
}
