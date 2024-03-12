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

export default function SignInError({ error }: { error: SignInErrorTypes }) {
  let message: string;
  switch (error) {
    case "CredentialsSignin":
      message = "Check the details you provided are correct.";
      break;
    case "SessionRequired":
      message = "You need to sign in to access this page.";
      break;
    default:
      console.error(`Unhandled error: ${error}`);
      message = "Something went wrong.";
  }

  return (
    <div
      className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 w-96 rounded-lg mx-auto mb-2"
      role="alert"
    >
      <p className="font-bold">Sign in failed.</p>
      <p data-cy="error-message">{message}</p>
    </div>
  );
}
