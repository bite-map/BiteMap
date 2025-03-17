import React from "react";
import { Review } from "../global-component-types";
import Image from "next/image";

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
          <Image
            className="h-[300px] object-cover"
            src={reviewsData.image}
            alt="Picture of a food truck"
            width={600}
            height={600}
          ></Image>
        </div>
      </div>
    </div>
  );
}
