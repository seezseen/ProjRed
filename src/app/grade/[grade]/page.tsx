"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ReviewerCard } from "@/components/reviewer-card"
import type { Reviewer } from "@/app/types"
import { use } from "react"

interface GradePageProps {
  params: Promise<{ grade: string }>
}

export default function GradePage({ params }: GradePageProps) {
  const { grade } = use(params)
  const [reviewers, setReviewers] = useState<Reviewer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("")

  useEffect(() => {
    async function fetchReviewers() {
      try {
        const response = await fetch("/api/reviewers")
        const data = await response.json()
        
        if (data.reviewers) {
          // Filter reviewers by grade level
          const filtered = data.reviewers.filter((reviewer: Reviewer) => {
            // Check if gradeLevel matches exactly or is in comma-separated list
            const grades = reviewer.gradeLevel.split(',').map(g => g.trim())
            return grades.includes(grade)
          })
          setReviewers(filtered)
        }
      } catch (error) {
        console.error("Error fetching reviewers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviewers()
  }, [grade])

  const filteredReviewers = reviewers.filter((reviewer) => {
    const matchesSearch = reviewer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reviewer.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject = !subjectFilter || reviewer.subject === subjectFilter
    return matchesSearch && matchesSubject
  })

  const subjects = Array.from(new Set(reviewers.map(r => r.subject)))

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-4 transition-colors"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Grade {grade} Reviewers
          </h1>
          <p className="text-gray-600">
            Browse and download review materials for Grade {grade} subjects
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search reviewers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        {/* Reviewers Grid */}
        {filteredReviewers.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No reviewers found
            </h3>
            <p className="text-gray-500">
              {reviewers.length === 0 
                ? `No reviewers available for Grade ${grade} yet.`
                : "Try adjusting your search or filter."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviewers.map((reviewer) => (
              <ReviewerCard key={reviewer._id} reviewer={reviewer} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
