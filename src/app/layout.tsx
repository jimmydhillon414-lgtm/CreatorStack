import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CreatorStack AI",
  description: "AI Image & Video Generator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      localization={{
        signIn: {
          start: {
            subtitle: "",
          },
        },
      }}
      appearance={{
        variables: {
          colorPrimary: "#f59e0b",
          colorBackground: "#0f0f24",
          borderRadius: "1.5rem",
        },
        elements: {
          modalContent: "max-w-lg w-full scale-100", 
          cardBox: "w-full shadow-2xl border border-purple-800/40 rounded-3xl",
          card: "w-full p-8 bg-[#0f0f24] text-white",
          formFieldInput: "bg-[#070712] border-purple-800/50 text-white focus:border-amber-400 py-3 text-base",
          formButtonPrimary: "py-3.5 text-base font-bold",
        },
      }}
    >
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </ClerkProvider>
  );
}
