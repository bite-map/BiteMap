import React from "react";
import Link from "next/link";
import { Url } from "next/dist/shared/lib/router/router";

type NavButton = {
  icon: React.ElementType;
  text: String;
  href: Url;
};

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
