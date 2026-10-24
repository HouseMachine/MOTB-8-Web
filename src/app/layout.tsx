import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "MOTB-8 | Make Your Machine Discoverable",
  description:
    "Machine Open Tag & Beacon. An open-source standard for permanent machine identifiers and signed, updateable machine-presence information.",
  metadataBase: new URL("https://motb8.com"),
  openGraph: {
    title: "MOTB-8 — Make Your Machine Discoverable",
    description:
      "An open-source standard for identifying machine presences and publishing signed information about their capabilities.",
    url: "https://motb8.com",
    siteName: "MOTB-8",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
