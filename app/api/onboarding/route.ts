import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  return new Response("Onboarding complete");
}
