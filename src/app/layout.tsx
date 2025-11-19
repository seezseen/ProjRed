import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/components/providers";
import { BroadcastManager } from "@/components/broadcast-manager";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Project Red - Reviewer Library",
  description: "A modern reviewer library for JHS students (Grades 7-10).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <BroadcastManager />
            <div className="ambient-bg" aria-hidden="true" />
            {children}
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
