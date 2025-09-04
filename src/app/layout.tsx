import type { Metadata } from "next";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { NuqsAdapter } from "nuqs/adapters/next";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/client";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillUp",
  description:
    "SkillUp LMS is a modern learning management system designed to help learners and instructors create, manage, and track courses with ease.",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/apple-touch-icon.png", // optional, for iOS home screen
  },
  openGraph: {
    title: "SkillUp",
    description:
      "A modern platform for online learning. Create, manage, and track your courses with SkillUp LMS.",
    url: "https://lms-2w7s.vercel.app",
    siteName: "SkillUp",
    images: [
      {
        url: "/logo.svg", // put this in /public
        width: 1200,
        height: 630,
        alt: "SkillUp LMS preview image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SkillUp LMS",
    description:
      "SkillUp LMS is a modern platform for online learning and teaching.",
    images: ["/logo.svg"],
    creator: "@yourhandle", // optional, add your Twitter username
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NuqsAdapter>
      <TRPCReactProvider>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <Toaster />
            <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
            {children}
          </body>
        </html>
      </TRPCReactProvider>
    </NuqsAdapter>
  );
}
