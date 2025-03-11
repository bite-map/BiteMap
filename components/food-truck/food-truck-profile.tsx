import React from "react";
// this is temperary component for displying in map when marker clicked
type FoodTruckProfileProps = {
  // location
  // review
  setTruckProfileDisplay: Function;
  sightingId: number;
};

export default function FoodTruckProfile({
  setTruckProfileDisplay,
  sightingId,
}: FoodTruckProfileProps) {
  // TODO: make food truck toggle when click outside

  async function getTruckBySightingId() {
    console.log(sightingId);
    // From sighting id link to truck id
    // query supabase
  }
  getTruckBySightingId();
  return (
    <div className="items-center w-5/6 h-5/6 bg-gray-50 absolute bg-blend-overlay flex flex-col ">
      <button
        onClick={() => {
          setTruckProfileDisplay(false);
        }}
        className="inline-flex w-full justify-center rounded-md bg-black  text-sm font-semibold text-white shadow-xs"
      >
        Close
      </button>
      <button className="inline-flex w-full justify-center rounded-md bg-black  text-sm font-semibold text-white shadow-xs">
        Add to Favourite
      </button>
      <button className="inline-flex w-full justify-center rounded-md bg-black  text-sm font-semibold text-white shadow-xs">
        Sight
      </button>
    </div>
  );
}
