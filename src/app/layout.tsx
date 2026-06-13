import type { Metadata, Viewport } from "next";
import { Geist, Inter } from "next/font/google";
import { PWARegistration } from "@/components/PWARegistration";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "COMMAND CENTER",
  description: "Executive Decision & Operations Center",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Command Center",
  },
  icons: {
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#070A0F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geist.variable} ${inter.variable} antialiased bg-background text-text-primary selection:bg-accent/30`}
      >
        <PWARegistration />
        {children}
      </body>
    </html>
  );
}
