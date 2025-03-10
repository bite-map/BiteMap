import React, { Dispatch, SetStateAction } from "react";
import NavSidebarMobile from "./nav-sidebar-mobile";
import { NavButton } from "./global-component-types";
import clsx from "clsx";

type SidebarMobileProps = {
  NavButtons: NavButton[];
  isDisplayed: boolean;
  handleToggle: () => void;
};

export default function SidebarMobile({
  NavButtons,
  isDisplayed,
  handleToggle,
}: SidebarMobileProps) {
  return (
    <div
      className={clsx("fixed top-16 right-0 z-10 flex w-full h-screen", {
        hidden: !isDisplayed,
      })}
    >
      <div
        onClick={handleToggle}
        className={clsx("grow", { hidden: !isDisplayed })}
      ></div>
      <div
        className={clsx(
          "fixed top-16 right-0 translate-x-0 flex flex-col gap-1 w-16 h-full bg-gray-300 transition-transform duration-300",
          { "translate-x-16": !isDisplayed }
        )}
      >
        {/* creates a button for each button passed to the component */}
        {NavButtons.map((NavButton, index) => (
          <NavSidebarMobile
            key={index}
            NavButton={NavButton}
            handleToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  );
}
