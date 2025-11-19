"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Broadcast, BroadcastType } from "@/app/types/broadcast";
import {
  Megaphone,
  Trash2,
  Loader2,
  Plus,
  Info,
  AlertTriangle,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

export default function BroadcastsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info" as BroadcastType,
    expiresAt: "",
    dismissible: true,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      const userRole = (session.user as any)?.role;
      if (userRole !== "admin" && userRole !== "founder") {
        router.push("/");
        return;
      }
      fetchBroadcasts();
    }
  }, [status, session, router]);

  async function fetchBroadcasts() {
    try {
      const response = await fetch("/api/admin/broadcasts");
      const data = await response.json();
      setBroadcasts(data.broadcasts || []);
    } catch (error) {
      console.error("Error fetching broadcasts:", error);
      toast({
        title: "Error",
        description: "Failed to fetch broadcasts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);

    try {
      const response = await fetch("/api/admin/broadcasts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          expiresAt: formData.expiresAt || null,
        }),
      });

      if (!response.ok) throw new Error("Failed to create broadcast");

      toast({
        title: "Success",
        description: "Broadcast created successfully",
      });

      setFormData({
        title: "",
        message: "",
        type: "info",
        expiresAt: "",
        dismissible: true,
      });
      setShowForm(false);
      fetchBroadcasts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create broadcast",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this broadcast?")) return;

    try {
      const response = await fetch(`/api/admin/broadcasts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      toast({
        title: "Success",
        description: "Broadcast deleted successfully",
      });
      fetchBroadcasts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete broadcast",
        variant: "destructive",
      });
    }
  }

  async function handleToggle(id: string) {
    try {
      const response = await fetch(`/api/admin/broadcasts/${id}`, {
        method: "PATCH",
      });

      if (!response.ok) throw new Error("Failed to toggle");

      toast({
        title: "Success",
        description: "Broadcast status updated",
      });
      fetchBroadcasts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update broadcast",
        variant: "destructive",
      });
    }
  }

  const getTypeIcon = (type: BroadcastType) => {
    switch (type) {
      case "info":
        return <Info className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "urgent":
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: BroadcastType) => {
    const variants: Record<BroadcastType, string> = {
      info: "bg-blue-500",
      warning: "bg-yellow-500",
      urgent: "bg-red-500",
    };
    return (
      <Badge className={`${variants[type]} text-white`}>
        {getTypeIcon(type)}
        <span className="ml-1 capitalize">{type}</span>
      </Badge>
    );
  };

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <div className="container mx-auto p-8 flex items-center justify-center h-96">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <div className="container mx-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-3">
                <Megaphone className="h-10 w-10" />
                Broadcast Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Create and manage announcements for all users
              </p>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="transition-all duration-300 hover:scale-105"
            >
              <Plus className="mr-2 h-4 w-4" />
              {showForm ? "Cancel" : "New Broadcast"}
            </Button>
          </div>

          {/* Create Form */}
          {showForm && (
            <Card className="animate-scaleIn border-2 border-primary/20">
              <CardHeader>
                <CardTitle>Create New Broadcast</CardTitle>
                <CardDescription>
                  Send an announcement to all users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Important Announcement"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="message">Message</Label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Enter your announcement here..."
                      className="min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="type">Type</Label>
                      <select
                        id="type"
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            type: e.target.value as BroadcastType,
                          })
                        }
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="info">Info (Banner)</option>
                        <option value="warning">Warning (Banner)</option>
                        <option value="urgent">Urgent (Popup)</option>
                      </select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="expiresAt">Expires At (Optional)</Label>
                      <Input
                        id="expiresAt"
                        type="datetime-local"
                        value={formData.expiresAt}
                        onChange={(e) =>
                          setFormData({ ...formData, expiresAt: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="dismissible"
                      checked={formData.dismissible}
                      onChange={(e) =>
                        setFormData({ ...formData, dismissible: e.target.checked })
                      }
                      className="h-4 w-4"
                    />
                    <Label htmlFor="dismissible" className="cursor-pointer">
                      Allow users to dismiss this broadcast
                    </Label>
                  </div>

                  <Button type="submit" disabled={creating} className="w-full">
                    {creating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Megaphone className="mr-2 h-4 w-4" />
                        Create Broadcast
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Broadcasts List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Active Broadcasts ({broadcasts.filter((b) => b.isActive).length})
            </h2>
            {broadcasts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Megaphone className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No broadcasts yet. Create one to get started!
                  </p>
                </CardContent>
              </Card>
            ) : (
              broadcasts.map((broadcast, index) => (
                <Card
                  key={broadcast._id}
                  className={`animate-scaleIn ${
                    !broadcast.isActive ? "opacity-60" : ""
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-xl">
                            {broadcast.title}
                          </CardTitle>
                          {getTypeBadge(broadcast.type)}
                          {!broadcast.isActive && (
                            <Badge variant="outline">Inactive</Badge>
                          )}
                        </div>
                        <CardDescription>{broadcast.message}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggle(broadcast._id)}
                        >
                          {broadcast.isActive ? (
                            <ToggleRight className="h-4 w-4" />
                          ) : (
                            <ToggleLeft className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(broadcast._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>By: {broadcast.createdBy}</span>
                      <span>
                        Created: {new Date(broadcast.createdAt).toLocaleString()}
                      </span>
                      {broadcast.expiresAt && (
                        <span>
                          Expires: {new Date(broadcast.expiresAt).toLocaleString()}
                        </span>
                      )}
                      <span>
                        {broadcast.dismissible ? "Dismissible" : "Non-dismissible"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
