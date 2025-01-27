import OrdersClient from "@/components/OrdersClient";
import { getMyOrders } from "../../../sanity/lib/getMyOrders/getMyOders";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


const Page = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const orders = await getMyOrders(userId);

  return <OrdersClient orders={orders} />;
};

export default Page;
