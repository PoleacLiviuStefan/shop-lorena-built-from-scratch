
import { backendClient } from "@/sanity/lib/backendClient";

// 1) Define an interface for each order line item
interface OrderItem {
    product: {
      _id: string;
      name: string;
      // ... anything else you need from the product
    };
    variant?: {
      curbura: string;
      grosime: string;
      marime: string;
      price: number;
      stock: number;
    };
    quantity: number;
  }

  interface Variant {
    curbura: string;
    grosime: string;
    marime: string;
    price: number;
    stock: number;
    // any other fields you expect
  }
  
  
  // 2) Use that in your function signature:
  export async function updateProductStock(orderItems: OrderItem[]) {
    try {
      const transactions = orderItems.map(async (item) => {
        const currentProduct = await backendClient.getDocument(item.product._id);
  
        if (!currentProduct) {
          throw new Error(`Product ${item.product._id} not found`);
        }
        console.log("item is:", item);
  
        if (!item.variant) {
          throw new Error(
            `Product ${item.product.name} requires variant selection`
          );
        }
  
        const variantIndex = currentProduct.variants.findIndex(
          (variant: Variant) =>
            variant.curbura === item.variant!.curbura &&
            variant.grosime === item.variant!.grosime &&
            variant.marime === item.variant!.marime
        );
  
        if (variantIndex === -1) {
          throw new Error(`Variant not found for ${item.product.name}`);
        }
  
        const variant = currentProduct.variants[variantIndex];
        if (variant.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${item.product.name}`);
        }
  
        currentProduct.variants[variantIndex].stock -= item.quantity;
  
        // Patch the product in Sanity
        return backendClient
          .patch(item.product._id)
          .set({ variants: currentProduct.variants })
          .commit();
      });
  
      await Promise.all(transactions);
      return { success: true };
    } catch (error) {
      console.error("Stock update error:", error);
      return { success: false, error };
    }
  }
  