import { Inter } from "next/font/google";
import "./globals.css";
import LenisWrapper from "@/components/LenisWrapper";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Raw Studio - Creative Portfolio",
  description: "Premium creative portfolio showcasing innovative digital projects",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-neue font-medium text-xs antialiased bg-white text-gray-900`} suppressHydrationWarning>
        <LenisWrapper>
          <Navbar />
          {children}
        </LenisWrapper>
      </body>
    </html>
  );
}
