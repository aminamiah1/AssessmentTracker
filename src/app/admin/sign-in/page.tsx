"use client";
import SignInComponent from "@/app/components/SignIn/SignIn";
import AuthContext from "@/app/utils/authContext";

export default function Home() {
  return (
    <AuthContext>
      <SignInComponent />
    </AuthContext>
  );
}
