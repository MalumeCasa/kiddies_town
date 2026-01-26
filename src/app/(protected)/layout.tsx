// app/(protected)/layout.tsx (create this file)
import { requireAuth } from "@api/actions";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireAuth();
    return <>{children}</>;
  } catch {
    redirect("/login");
  }
}