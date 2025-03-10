import React from "react";
import Link from "next/link";
import { NavButton } from "./global-component-types";
import { usePathname } from "next/navigation";
import clsx from "clsx";

type NavSidebarMobileProps = {
  NavButton: NavButton;
};

export default function NavSidebarMobile({ NavButton }: NavSidebarMobileProps) {
  const pathname = usePathname();

  const Icon = NavButton.icon;
  return (
    <Link href={NavButton.href}>
      <div
        className={clsx(
          "flex flex-col justify-center items-center w-[80px] h-[60px] mt-8",
          { "bg-gray-400": pathname === NavButton.href }
        )}
      >
        <Icon className="size-6 " />
        <p>{NavButton.text}</p>
      </div>
    </Link>
  );
}
