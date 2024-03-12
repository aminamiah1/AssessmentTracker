import type { Metadata } from "next";
import Navbar from "./components/navbar";
import "./globals.css";
import AuthContext from "./utils/authContext";

export const metadata: Metadata = {
  title: "Assessment Tracker",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthContext>
          <Navbar>{children}</Navbar>
        </AuthContext>
      </body>
    </html>
  );
}
