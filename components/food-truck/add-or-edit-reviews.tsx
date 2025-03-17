import React, { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { SubmitButton } from "../submit-button";
import { AddFoodTruckReview } from "@/app/database-actions";
import StarRating from "./star-rating";

type AddReviewFoodTruckFormProps = {
  handleToggle: () => void;
  truckId: number;
};

export default function AddReviewFoodTruckForm({
  handleToggle,
  truckId,
}: AddReviewFoodTruckFormProps) {
  const [rating, setRating] = useState(0);
  return (
    <div className="pt-2">
      <form className="flex flex-col min-w-64 max-w-64 mx-auto">
        <h1 className="text-2xl font-medium">Add Review</h1>
        <p className="text-sm text-foreground">Add Review and pictures. </p>
        {/* RATING STAR FOR THE USER EXPERIENCE LATER */}
        <div className="mt-4">
          <Label className="text-sm font-medium">Overall Rating</Label>
          <StarRating rating={rating} setRating={setRating} />
        </div>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="content"
          >
            Comments
          </Label>
          <Input
            name="content"
            placeholder="Tell me about your experience"
            required
          />
          <Label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="picture"
          >
            Picture
          </Label>
          <Input type="file" name="picture" />
          <SubmitButton
            formAction={(formData) => {
              formData.append("rating", rating.toString()); // include rating in form data
              AddFoodTruckReview(formData, truckId);
              handleToggle();
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
