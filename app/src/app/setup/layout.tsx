"use client";

import { AppShell } from "@/components/layout/AppShell";
import { useStore } from "@/store/useStore";

export default function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const setupComplete = useStore((s) => s.setupComplete);

  if (!setupComplete) {
    return <>{children}</>;
  }

  return <AppShell>{children}</AppShell>;
}
