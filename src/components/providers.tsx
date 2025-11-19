"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    try {
      const forced = localStorage.getItem("settings.forceLowPower");

      // Auto detection heuristics
      const nav: any = navigator as any;
      const saveData = nav?.connection?.saveData === true;
      const lowThreads = typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4;
      const lowMemory = typeof (nav?.deviceMemory) === "number" && nav.deviceMemory <= 4;
      const auto = saveData || lowThreads || lowMemory;

      if (forced === "true" || (forced === null && auto)) {
        document.documentElement.setAttribute("data-low-power", "true");
      } else if (forced === "false") {
        document.documentElement.removeAttribute("data-low-power");
      } else {
        document.documentElement.removeAttribute("data-low-power");
      }
    } catch {}
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}
