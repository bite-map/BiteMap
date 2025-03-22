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
    <>
      {/* this is the gray area to the left of the sidebar */}
      <div
        onClick={handleToggle}
        className={clsx(
          "fixed top-0  w-full h-full bg-black bg-opacity-50 z-20",
          {
            hidden: !isDisplayed,
          }
        )}
      ></div>
      <div
        className={clsx(
          "fixed top-0 right-0 translate-x-0 flex flex-col border-l-[1.5px] border-primary w-48 h-full pt-16 bg-muted transition-transform duration-300 z-20",
          { "translate-x-48": !isDisplayed }
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
    </>
  );
}
