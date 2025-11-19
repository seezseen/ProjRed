"use client";

import { useEffect, useState } from "react";
import { Broadcast } from "@/app/types/broadcast";
import { X, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface BroadcastPopupProps {
  broadcast: Broadcast;
  onDismiss: (id: string) => void;
}

export function BroadcastPopup({ broadcast, onDismiss }: BroadcastPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Scale in animation
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(broadcast._id), 300);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={broadcast.dismissible ? handleDismiss : undefined}
      />

      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <Card
          className={`max-w-md w-full pointer-events-auto border-2 border-red-500 shadow-2xl transform transition-all duration-300 ${
            isVisible ? "scale-100 opacity-100" : "scale-90 opacity-0"
          }`}
        >
          <CardHeader className="bg-red-500 text-white rounded-t-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="animate-pulse">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{broadcast.title}</CardTitle>
              </div>
              {broadcast.dismissible && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="hover:bg-white/20 text-white -mt-1 -mr-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {broadcast.message}
            </p>
            {broadcast.dismissible && (
              <Button
                onClick={handleDismiss}
                className="w-full mt-6 bg-red-500 hover:bg-red-600"
              >
                Got it
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
