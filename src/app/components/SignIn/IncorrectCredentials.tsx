export default function IncorrectCredentials() {
  return (
    <div
      className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 w-96 rounded-lg mx-auto mt-10"
      role="alert"
    >
      <p className="font-bold">Sign in failed.</p>
      <p>Check the details you provided are correct.</p>
    </div>
  );
}
