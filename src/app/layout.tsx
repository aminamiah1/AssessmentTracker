import type { Metadata } from "next";
import "./globals.css";
import WrappedNavbar from "@/app/components/navbar";

export const metadata: Metadata = {
  title: "Assessment Tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <WrappedNavbar>{children}</WrappedNavbar>
      </body>
    </html>
  );
}
