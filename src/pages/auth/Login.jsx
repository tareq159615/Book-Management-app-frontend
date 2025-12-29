import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();
  const nav = useNavigate();

  const onSubmit = async (form) => {
    try {
      await login(form);
      nav("/");
    } catch (e) {
      alert(e?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-gray-100 px-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-10 bg-gray-900 text-white flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back 👋</h1>
            <p className="text-gray-300 mt-3">
              Login করে তোমার বই কেনা, অর্ডার ট্র্যাক, আর membership ব্যবহার করো।
            </p>
          </div>
          <div className="mt-10 text-sm text-gray-300">
            <p>Admin হলে তুমি dashboard access পাবে।</p>
          </div>
        </div>

        <div className="p-10">
          <h2 className="text-2xl font-bold text-gray-900">Login</h2>
          <p className="text-sm text-gray-500 mt-1">তোমার অ্যাকাউন্টে ঢুকো</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <input
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Email"
              {...register("email", { required: true })}
            />
            <input
              type="password"
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Password"
              {...register("password", { required: true })}
            />

            <button className="w-full bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-xl py-3">
              Login
            </button>
          </form>

          <p className="text-sm text-gray-600 mt-6">
            নতুন?{" "}
            <Link className="text-amber-600 font-semibold" to="/register">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
