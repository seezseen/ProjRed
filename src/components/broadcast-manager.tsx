"use client";

import { useEffect, useState } from "react";
import { Broadcast } from "@/app/types/broadcast";
import { BroadcastBanner } from "./broadcast-banner";
import { BroadcastPopup } from "./broadcast-popup";

export function BroadcastManager() {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [mutePopups, setMutePopups] = useState(false);
  const [hideBanner, setHideBanner] = useState(false);

  useEffect(() => {
    // Load user display preferences
    setMutePopups(localStorage.getItem("settings.mutePopups") === "true");
    setHideBanner(localStorage.getItem("settings.hideBanner") === "true");

    // Load dismissed broadcasts from localStorage
    const stored = localStorage.getItem("dismissedBroadcasts");
    if (stored) {
      try {
        setDismissedIds(JSON.parse(stored));
      } catch (e) {
        console.error("Error parsing dismissed broadcasts:", e);
      }
    }

    // Fetch active broadcasts
    fetchBroadcasts();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchBroadcasts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  async function fetchBroadcasts() {
    try {
      const response = await fetch("/api/broadcasts");
      const data = await response.json();
      setBroadcasts(data.broadcasts || []);
    } catch (error) {
      console.error("Error fetching broadcasts:", error);
    }
  }

  const handleDismiss = (id: string) => {
    const newDismissed = [...dismissedIds, id];
    setDismissedIds(newDismissed);
    localStorage.setItem("dismissedBroadcasts", JSON.stringify(newDismissed));
  };

  // Filter out dismissed broadcasts and separate by type
  const activeBroadcasts = broadcasts.filter((b) => !dismissedIds.includes(b._id));
  const urgentBroadcast = mutePopups ? undefined : activeBroadcasts.find((b) => b.type === "urgent");
  const bannerBroadcasts = hideBanner ? [] : activeBroadcasts.filter((b) => b.type !== "urgent");

  return (
    <>
      {/* Show urgent popup first (only one at a time) */}
      {urgentBroadcast && (
        <BroadcastPopup
          broadcast={urgentBroadcast}
          onDismiss={handleDismiss}
        />
      )}

      {/* Show banners (can stack, but typically show one) */}
      {!urgentBroadcast && bannerBroadcasts.slice(0, 1).map((broadcast) => (
        <BroadcastBanner
          key={broadcast._id}
          broadcast={broadcast}
          onDismiss={handleDismiss}
        />
      ))}
    </>
  );
}
