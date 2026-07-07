"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function AuthNav({
  initialAuthenticated,
  compact = false,
}: {
  initialAuthenticated: boolean;
  compact?: boolean;
}) {
  const router = useRouter();
  const [signedOut, setSignedOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const authenticated = initialAuthenticated && !signedOut;

  const signOut = async () => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      setLoading(false);
      return;
    }
    setSignedOut(true);
    router.push("/");
    router.refresh();
  };

  if (!authenticated) {
    return <Link href="/login">Sign in</Link>;
  }

  return (
    <span className={`auth-nav ${compact ? "compact" : ""}`}>
      <Link href="/dashboard">Dashboard</Link>
      <button onClick={signOut} disabled={loading}>
        <LogOut size={14} />
        {loading ? "Signing out…" : "Log out"}
      </button>
    </span>
  );
}
