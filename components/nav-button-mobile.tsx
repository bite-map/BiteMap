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
  // return differently for map button
  const isMap = NavButton.href.toString().includes("/truck-map");
  return (
    <>
      {!isMap ? (
        <Link
          onClick={handleToggle}
          href={NavButton.href}
          className={`mt-${NavButton.marginTop} last:mb-4 md:last:mb-0 md:mt-0 `}
        >
          <div
            className={clsx(
              "flex font-semibold items-center w-48 h-12 p-3 mt-3 md:max-w-[36] md:justify-center md:p-0  md:rounded-xl md:mb-2 md:mt-2",
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
        <a
          onClick={handleToggle}
          href={NavButton.href.toString()}
          className=" "
        >
          <div
            className={clsx(
              "flex font-semibold items-center w-48 h-12 p-3 mt-3 md:max-w-1/5 md:justify-center md:rounded-xl md:mb-2 md:mt-2  ",
              {
                "bg-primary text-background": pathname.includes("/truck-map"),
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
