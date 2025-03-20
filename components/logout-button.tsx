import React from "react";
import { GrLogout } from "react-icons/gr";
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
      className="flex font-semibold items-center w-40 h-12 p-3 mt-3"
    >
      <GrLogout size={26} />
      <p className="ml-2">Logout</p>
    </button>
  );
}
