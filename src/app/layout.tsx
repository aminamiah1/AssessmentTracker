import type { Metadata } from "next";
import Navbar from "@/app/components/navbar";
import "./globals.css";
import AuthContext from "./utils/authContext";
import { PasswordReset } from "./components/PasswordReset/PasswordReset";

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
          <PasswordReset />
        </AuthContext>
      </body>
    </html>
  );
}
