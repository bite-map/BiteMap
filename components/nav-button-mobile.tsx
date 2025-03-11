import React from "react";
import Link from "next/link";
import { NavButton } from "./global-component-types";
import { usePathname } from "next/navigation";
import clsx from "clsx";

type NavButtonMobileProps = {
  NavButton: NavButton;
  handleToggle: () => void;
};

export default function NavButtonMobile({
  NavButton,
  handleToggle,
}: NavButtonMobileProps) {
  const pathname = usePathname();

  const Icon = NavButton.icon;

  return (
    <Link onClick={handleToggle} href={NavButton.href}>
      <div
        className={clsx(
          "flex flex-col justify-center font-semibold items-center w-16 py-[6px] mt-3 text-sm",
          {
            "bg-primary text-background": pathname === NavButton.href,
          }
        )}
      >
        <Icon className="size-6 " />
        <p>{NavButton.text}</p>
      </div>
    </Link>
  );
}
