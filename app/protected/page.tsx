import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";
import Link from "next/link";
export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          You have successfully confirmed your email!
        </div>
      </div>
      <div className=" gap-2 items-center"></div>

      <Link href={"/"}>
        <h2 className="font-bold text-2xl mb-4">Next steps</h2>
      </Link>
    </div>
  );
}
