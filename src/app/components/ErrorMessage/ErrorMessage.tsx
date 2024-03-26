/**
 * @see https://next-auth.js.org/configuration/pages#sign-in-page
 */
export type SignInErrorTypes =
  | "Signin"
  | "OAuthSignin"
  | "OAuthCallback"
  | "OAuthCreateAccount"
  | "EmailCreateAccount"
  | "Callback"
  | "OAuthAccountNotLinked"
  | "EmailSignin"
  | "CredentialsSignin"
  | "SessionRequired"
  | "default";

interface ErrorProps {
  error?: SignInErrorTypes | "default";
  message?: string;
  title?: string;
}

export default function Error({
  error = "default",
  message = "Something went wrong.",
  title = "Error",
}: ErrorProps) {
  switch (error) {
    case "CredentialsSignin":
      message =
        "Check the details you provided are correct and not for an inactive account.";
      break;
    case "SessionRequired":
      message = "You need to sign in to access this page.";
      break;
    default:
      console.error(`Unhandled error: ${error}`);
  }

  return (
    <div
      className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 w-96 rounded-lg mx-auto mb-2"
      role="alert"
    >
      <p data-cy="error-title" className="font-bold">
        {title}
      </p>
      <p data-cy="error-message">{message}</p>
    </div>
  );
}
