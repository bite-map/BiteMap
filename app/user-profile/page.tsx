import UserProfile from "@/components/user-profile";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  return (
    <>
      <UserProfile />
    </>
  );
}
