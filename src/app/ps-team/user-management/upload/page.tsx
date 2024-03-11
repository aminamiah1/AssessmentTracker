"use client";
import React, { useEffect, useState } from "react";
import uploadCSV from "@/app/utils/uploadUsersCSV";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import UnauthorizedAccess from "@/app/components/authError";
import AuthContext from "@/app/utils/authContext";

const UploadUsersPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [isPSTeam, setIsPSTeam] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session != null) {
      const checkRoles = () => {
        const roles = session.user.roles;
        console.log(session.user.roles);
        if (roles.includes("ps_team")) {
          setIsPSTeam(true);
        } else {
          setIsPSTeam(false);
          // Set to false if not part of ps_team
        }
      };

      checkRoles();
    } else if (status === "unauthenticated") {
      // If not an authenticated user then make them sign-in
      signIn();
    }
  }, [session, status]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isPSTeam) {
    return (
      <p className="text-white bg-black">
        You are not authorized to view this page...
      </p>
    );
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        setFile(file);
        setUploadMessage("");
      } else {
        setFile(null);
        setUploadMessage("Please select a valid CSV file.");
      }
    }
  };

  const handleUpload = async () => {
    if (file) {
      setIsUploading(true);
      setUploadMessage("");
      try {
        await uploadCSV({ file });
        setUploadMessage("Users have been uploaded successfully.");
      } catch (error) {
        setUploadMessage(
          `Upload failed: ${error instanceof Error ? error.message : "An error occurred"}`,
        );
      } finally {
        setIsUploading(false);
      }
    } else {
      setUploadMessage("Please select a CSV file to upload.");
    }
  };

  return isPSTeam ? (
    <div className="flex justify-center items-center h-screen bg-white dark:bg-darkmode">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-xl font-bold mb-4">Upload Users</h1>
        <div className="mb-4">
          <Image
            src="/images/usersCSV.png"
            alt="Sample CSV file layout"
            width={600}
            height={300}
            className="mx-auto"
          />
          <p className="text-sm text-center">Sample CSV file layout</p>
        </div>
        <input
          className="block w-full text-sm text-gray-900 dark:text-gray-100 border rounded-lg cursor-pointer focus:ring-blue-500 focus:border-blue-500 p-2.5 mb-4"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <button
          className={`w-full text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={handleUpload}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload CSV"}
        </button>
        {uploadMessage && (
          <p className="mt-4 text-sm text-center font-semibold">
            {uploadMessage}
          </p>
        )}
      </div>
    </div>
  ) : (
    <UnauthorizedAccess />
  );
};

const WrappedUploadUsersPage = () => (
  <AuthContext>
    <UploadUsersPage />
  </AuthContext>
);

export default WrappedUploadUsersPage;
