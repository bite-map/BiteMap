import React from "react";

type FoodTruckProfileProps = {
  // location
  // review
  setTruckProfile: Function;
};

export default function FoodTruckProfile({
  setTruckProfile,
}: FoodTruckProfileProps) {
  return (
    <div className="w-5/6 h-5/6 bg-gray-50">
      <button
        onClick={() => {
          setTruckProfile(false);
        }}
      >
        Close
      </button>
      <button>Add to Favourite</button>
      <button>Sight</button>
    </div>
  );
}
