import axios from "axios";
import Papa from "papaparse";

interface UploadCSVProps {
  file: File; // The CSV file prop
}

// Interface only used here to define a csv row of the import bulk assessments and modules csv file
interface CsvRow {
  Module_Code: string;
  Module_Name: string;
  //To add assessment details later
}

const uploadCSV = async ({ file }: UploadCSVProps) => {
  Papa.parse(file, {
    header: true,
    complete: async (results: { data: CsvRow[] }) => {
      // The csv file's data
      const csvData = results.data;

      // Module creation data
      const moduleNames = csvData.map((row) => row.Module_Name);

      const moduleCodes = csvData.map((row) => row.Module_Code);

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
    },
    error: (error) => {
      // Alert user of any errors if they occur during csv parsing
      console.error("CSV Parsing Error:", error);
    },
  });
};

export default uploadCSV;
