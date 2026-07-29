import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import BackgroundGeometry from "@/components/BackgroundGeometry";
import ErrorBoundary from "@/components/ErrorBoundary";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DEV Agency — Content Generator",
  description:
    "Generate Instagram, Facebook, LinkedIn, and blog content from one idea.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="font-outfit min-h-screen bg-slate-50 text-slate-800">
        <BackgroundGeometry />
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
