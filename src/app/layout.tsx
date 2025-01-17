import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "@/components/Provider";
import MyToaster from "@/components/MyToaster";

// Dynamically import Toaster component
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Notion Clone - Your Ultimate Workspace",
  description:
    "Streamline your workflow with our Notion-inspired workspace. Organize, plan, and collaborate seamlessly.",
  icons: {},
  openGraph: {
    title: "Notion Clone - Your Ultimate Workspace",
    description:
      "A Notion-inspired platform to organize your life and work. Plan, write, and collaborate effortlessly.",
    url: "https://notion-clone-peach-six.vercel.app/",
    type: "website",
    images: [
      {
        url: "/favicon.ico", // Use the logo for Open Graph
        width: 512,
        height: 512,
        alt: "Notion Clone Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Notion Clone - Your Ultimate Workspace",
    description:
      "Organize, plan, and collaborate seamlessly with our Notion-inspired app.",
    images: ["/favicon.ico"], // Use the logo for Twitter as well
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
          <link rel="icon" href="/icon.ico" /> {/* Reference to the favicon */}
        </head>
        <body className={inter.className}>
          <MyToaster /> {/* Display the Toaster */}
          <Provider>{children}</Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
