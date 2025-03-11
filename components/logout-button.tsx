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
      className="flex flex-col justify-center font-semibold items-center text-foreground w-16 py-[6px] mt-3 text-sm"
    >
      <GrLogout className="size-6 " />
      <p>Logout</p>
    </button>
  );
}
