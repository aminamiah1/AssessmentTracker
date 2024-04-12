import useSWR from "swr";

interface TaskHook {
  tasks: AssessmentAndPartAPIResponse[];
  error: any;
  isLoading: boolean;
}

export function useTasks(userId: number): TaskHook {
  const { data, error, isLoading, isValidating } = useSWR(
    `/api/users/${userId}/todos`,
    async (url) => {
      const response = await fetch(url);

      if (response.status !== 200)
        throw new Error((await response.json()).message);

      return response.json();
    },
  );

  return {
    tasks: data,
    error,
    isLoading: isLoading ?? isValidating,
  };
}

interface PartTodoHook {
  parts: PartWithQuestionsAndResponses[];
  error: any;
  isLoading: boolean;
}

/**
 * @param assessmentId The ID of the assessment to get parts for
 * @param getAll Whether to get ALL parts of the assessment form, or just the outstanding part todo/in progress
 * @returns An object containing an array of parts, any errors, and the loading state
 */
export function useParts(
  assessmentId: number,
  getAll: boolean = false,
): PartTodoHook {
  const { data, error, isLoading, isValidating } = useSWR(
    `/api/assessments/${assessmentId}/todos?all=${getAll}`,
    async (url: string) => {
      const response = await fetch(url);

      if (response.status !== 200)
        throw new Error((await response.json()).message);

      return response.json();
    },
    {
      revalidateOnMount: true,
    },
  );

  return {
    parts: data,
    error,
    isLoading: isLoading ?? isValidating,
  };
}
