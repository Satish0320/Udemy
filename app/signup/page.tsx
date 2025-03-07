"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Signup() {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [role, setRole] = useState("STUDENT");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = nameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await res.json();
    console.log(data)
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong!");
    } else {
      // alert("welcome")
      router.push("/login");
    }
  };


  const handleGoogleSignup = async () => {
    signIn("google", {callbackUrl: "/"})
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form className="p-6 bg-white shadow-lg rounded-lg w-96" onSubmit={handleSignup}>
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-700">Sign Up</h2>

        {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}

        <input
          type="text"
          placeholder="Full Name"
          ref={nameRef}
          className="border border-gray-300 p-3 w-full mb-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
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
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border border-gray-300 p-3 w-full mb-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="STUDENT">Student</option>
          <option value="INSTRUCTOR">Instructor</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full font-semibold hover:bg-blue-600 transition disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        <div className="mt-4 text-center">
          <p className="text-gray-600">Or sign up with</p>
          <button
            type="button"
            onClick={handleGoogleSignup}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg w-full font-semibold hover:bg-red-600 transition"
          >
            Sign Up with Google
          </button>
        </div>
      </form>
    </div>
  );
}