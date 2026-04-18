import { redirect } from "next/navigation";
import { getOptionalSession } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export default async function LoginPage() {
  const { session } = await getOptionalSession();

  if (session) {
    redirect("/admin");
  }

  return <LoginForm />;
}
