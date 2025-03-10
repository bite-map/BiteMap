import { ThemeProvider } from "next-themes";
import "./globals.css";
import SidebarNavMobileLoggedIn from "@/components/sidebar-mobile-logged-in";
import SidebarNavMobileLoggedOut from "@/components/sidebar-mobile-logged-out";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import logo from "../public/logo.svg";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "BiteMap",
  description: "Find and share local food trucks and food stands.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  // gets information about logged in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning={true}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen h-[100svh] flex flex-col bg-background">
            <header className="sticky top-0 left-0 z-10 bg-background w-full flex shrink-0 items-center h-16 p-2">
              <Image
                className="w-[100px]"
                src={logo}
                alt="BiteMap's Logo"
                width={400}
                height={140}
              ></Image>
            </header>
            <main className="flex-1 relative">{children}</main>
            {user ? <SidebarNavMobileLoggedIn /> : <SidebarNavMobileLoggedOut />}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
