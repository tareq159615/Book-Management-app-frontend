import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

const BASE_URL = (import.meta.env.VITE_BASE_URL || "http://localhost:8000").replace(/\/+$/, "");

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const BookContext = createContext(null);

export function BookProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [singleBook, setSingleBook] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);

  const [totalBooks, setTotalBooks] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [order, setOrder] = useState("asc");

  const buildParams = useCallback(
    (override = {}) => {
      const params = {
        page,
        limit,
        sortBy,
        order,
        ...override,
      };
      if (search) params.search = search;
      if (genre) params.genre = genre;
      return params;
    },
    [page, limit, sortBy, order, search, genre]
  );

  // ✅ stable function (IMPORTANT)
  const fetchBooks = useCallback(
    async (override = {}) => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/books", { params: buildParams(override) });

        setBooks(data?.books || []);
        setTotalBooks(data?.totalBooks || 0);
        setTotalPages(data?.totalPages || 1);
        if (data?.currentPage) setPage(data.currentPage);
      } catch (e) {
        setError(e?.response?.data?.message || e.message || "Failed to fetch books");
      } finally {
        setLoading(false);
      }
    },
    [buildParams]
  );

  // ✅ stable function (IMPORTANT)
  const getBookById = useCallback(async (id) => {
    if (!id) return null;
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/books/${id}`);
      setSingleBook(data);
      return data;
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to fetch book");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addBook = useCallback(
    async (payload) => {
      setLoading(true);
      setError("");
      try {
        await api.post("/books", payload);
        // add হলে first page এ নিয়ে গিয়ে refresh
        setPage(1);
        await fetchBooks({ page: 1 });
        return true;
      } catch (e) {
        setError(e?.response?.data?.message || e.message || "Failed to add book");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchBooks]
  );

  const updateBook = useCallback(
    async (id, payload) => {
      setLoading(true);
      setError("");
      try {
        await api.put(`/books/${id}`, payload);
        await fetchBooks();
        return true;
      } catch (e) {
        setError(e?.response?.data?.message || e.message || "Failed to update book");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchBooks]
  );

  const deleteBook = useCallback(
    async (id) => {
      setLoading(true);
      setError("");
      try {
        await api.delete(`/books/${id}`);
        await fetchBooks();
        return true;
      } catch (e) {
        setError(e?.response?.data?.message || e.message || "Failed to delete book");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchBooks]
  );

  // ✅ Auto fetch when query changes
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks, page, limit, search, genre, sortBy, order]);

  const value = useMemo(
    () => ({
      books,
      singleBook,
      totalBooks,
      totalPages,
      loading,
      error,

      page,
      limit,
      search,
      genre,
      sortBy,
      order,

      setPage,
      setLimit,
      setSearch,
      setGenre,
      setSortBy,
      setOrder,

      fetchBooks,
      getBookById,
      addBook,
      updateBook,
      deleteBook,
    }),
    [
      books,
      singleBook,
      totalBooks,
      totalPages,
      loading,
      error,
      page,
      limit,
      search,
      genre,
      sortBy,
      order,
      fetchBooks,
      getBookById,
      addBook,
      updateBook,
      deleteBook,
    ]
  );

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
}

export function useBooks() {
  const ctx = useContext(BookContext);
  if (!ctx) throw new Error("useBooks must be used inside BookProvider");
  return ctx;
}
