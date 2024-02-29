import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/navbar";

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
      <body className="dark:bg-slate-700 selection:text-white selection:bg-purple-900">
        <Navbar>{children}</Navbar>
      </body>
    </html>
  );
}
