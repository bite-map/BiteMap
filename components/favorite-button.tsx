import React, { useState } from "react";
import { IoMdHeart } from "react-icons/io";
import { createClient } from "@supabase/supabase-js";

type FavoriteButtonProps = {
    handleToggle: () => void;
};

export default function FavoriteButton({ handleToggle}: FavoriteButtonProps) {
    const [buttonColor, setButtonColor] = useState("gray")
    return (
        <button 
        style={{color: buttonColor}}
        onClick={() => {
            setButtonColor(buttonColor === "red" ? "gray" : "red");
            handleToggle();
        }}>
        <IoMdHeart />
        </button>
    )
}