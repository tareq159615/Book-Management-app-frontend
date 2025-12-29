import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useBooks } from "../../context/BookContext";

export default function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBookById, updateBook, loading, error } = useBooks();

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

  useEffect(() => {
    let mounted = true;

    (async () => {
      const book = await getBookById(id);
      if (!mounted || !book) return;

      reset({
        title: book.title || "",
        author: book.author || "",
        genre: book.genre || "",
        price: book.price ?? "",
        imageUrl: book.imageUrl || "",
        description: book.description || "",
        publishedYear: book.publishedYear ?? "",
      });
    })();

    return () => {
      mounted = false;
    };
  }, [id, getBookById, reset]);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      price: data.price === "" ? 0 : Number(data.price),
      publishedYear: data.publishedYear === "" ? undefined : Number(data.publishedYear),
    };

    const ok = await updateBook(id, payload);
    if (ok) {
      alert("✅ Book updated!");
      navigate("/books");
    } else {
      alert("❌ Update failed!");
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-8 border">
        <h1 className="text-3xl font-bold text-gray-900">Edit Book</h1>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <input
              className="w-full border rounded-xl px-4 py-3"
              placeholder="Title"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <input
              className="w-full border rounded-xl px-4 py-3"
              placeholder="Author"
              {...register("author", { required: "Author is required" })}
            />
            {errors.author && <p className="text-xs text-red-600 mt-1">{errors.author.message}</p>}
          </div>

          <input className="w-full border rounded-xl px-4 py-3" placeholder="Genre" {...register("genre")} />

          <div>
            <input
              type="number"
              step="0.01"
              min="0"
              className="w-full border rounded-xl px-4 py-3"
              placeholder="Price (e.g. 50.12)"
              {...register("price", { required: "Price is required" })}
            />
            {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price.message}</p>}
          </div>

          <input
            type="number"
            step="1"
            min="0"
            className="w-full border rounded-xl px-4 py-3"
            placeholder="Published Year (optional)"
            {...register("publishedYear")}
          />

          <input className="w-full border rounded-xl px-4 py-3" placeholder="Image URL" {...register("imageUrl")} />

          <textarea className="w-full border rounded-xl px-4 py-3 min-h-[120px]" placeholder="Description" {...register("description")} />

          <button
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white rounded-xl py-3 font-semibold"
          >
            {loading ? "Updating..." : "Update Book"}
          </button>
        </form>
      </div>
    </div>
  );
}
