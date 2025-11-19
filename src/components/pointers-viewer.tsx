"use client";

import { useEffect, useMemo, useState } from "react";
import type { Pointer } from "@/app/types";
import { Button } from "@/components/ui/button";

type Section = { grade: string; items: Pointer[] };

export function PointersViewer({ sections }: { sections: Section[] }) {
  const [selected, setSelected] = useState<Pointer | null>(null);

  // Flatten for quick lookup if needed later
  const all = useMemo(() => sections.flatMap((s) => s.items), [sections]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelected(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {sections.map((s) => (
        <section key={s.grade} className="space-y-4">
          <h2 className="text-xl font-semibold">Grade {s.grade}</h2>
          {s.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pointers for Grade {s.grade} yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {s.items.map((p) => (
                <div key={p._id} className="group overflow-hidden rounded-xl border bg-background">
                  <button
                    type="button"
                    className="relative aspect-[4/3] overflow-hidden w-full"
                    onClick={() => setSelected(p)}
                    aria-label={`Open ${p.title}`}
                    title="Open"
                  >
                    <img
                      src={`/api/files/${p.fileKey}`}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </button>
                  <div className="p-4 space-y-1">
                    <div className="text-xs text-muted-foreground">{p.subject} • {p.teacher}</div>
                    <div className="font-medium">{p.title}</div>
                    {p.description && <div className="text-sm text-muted-foreground line-clamp-2">{p.description}</div>}
                    <div className="pt-2 flex gap-2">
                      <a className="inline-flex items-center justify-center h-9 px-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90" href={`/api/files/${p.fileKey}?download=1`}>Download</a>
                      <a className="inline-flex items-center justify-center h-9 px-3 rounded-md border hover:bg-muted" href={`/api/files/${p.fileKey}`} target="_blank" rel="noopener noreferrer">Open in tab</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ))}

      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-w-6xl w-full max-h-[90vh] bg-background rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b">
              <div className="space-y-0.5">
                <div className="text-sm text-muted-foreground">G{selected.gradeLevel} • {selected.subject} • {selected.teacher}</div>
                <div className="font-semibold leading-tight">{selected.title}</div>
              </div>
              <div className="flex items-center gap-2">
                <a className="inline-flex items-center justify-center h-9 px-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90" href={`/api/files/${selected.fileKey}?download=1`}>Download</a>
                <Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>
              </div>
            </div>
            <div className="w-full h-[70vh] flex items-center justify-center bg-black">
              <img
                src={`/api/files/${selected.fileKey}`}
                alt={selected.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
