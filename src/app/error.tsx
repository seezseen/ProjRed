"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <div className="text-center space-y-6">
        <AlertCircle className="h-24 w-24 mx-auto text-destructive" />
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Something went wrong!</h2>
          <p className="text-muted-foreground max-w-md">
            An unexpected error occurred. Please try again.
          </p>
        </div>
        <Button onClick={reset} size="lg">
          Try again
        </Button>
      </div>
    </div>
  );
}
