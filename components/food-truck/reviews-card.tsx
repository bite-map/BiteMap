import React from "react";
import { Review } from "../global-component-types";

type ReviewCardProps = {
  reviewsData: Review;
};

export default function ReviewCard({ reviewsData }: ReviewCardProps) {
  return (
    <div className="rounded-xl bg-background overflow-clip shadow-md ring-1 ring-primary">
      <div className="flex">
        <div className="p-2">
          <h2 className="text-lg font-semibold text-primary">
            {reviewsData.food_truck_profiles.name}
          </h2>
          <p>{reviewsData.content}</p>
        </div>
      </div>
    </div>
  );
}
