import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Christian Developers — Faith-Driven Tech Community & Job Board",
  description: "Connect with fellow Christian developers, find faith-aligned tech jobs, get mentorship, and grow your career with purpose.",
  keywords: ["Christian developers", "Christian tech jobs", "faith-based developer community", "Christian coding mentorship"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
