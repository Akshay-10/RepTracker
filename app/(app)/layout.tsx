import { AppShell } from "@/components/app-shell";
import { getViewer } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");

  return <AppShell viewer={viewer}>{children}</AppShell>;
}
