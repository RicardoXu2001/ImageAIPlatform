import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Astra Admin",
  description: "Admin dashboard for AI image generation"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
