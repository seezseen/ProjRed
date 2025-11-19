"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader2, Trash2, Download, Search, FileText } from "lucide-react"
import type { Reviewer } from "@/app/types"

export default function AdminReviewersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [reviewers, setReviewers] = useState<Reviewer[]>([])
  const [filteredReviewers, setFilteredReviewers] = useState<Reviewer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [gradeFilter, setGradeFilter] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("")
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  useEffect(() => {
    if (status === "loading") return

    if (!session?.user) {
      router.push("/login")
      return
    }

    const userRole = (session.user as any)?.role
    if (userRole !== "admin" && userRole !== "founder") {
      router.push("/")
    }
  }, [session, status, router])

  useEffect(() => {
    fetchReviewers()
  }, [])

  useEffect(() => {
    filterReviewers()
  }, [searchQuery, gradeFilter, subjectFilter, reviewers])

  async function fetchReviewers() {
    try {
      const response = await fetch("/api/reviewers")
      const data = await response.json()
      if (data.reviewers) {
        setReviewers(data.reviewers)
      }
    } catch (error) {
      console.error("Error fetching reviewers:", error)
    } finally {
      setLoading(false)
    }
  }

  function filterReviewers() {
    let filtered = reviewers

    if (searchQuery) {
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.subject.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (gradeFilter) {
      filtered = filtered.filter((r) => {
        const grades = r.gradeLevel.split(",").map((g) => g.trim())
        return grades.includes(gradeFilter)
      })
    }

    if (subjectFilter) {
      filtered = filtered.filter((r) => r.subject === subjectFilter)
    }

    setFilteredReviewers(filtered)
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this reviewer?")) return

    setDeleteLoading(id)
    try {
      const response = await fetch(`/api/reviewers/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setReviewers(reviewers.filter((r) => r._id !== id))
      } else {
        alert("Failed to delete reviewer")
      }
    } catch (error) {
      console.error("Error deleting reviewer:", error)
      alert("Error deleting reviewer")
    } finally {
      setDeleteLoading(null)
    }
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const subjects = Array.from(new Set(reviewers.map((r) => r.subject)))
  const grades = ["7", "8", "9", "10"]

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Reviewer Management</h1>
              <p className="text-muted-foreground">
                Manage all uploaded reviewers
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/">← Back to Home</Link>
              </Button>
              <Button asChild>
                <Link href="/upload">Upload New</Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Total Reviewers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reviewers.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Subjects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{subjects.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Grade Levels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Filtered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {filteredReviewers.length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reviewers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">All Grades</option>
              {grades.map((grade) => (
                <option key={grade} value={grade}>
                  Grade {grade}
                </option>
              ))}
            </select>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reviewers Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Reviewers</CardTitle>
            <CardDescription>
              View and manage all uploaded reviewers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredReviewers.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No reviewers found</h3>
                <p className="text-muted-foreground">
                  {reviewers.length === 0
                    ? "Upload your first reviewer to get started."
                    : "Try adjusting your filters."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">Title</th>
                      <th className="text-left p-4 font-medium">Subject</th>
                      <th className="text-left p-4 font-medium">Grade</th>
                      <th className="text-left p-4 font-medium">Size</th>
                      <th className="text-left p-4 font-medium">Uploaded By</th>
                      <th className="text-right p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReviewers.map((reviewer) => (
                      <tr key={reviewer._id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{reviewer.title}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {reviewer.description}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary">{reviewer.subject}</Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline">
                            Grade {reviewer.gradeLevel}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {formatFileSize(reviewer.fileSize)}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {reviewer.uploadedBy}
                        </td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              asChild
                            >
                              <a
                                href={`/api/files/${reviewer.fileKey}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Download className="h-4 w-4" />
                              </a>
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(reviewer._id)}
                              disabled={deleteLoading === reviewer._id}
                            >
                              {deleteLoading === reviewer._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
