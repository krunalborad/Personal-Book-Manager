"use client";

import { useRouter } from "next/navigation";
import type { User } from "@/types";

export default function Navbar({ user }: { user: User | null }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between border-b border-parchment/10 px-6 py-5 sm:px-10">
      <div className="flex items-baseline gap-3">
        <span className="font-display text-2xl font-medium text-ivory">
          Ledger
        </span>
        <span className="hidden font-mono text-xs uppercase tracking-[0.2em] text-parchment/40 sm:inline">
          Personal Book Manager
        </span>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <span className="font-body text-sm text-parchment/60">
            {user.name}
          </span>
        )}
        <button onClick={handleLogout} className="btn-ghost !px-4 !py-2 text-xs">
          Sign out
        </button>
      </div>
    </header>
  );
}
