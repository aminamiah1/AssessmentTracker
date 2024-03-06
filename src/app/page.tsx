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
  return (
    <div
      style={{
        paddingTop: "100px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        boxSizing: "border-box",
      }}
    >
      <p
        className="text-black"
        style={{ fontSize: "24px", fontWeight: "bold" }}
      >
        Hi {session.user.name}!
      </p>
    </div>
  );
}

const WrappedUserPage = () => (
  <AuthContext>
    <UserPage />
  </AuthContext>
);

export default WrappedUserPage;
