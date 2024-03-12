import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/options";
import { permanentRedirect } from "next/navigation";

export default async function UserPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    permanentRedirect("/admin/sign-in");
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
