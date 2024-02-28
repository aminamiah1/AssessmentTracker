"use client";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import AuthContext from "./utils/authContext";

function Home() {
  const { data: session, status } = useSession(); // Use useSession to get session and status

  useEffect(() => {
    // Redirect to sign-in if not authenticated
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  if (status === "loading") {
    return <p className="text-white bg-black">Loading...</p>; // Show a loading message while checking session status
  }

  if (!session) {
    return <p>Redirecting to sign-in...</p>; // This will be briefly shown before the signIn() effect redirects the user
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex"></div>
    </main>
  );
}

const WrappedHome = () => (
  <AuthContext>
    <Home />
  </AuthContext>
);

export default WrappedHome;
