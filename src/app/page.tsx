import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_NAME, verifyToken } from "@/lib/auth";

export default function Home() {
  const token = cookies().get(AUTH_COOKIE_NAME)?.value;
  if (token && verifyToken(token)) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <span className="stamp border-gold text-gold">Est. today</span>
      <h1 className="mt-6 max-w-xl font-display text-5xl font-medium leading-[1.1] text-ivory sm:text-6xl">
        A quiet ledger for every book you mean to read.
      </h1>
      <p className="mt-5 max-w-md font-body text-parchment/70">
        Log what you&apos;re reading, stamp it when it&apos;s done, and keep
        your shelf exactly as tidy as you like.
      </p>
      <div className="mt-10 flex gap-4">
        <Link href="/signup" className="btn-primary">
          Start your shelf
        </Link>
        <Link href="/login" className="btn-ghost">
          I already have one
        </Link>
      </div>
    </main>
  );
}
