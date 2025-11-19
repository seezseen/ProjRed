"use client";

import { Reviewer } from "@/app/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Download, FileText, Heart, Eye, ThumbsUp, Flag } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface ReviewerCardProps {
  reviewer: Reviewer;
}

export function ReviewerCard({ reviewer }: ReviewerCardProps) {
  const { data: session } = useSession();
  const [fav, setFav] = useState<boolean | null>(null);
  const [helpful, setHelpful] = useState<number>(reviewer.helpfulCount || 0);
  const favored = fav ?? false;
  function handleDownload() {
    const openInNewTab = (localStorage.getItem("settings.openDownloadsInNewTab") ?? "true") === "true";
    const forceDownload = localStorage.getItem("settings.forceDownload") === "true";
    const url = `/api/files/${reviewer.fileKey}${forceDownload ? "?download=1" : ""}`;
    if (openInNewTab) {
      window.open(url, "_blank");
    } else {
      window.location.href = url;
    }
  }

  async function toggleFavorite() {
    if (!session?.user?.email) {
      alert("Please log in to save favorites.");
      return;
    }
    try {
      const res = await fetch("/api/user/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewerId: reviewer._id }),
      });
      const data = await res.json();
      if (res.ok) setFav(data.favored);
    } catch {}
  }

  function openReader() {
    window.open(`/viewer/${reviewer.fileKey}`, "_blank");
  }

  async function markHelpful() {
    try {
      const res = await fetch(`/api/reviewers/${reviewer._id}/helpful`, { method: "POST" });
      if (res.ok) setHelpful((h) => h + 1);
    } catch {}
  }

  async function reportReviewer() {
    const reason = prompt("Reason for report (required):", "Inaccurate content");
    if (!reason) return;
    const details = prompt("Any details? (optional)", "");
    try {
      await fetch(`/api/reviewers/${reviewer._id}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, details }),
      });
      alert("Report submitted. Thank you.");
    } catch {}
  }

  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 border-2 hover:border-primary/20 animate-fadeIn glass-card relative">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
            {reviewer.title}
          </CardTitle>
          <Badge 
            variant="secondary" 
            className="transition-all duration-300 group-hover:scale-110 group-hover:shadow-md"
          >
            Grade {reviewer.gradeLevel}
          </Badge>
        </div>
        <button
          onClick={toggleFavorite}
          aria-label="Toggle favorite"
          className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors"
          title="Save to favorites"
        >
          <Heart className={`h-5 w-5 ${favored ? 'fill-current text-primary' : ''}`} />
        </button>
        <CardDescription className="flex items-center gap-2 group-hover:text-foreground/80 transition-colors">
          <FileText className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
          {reviewer.subject}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2 transition-colors duration-300 group-hover:text-foreground/70">
          {reviewer.description}
        </p>
        {Array.isArray(reviewer.tags) && reviewer.tags.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {reviewer.tags.slice(0, 5).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
        <p className="text-xs text-muted-foreground transition-colors duration-300">
          {reviewer.fileName}
        </p>
        {(session?.user as any)?.role && ((session?.user as any).role === 'admin' || (session?.user as any).role === 'founder') && (
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground/70">Admin-only</span>
            <Badge variant="outline" className="text-[11px]">Downloads {reviewer.downloadCount ?? 0}</Badge>
          </div>
        )}
        <div className="mt-3 flex items-center gap-3 text-xs">
          <button onClick={markHelpful} className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors" aria-label="Mark helpful">
            <ThumbsUp className="h-4 w-4" /> Helpful {helpful > 0 ? `(${helpful})` : ""}
          </button>
          <span className="text-muted-foreground/40">•</span>
          <button onClick={reportReviewer} className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors" aria-label="Report reviewer">
            <Flag className="h-4 w-4" /> Report
          </button>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex gap-2 w-full">
          <Button 
            onClick={openReader} 
            variant="secondary"
            className="w-1/2 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
          >
            <Eye className="mr-2 h-4 w-4" />
            Reader
          </Button>
          <Button 
            onClick={handleDownload} 
            className="w-1/2 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
          >
            <Download className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            Download
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
