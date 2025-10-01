import Link from "next/link";
import { stackServerApp } from "@/lib/stack";

export default async function Home() {
  const user = await stackServerApp.getUser();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold">Auth Test App</h1>
        <p className="text-gray-600">
          Next.js with Neon Postgres, Stack Auth, and Row Level Security
        </p>

        {user ? (
          <div className="space-y-4">
            <p className="text-lg">Welcome, {user.primaryEmail}!</p>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <Link
              href="/handler/sign-in"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mr-4"
            >
              Sign In
            </Link>
            <Link
              href="/handler/sign-up"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
