import { cn } from "@/lib/utils";

type SectionLabelProps = {
  children: React.ReactNode;
  className?: string;
};

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <p
      className={cn(
        "font-sans text-[10px] uppercase tracking-label text-stone",
        className
      )}
    >
      {children}
    </p>
  );
}
