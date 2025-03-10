import React from "react";
import NavSidebarMobile from "./nav-sidebar-mobile";
import { NavButton } from "./global-component-types";

type SidebarMobileProps = {
  NavButtons: NavButton[];
};

export default function SidebarMobile({ NavButtons }: SidebarMobileProps) {
  return (
    <div className="fixed bottom-0 flex justify-around items-center w-full h-16 bg-gray-300">
      {/* creates a button for each button passed to the component */}
      {NavButtons.map((NavButton, index) => (
        <NavSidebarMobile key={index} NavButton={NavButton} />
      ))}
    </div>
  );
}
