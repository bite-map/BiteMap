"use client";

import { usePathname } from "next/navigation";

export default function SearchBar() {
  const pathname = usePathname();

  return (
    <>
      {pathname === "/truck-map" && (
        <div
          className=" p-1 
      w-auto gap-3  relative flex flex-row items-center h-3/4"
        >
          <div className=" absolute h-1/2 w-1/6 items-center">
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="gray"
              className="w-full h-full"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
          <input
            id="search-bar"
            type="text "
            placeholder="Search Trucks"
            className=" bg-gray-100 outline-none w-full h-full block  ps-10 text-sm placeholder:p-1 "
          />
          <button
            type="submit"
            className="text-white rel end-2.5  w-1/4 h-full bottom-2.5 bg-gray-600 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2"
          >
            Search
          </button>
        </div>
      )}
    </>
  );
}
