"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AuthFormProps {
  mode: "login" | "signup";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isSignup ? { name, email, password } : { email, password }
        ),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="stamp border-gold text-gold">
            {isSignup ? "New member" : "Welcome back"}
          </span>
          <h1 className="mt-4 font-display text-3xl font-medium text-ivory">
            {isSignup ? "Open your shelf" : "Sign in to your shelf"}
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-md border border-parchment/15 bg-ink-light/60 p-6 shadow-card"
        >
          {isSignup && (
            <div className="mb-4">
              <label htmlFor="name" className="field-label">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="field-input"
                placeholder="Jane Reader"
                autoComplete="name"
              />
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="field-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field-input"
              placeholder="[email protected]"
              autoComplete="email"
            />
          </div>

          <div className="mb-2">
            <label htmlFor="password" className="field-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field-input"
              placeholder="At least 8 characters"
              autoComplete={isSignup ? "new-password" : "current-password"}
            />
          </div>

          {error && (
            <p role="alert" className="mt-3 font-body text-sm text-brick-light">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-6 w-full"
          >
            {loading
              ? "One moment..."
              : isSignup
              ? "Create account"
              : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center font-body text-sm text-parchment/60">
          {isSignup ? "Already have a shelf?" : "New here?"}{" "}
          <Link
            href={isSignup ? "/login" : "/signup"}
            className="text-gold underline underline-offset-4 hover:text-gold-light"
          >
            {isSignup ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </div>
    </main>
  );
}
