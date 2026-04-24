"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignupPage = () => {
  const router = useRouter();
  const [accountType, setAccountType] = useState("job-seeker");
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setServerError("");
      setServerSuccess("");

      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: accountType,
      };

      // 1. Create account
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.message || "Failed to create account");
        return;
      }

      setServerSuccess("Account created! Logging you in...");

      // 2. Auto-login
      const loginResult = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (loginResult?.error) {
        setServerSuccess("");
        setServerError("Account created but auto-login failed. Please login manually.");
        return;
      }

      // 3. Redirect based on role
      if (accountType === "company") {
        router.push("/dashboard/company");
      } else {
        router.push("/dashboard/user");
      }
    } catch (err) {
      setServerError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Heading */}
        <h1 className="heading text-3xl text-center mb-6">
          Create your account
        </h1>

        {serverError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {serverError}
          </div>
        )}

        {serverSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-600">
            {serverSuccess}
          </div>
        )}

        {/* Account Type Selector */}
        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={() => setAccountType("job-seeker")}
            className={`flex-1 py-3 rounded-xl font-medium border transition cursor-pointer
              ${
                accountType === "job-seeker"
                  ? "bg-black text-white"
                  : "bg-white text-black border-gray-300"
              }
            `}
          >
            Job Seeker
          </button>

          <button
            type="button"
            onClick={() => setAccountType("company")}
            className={`flex-1 py-3 rounded-xl font-medium border transition cursor-pointer
              ${
                accountType === "company"
                  ? "bg-black text-white"
                  : "bg-white text-black border-gray-300"
              }
            `}
          >
            Company
          </button>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <input
              type="text"
              placeholder={
                accountType === "company" ? "Your name" : "Full name"
              }
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
              })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        {/* Footer text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-black hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
