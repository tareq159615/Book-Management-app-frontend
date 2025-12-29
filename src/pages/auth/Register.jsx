import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const { register: rf, handleSubmit } = useForm();
  const { register: signup } = useAuth();
  const nav = useNavigate();

  const onSubmit = async (form) => {
    try {
      await signup(form);
      nav("/");
    } catch (e) {
      alert(e?.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-amber-50 px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-3xl font-bold text-gray-900">Create account</h1>
        <p className="text-gray-500 mt-2 text-sm">Register করে বই কিনতে শুরু করো</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <input className="w-full border rounded-xl px-4 py-3" placeholder="Full name" {...rf("name")} />
          <input className="w-full border rounded-xl px-4 py-3" placeholder="Email" {...rf("email", { required: true })} />
          <input type="password" className="w-full border rounded-xl px-4 py-3" placeholder="Password" {...rf("password", { required: true })} />

          <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl py-3">
            Register
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link className="text-amber-600 font-semibold" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
