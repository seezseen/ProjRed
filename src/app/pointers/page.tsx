import { Header } from "@/components/header";
import { headers } from "next/headers";
import { PointersViewer } from "@/components/pointers-viewer";

export const dynamic = 'force-dynamic';

async function getPointers(baseUrl: string, grade?: string) {
  const url = grade ? `${baseUrl}/api/pointers?grade=${grade}` : `${baseUrl}/api/pointers`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return [] as any[];
  const data = await res.json();
  return data.pointers as Array<any>;
}

export default async function PointersPage() {
  const h = await headers();
  const protocol = h.get('x-forwarded-proto') ?? 'http';
  const host = h.get('host') ?? 'localhost:3000';
  const base = `${protocol}://${host}`;

  const [g7, g8, g9, g10] = await Promise.all([
    getPointers(base, '7'),
    getPointers(base, '8'),
    getPointers(base, '9'),
    getPointers(base, '10'),
  ]);

  const sections = [
    { grade: '7', items: g7 },
    { grade: '8', items: g8 },
    { grade: '9', items: g9 },
    { grade: '10', items: g10 },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <div className="container mx-auto p-4 md:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Pointers</h1>
          <p className="text-muted-foreground">Teacher-provided exam coverage pointers by grade level.</p>
        </div>
        <PointersViewer sections={sections as any} />
      </div>
    </main>
  );
}
