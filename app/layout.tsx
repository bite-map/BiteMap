import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import BottomNavMobile from "@/components/bottom-nav-mobile";

// Icons
import { HomeIcon } from "@heroicons/react/24/solid";
import { MapIcon } from "@heroicons/react/24/solid";
import { UserIcon } from "@heroicons/react/24/solid";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning={true}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen">
            <header className="w-full flex justify-center h-16 bg-gray-300">
              SEARCH
            </header>
            <main className="flex-1 w-full flex flex-col items-center bg-gray-50 pb-16">
              {children}
            </main>
            <BottomNavMobile
              NavButtons={[
                { icon: HomeIcon, text: "Home", href: "/" },
                { icon: MapIcon, text: "Map", href: "/map" },
                { icon: UserIcon, text: "Account", href: "/profile" },
              ]}
            />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
