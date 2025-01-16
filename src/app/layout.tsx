import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "@/components/Provider";
import MyToaster from "@/components/MyToaster";

// Dynamically import Toaster component
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AIdeation YT",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.ico" />{" "}
          {/* Reference to the favicon */}
        </head>
        <body className={inter.className}>
          <MyToaster /> {/* Display the Toaster */}
          <Provider>{children}</Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
