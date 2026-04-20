"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PageRecord } from "@/types/blocks";
import { cn } from "@/lib/utils";

type NavProps = {
  pages: PageRecord[];
};

export function Nav({ pages }: NavProps) {
  const pathname = usePathname();

  function isActive(slug: string) {
    if (slug === "home") return pathname === "/";
    return pathname === `/${slug}` || pathname.startsWith(`/${slug}/`);
  }

  function href(slug: string) {
    return slug === "home" ? "/" : `/${slug}`;
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-ivory">
      <div className="mx-auto flex max-w-[1100px] items-center justify-between px-5 py-4 md:px-8">
        <Link
          href="/"
          className="font-serif text-lg font-normal tracking-editorial text-ink hover:no-underline"
        >
          Vainateya Rangaraju
        </Link>
        <nav className="hidden items-center gap-5 md:flex">
          {pages.map((page) => (
            <Link
              key={page.id}
              href={href(page.slug)}
              className={cn(
                "font-sans text-[10px] uppercase tracking-label text-warm-grey hover:no-underline",
                isActive(page.slug)
                  ? "border-b border-prussian pb-px text-prussian"
                  : "hover:text-prussian"
              )}
            >
              {page.name}
            </Link>
          ))}
          <a
            href="/cv.pdf"
            target="_blank"
            rel="noreferrer"
            className="font-sans text-[10px] uppercase tracking-label text-warm-grey hover:text-prussian hover:no-underline"
          >
            CV
          </a>
        </nav>
      </div>
      {/* Mobile nav */}
      <div className="border-t border-border px-5 py-2 md:hidden">
        <nav className="flex flex-wrap gap-x-4 gap-y-1">
          {pages.map((page) => (
            <Link
              key={page.id}
              href={href(page.slug)}
              className={cn(
                "font-sans text-[10px] uppercase tracking-label text-warm-grey hover:no-underline",
                isActive(page.slug) && "text-prussian"
              )}
            >
              {page.name}
            </Link>
          ))}
          <a
            href="/cv.pdf"
            target="_blank"
            rel="noreferrer"
            className="font-sans text-[10px] uppercase tracking-label text-warm-grey"
          >
            CV
          </a>
        </nav>
      </div>
    </header>
  );
}
