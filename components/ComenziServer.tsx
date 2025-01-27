import { getMyOrders } from "@/sanity/lib/getMyOrders";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ComenziServer({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const orders = await getMyOrders(userId);

  return <>{children(orders)}</>;
}
