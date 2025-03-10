import React from "react";
import Link from "next/link";
import { NavButton } from "./global-component-types";
import { usePathname } from "next/navigation";
import clsx from "clsx";

type NavSidebarMobileProps = {
  NavButton: NavButton;
  handleToggle: () => void;
};

export default function NavButtonMobile({
  NavButton,
  handleToggle,
}: NavSidebarMobileProps) {
  const pathname = usePathname();

  const Icon = NavButton.icon;
  return (
    <Link onClick={handleToggle} href={NavButton.href}>
      <div
        className={clsx(
          "flex flex-col justify-center items-center w-16 h-16 text-sm",
          {
            "bg-gray-400": pathname === NavButton.href,
          }
        )}
      >
        <Icon className="size-6 " />
        <p>{NavButton.text}</p>
      </div>
    </Link>
  );
}
