import React from "react";
import NavButtonMobile from "./nav-button-mobile";
import { Url } from "next/dist/shared/lib/router/router";

type NavButton = {
  icon: React.ElementType;
  text: String;
  href: Url;
};

type BottomNavMobileProps = {
  NavButtons: NavButton[];
};

export default function BottomNavMobile({ NavButtons }: BottomNavMobileProps) {
  return (
    <div className="sticky top-[100vh] flex justify-around items-center w-full h-16 bg-gray-300">
      {NavButtons.map((NavButton, index) => (
        <NavButtonMobile key={index} NavButton={NavButton} />
      ))}
    </div>
  );
}
