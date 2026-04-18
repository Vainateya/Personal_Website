import { Nav } from "@/components/public/Nav";

export default async function PublicLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ivory">
      <Nav />
      {children}
    </div>
  );
}
