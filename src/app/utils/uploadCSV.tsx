import axios from "axios";
import Papa from "papaparse";
import { Assessment_type } from "@prisma/client";

interface UploadCSVProps {
  file: File; // The CSV file prop
  startDate: Date; // The start date selected by the user
}

// Interface only used here to define a csv row of the import bulk assessments and modules csv file
interface CsvRow {
  Module_Code: string;
  Module_Name: string;
  Assessment_Name: string;
  Assessment_Type: Assessment_type;
  Hand_Out_Week: string;
  Hand_In_Week: string;
}

const uploadCSV = ({ file, startDate }: UploadCSVProps): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: async (results: { data: CsvRow[] }) => {
        // The csv file's data
        const csvData = results.data;

        // Original string formatted dates data
        const handOutWeeks = csvData.map((row) => row.Hand_Out_Week);
        const handInWeeks = csvData.map((row) => row.Hand_In_Week);

        // Await function here for taking in the hand out weeks and hand in weeks and mapping the A01 and S01 to date format
        const calculatedHandOutDates = await calculateDates(
          startDate,
          handOutWeeks,
        );
        const calculatedHandInDates = await calculateDates(
          startDate,
          handInWeeks,
        );

        // Modules data
        const moduleNames = csvData.map((row) => row.Module_Name);
        const moduleCodes = csvData.map((row) => row.Module_Code);

        try {
          // Pass module names and module codes to the backend here first to create the modules
          await axios.post("/api/ps-team/modules/csv/post", {
            moduleNames,
            moduleCodes,
          });
          console.log("Module data sent to backend");
        } catch (error) {
          console.error("Error sending module data:", error);
          reject(error);
        }

        // Assessments data
        const assessmentNames = csvData.map((row) => row.Assessment_Name);
        const assessmentTypes = csvData.map((row) => row.Assessment_Type);

        try {
          // Pass module codes, assessment names and assessment types and dates to the backend here second to create the assessments
          await axios.post("/api/ps-team/assessments/csv/post", {
            moduleCodes,
            assessmentNames,
            assessmentTypes,
            calculatedHandOutDates, // Array of calculated Date objects
            calculatedHandInDates, // Array of calculated Date objects
          });
          console.log("Assessment data sent to backend");
          resolve(); // Resolve the promise once upload is successful
        } catch (error) {
          console.error("Error sending assessment data:", error);
          reject(error);
        }
      },
      error: (error) => {
        // Alert user of any errors if they occur during csv parsing
        console.error("CSV Parsing Error:", error);
        reject(error);
      },
    });
  });
};

// Helper function to calculate dates based on string code provided
const calculateDates = async (
  termStartDate: Date,
  weekCodes: string[],
): Promise<Date[]> => {
  return Promise.all(
    weekCodes.map((weekCode) => {
      const termStart = new Date(termStartDate);
      let offsetDays = 0;

      if (weekCode.startsWith("A")) {
        // Autumn logic
        offsetDays = (parseInt(weekCode.slice(1)) - 1) * 7;
      } else if (weekCode.startsWith("SE")) {
        // Only hand out at the start of spring for this code
        offsetDays = 90;
      } else if (weekCode.startsWith("S")) {
        // Spring logic (example: 3 months after autumn start)
        offsetDays = 90 + (parseInt(weekCode.slice(1)) - 1) * 7;
      } else {
        // Handle potential errors for invalid week codes
        throw new Error(`Invalid week code: ${weekCode}`);
      }

      const calculatedDate = new Date(termStart);
      calculatedDate.setDate(termStart.getDate() + offsetDays);
      return calculatedDate;
    }),
  );
};

export default uploadCSV;
