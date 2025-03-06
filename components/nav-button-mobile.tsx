import React from "react";
import Link from "next/link";
import { NavButton } from "./global-component-types";

type NavButtonMobileProps = {
  NavButton: NavButton;
};

export default function NavButtonMobile({ NavButton }: NavButtonMobileProps) {
  const Icon = NavButton.icon;
  return (
    <Link href={NavButton.href}>
      <div className="flex flex-col justify-center items-center w-[80px] h-[50px]">
        <Icon className="size-6 " />
        <p>{NavButton.text}</p>
      </div>
    </Link>
  );
}
