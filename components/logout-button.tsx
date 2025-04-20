import React from "react";
import { LuLogOut } from "react-icons/lu";
import { signOutAction } from "@/app/actions";

type LogoutButtonProps = {
  handleToggle: () => void;
};

export default function LogoutButton({ handleToggle }: LogoutButtonProps) {
  return (
    <button
      onClick={() => {
        signOutAction();
        handleToggle();
      }}
      className="flex font-semibold items-center w-48 h-12 p-3 mt-3 last:mb-4, md:last:mb-0 md:ring-1 md:ring-primary md:rounded-t-xl  md:justify-center"
    >
      <LuLogOut size={26} />
      <p className="ml-2 ">Logout</p>
    </button>
  );
}
