"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Upload, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  subject: z.string().min(2, "Subject must be at least 2 characters"),
  gradeLevel: z.string().min(1, "Please select at least one grade level"),
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "Max file size is 10MB")
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      "Only PDF and Word documents are accepted"
    ),
});

export default function UploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || !session.user) {
      router.push("/login");
      return;
    }
    
    const userRole = (session.user as any)?.role;
    if (userRole !== "admin" && userRole !== "founder") {
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <Header />
        <div className="flex items-center justify-center p-4 md:p-8 h-96">
          <div className="flex flex-col items-center gap-4 animate-fadeIn">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsUploading(true);
    try {
      // Create FormData to upload file directly
      const formData = new FormData();
      formData.append("file", values.file);
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("subject", values.subject);
      formData.append("gradeLevel", values.gradeLevel);

      // Upload file and metadata to MongoDB
      const uploadResponse = await fetch("/api/reviewers/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        throw new Error(error.message || "Failed to upload reviewer");
      }

      toast({
        title: "Success!",
        description: "Reviewer uploaded successfully.",
      });
      router.push("/");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      <div className="flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Reviewer
            </CardTitle>
            <CardDescription>
              Share your study materials with the community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g., Math Reviewer - Quadratic Equations"
                  {...form.register("title")}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  type="text"
                  placeholder="Brief description of the content"
                  {...form.register("description")}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="e.g., Mathematics"
                  {...form.register("subject")}
                />
                {form.formState.errors.subject && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.subject.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="gradeLevel">Grade Level *</Label>
                <select
                  id="gradeLevel"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...form.register("gradeLevel")}
                >
                  <option value="">Select grade level(s)</option>
                  <option value="7">Grade 7</option>
                  <option value="8">Grade 8</option>
                  <option value="9">Grade 9</option>
                  <option value="10">Grade 10</option>
                  <option value="7,8,9,10">All Grades (7-10)</option>
                </select>
                {form.formState.errors.gradeLevel && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.gradeLevel.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">File (PDF or Word) *</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      form.setValue("file", file);
                    }
                  }}
                />
                {form.formState.errors.file && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.file.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Max file size: 10MB
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
