import React, { useEffect, useMemo } from "react";
import BookCard from "./BookCard";
import Pagination from "../../components/Pagination";
import { useBooks } from "../../context/BookContext";

export default function Shop() {
  const {
    books,
    loading,
    error,
    page,
    totalPages,
    search,
    genre,
    sortBy,
    order,
    setPage,
    setSearch,
    setGenre,
    setSortBy,
    setOrder,
    deleteBook,
    fetchBooks,
  } = useBooks();

  // optional: first load safety (BookContext already auto-fetch করে, তবু harmless)
  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Genre list safe: books empty হলেও crash করবে না
  const genres = useMemo(() => {
    const set = new Set();
    (books || []).forEach((b) => {
      if (b?.genre) set.add(b.genre);
    });
    return ["", ...Array.from(set)];
  }, [books]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book?")) return;
    await deleteBook(id);
  };

  const handleSort = (value) => {
    if (value === "title-asc") {
      setSortBy("title");
      setOrder("asc");
    } else if (value === "title-desc") {
      setSortBy("title");
      setOrder("desc");
    } else if (value === "price-asc") {
      setSortBy("price");
      setOrder("asc");
    } else if (value === "price-desc") {
      setSortBy("price");
      setOrder("desc");
    } else {
      setSortBy("title");
      setOrder("asc");
    }
    setPage(1);
  };

  const sortValue =
    sortBy === "price" && order === "asc"
      ? "price-asc"
      : sortBy === "price" && order === "desc"
      ? "price-desc"
      : sortBy === "title" && order === "desc"
      ? "title-desc"
      : "title-asc";

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Shop Books</h1>
          <p className="text-sm text-gray-500 mt-1">
            Search, filter, sort এবং অর্ডার করার জন্য Cart ব্যবহার করো
          </p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by title/author..."
            className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />

          <select
            value={genre}
            onChange={(e) => {
              setGenre(e.target.value);
              setPage(1);
            }}
            className="border rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="">All Genres</option>
            {genres
              .filter((g) => g !== "")
              .map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
          </select>

          <select
            value={sortValue}
            onChange={(e) => handleSort(e.target.value)}
            className="border rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="title-asc">Title: A → Z</option>
            <option value="title-desc">Title: Z → A</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="mt-8 text-center text-gray-600">Loading books...</div>
      )}

      {/* Empty */}
      {!loading && (!books || books.length === 0) && (
        <div className="mt-8 bg-white rounded-2xl shadow p-10 text-center text-gray-600">
          No books found.
        </div>
      )}

      {/* Grid */}
      {!loading && books?.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {books.map((book) => (
            <BookCard key={book._id} book={book} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
