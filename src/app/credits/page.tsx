"use client";

import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Code, Users, Sparkles, Github, Globe } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CreditsPage() {
  const contributors = [
    {
      name: "Project Team",
      role: "Development & Design",
      description: "Buuld by students for students.",
      icon: Users,
    },
    {
      name: "Reviewers Kitchen",
      role: "Inspiration",
      description: "Original inspiration for this project",
      icon: Sparkles,
    },
    {
      name: "Student Contributors",
      role: "Content Creators",
      description: "All the amazing students who share their reviewers",
      icon: Heart,
    },
  ];

  const technologies = [
    { name: "Next.js 16", category: "Framework" },
    { name: "React 19", category: "UI Library" },
    { name: "TypeScript", category: "Language" },
    { name: "Tailwind CSS", category: "Styling" },
    { name: "NextAuth.js", category: "Authentication" },
    { name: "MongoDB", category: "Database" },
    { name: "Vercel", category: "Hosting" },
    { name: "Radix UI", category: "Components" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <div className="container mx-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-slideInUp">
              Credits & Acknowledgments
            </h1>
          </div>

          {/* Project Info */}
          <Card className="animate-scaleIn border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Heart className="h-6 w-6 text-red-500" />
                About Project Red
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Reviewer's Menu is a project made by students for students to 
                access student made reviewers! This way, all reviewers can be 
                accessed in one website!
              </p>
              <div className="flex flex-wrap gap-2 pt-4">
                <Badge variant="secondary" className="px-3 py-1">
                  <Globe className="h-3 w-3 mr-1" />
                  Open Access
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  <Users className="h-3 w-3 mr-1" />
                  Student-Made
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  <Code className="h-3 w-3 mr-1" />
                  Open Source
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Contributors */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100 animate-fadeIn">
              Contributors & Acknowledgments
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {contributors.map((contributor, index) => (
                <Card 
                  key={contributor.name} 
                  className="animate-scaleIn hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <contributor.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{contributor.name}</CardTitle>
                        <Badge variant="outline" className="mt-1">{contributor.role}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {contributor.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Technologies Used */}
          <Card className="animate-scaleIn" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Built With
              </CardTitle>
              <CardDescription>Technologies and tools that power this platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <Badge 
                    key={tech.name} 
                    variant="secondary"
                    className="px-3 py-1.5 hover:scale-105 transition-transform"
                  >
                    {tech.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Special Thanks */}
          <Card className="animate-scaleIn border-2 border-pink-200 dark:border-pink-900" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-pink-600 dark:text-pink-400">
                <Sparkles className="h-5 w-5" />
                Special Thanks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-600 dark:text-gray-400">
                A huge thank you to <span className="font-semibold">Reviewers Kitchen</span> for inspiring this project 
                and showing us the impact of sharing educational resources.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Thank you to all the students who contribute their reviewers and help make education more accessible to everyone.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                And thank you to <span className="font-semibold">you</span> for using this platform and being part of our community! 💜
              </p>
            </CardContent>
          </Card>

          {/* Footer CTA */}
          <div className="text-center py-8 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Want to contribute or report an issue?
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild variant="outline">
                <Link href="/">
                  <Globe className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              <Button asChild>
                <Link href="https://discord.gg/2rPCnZwcbM">
                  <Users className="mr-2 h-4 w-4" />
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
