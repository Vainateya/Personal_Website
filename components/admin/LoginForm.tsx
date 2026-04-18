"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export function LoginForm() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[420px] space-y-5 border border-border bg-ivory p-6"
      >
        <div className="space-y-2 border-b border-border pb-5">
          <p className="font-sans text-[10px] uppercase tracking-label text-stone">
            Login
          </p>
          <h1 className="font-serif text-[34px] font-normal tracking-editorial text-ink">
            Admin editor
          </h1>
          <p className="text-ink/80">
            Sign in with your Supabase account to switch the site into editor mode.
          </p>
        </div>
        <label className="space-y-2">
          <span className="font-sans text-[10px] uppercase tracking-label text-stone">
            Email
          </span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label className="space-y-2">
          <span className="font-sans text-[10px] uppercase tracking-label text-stone">
            Password
          </span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {error ? <p className="font-sans text-[11px] text-[#8b3a2e]">{error}</p> : null}
        <button
          type="submit"
          className="w-full border-prussian bg-prussian px-4 py-3 font-sans text-[10px] uppercase tracking-label text-ivory"
          disabled={isLoading}
        >
          {isLoading ? "Signing in" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
