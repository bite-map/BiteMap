"use client";

import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { Truck } from "../global-component-types";
import {
  getFoodTruckDataById,
  toggleFavorite,
  getIsFavorite,
  getSightingsByLastActiveOfTruck,
  getReviewsDataByTruck,
} from "@/app/database-actions";
import SightingCard from "./sighting-card";
import { IoMdHeart } from "react-icons/io";
import AddReviewFoodTruckForm from "./add-or-edit-reviews";
import ReviewCard from "./reviews-card";
import { createClient } from "@/utils/supabase/client";
import { UserMetadata } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { getAllSighConfirmationsByDayLocationId } from "@/app/database-actions";
import { IoCreateOutline } from "react-icons/io5";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { montserrat } from "../fonts";
import { FaSpinner } from "react-icons/fa";

type FoodTruckProfileProps = {
  truckId: number;
};

export default function FoodTruckProfile({ truckId }: FoodTruckProfileProps) {
  dayjs.extend(relativeTime);

  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<UserMetadata | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<"sightings" | "reviews">(
    "reviews"
  );
  const [foodTruck, setFoodTruck] = useState<Truck | null>(null);
  const [sightings, setSightings] = useState<any[] | null>();
  const [reviews, setReviews] = useState<any[]>([]);
  const [lastActive, setLastActive] = useState<string>();
  const [lastActiveHumanRead, setLastActiveHumanRead] = useState<string>();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isDisplayedAddReview, setIsDisplayedAddReview] = useState(false);
  const [locationsChance, setLocationsChance] = useState<Map<string, number>>(
    new Map()
  );
  const [chancesLoading, setChancesLoading] = useState(true);

  const handleToggleAddReview = () => {
    setIsDisplayedAddReview((prev) => !prev);
  };

  useEffect(() => {
    // get logged in user
    (async () => {
      const session = await supabase.auth.getSession();
      setUser(session.data.session?.user.user_metadata);
    })();

    (async () => {
      setFoodTruck(await getFoodTruckDataById(truckId));
      // get current favorite state
      setIsFavorite(await getIsFavorite(truckId));
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const data = await getSightingsByLastActiveOfTruck(truckId);
      if (data) {
        setSightings(data);
      }
    })();

    (async () => {
      setReviews(await getReviewsDataByTruck(truckId));
    })();
  }, [foodTruck]);

  useEffect(() => {
    // console.log(reviews);
  }, [reviews]);

  useEffect(() => {
    if (sightings && sightings.length > 0) {
      setChancesLoading(true);
      const calculateChance = async () => {
        const chancesMap = new Map<string, number>();
        const dayOfWeek = new Date().getDay(); // get the current day of the week (0-6)

        // Get sightings confirmations for all sightings
        for (let sighting of sightings) {
          const confirmations = await getAllSighConfirmationsByDayLocationId(
            truckId,
            sighting.address_formatted,
            dayOfWeek
          );

          const confirmationCount = confirmations.length;

          if (confirmationCount > 0) {
            const currentChance =
              chancesMap.get(sighting.address_formatted) || 0;
            chancesMap.set(
              sighting.address_formatted,
              currentChance + confirmationCount // Normalize chance by the number of sightings
            );
          }
        }

        const totalConfirmations = Array.from(chancesMap.values()).reduce(
          (acc, val) => acc + val,
          0
        );

        if (totalConfirmations > 0) {
          chancesMap.forEach((count, address) => {
            const maxChance = Math.min(count / totalConfirmations, 0.9);
            chancesMap.set(address, maxChance);
          });
        }

        setLocationsChance(chancesMap);
        setChancesLoading(false);
      };

      calculateChance();
    }
  }, [sightings]);
  useEffect(() => {
    if (sightings) {
      const localTime = new Date(sightings[0].last_active_time);
      const year = localTime.getFullYear().toString().slice(-2);
      const month = (localTime.getMonth() + 1).toString().padStart(2, "0");
      const day = localTime.getDate().toString().padStart(2, "0");
      const dayOfWeek = localTime.toString().split(" ")[0];
      const hours = localTime.getHours().toString().padStart(2, "0");
      const minutes = localTime.getMinutes().toString().padStart(2, "0");
      const seconds = localTime.getSeconds().toString().padStart(2, "0");
      setLastActive(
        `${year}-${month}-${day} ${dayOfWeek} ${hours}:${minutes}:${seconds}`
      );

      setLastActiveHumanRead(dayjs(sightings[0].last_active_time).fromNow());
    }
  }, [sightings]);

  return (
    <div className="p-3 min-h-screen">
      {foodTruck && (
        <div className="relative rounded-xl bg-background overflow-clip shadow-md ring-1 ring-primary width-full">
          <Image
            className="h-[200px] object-cover"
            src={foodTruck.avatar as string}
            alt="Picture of a food truck"
            width={600}
            height={600}
          ></Image>

          <div className="flex flex-row">
            <div className="px-3 py-2 truncate">
              <h2 className="text-xl font-semibold truncate">
                {foodTruck.name}
              </h2>
              <p className="-mt-1 text-sm text-gray-500">
                {foodTruck.food_style}
              </p>
              {lastActive && <p>Last seen: {lastActiveHumanRead}</p>}
            </div>
            {user && (
              <button
                style={{
                  color: isFavorite ? "#ef6262" : "#D1D5DB",
                }}
                className="ml-auto mr-3"
                onClick={async () => {
                  try {
                    const data = await toggleFavorite(truckId);
                    setIsFavorite(data);
                  } catch (error) {
                    console.error(error);
                  }
                }}
              >
                <IoMdHeart size={32} />
              </button>
            )}
          </div>
        </div>
      )}

      {chancesLoading ? (
        <p className="flex items-center mt-2 ml-2 text-sm gap-2">
          Calculating Chances{" "}
          <FaSpinner className="animate-spin text-primary" />
        </p>
      ) : locationsChance.size > 0 ? (
        <div className="relative rounded-xl bg-background overflow-clip shadow-md ring-1 ring-primary width-full mt-4 min-h-16 px-3 py-2">
          <strong>
            <p className="text-lg">
              Chances for{" "}
              {
                [
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ][new Date().getDay()]
              }
            </p>
          </strong>
          <ul className="pl-3 marker:text-primary">
            {Array.from(locationsChance.entries()).map(([location, chance]) => (
              <li
                key={location}
                className="text-sm list-disc first:pt-1 pt-3 text-gray-500"
              >
                {location}:{" "}
                <strong className="text-primary">
                  {Math.round(chance * 100)}%
                </strong>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-4 text-sm ml-2">
          Insufficient data to calculate chance
        </div>
      )}

      <div className="border-b border-gray-200 mt-4">
        <nav className="flex -mb-px">
          {["reviews", "sightings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 px-4 py-3 text-center text-sm font-medium ${
                activeTab === tab
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } transition-colors duration-200`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Reviews Tab */}
      <div className="pt-2">
        {activeTab === "reviews" && (
          <>
            <div className="flex">
              <h1
                className={`${montserrat.className} text-2xl text-primary tracking-tight`}
              >
                <strong>Recent Reviews</strong>
              </h1>
              <button
                className="bg-primary p-2 mr-2 text-primary-foreground rounded-xl flex-none w-9 h-9 flex justify-center items-center ml-auto mb-2"
                onClick={() => {
                  if (!user) {
                    return router.push("/sign-in?error=Not signed in");
                  }

                  handleToggleAddReview();
                }}
              >
                <IoCreateOutline size={24} />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-y-3">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <ReviewCard key={review.id} reviewsData={review} />
                ))
              ) : (
                <p>No reviews available</p>
              )}
            </div>
          </>
        )}
        {activeTab === "sightings" && (
          <div className="flex flex-col gap-y-2">
            {sightings ? (
              sightings.map((sighting) => (
                <SightingCard key={sighting.id} sightingData={sighting} />
              ))
            ) : (
              <p>No sighting available</p>
            )}
          </div>
        )}
      </div>

      {isDisplayedAddReview && (
        <div className="absolute left-0 flex flex-col h-90 w-96 justify-center items-center top-32 ">
          <AddReviewFoodTruckForm
            handleToggle={handleToggleAddReview}
            truckId={truckId}
            setReviews={setReviews}
          />
        </div>
      )}
    </div>
  );
}
