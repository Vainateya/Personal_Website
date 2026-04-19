import Link from "next/link";
import { pageLabels, pagePaths, type PageName } from "@/types/blocks";
import { cn } from "@/lib/utils";

const orderedPages: PageName[] = ["home", "writing", "talks", "now", "connect"];

type NavProps = {
  currentPage?: PageName;
  showAdminLink?: boolean;
};

export function Nav({ currentPage, showAdminLink = false }: NavProps) {
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
          {orderedPages.map((page) => (
            <Link
              key={page}
              href={pagePaths[page]}
              className={cn(
                "font-sans text-[10px] uppercase tracking-label text-warm-grey hover:no-underline",
                currentPage === page
                  ? "border-b border-prussian pb-px text-prussian"
                  : "hover:text-prussian"
              )}
            >
              {pageLabels[page] === "Home" ? "Work" : pageLabels[page]}
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
          {showAdminLink ? (
            <Link
              href="/admin"
              className="font-sans text-[10px] uppercase tracking-label text-warm-grey"
            >
              Admin
            </Link>
          ) : null}
        </nav>
      </div>
      <div className="border-t border-border px-5 py-2 md:hidden">
        <nav className="flex flex-wrap gap-x-4 gap-y-1">
          {orderedPages.map((page) => (
            <Link
              key={page}
              href={pagePaths[page]}
              className={cn(
                "font-sans text-[10px] uppercase tracking-label text-warm-grey hover:no-underline",
                currentPage === page && "text-prussian"
              )}
            >
              {pageLabels[page] === "Home" ? "Work" : pageLabels[page]}
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
