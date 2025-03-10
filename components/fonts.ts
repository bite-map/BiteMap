import { Lusitana, Montserrat } from "next/font/google";

// these fonts were just to test we can add our own fonts here
export const lusitana = Lusitana({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"],
});
