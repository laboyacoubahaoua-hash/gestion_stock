"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { user, isLoading, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) router.replace("/dashboard");
  }, [isLoading, user, router]);

  const handleLogin = async () => {
    setError(null);
    if (!email.trim()) {
      setError("Veuillez saisir votre email.");
      return;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setSubmitting(true);
    const { error: signInError } = await signIn(email.trim(), password);
    setSubmitting(false);

    if (signInError) {
      setError(signInError.message || "Email ou mot de passe incorrect.");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(to bottom right, #dbeafe, #ffffff)", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 420, background: "white", borderRadius: 16, padding: 32, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 56, height: 56, background: "#dbeafe", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", fontSize: 28 }}>📦</div>
          <h1 style={{ fontSize: 24, fontWeight: "bold", marginTop: 12 }}>Connexion</h1>
          <p style={{ color: "#666", fontSize: 14 }}>Accédez à votre système de gestion de stock</p>
        </div>

        <div style={{ marginTop: 20 }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #ddd", marginTop: 4, background: "#eff6ff" }}
          />
        </div>
        <div style={{ marginTop: 12 }}>
          <label>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #ddd", marginTop: 4, background: "#eff6ff" }}
          />
        </div>

        {error && <p style={{ marginTop: 12, color: "#dc2626", fontSize: 14 }}>{error}</p>}

        <button
          onClick={handleLogin}
          disabled={submitting}
          style={{ width: "100%", background: "#1e293b", color: "white", padding: 12, borderRadius: 8, marginTop: 20, fontWeight: "bold", opacity: submitting ? 0.7 : 1 }}
        >
          {submitting ? "Connexion..." : "Se connecter"}
        </button>
        <button
          type="button"
          onClick={() => { setEmail(""); setPassword(""); setError(null); }}
          style={{ width: "100%", background: "#e5e7eb", color: "#111827", padding: 12, borderRadius: 8, marginTop: 12, fontWeight: "bold" }}
        >
          Annuler
        </button>

        <p style={{ textAlign: "center", marginTop: 12, fontSize: 14 }}>
          <a href="/mot%20de%20pass" style={{ color: "#2563eb" }}>Mot de passe oublié ?</a>
        </p>
        <p style={{ textAlign: "center", marginTop: 12, fontSize: 14, color: "#666" }}>
          Pas de compte ? <a href="/register" style={{ color: "#2563eb" }}>S&apos;inscrire</a>
        </p>
      </div>
    </div>
  );
} 