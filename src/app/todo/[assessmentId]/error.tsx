"use client";

import Error from "@/app/components/ErrorMessage/ErrorMessage";

interface PageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error }: PageProps) {
  return (
    <div className="text-center w-full flex flex-col items-center dark:bg-slate-800">
      <Error />
    </div>
  );
}
