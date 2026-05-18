import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Astra Image",
  description: "Enterprise AI image generation platform"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
