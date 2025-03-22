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
    <>
      {NavButton.href !== "/truck-map" ? (
        <Link
          onClick={handleToggle}
          href={NavButton.href}
          className={`mt-${NavButton.marginTop} last:mb-4`}
        >
          <div
            className={clsx(
              "flex font-semibold items-center w-48 h-12 p-3 mt-3",
              {
                "bg-primary text-background": pathname === NavButton.href,
              }
            )}
          >
            <Icon size={26} />
            <p className="ml-2">{NavButton.text}</p>
          </div>
        </Link>
      ) : (
        <a onClick={handleToggle} href={NavButton.href}>
          <div
            className={clsx(
              "flex font-semibold items-center w-48 h-12 p-3 mt-3",
              {
                "bg-primary text-background": pathname === NavButton.href,
              }
            )}
          >
            <Icon size={26} />
            <p className="ml-2">{NavButton.text}</p>
          </div>
        </a>
      )}
    </>
  );
}
