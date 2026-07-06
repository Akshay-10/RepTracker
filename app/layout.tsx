import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "RepForge — Train with intent",
    template: "%s · RepForge",
  },
  description:
    "A premium, adaptive gym tracker for progressive overload, smart exercise variations, and focused coaching.",
};

export const viewport: Viewport = {
  themeColor: "#090b0a",
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
