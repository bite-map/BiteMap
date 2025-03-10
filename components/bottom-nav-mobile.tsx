import React, { useState } from "react";
import { signOutAction } from "@/app/actions";
import NavButtonMobile from "./nav-button-mobile";
import { NavButton } from "./global-component-types";
import { GrLogout } from "react-icons/gr";

type BottomNavMobileProps = {
  NavButtons: NavButton[];
};

export default function BottomNavMobile({ NavButtons }: BottomNavMobileProps) {
  const [useSidebar, setUseSidebar] = useState(false);

  const toggleSidebar = () => {
    setUseSidebar(!useSidebar)
  }

  return (
    <div>
      {/* hamburger button to toggle sidebar */}
      <button onClick={toggleSidebar} className="fixed top-2.5 left-6 text-4xl text-gray-700 md:hidden">
        &#9776; {/* hamburger icon */}
      </button>
            {/* Sidebar */}
       <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white p-0.85 transition-transform duration-300 transform ${
          useSidebar ? "translate-x-0" : "-translate-x-full"
         }`}
       >
      {/* creates a button for each button passed to the component */}
      <nav className="pt-8">
      {NavButtons.map((NavButton, index) => (
        <NavButtonMobile key={index} NavButton={NavButton} />
      ))}
      </nav>
      <button className = "fixed bottom-4 left-4 bg-transparent hover:border-transparent rounded" onClick={signOutAction}>  <GrLogout className=" " />Log Out</button>
      </div>
            {/* overlay to close the sidebar when clicked outside */}
       {useSidebar && (
        <>
         <div
           className="fixed top-0 left-0 w-0 h-full bg-black opacity-50 z-10"
           onClick={toggleSidebar}
         />
         <button
           onClick={toggleSidebar}
           className="fixed top-2.5 left-6 text-4xl text-gray-700 md:hidden"
         >
          &#9776;
          </button>
      
         </>
       )}
    </div>
  );
}
