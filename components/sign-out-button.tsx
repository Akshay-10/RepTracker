"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function SignOutButton({ iconOnly = false }: { iconOnly?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const signOut = async () => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      setLoading(false);
      return;
    }
    router.push("/");
    router.refresh();
  };

  return (
    <button
      className={iconOnly ? "icon-button" : "sign-out-button"}
      onClick={signOut}
      disabled={loading}
      aria-label="Log out"
    >
      <LogOut size={17} />
      {!iconOnly && (loading ? "Signing out…" : "Log out")}
    </button>
  );
}
