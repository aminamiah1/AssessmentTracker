import type { Metadata } from "next";
import "../globals.css";
import Navbar from "../components/navbar";
import React from "react";

export const metadata: Metadata = {
  title: "Assessment Tracker",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Navbar>{children}</Navbar>;
}
