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
  partTodo: PartWithQuestionsAndResponses[];
  error: any;
  isLoading: boolean;
}

export function usePartTodo(assessmentId: number): PartTodoHook {
  const { data, error, isLoading, isValidating } = useSWR(
    `/api/assessments/${assessmentId}/todos`,
    async (url) => {
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
    partTodo: data,
    error,
    isLoading: isLoading ?? isValidating,
  };
}
