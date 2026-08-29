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
            subtitle: "", // Yahan aap custom text likh sakte hain, khali ("") chhodne se subtitle hide ho jayega
          },
        },
      }}
      appearance={{
        variables: {
          colorPrimary: "#f59e0b",
          colorBackground: "#0f0f24",
          borderRadius: "1rem",
        },
        elements: {
          modalContent: "max-w-md w-full scale-90", // Size fit karne ke liye scale-110 ko scale-90 aur max-w-xl ko max-w-md kar diya hai
          cardBox: "w-full shadow-2xl border border-purple-800/40 rounded-3xl",
          card: "w-full p-6 bg-[#0f0f24] text-white",
          formFieldInput: "bg-[#070712] border-purple-800/50 text-white focus:border-amber-400",
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
