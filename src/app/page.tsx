import { caller } from "@/trpc/server";
import { requireAuth } from "@/lib/auth-utils";

export default async function Home() {
  await requireAuth();

  const data = await caller.getUsers();

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
      Protected Server Component {JSON.stringify(data)}
    </div>
  );
}
