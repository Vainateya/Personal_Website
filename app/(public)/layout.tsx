import { Nav } from "@/components/public/Nav";
import { getAllPages } from "@/lib/pages";

export default async function PublicLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pages = await getAllPages();
  return (
    <div className="min-h-screen bg-ivory">
      <Nav pages={pages} />
      {children}
    </div>
  );
}
