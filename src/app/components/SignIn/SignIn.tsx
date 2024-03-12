"use client";

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import "../../globals.css";
import IncorrectCredentials, { SignInErrorTypes } from "./ErrorMessage";

export default function SignInComponent() {
  const { status } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [redirectSeconds, setRedirectSeconds] = useState(3);

  useEffect(() => {
    if (status === "authenticated") {
      if (redirectSeconds === 0) {
        redirect("/");
      }

      setTimeout(() => {
        setRedirectSeconds(redirectSeconds - 1);
      }, 1000);
    }
  }, [status, redirectSeconds]);

  const params = useSearchParams();
  const error = params.get("error");

  if (status === "authenticated") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="p-6 max-w-sm w-full bg-white rounded-lg border border-gray-200 shadow-md">
          <h2 className="text-lg font-semibold text-center mb-4">
            You are already signed in! <br />
            Redirecting to the dashboard in {redirectSeconds}...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        {error && <IncorrectCredentials error={error as SignInErrorTypes} />}
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <Image
            src="/images/uniLogo.png"
            width={50}
            height={50}
            className="mr-3"
            alt="logo"
          />
          Assessment Tracker
        </a>

        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 border-4 animated-border">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>

            <form
              id="admin-login-form"
              action={() => signIn("credentials", { email, password })}
              className="space-y-4 md:space-y-6"
            >
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white ">
                  Your email
                </label>
                <input
                  type="email"
                  id="input-email-for-credentials-provider"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Your password
                </label>
                <input
                  type="password"
                  id="input-password-for-credentials-provider"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-start"></div>
                <a
                  href="#"
                  className="text-sm font-medium hover:underline text-black dark:text-white"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                id="adminSubmit"
                className="w-full text-white bg-customLightRed hover:bg-customDarkRed focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
