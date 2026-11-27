import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import type { CSSProperties, ReactNode } from "react";

import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["500", "600", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sarastra Hub",
  description: "Project tracking for Sarastra Labs",
};

const bodyStyle = {
  "--font-display": "var(--font-sora), sans-serif",
  "--font-body": "var(--font-manrope), sans-serif",
} as CSSProperties;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${manrope.variable}`}>
      <body style={bodyStyle}>{children}</body>
    </html>
  );
}
