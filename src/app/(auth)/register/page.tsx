"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const router = useRouter();
  const { user, isLoading, signUp } = useAuth();
   const [nom, setnom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) router.replace("/dashboard");
  }, [isLoading, user, router]);

  const handleRegister = async () => {
    setError(null);
    setMessage(null);
    if (!email.trim()) {
      setError("Veuillez saisir votre email.");
      return;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setSubmitting(true);
    const { error: signUpError } = await signUp(email.trim(), password);
    setSubmitting(false);

    if (signUpError) {
      setError(signUpError.message || "Impossible de créer le compte.");
      return;
    }

    setMessage("Compte créé. Vérifiez votre email si la confirmation est activée, puis connectez-vous.");
    setTimeout(() => router.push("/login"), 1200);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(to bottom right, #dbeafe, #ffffff)", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 420, background: "white", borderRadius: 16, padding: 32, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 56, height: 56, background: "#dbeafe", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", fontSize: 28 }}>📦</div>
          <h1 style={{ fontSize: 24, fontWeight: "bold", marginTop: 12 }}>Créer un compte</h1>
          <p style={{ color: "#666", fontSize: 14 }}>Créez votre compte pour gérer votre stock</p>
        </div>

<div style={{ marginTop: 20 }}>
          <label>Nom complet</label>
          <input
            type="texte"
            value={nom}
            onChange={(e) => setnom(e.target.value)}
            placeholder="Votre nom"
            style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #ddd", marginTop: 4, background: "#eff6ff" }}
          />
        </div>
        <div style={{ marginTop: 20 }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.com"
            style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #ddd", marginTop: 4, background: "#eff6ff" }}
          />
        </div>
        <div style={{ marginTop: 12 }}>
          <label>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #ddd", marginTop: 4, background: "#eff6ff" }}
          />
        </div>

        {error && <p style={{ marginTop: 12, color: "#dc2626", fontSize: 14 }}>{error}</p>}
        {message && <p style={{ marginTop: 12, color: "#16a34a", fontSize: 14 }}>{message}</p>}

        <button
          onClick={handleRegister}
          disabled={submitting}
          style={{ width: "100%", background: "#1e293b", color: "white", padding: 12, borderRadius: 8, marginTop: 20, fontWeight: "bold", opacity: submitting ? 0.7 : 1 }}
        >
          {submitting ? "Création..." : "Créer le compte"}
        </button>

        <p style={{ textAlign: "center", marginTop: 12, fontSize: 14, color: "#666" }}>
          Déjà un compte ? <a href="/login" style={{ color: "#2563eb" }}>Se connecter</a>
        </p>
      </div>
    </div>
  );
}
