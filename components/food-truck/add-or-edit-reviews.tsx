import React, { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { SubmitButton } from "../submit-button";
import {
  AddFoodTruckReview,
  getReviewsDataByTruck,
} from "@/app/database-actions";
import StarRating from "./star-rating";
import { IoMdClose } from "react-icons/io";
import { handleImageUpload } from "@/utils/file-compress";

type AddReviewFoodTruckFormProps = {
  handleToggle: () => void;
  truckId: number;
  setReviews: React.Dispatch<React.SetStateAction<any[]>>;
};

export default function AddReviewFoodTruckForm({
  handleToggle,
  truckId,
  setReviews,
}: AddReviewFoodTruckFormProps) {
  const [rating, setRating] = useState(0);
  const [file, setFile] = useState<File | undefined>();

  return (
    <div className="relative w-80 h-fit bg-white p-2  border border-gray-300 rounded-xl">
      <button
        onClick={handleToggle}
        className="absolute top-2 right-2 bg-primary p-2 text-primary-foreground rounded-xl flex-none w-9 h-9 flex justify-center items-center"
      >
        <IoMdClose />
      </button>
      <form className="flex flex-col min-w-64 max-w-64 mx-auto">
        <h1 className="text-2xl font-medium">Add Review</h1>
        <p className="text-sm text-foreground">Tell us about this food truck</p>
        {/* RATING STAR FOR THE USER EXPERIENCE LATER */}

        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <div>
            <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Overall Rating
            </Label>
            <StarRating
              rating={rating}
              setRating={setRating}
              isClickable={true}
            />
          </div>
          <Label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="content"
          >
            Comments
          </Label>
          <textarea
            name="content"
            className="flex h-20 resize-none w-full rounded-[8px] border border-foreground bg-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Tell us about your experience"
            required
          />
          <Label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="review-picture"
          >
            Image
          </Label>
          <Input
            required
            type="file"
            name="review-picture"
            onChange={async (e) => {
              if (e.target.files) {
                const compressedImage = await handleImageUpload(e);
                //setFile(e.target.files[0]);
                setFile(compressedImage);
              }
            }}
          />
          <SubmitButton
            formAction={async (formData) => {
              formData.append("rating", rating.toString()); // include rating in form data
              AddFoodTruckReview(formData, truckId, file as File);
              handleToggle();
              setReviews(await getReviewsDataByTruck(truckId));
            }}
            pendingText="Adding Review..."
          >
            Add Review
          </SubmitButton>
          <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8"></div>
        </div>
      </form>
    </div>
  );
}
