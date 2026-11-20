"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, signOut } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, pathname, router]);

  const logout = async () => {
    await signOut();
    router.replace("/login");
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Chargement...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{ width: 220, background: "#111", color: "#fff", padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
        <h2>Ma Boutique</h2>
        <Link href="/dashboard">Aujourd'hui</Link>
        <Link href="/products">Produits</Link>
        <Link href="/categories">Catégories</Link>
        <Link href="/suppliers">Fournisseurs</Link>
        <Link href="/movements">Mouvements</Link>
        <Link href="/utilisateurs">Utilisateurs</Link>
        <Link href="/entrepots">Entrepôts</Link>
        <button
          type="button"
          onClick={logout}
          style={{ marginTop: "auto", background: "#374151", color: "#fff", padding: "8px 12px", borderRadius: 8 }}
        >
          Se déconnecter
        </button>
      </div>
      <div style={{ flex: 1, background: "#f5f5f5" }}>{children}</div>
    </div>
  );
}
