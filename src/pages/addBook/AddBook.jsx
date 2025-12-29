import React from "react";
import { useForm } from "react-hook-form";
import { useBooks } from "../../context/BookContext";

export default function AddBook() {
  const { addBook, loading, error } = useBooks();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      author: "",
      genre: "",
      price: "",
      imageUrl: "",
      description: "",
      publishedYear: "",
    },
  });

  const onSubmit = async (data) => {
    // ✅ number conversion (safe)
    const payload = {
      ...data,
      price: data.price === "" ? 0 : Number(data.price),
      publishedYear: data.publishedYear === "" ? undefined : Number(data.publishedYear),
    };

    const ok = await addBook(payload);
    if (ok) {
      alert("✅ Book added successfully!");
      reset();
    } else {
      alert("❌ Error adding book!");
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-8 border">
        <h1 className="text-3xl font-bold text-gray-900">Add New Book</h1>
        <p className="text-sm text-gray-500 mt-1">(Admin only) নতুন বই যোগ করো</p>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          {/* Title */}
          <div>
            <input
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Title"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Author */}
          <div>
            <input
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Author"
              {...register("author", { required: "Author is required" })}
            />
            {errors.author && (
              <p className="text-xs text-red-600 mt-1">{errors.author.message}</p>
            )}
          </div>

          {/* Genre */}
          <div>
            <input
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Genre (optional)"
              {...register("genre")}
            />
          </div>

          {/* Price ✅ decimal allowed */}
          <div>
            <input
              type="number"
              step="0.01"
              min="0"
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Price (e.g. 50.12)"
              {...register("price", {
                required: "Price is required",
                validate: (v) => (v !== "" && Number(v) >= 0) || "Price must be 0 or more",
              })}
            />
            {errors.price && (
              <p className="text-xs text-red-600 mt-1">{errors.price.message}</p>
            )}
          </div>

          {/* Published Year */}
          <div>
            <input
              type="number"
              step="1"
              min="0"
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Published Year (optional)"
              {...register("publishedYear")}
            />
          </div>

          {/* Image */}
          <div>
            <input
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Image URL (optional)"
              {...register("imageUrl")}
            />
          </div>

          {/* Description */}
          <div>
            <textarea
              className="w-full border rounded-xl px-4 py-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Description (optional)"
              {...register("description")}
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 rounded-xl py-3 font-semibold"
          >
            {loading ? "Adding..." : "Add Book"}
          </button>
        </form>
      </div>
    </div>
  );
}
