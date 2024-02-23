"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col p-6 gap-2">
      <h2 className="text-2xl">There was an error!</h2>
      <p>{error.message}</p>
      <button
        className="px-4 py-2 min-w-20 w-fit border rounded transition-all bg-blue-500 hover:bg-blue-600 text-white"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}
