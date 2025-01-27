import { backendClient } from "@/sanity/lib/backendClient";

export async function updateProductStock(products: any[]) {
    try {
        const transactions = products.map(async (orderItem) => {
            const currentProduct = await backendClient.getDocument(orderItem.product._id);
            
            if (!currentProduct) {
                throw new Error(`Product ${orderItem.product._id} not found`);
            }
            console.log("orderItem este:",orderItem)
            if (orderItem.variant) {
                const variantIndex = currentProduct.variants.findIndex((variant: any) => 
                    variant.curbura === orderItem.variant.curbura &&
                    variant.grosime === orderItem.variant.grosime &&
                    variant.marime === orderItem.variant.marime
                );
 
                if (variantIndex === -1) {
                    throw new Error(`Variant not found for ${orderItem.product.name}`);
                }
 
                const variant = currentProduct.variants[variantIndex];
                if (variant.stock < orderItem.quantity) {
                    throw new Error(`Insufficient stock for ${orderItem.product.name}`);
                }
 
                currentProduct.variants[variantIndex].stock -= orderItem.quantity;
 
                return backendClient
                    .patch(orderItem.product._id)
                    .set({ variants: currentProduct.variants })
                    .commit();
            } else {
                throw new Error(`Product ${orderItem.product.name} requires variant selection`);
            }
        });
 
        await Promise.all(transactions);
        return { success: true };
    } catch (error) {
        console.error('Stock update error:', error);
        return { success: false, error };
    }
 }