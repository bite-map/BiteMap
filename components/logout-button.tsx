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
      className="flex font-semibold items-center w-48 h-12 p-3 mt-3 last:mb-4, md:last:mb-0  md:mt-0"
    >
      <div className="flex font-semibold items-center w-48 h-9 p-3 mt-3 md:max-w-[36] md:justify-center md:p-0  md:rounded-xl md:mb-2 md:mt-2">
        <LuLogOut size={26} />
        <p className="ml-2 ">Logout</p>
      </div>
    </button>
  );
}
