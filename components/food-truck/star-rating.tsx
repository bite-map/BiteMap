import React from "react";
import { FaStar } from "react-icons/fa";

type StarRatingProps = {
  rating: number;
  setRating?: (rating: number) => void;
  isClickable: boolean;
};

export default function StarRating({
  rating,
  isClickable,
  setRating,
}: StarRatingProps) {
  const starColor = "#ef6262";
  const starColorEmpty = "#D1D5DB";

  return (
    <div className="flex space-x-2 mt-2">
      {isClickable && setRating
        ? [...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              size={24}
              color={rating > index ? starColor : starColorEmpty}
              onClick={() => setRating(index + 1)} // Set rating when clicked
              style={{ cursor: "pointer" }} // Add pointer cursor to indicate it's clickable
            />
          ))
        : [...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              size={24}
              color={rating > index ? starColor : starColorEmpty}
            />
          ))}
    </div>
  );
}
