import { createClient } from "@/utils/supabase/server";
import { normalizeWeightUnit, type WeightUnit } from "@/lib/units";

export type Viewer = {
  id: string;
  name: string;
  email: string;
  initials: string;
  experienceLevel: string;
  currentWeightKg: number | null;
  units: WeightUnit;
};

export async function getViewer(): Promise<Viewer | null> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || !userId) return null;

  const email =
    typeof data.claims.email === "string" ? data.claims.email : "";
  const metadata =
    typeof data.claims.user_metadata === "object" &&
    data.claims.user_metadata !== null
      ? (data.claims.user_metadata as Record<string, unknown>)
      : {};

  const [{ data: profile }, { data: preferences }] = await Promise.all([
    supabase
      .from("profiles")
      .select("name,email,experience_level,current_weight_kg")
      .eq("id", userId)
      .maybeSingle(),
    supabase
      .from("user_preferences")
      .select("units")
      .eq("user_id", userId)
      .maybeSingle(),
  ]);

  const fallbackName =
    typeof metadata.name === "string" ? metadata.name : email.split("@")[0];
  const name: string = String(profile?.name || fallbackName || "Athlete");
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return {
    id: userId,
    name,
    email: profile?.email || email,
    initials: initials || "RF",
    experienceLevel: profile?.experience_level || "Not set",
    currentWeightKg:
      profile?.current_weight_kg === null ||
      profile?.current_weight_kg === undefined
        ? null
        : Number(profile.current_weight_kg),
    units: normalizeWeightUnit(preferences?.units),
  };
}
