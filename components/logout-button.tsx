import React from "react";
import { GrLogout } from "react-icons/gr";
import { signOutAction } from "@/app/actions";

export default function LogoutButton({}) {
  return (
    <button
      onClick={signOutAction}
      className="flex flex-col justify-center font-semibold items-center text-foreground w-16 py-[6px] mt-3 text-sm"
    >
      <GrLogout className="size-6 " />
      <p>Logout</p>
    </button>
  );
}
