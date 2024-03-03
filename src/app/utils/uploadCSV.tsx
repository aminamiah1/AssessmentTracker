import axios from "axios";
import Papa from "papaparse";
import { Assessment_type } from "@prisma/client";

interface UploadCSVProps {
  file: File; // The CSV file prop
}

// Interface only used here to define a csv row of the import bulk assessments and modules csv file
interface CsvRow {
  Module_Code: string;
  Module_Name: string;
  Assessment_Name: string;
  Assessment_Type: Assessment_type;
}

const uploadCSV = async ({ file }: UploadCSVProps) => {
  Papa.parse(file, {
    header: true,
    complete: async (results: { data: CsvRow[] }) => {
      // The csv file's data
      const csvData = results.data;

      // Modules data
      const moduleNames = csvData.map((row) => row.Module_Name);

      const moduleCodes = csvData.map((row) => row.Module_Code);

      console.log(csvData);

      // Assessments data
      const assessmentNames = csvData.map((row) => row.Assessment_Name);

      const assessmentTypes = csvData.map((row) => row.Assessment_Type);

      // Pass module names and module codes to the backend here first to create the modules
      try {
        await axios.post("/api/ps-team/modules/csv/post", {
          moduleNames,
          moduleCodes,
        });
        console.log("Module data sent to backend");
      } catch (error) {
        console.error("Error sending module data:", error);
      }

      // Pass module codes, assessment names and assessment types to the backend here second to create the assessments
      try {
        await axios.post("/api/ps-team/assessments/csv/post", {
          moduleCodes,
          assessmentNames,
          assessmentTypes,
        });
        console.log("Assessment data sent to backend");
      } catch (error) {
        console.error("Error sending assessment data:", error);
      }
    },
    error: (error) => {
      // Alert user of any errors if they occur during csv parsing
      console.error("CSV Parsing Error:", error);
    },
  });
};

export default uploadCSV;
