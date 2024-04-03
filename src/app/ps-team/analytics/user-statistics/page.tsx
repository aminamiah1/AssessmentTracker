"use client";
import UnauthorizedAccess from "@/app/components/authError";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useSession } from "next-auth/react"; // Import useSession and signIn
import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { FaChartLine } from "react-icons/fa";
import MostAssignedUsersChart from "@/app/components/Charts/userStatistics/MostAssignedUsersChart";

export default function userStatisticsPSTeam() {
  const { data: session, status } = useSession({ required: true }); // Use useSession to get session and status
  // Data used for chart 1
  const [mostAssignedUsers, setMostAssignedUsers] = useState<[]>([]);

  useEffect(() => {
    const fetchGraph1Data = async () => {
      // Fetch assessments only when component mounts
      try {
        const response = await fetch(
          `/api/ps-team/analytics/mostAssignedUsers/get`,
        );
        const data = await response.json();
        // 1. Sort in descending order by assigned assessments count
        const sortedUsers = data.sort(
          (a: any, b: any) => b._count.assessments - a._count.assessments,
        );
        // 2. Get the top 5
        const formattedData = sortedUsers
          .map((user: any) => ({
            email: user.email,
            assessments: user._count.assessments,
          }))
          .slice(0, 5);
        // Set the data array to be used in graph 1 formatted
        setMostAssignedUsers(formattedData);
      } catch (e) {
        setMostAssignedUsers([]);
      }
    };

    if (isPSTeam) {
      fetchGraph1Data();
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const isPSTeam = session.user.roles.includes("ps_team");
  return isPSTeam ? (
    <div className="bg-white dark:bg-darkmode h-screen max-h-full">
      <ToastContainer />
      <div className="text-center mb-10 mt-10">
        <h1 className="text-4xl">User Statistics</h1>
      </div>
      <div className="flex flex-col w-full justify-center items-center">
        <div className="text-center">
          <h1 className="mb-2 text-xl">
            Top 5 most assigned users by number of assigned assessments
          </h1>
        </div>
        <div className="w-[80vw] h-[30vw] text-white bg-gray-700 shadow-lg rounded-lg">
          <MostAssignedUsersChart data={mostAssignedUsers} />
        </div>
      </div>
    </div>
  ) : (
    <UnauthorizedAccess />
  );
}
