"use client";
import UnauthorizedAccess from "@/app/components/authError";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useSession } from "next-auth/react"; // Import useSession and signIn
import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { FaChartLine } from "react-icons/fa";
import { ResponsiveBarCanvas } from "@nivo/bar";

export default function overdueStatisticsPSTeam() {
  const { data: session, status } = useSession({ required: true }); // Use useSession to get session and status
  // Data used for chart 1
  const [overDueUsers, setOverDueUsers] = useState<[]>([]);

  useEffect(() => {
    const fetchGraph1Data = async () => {
      // Fetch assessments only when component mounts
      try {
        const response = await fetch(
          `/api/ps-team/analytics/mostOverdueUsers/get`,
        );
        const data = await response.json();
        // 1. Sort in descending order by overdue assessment count
        const sortedUsers = data.sort(
          (a: any, b: any) => b._count.assessments - a._count.assessments,
        );
        // 2. Get the top 5
        const formattedData = sortedUsers
          .map((user: any) => ({
            email: user.email,
            overdueAssessments: user._count.assessments,
          }))
          .slice(0, 5);
        // Set the data array to be used in graph 1 formatted
        setOverDueUsers(formattedData);
      } catch (e) {
        setOverDueUsers([]);
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
      <aside
        id="analytics-sidebar"
        className={`fixed top-0 right-0 z-20 h-screen pt-20 bg-white border-r border-gray-300 dark:bg-gray-800 dark:border-gray-700 transition-transform duration-300 ease-in-out shadow-md`}
        aria-label="Sidebar"
      >
        <button className="min-h-12 mr-2 flex items-center text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group flex items-center">
          <FaChartLine
            size={23}
            className="mr-2 text-gray-700 dark:text-white"
          />
          <span className="text-lg font-bold">Graph 1</span>
        </button>
        <button className="mt-2 mr-2 min-h-12 flex items-center text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group flex items-center">
          <FaChartLine
            size={23}
            className="mr-2 text-gray-700 dark:text-white"
          />
          <span className="text-lg font-bold">Graph 2</span>
        </button>
        <button className="mt-2 mr-2 min-h-12 flex items-center text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group flex items-center">
          <FaChartLine
            size={23}
            className="mr-2 text-gray-700 dark:text-white"
          />
          <span className="text-lg font-bold">Graph 3</span>
        </button>
      </aside>
      <ToastContainer />
      <div className="text-center mb-10 mt-10">
        <h1 className="text-3xl">Overdue Statistics</h1>
      </div>
      <div className="flex flex-col h-screen w-full justify-center items-center">
        <div className="text-center">
          <h1 className="mb-2 font-bold">
            Top 5 most late users by number of overdue assessments
          </h1>
        </div>
        <div className="w-[80vw] h-[80vw] text-white bg-gray-700 shadow-lg rounded-lg">
          <ResponsiveBarCanvas
            data={overDueUsers} // Use the formatted data retrieved from the api
            keys={["overdueAssessments"]} // Indicate the value field of number of overdue assessments
            indexBy="email" // Set the key used for the x-axis as user email
            margin={{ top: 100, right: 100, bottom: 100, left: 100 }}
            labelTextColor={"#000000"}
            theme={{
              text: {
                fill: "#ffffff",
              },
            }}
            // Define the axis
            axisBottom={{
              tickRotation: -45,
              tickPadding: 10,
              tickSize: 5,
              legendPosition: "middle",
              legendOffset: 32,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              legend: "Number of Overdue Assessments",
              legendPosition: "middle",
              legendOffset: -60,
              format: (value) => Math.round(value), // Format function to display whole numbers
              tickValues: "every 1",
            }}
          />
        </div>
        <div className="flex h-screen">
          <h1>Graph 2 Goes Here</h1>
        </div>
      </div>
    </div>
  ) : (
    <UnauthorizedAccess />
  );
}
