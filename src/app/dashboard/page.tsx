import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_NAME, verifyToken } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/User";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const token = cookies().get(AUTH_COOKIE_NAME)?.value;
  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    redirect("/login");
  }

  await connectToDatabase();
  const dbUser = await User.findById(payload!.userId);

  if (!dbUser) {
    redirect("/login");
  }

  const user = {
    id: dbUser!._id.toString(),
    name: dbUser!.name,
    email: dbUser!.email,
  };

  return <DashboardClient user={user} />;
}
