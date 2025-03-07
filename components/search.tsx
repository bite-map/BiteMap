import { useEffect, useState } from "react";
export default function SearchBar() {
  return (
    <div
      className=" p-1 
      w-auto gap-3  relative flex flex-row ite"
    >
      <div className=" absolute h-full items-center">
        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="gray"
          className="w-6 h-6  inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search Trucks"
        className=" bg-gray-100 outline-none w-full block p-4 ps-10 text-sm   "
      />
      <button
        type="submit"
        className="text-white rel end-2.5 bottom-2.5 bg-gray-600 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2"
      >
        Search
      </button>
    </div>
  );
}
