"use client";

import { createToast } from "@/utils/toast";
import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";

type SignInToastProps = {
  message: string;
};

export default function SignInToast({ message }: SignInToastProps) {
  const [toastMessage, setToastMessage] = useState<string>("");

  useEffect(() => {
    if (message === "Not signed in") {
      setToastMessage("You must be signed in to take that action");
    }
  }, []);

  useEffect(() => {
    if (toastMessage !== "") {
      const signInToast = createToast(toastMessage, "error");
      signInToast && signInToast();
    }
  }, [toastMessage]);

  return <ToastContainer />;
}
