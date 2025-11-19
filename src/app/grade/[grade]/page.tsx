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
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 z-50">
        <div className="flex flex-col items-center gap-4 animate-fadeIn">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-purple-600/20"></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">Loading reviewers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slideInUp">
          <Link 
            href="/" 
            className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-4 transition-all duration-300 hover:translate-x-[-4px] hover:scale-105 font-medium"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            Grade {grade} Reviewers
          </h1>
          <p className="text-gray-600 dark:text-gray-400 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            Browse and download review materials for Grade {grade} subjects
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <input
            type="text"
            placeholder="Search reviewers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 focus:scale-[1.02] focus:shadow-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 focus:scale-[1.02] focus:shadow-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
          <div className="text-center py-16 animate-fadeIn">
            <div className="text-6xl mb-4 animate-bounce">📚</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No reviewers found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {reviewers.length === 0 
                ? `No reviewers available for Grade ${grade} yet.`
                : "Try adjusting your search or filter."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviewers.map((reviewer, index) => (
              <div 
                key={reviewer._id}
                className="animate-scaleIn"
                style={{ animationDelay: `${0.4 + index * 0.05}s`, opacity: 0 }}
              >
                <ReviewerCard reviewer={reviewer} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
