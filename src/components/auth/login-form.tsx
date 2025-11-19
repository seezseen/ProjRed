"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { toast } from "@/components/ui/use-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Home } from "lucide-react";

const formSchema = z.object({
  emailOrUsername: z.string().min(1, "Email or username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function LoginForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await signIn("credentials", {
      redirect: false,
      emailOrUsername: values.emailOrUsername,
      password: values.password,
    });

    if (result?.error) {
      toast({
        title: "Error",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } else {
      router.push("/");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-sm space-y-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors animate-fadeIn"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
        <Card className="w-full animate-scaleIn shadow-2xl border-2 hover:shadow-3xl transition-shadow duration-300">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Login
            </CardTitle>
            <CardDescription className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
              Enter your credentials to access your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                <Label htmlFor="emailOrUsername">Email or Username</Label>
                <Input
                  id="emailOrUsername"
                  type="text"
                  placeholder="admin or admin@example.com"
                  className="transition-all duration-300 focus:scale-[1.02] focus:shadow-md"
                  {...form.register("emailOrUsername")}
                />
              </div>
              <div className="space-y-2 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  className="transition-all duration-300 focus:scale-[1.02] focus:shadow-md"
                  {...form.register("password")} 
                />
              </div>
              <Button 
                type="submit" 
                className="w-full animate-fadeIn transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95" 
                style={{ animationDelay: '0.4s' }}
              >
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
