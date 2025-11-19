"use client";

import { useEffect, useState } from "react";
import { Broadcast } from "@/app/types/broadcast";
import { X, Info, AlertTriangle, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";

interface BroadcastBannerProps {
  broadcast: Broadcast;
  onDismiss: (id: string) => void;
}

export function BroadcastBanner({ broadcast, onDismiss }: BroadcastBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Slide in animation
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(broadcast._id), 300);
  };

  const getColors = () => {
    switch (broadcast.type) {
      case "info":
        return "bg-blue-500 dark:bg-blue-600";
      case "warning":
        return "bg-yellow-500 dark:bg-yellow-600";
      case "urgent":
        return "bg-red-500 dark:bg-red-600";
    }
  };

  const getIcon = () => {
    switch (broadcast.type) {
      case "info":
        return <Info className="h-5 w-5" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5" />;
      case "urgent":
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  return (
    <div
      className={`fixed top-16 left-0 right-0 z-40 transform transition-all duration-500 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className={`${getColors()} text-white shadow-lg`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="flex-shrink-0">{getIcon()}</div>
              <div className="flex-1">
                <p className="font-semibold">{broadcast.title}</p>
                <p className="text-sm opacity-90">{broadcast.message}</p>
              </div>
            </div>
            {broadcast.dismissible && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="hover:bg-white/20 text-white flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
