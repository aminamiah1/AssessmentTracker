"use client";
import AuthContext from "@/app/utils/authContext";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

function UserPage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    // If not signed in, redirect to the sign-in page automatically
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  if (status === "loading") {
    return <p className="text-black">Loading...</p>;
  }

  if (!session) {
    // This will be briefly shown before the signIn() effect redirects the user
    return <p>Redirecting to sign-in...</p>;
  }

  // Render the personalized greeting page if the session exists
  return <p className="text-black">Hi {session.user.name}!</p>;
}

const WrappedUserPage = () => (
  <AuthContext>
    <UserPage />
  </AuthContext>
);

export default WrappedUserPage;
