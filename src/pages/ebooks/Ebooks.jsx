import React, { useMemo, useState } from "react";
import ebooksData from "../../../public/e-books.json";

export default function Ebooks() {
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState("");

  const languages = useMemo(() => {
    const set = new Set();
    (ebooksData || []).forEach((e) => {
      if (e?.language) set.add(e.language);
    });
    return ["", ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (ebooksData || []).filter((e) => {
      const okQuery =
        !q ||
        (e.title || "").toLowerCase().includes(q) ||
        (e.author || "").toLowerCase().includes(q) ||
        (e.country || "").toLowerCase().includes(q);

      const okLang = !lang || e.language === lang;

      return okQuery && okLang;
    });
  }, [query, lang]);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Ebooks Library</h1>
          <p className="text-sm text-gray-500 mt-1">
            Local JSON থেকে ebooks দেখাচ্ছে (backend লাগবে না)
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-auto">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title/author/country..."
            className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="border rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="">All Languages</option>
            {languages.filter((x) => x !== "").map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 bg-white rounded-2xl shadow p-10 text-center text-gray-600">
          No ebooks found.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {filtered.map((e, idx) => (
            <EbookCard key={`${e.title}-${idx}`} ebook={e} />
          ))}
        </div>
      )}
    </div>
  );
}

function EbookCard({ ebook }) {
  // imageLink গুলো সাধারণত প্রজেক্টে নেই, তাই fallback cover
  const fallback = (ebook?.title?.[0] || "E").toUpperCase();
  const link = (ebook?.link || "").trim();

  return (
    <div className="bg-white rounded-2xl shadow border overflow-hidden hover:shadow-lg transition">
      <div className="aspect-[4/5] bg-gray-900 flex items-center justify-center text-white text-5xl font-black">
        {fallback}
      </div>

      <div className="p-4 space-y-1">
        <div className="font-bold line-clamp-1">{ebook.title}</div>
        <div className="text-sm text-gray-500 line-clamp-1">{ebook.author}</div>
        <div className="text-xs text-gray-500">
          {ebook.country} • {ebook.language} • {ebook.year}
        </div>

        <div className="pt-3">
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center w-full bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold px-4 py-2 rounded-xl"
            >
              Open Info
            </a>
          ) : (
            <button
              disabled
              className="w-full bg-gray-100 text-gray-500 font-semibold px-4 py-2 rounded-xl cursor-not-allowed"
            >
              No Link
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
