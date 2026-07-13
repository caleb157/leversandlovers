import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Levers of B4T",
  description:
    "Measure the intensity of your business-for-transformation lever combination.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
