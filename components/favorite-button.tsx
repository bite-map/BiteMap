import React, { useEffect, useState } from "react";
import { IoMdHeart } from "react-icons/io";

type FavoriteButtonProps = {
  handleToggle: () => void;
  isFavorite: boolean;
};

export default function FavoriteButton({
  handleToggle,
  isFavorite,
}: FavoriteButtonProps) {
  const [buttonColor, setButtonColor] = useState<"gray" | "red">();
  useEffect(() => {
    console.log(isFavorite);
    console.log(buttonColor);

    setButtonColor(isFavorite ? "red" : "gray");
  }, [isFavorite]);
  //   useEffect(() => {
  //     console.log(isFavorite);
  //   }, [isFavorite]);
  return (
    <button
      style={{ color: buttonColor }}
      onClick={() => {
        handleToggle();
      }}
    >
      <IoMdHeart />
    </button>
  );
}
