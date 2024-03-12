import Papa from "papaparse";

interface UploadCSVProps {
  file: File;
}

interface UserRow {
  email: string;
  name: string;
  password: string;
  roles: string;
}

const uploadCSV = ({ file }: UploadCSVProps): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results: {
        data: UserRow[];
        meta: { fields?: string[] };
      }) => {
        try {
          const expectedHeaders = ["email", "name", "password", "roles"];
          const actualHeaders = results.meta.fields;
          if (
            !actualHeaders ||
            expectedHeaders.some((header) => !actualHeaders.includes(header))
          ) {
            throw new Error(
              "CSV file headers are incorrect or have typos. Expected headers are: " +
                expectedHeaders.join(", ") +
                ". Found headers are: " +
                (actualHeaders ? actualHeaders.join(", ") : "None"),
            );
          }
          const csvData = results.data;
          const userData = csvData.map((user) => ({
            email: user.email,
            name: user.name,
            password: user.password,
            roles: user.roles
              ? user.roles.split(",").map((role) => role.trim())
              : [],
          }));

          try {
            const response = await fetch("/api/ps-team/users/post", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userData),
            });

            if (!response.ok) {
              throw new Error("Network response was not ok");
            }

            console.log("User data sent to backend successfully.");
            resolve();
          } catch (error) {
            if (error instanceof Error) {
              console.error(
                "Error sending user data to backend:",
                error.message,
              ); // Safe type assertion
            } else {
              console.error("An unknown error occurred.");
            }
            reject(error);
          }
        } catch (error) {
          if (error instanceof Error) {
            console.log(
              "Error parsing CSV. Ensure the format of the CSV is correct. Error: ",
              error.message,
            );
          } else {
            console.log("An unknown error occurred during CSV parsing.");
          }
          reject(error);
        }
      },
      error: (error) => {
        if (error instanceof Error) {
          console.error(
            "Error parsing CSV. Check format and try again. Error: ",
            error.message,
          );
        } else {
          console.error("An unknown error occurred during CSV error handling.");
        }
        reject(error);
      },
    });
  });
};

export default uploadCSV;
