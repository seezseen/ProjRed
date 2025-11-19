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
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 gradient-animated">
      <Header />
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex flex-col gap-8">
          {/* Hero Section */}
          <div className="text-center py-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-slideInUp">
              Reviewer Library
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-2 animate-fadeIn" style={{ animationDelay: '0.2s', opacity: 0 }}>
              Access reviewers made by you the students!
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 animate-fadeIn" style={{ animationDelay: '0.3s', opacity: 0 }}>
              This project was inspired from Reviewers Kitchen!
            </p>
          </div>

          {/* Grade Level Cards */}
          <div className="max-w-5xl mx-auto w-full">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100 animate-fadeIn" style={{ animationDelay: '0.4s', opacity: 0 }}>
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
                  <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${grade.color} p-8 shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:-translate-y-2 hover:rotate-1 gradient-sheen`}>
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

          {/* Pointers Card */}
          <div className="max-w-5xl mx-auto w-full">
            <Link href="/pointers" className="block group">
              <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border p-6 shadow-lg transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl glass-panel">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center text-2xl">📌</div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Pointers</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Pointers given my your teachers!.</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Information Section */}
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg glass-panel">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              📚 About the Library
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Welcome to the Reviewer Library! This website is a collection of reviewers made by students so that all students can use YOUR reviewer!
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Reviewers that are uploaded here are accessble to all students! And of course we will credit the author of the reviewer as well as the person who submitted it.
            </p>
          </div>

          {/* Additional Info */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg glass-panel">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                ℹ️ How to Use
              </h2>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg glass-panel">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                ℹ️ How can I upload my reviewer?
              </h2>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="font-bold mr-2">1.</span>
                  <span>Prepare your reviewer into a Word or PDF document.</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">2.</span>
                  <span>Message one of our admins or join this discord server and follow instructions there.</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">3.</span>
                  <span>Wait for our admins to upload it to the website.</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">4.</span>
                  <span>Thats it your done!</span>
                </li>
              </ul>
              <p className="mt-4 text-gray-600 dark:text-gray-300">If you want to report a reviewer for any reason, please contact our admins.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
