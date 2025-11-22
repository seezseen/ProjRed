"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ReviewerRequest } from "@/app/types";
import { Loader2, Check, X } from "lucide-react";

export default function ReviewerApprovalsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<ReviewerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = useMemo(() => {
    const role = (session?.user as any)?.role; return role === 'admin' || role === 'founder';
  }, [session]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user) { router.push('/login'); return; }
    if (!isAdmin) { router.push('/'); return; }
    refresh();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status]);

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch('/api/reviewer-requests?status=pending');
      const data = await res.json();
      setItems(data.requests || []);
    } finally { setLoading(false); }
  }

  async function approve(id: string) {
    const res = await fetch(`/api/reviewer-requests/${id}/approve`, { method: 'POST' });
    if (res.ok) refresh(); else alert('Failed to approve');
  }
  async function reject(id: string) {
    const res = await fetch(`/api/reviewer-requests/${id}/reject`, { method: 'POST' });
    if (res.ok) refresh(); else alert('Failed to reject');
  }

  if (status === 'loading') {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <Header />
        <div className="flex items-center justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      <div className="container mx-auto p-4 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reviewer Approval</h1>
            <p className="text-muted-foreground">Approve or disapprove user-submitted reviewers.</p>
          </div>
          <Button variant="outline" onClick={refresh}>Refresh</Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8 text-muted-foreground">Loading requests…</div>
        ) : items.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No pending requests</CardTitle>
              <CardDescription>New user submissions will appear here.</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((r) => (
              <Card key={r._id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="line-clamp-1">{r.title}</CardTitle>
                  <CardDescription>G{r.gradeLevel} • {r.subject} • {r.component}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-muted-foreground">Author:</span> {r.author}</div>
                    <div><span className="text-muted-foreground">Student:</span> {r.studentName} ({r.studentSection})</div>
                    <div className="flex gap-2 pt-3">
                      <a className="inline-flex items-center justify-center h-9 px-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90" href={`/api/files/${r.fileKey}`} target="_blank" rel="noopener noreferrer">Open</a>
                      <a className="inline-flex items-center justify-center h-9 px-3 rounded-md border hover:bg-muted" href={`/api/files/${r.fileKey}?download=1`}>Download</a>
                      <Button className="ml-auto inline-flex items-center gap-1" size="sm" onClick={() => approve(r._id)}><Check className="h-4 w-4"/>Approve</Button>
                      <Button variant="destructive" size="sm" onClick={() => reject(r._id)} className="inline-flex items-center gap-1"><X className="h-4 w-4"/>Disapprove</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
