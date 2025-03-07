"use client";

import { signIn } from "next-auth/react";
import { useState, useRef } from "react";
// import { useRouter } from "next/navigation";

export default function Login() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
//   const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password.");
    } else {
      alert("welcome")
    //   router.push("/register");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form className="p-6 bg-white shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-700">Login</h2>

        {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          ref={emailRef}
          className="border border-gray-300 p-3 w-full mb-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Password"
          ref={passwordRef}
          className="border border-gray-300 p-3 w-full mb-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full font-semibold hover:bg-blue-600 transition disabled:bg-gray-400"
          disabled={loading}
          onClick={handleLogin}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <button onClick={() => signIn("google")} className="bg-red-500 text-white p-2 rounded">
        Sign in with Google
      </button>
      </form>
    </div>
  );
}