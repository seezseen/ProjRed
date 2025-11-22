"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const schema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  subject: z.string().min(2),
  gradeLevel: z.union([z.literal('7'), z.literal('8'), z.literal('9'), z.literal('10')]),
  author: z.string().min(2),
  component: z.union([z.literal('Quiz'), z.literal('Midterms'), z.literal('Finals'), z.literal('Others')]),
  studentName: z.string().min(2),
  studentSection: z.string().min(1),
  file: z.instanceof(File)
    .refine((f) => f.size <= MAX_FILE_SIZE, 'Max file size is 10MB')
    .refine((f) => ACCEPTED.includes(f.type), 'Only PDF and Word documents are accepted'),
});

export default function UploadRequestPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user) { router.push('/login'); }
  }, [session, status, router]);

  useEffect(() => {
    const g = params?.get('grade');
    if (g && ['7','8','9','10'].includes(g)) form.setValue('gradeLevel', g as any);
  }, [params, form]);

  async function onSubmit(values: z.infer<typeof schema>) {
    setSubmitting(true);
    try {
      const fd = new FormData();
      (['title','description','subject','gradeLevel','author','component','studentName','studentSection'] as const).forEach((k) => {
        fd.append(k, values[k].toString());
      });
      fd.append('file', values.file);
      const res = await fetch('/api/reviewer-requests', { method: 'POST', body: fd });
      if (!res.ok) {
        const e = await res.json().catch(() => ({} as any));
        throw new Error(e.message || 'Failed to submit');
      }
      router.push('/');
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to submit');
    } finally { setSubmitting(false); }
  }

  if (status === 'loading') return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20"><Header /><div className="flex items-center justify-center p-8"><Loader2 className="h-6 w-6 animate-spin"/></div></main>
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      <div className="container mx-auto p-4 md:p-8">
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5"/> Submit Reviewer for Approval</CardTitle>
            <CardDescription>Uploads go to admins for review before publishing.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" {...form.register('title')} placeholder="e.g., Q2 Math Reviewer" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Input id="description" {...form.register('description')} placeholder="Brief description" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input id="subject" {...form.register('subject')} placeholder="e.g., Mathematics" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gradeLevel">Grade Level *</Label>
                <select id="gradeLevel" className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" {...form.register('gradeLevel')}>
                  <option value="">Select grade</option>
                  <option value="7">Grade 7</option>
                  <option value="8">Grade 8</option>
                  <option value="9">Grade 9</option>
                  <option value="10">Grade 10</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input id="author" {...form.register('author')} placeholder="e.g., Student Author" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="component">Component *</Label>
                <select id="component" className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" {...form.register('component')}>
                  <option value="">Select component</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Midterms">Midterms</option>
                  <option value="Finals">Finals</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentName">Student Name *</Label>
                <Input id="studentName" {...form.register('studentName')} placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentSection">Student Section *</Label>
                <Input id="studentSection" {...form.register('studentSection')} placeholder="e.g., 10 - Rizal" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="file">File (PDF or Word) *</Label>
                <Input id="file" type="file" accept=".pdf,.doc,.docx" onChange={(e) => { const f = e.target.files?.[0]; if (f) form.setValue('file', f); }} />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Submitting…</>) : (<><Upload className="mr-2 h-4 w-4"/>Submit for Approval</>)}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
