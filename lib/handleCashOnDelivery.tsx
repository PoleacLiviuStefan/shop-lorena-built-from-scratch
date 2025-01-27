export const handleCashOnDelivery = async () => {
    try {
        const orderNumber = crypto.randomUUID();
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders/cash-on-delivery`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                orderNumber,
                customerName: user?.fullName ?? "Unknown",
                customerEmail: user?.emailAddresses[0]?.emailAddress ?? "Unknown",
                clerkUserId: user!.id,
                products: storeData.groupedItems.map((item) => ({
                    productId: item.product._id,
                    quantity: item.quantity,
                })),
                totalPrice: storeData.groupedItems.reduce(
                    (total, item) =>
                        total + (item.product.price ?? 0) * item.quantity,
                    0
                ),
                currency: "RON",
            }),
        });

        if (!response.ok) {
            throw new Error("Error processing cash-on-delivery order.");
        }

        const data = await response.json();
        console.log("Order created:", data);
        router.push(`/success?orderNumber=${orderNumber}`);
    } catch (error) {
        console.error("Error handling cash-on-delivery:", error);
    }
};
