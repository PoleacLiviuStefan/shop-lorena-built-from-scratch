import { defineQuery} from "next-sanity";
import { sanityFetch } from "../live";

export async function getMyOrders(userId: string) {
  if(!userId){
    return new Error("No user id provided");
  }

  const My_ORDERS_QUERY = defineQuery(`
    *[_type == "order" && clerkUserId == $userId] | order(_createdAt desc){
    ...,
    products[]{
      ...,
      product->
    }
  }
`);

  try{
    const orders = await sanityFetch({
      query: My_ORDERS_QUERY,
      params: {userId}
    });
    console.log("comenzile sunt:",orders)
    return orders.data || [];
  } catch(error) {
    console.log("Error fetching my orders: ", error);
    throw new Error("Error fetching orders");
  }

}