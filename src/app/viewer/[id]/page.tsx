"use client";

import { Header } from "@/components/header";
import { useParams } from "next/navigation";

export default function ViewerPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <div className="container mx-auto p-4 md:p-6">
        <div className="glass-panel rounded-xl p-3 mb-3 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Inline Reader</div>
          <a className="text-sm underline hover:no-underline" href={`/api/files/${id}`} target="_blank" rel="noreferrer">Open in new tab</a>
        </div>
        <div className="rounded-xl overflow-hidden bg-background border h-[calc(100vh-200px)]">
          <iframe
            title="PDF Viewer"
            src={`/api/files/${id}`}
            className="w-full h-full"
          />
        </div>
      </div>
    </main>
  );
}
