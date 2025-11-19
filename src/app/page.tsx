import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Upload, BookOpen } from "lucide-react";

// Force dynamic rendering to avoid build-time database connection
export const dynamic = 'force-dynamic';

export default async function Home() {
  const grades = [
    { number: 7, color: "from-blue-500 to-cyan-500", emoji: "📘" },
    { number: 8, color: "from-purple-500 to-pink-500", emoji: "📗" },
    { number: 9, color: "from-orange-500 to-red-500", emoji: "📙" },
    { number: 10, color: "from-green-500 to-emerald-500", emoji: "📕" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <Header />
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex flex-col gap-8">
          {/* Hero Section */}
          <div className="text-center py-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-slideInUp">
              Reviewer Library
            </h1>
            <p className="text-xl text-gray-600 mb-2 animate-fadeIn" style={{ animationDelay: '0.2s', opacity: 0 }}>
              Access quality study materials for your grade level
            </p>
            <p className="text-sm text-gray-500 animate-fadeIn" style={{ animationDelay: '0.3s', opacity: 0 }}>
              This project was inspired from Reviewers Kitchen!
            </p>
          </div>

          {/* Grade Level Cards */}
          <div className="max-w-5xl mx-auto w-full">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 animate-fadeIn" style={{ animationDelay: '0.4s', opacity: 0 }}>
              Select Your Grade Level
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {grades.map((grade, index) => (
                <Link
                  key={grade.number}
                  href={`/grade/${grade.number}`}
                  className="group animate-scaleIn"
                  style={{ animationDelay: `${0.5 + index * 0.1}s`, opacity: 0 }}
                >
                  <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${grade.color} p-8 shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:-translate-y-2 hover:rotate-1`}>
                    <div className="text-center text-white">
                      <div className="text-6xl mb-3">{grade.emoji}</div>
                      <h3 className="text-3xl font-bold mb-2">Grade {grade.number}</h3>
                      <p className="text-sm opacity-90">Browse reviewers</p>
                    </div>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Information Section */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              📚 About the Library
            </h2>
            <p className="text-gray-600 mb-4">
              Welcome to the Reviewer Library! This platform provides free access to study materials 
              for students in grades 7-10. Browse through various subjects and download reviewers to 
              help you prepare for your exams.
            </p>
            <p className="text-gray-600">
              All reviewers are uploaded by administrators to ensure quality and accuracy. 
              Each reviewer is organized by grade level and subject for easy navigation.
            </p>
          </div>

          {/* Additional Info */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              ℹ️ How to Use
            </h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="font-bold mr-2">1.</span>
                <span>Click on your grade level from the cards above</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">2.</span>
                <span>Browse available reviewers by subject</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">3.</span>
                <span>Click on a reviewer to view or download it</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">4.</span>
                <span>Use the search and filter features to find specific topics</span>
              </li>
            </ul>
          </div>

          {/* Admin Note */}
          <div className="text-center text-sm text-gray-500">
            <p>
              Are you an administrator?{" "}
              <Link href="/login" className="text-purple-600 hover:text-purple-800 font-semibold">
                Login here
              </Link>
              {" "}to upload new reviewers.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
