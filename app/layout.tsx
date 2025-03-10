import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import SidebarNavMobileLoggedIn from "@/components/sidebar-mobile-logged-in";
import SidebarNavMobileLoggedOut from "@/components/sidebar-mobile-logged-out";
import SearchBar from "@/components/search";
import { createClient } from "@/utils/supabase/server";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "BiteMap",
  description: "Find and share local food trucks and food stands.",
};

const geistSans = Geist({
  subsets: ["latin"],
});

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
          <div className="min-h-screen h-[100svh] flex flex-col ">
            <header className="w-full flex shrink-0 justify-center items-center h-16 bg-gray-300">
              <SearchBar />
            </header>
            <main className="flex-1 relative">{children}</main>
            {user ? <SidebarNavMobileLoggedIn /> : <SidebarNavMobileLoggedOut />}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
