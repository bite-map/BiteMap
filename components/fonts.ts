import { Lusitana, Montserrat, Ranchers } from "next/font/google";

// these fonts were just to test we can add our own fonts here
export const lusitana = Lusitana({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const ranchers = Ranchers({ subsets: ["latin"], weight: ["400"] });
