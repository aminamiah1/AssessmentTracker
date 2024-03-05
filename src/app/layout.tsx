import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/navbar";
import AuthContext from "./utils/authContext";

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
      <body>{children} </body>
    </html>
  );
}
