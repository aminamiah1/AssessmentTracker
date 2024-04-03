import { ResponsiveBarCanvas } from "@nivo/bar";

export default function MostAssignedUsersChart({ data }: { data: any }) {
  return (
    <ResponsiveBarCanvas
      data={data} // Use the formatted data retrieved from the api
      keys={["assessments"]} // Indicate the value field of number of assessments
      indexBy="email" // Set the key used for the x-axis as user email
      margin={{ top: 100, right: 100, bottom: 100, left: 100 }}
      labelTextColor={"#000000"}
      tooltip={(point) => {
        return <div className="text-black bg-white p-2">{point.label}</div>;
      }}
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
        legend: "Number of Assigned Assessments",
        legendPosition: "middle",
        legendOffset: -60,
        format: (value) => Math.round(value), // Format function to display whole numbers
        tickValues: "every 1",
      }}
    />
  );
}
