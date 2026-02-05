"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";

export default function Home() {
  const router = useRouter();
  const setupComplete = useStore((s) => s.setupComplete);

  useEffect(() => {
    if (setupComplete) {
      router.replace("/dashboard");
    } else {
      router.replace("/setup");
    }
  }, [setupComplete, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="flex flex-col items-center gap-3 animate-fade-in">
        <div className="w-10 h-10 rounded-xl bg-ink flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-surface">
            <path d="M3 8L12 3L21 8V16L12 21L3 16V8Z" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <p className="text-[14px] text-ink-muted">Loading...</p>
      </div>
    </div>
  );
}
