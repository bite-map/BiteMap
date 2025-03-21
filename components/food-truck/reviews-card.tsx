import React from "react";
import { Review } from "../global-component-types";
import Image from "next/image";
import StarRating from "./star-rating";
import { usePathname } from "next/navigation";
import Link from "next/link";

type ReviewCardProps = {
  reviewsData: Review;
};

export default function ReviewCard({ reviewsData }: ReviewCardProps) {
  const pathname = usePathname();

  return (
    <>
      {pathname === "/user-profile" ? (
        <Link href={`/truck-profile/${reviewsData.food_truck_profile_id}`}>
          <div className="rounded-xl bg-background overflow-clip shadow-md ring-1 ring-primary">
            <div className="flex flex-col">
              <div className="p-2">
                <h2 className="text-xl font-semibold truncate">
                  {reviewsData.food_truck_profiles.name}
                </h2>
                <StarRating rating={reviewsData.rating} isClickable={false} />
                <p className="my-2">{reviewsData.content}</p>
              </div>
              <Image
                className="h-[300px] object-cover"
                src={reviewsData.image}
                alt="Picture of a food truck"
                width={600}
                height={600}
              ></Image>
            </div>
          </div>
        </Link>
      ) : (
        <div className="rounded-xl bg-background overflow-clip shadow-md ring-1 ring-primary">
          <div className="flex flex-col">
            <div className="p-2">
              <StarRating rating={reviewsData.rating} isClickable={false} />
              <p className="my-2">{reviewsData.content}</p>
            </div>
            <Image
              className="h-[300px] object-cover"
              src={reviewsData.image}
              alt="Picture of a food truck"
              width={600}
              height={600}
            ></Image>
          </div>
        </div>
      )}
    </>
  );
}
