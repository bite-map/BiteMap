import NavButtonMobile from "./nav-button-mobile";
import { NavButton } from "./global-component-types";
import clsx from "clsx";
import { User } from "@supabase/supabase-js";
import LogoutButton from "./logout-button";

type SidebarMobileProps = {
  NavButtons: NavButton[];
  isDisplayed: boolean;
  handleToggle: () => void;
  user: User | null;
};

export default function SidebarMobile({
  NavButtons,
  isDisplayed,
  handleToggle,
  user,
}: SidebarMobileProps) {
  return (
    <div
      className={clsx("fixed top-16 right-0 z-20 flex w-full h-screen", {
        hidden: !isDisplayed,
      })}
    >
      {/* this is temporary div to handle closing the menu when clicking outide
      we should research a better way to do this as it breaks the animations */}
      <div
        onClick={handleToggle}
        className={clsx("grow", { hidden: !isDisplayed })}
      ></div>
      <div
        className={clsx(
          "fixed top-16 right-0 translate-x-0 flex flex-col border-l-[1.5px] border-primary w-16 h-full  bg-muted transition-transform duration-300",
          { "translate-x-16": !isDisplayed }
        )}
      >
        {/* creates a button for each button passed to the component */}
        {NavButtons.map((NavButton, index) => (
          <NavButtonMobile
            key={index}
            NavButton={NavButton}
            handleToggle={handleToggle}
          />
        ))}
        {/* displays logout button if a user is logged in */}
        {user ? <LogoutButton handleToggle={handleToggle} /> : null}
      </div>
    </div>
  );
}
