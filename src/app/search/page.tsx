"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { ReviewerCard } from "@/components/reviewer-card";
import type { Reviewer } from "@/app/types";
import { useSession } from "next-auth/react";

export default function SearchPage() {
  const { data: session } = useSession();
  const sp = useSearchParams();
  const initialQ = sp?.get("q") || "";
  const [q, setQ] = useState(initialQ);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Reviewer[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [sortBy, setSortBy] = useState<"relevance" | "downloads-desc">("relevance");
  const [onlyDownloaded, setOnlyDownloaded] = useState(false);

  async function runSearch(query: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.reviewers || []);
      setSelectedTag("");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (initialQ) runSearch(initialQ);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQ]);

  const isAdmin = (session?.user as any)?.role === "admin" || (session?.user as any)?.role === "founder";

  const filteredAndSorted = useMemo(() => {
    let list = selectedTag ? results.filter(r => (r.tags || []).includes(selectedTag)) : results.slice();
    if (isAdmin && onlyDownloaded) {
      list = list.filter(r => (r.downloadCount || 0) > 0);
    }
    if (isAdmin && sortBy === "downloads-desc") {
      list.sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0));
    }
    return list;
  }, [results, selectedTag, sortBy, onlyDownloaded, isAdmin]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <div className="container mx-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="glass-panel rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
            <input
              autoFocus
              placeholder="Search reviewers, subjects, tags..."
              className="flex-1 h-11 rounded-md border bg-background px-3"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") runSearch(q);
              }}
            />
            <button
              onClick={() => runSearch(q)}
              className="h-11 rounded-md px-5 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          {/* Tag filters */}
          {results.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(results.flatMap(r => (r.tags || []).map(t => t.trim()).filter(Boolean)))).slice(0, 20).map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(t => t === tag ? "" : tag)}
                  className={`px-3 py-1 rounded-full border text-sm ${selectedTag === tag ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-accent'}`}
                >
                  #{tag}
                </button>
              ))}
              {selectedTag && (
                <button onClick={() => setSelectedTag("")} className="text-sm underline">Clear</button>
              )}
            </div>
          )}

          {/* Admin-only controls */}
          {isAdmin && results.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-muted-foreground">Admin-only:</span>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={onlyDownloaded}
                  onChange={(e) => setOnlyDownloaded(e.target.checked)}
                />
                Only with downloads
              </label>
              <div className="flex items-center gap-2">
                <span>Sort</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="h-9 rounded-md border bg-background px-2"
                >
                  <option value="relevance">Relevance</option>
                  <option value="downloads-desc">Most downloads</option>
                </select>
              </div>
            </div>
          )}

          {results.length === 0 && !loading ? (
            <p className="text-center text-muted-foreground">No results yet. Try a different search.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSorted.map((r) => (
                <ReviewerCard key={r._id} reviewer={r} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
