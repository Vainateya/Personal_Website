import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="max-w-content space-y-4 border border-border p-6">
        <p className="font-sans text-[10px] uppercase tracking-label text-stone">
          Not Found
        </p>
        <h1 className="font-serif text-[32px] font-normal tracking-editorial text-ink">
          This page does not exist.
        </h1>
        <Link href="/">Return home</Link>
      </div>
    </main>
  );
}
