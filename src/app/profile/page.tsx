import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Shield, Heart } from "lucide-react";
import clientPromise from "@/lib/client";
import { getReviewersByIds } from "@/lib/reviewers";
import { ReviewerCard } from "@/components/reviewer-card";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Fetch favorites for the logged-in user
  let favoriteReviewers: any[] = [];
  try {
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");
    const user = await users.findOne({ email: session.user?.email });
    const favorites: string[] = user?.favorites || [];
    const { reviewers } = await getReviewersByIds(favorites);
    favoriteReviewers = reviewers || [];
  } catch {}

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      <div className="container p-4 md:p-8 space-y-8">
        <Card className="w-full max-w-3xl mx-auto glass-panel">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                {session.user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{session.user?.name}</h3>
                <Badge variant="secondary" className="mt-1">
                  {(session.user as any)?.role || "Student"}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <User className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-sm text-muted-foreground">
                    {session.user?.name}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Mail className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    {session.user?.email}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Shield className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Role</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {(session.user as any)?.role || "Student"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="w-full max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Favorites</h2>
          </div>
          {favoriteReviewers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No favorites yet. Tap the heart on any reviewer to save it here.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteReviewers.map((r) => (
                <ReviewerCard key={r._id} reviewer={r} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
