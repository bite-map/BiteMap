import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import BottomNavMobile from "@/components/bottom-nav-mobile";

// Icons
import { HomeIcon } from "@heroicons/react/24/outline";
import { MapIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/outline";

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
          <div className="min-h-screen h-[100svh] flex flex-col ">
            <header className="w-full flex shrink-0 justify-center h-16 bg-gray-300">
              SEARCH
            </header>
            <main className="flex-1 relative">{children}</main>
            <BottomNavMobile
              NavButtons={[
                { icon: HomeIcon, text: "Home", href: "/" },
                { icon: MapIcon, text: "Map", href: "/truckmap" },
                { icon: UserIcon, text: "Account", href: "/profile" },
              ]}
            />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
