"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Loader2, Trash2 } from "lucide-react";
import type { Pointer } from "@/app/types";

export default function AdminPointersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [items, setItems] = useState<Pointer[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = useMemo(() => {
    const role = (session?.user as any)?.role;
    return role === "admin" || role === "founder";
  }, [session]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) { router.push("/login"); return; }
    if (!isAdmin) { router.push("/"); return; }
    refresh();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status]);

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch('/api/pointers');
      const data = await res.json();
      setItems(data.pointers || []);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsUploading(true);
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const res = await fetch('/api/pointers', { method: 'POST', body: formData });
      if (!res.ok) {
        const err = await res.json().catch(() => ({} as any));
        throw new Error(err.message || 'Upload failed');
      }
      form.reset();
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm('Delete this pointer?')) return;
    const res = await fetch(`/api/pointers/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const e = await res.json().catch(() => ({} as any));
      alert(e.message || 'Delete failed');
      return;
    }
    await refresh();
  }

  const grouped = useMemo(() => {
    const groups: Record<'7'|'8'|'9'|'10', Pointer[]> = { '7': [], '8': [], '9': [], '10': [] };
    for (const p of items) {
      if (p.gradeLevel === '7' || p.gradeLevel === '8' || p.gradeLevel === '9' || p.gradeLevel === '10') {
        groups[p.gradeLevel].push(p);
      }
    }
    return groups;
  }, [items]);

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
      <div className="container mx-auto p-4 md:p-8 space-y-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5" /> Upload Pointer</CardTitle>
            <CardDescription>Upload PNG/JPG pointers with metadata. Admins only.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" name="title" required placeholder="e.g., Q2 Exam Pointers" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Input id="description" name="description" required placeholder="Brief description" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input id="subject" name="subject" required placeholder="e.g., Science" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teacher">Teacher *</Label>
                <Input id="teacher" name="teacher" required placeholder="e.g., Mr. Dela Cruz" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gradeLevel">Grade Level *</Label>
                <select id="gradeLevel" name="gradeLevel" className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" required>
                  <option value="">Select grade</option>
                  <option value="7">Grade 7</option>
                  <option value="8">Grade 8</option>
                  <option value="9">Grade 9</option>
                  <option value="10">Grade 10</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="file">Image (PNG/JPG) *</Label>
                <Input id="file" name="file" type="file" accept="image/png,image/jpeg,.png,.jpg,.jpeg" required />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" className="w-full" disabled={isUploading}>
                  {isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading…</> : <>Upload</>}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex items-center justify-center p-8 text-muted-foreground">Loading pointers…</div>
        ) : (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">All Pointers</h2>
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pointers uploaded yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(p => (
                  <div key={p._id} className="group overflow-hidden rounded-xl border bg-background">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={`/api/files/${p.fileKey}`} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-4 space-y-1">
                      <div className="text-xs text-muted-foreground">G{p.gradeLevel} • {p.subject} • {p.teacher}</div>
                      <div className="font-medium">{p.title}</div>
                      {p.description && <div className="text-sm text-muted-foreground line-clamp-2">{p.description}</div>}
                      <div className="pt-2 flex gap-2">
                        <a className="inline-flex items-center justify-center h-9 px-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90" href={`/api/files/${p.fileKey}?download=1`}>Download</a>
                        <Button variant="destructive" size="sm" onClick={() => onDelete(p._id)} className="ml-auto inline-flex items-center gap-1"><Trash2 className="h-4 w-4"/>Delete</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
