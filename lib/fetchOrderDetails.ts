export async function fetchOrderDetails(orderNumber: string) {
    try {
      const response = await fetch(`/orders/${orderNumber}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch order details: ${response.statusText}`);
      }
  
      const data = await response.json();
  
      // Structură exemplu a datelor
      const orderDetails = {
        orderNumber: data.orderNumber,
        customerName: data.customerName,
        customerEmail: data.email,
        address: data.address, // {street, city, province, postalCode}
        products: data.products, // [{product: {name, price}, quantity}]
        totalPrice: data.totalPrice,
        shippingCost: data.shippingCost || 0,
        paymentType: data.paymentType, // Ex: "card" sau "cash"
        status: data.status, // Ex: "pending", "completed"
        orderDate: data.orderDate, // Data completă
      };
  
      return orderDetails;
    } catch (error) {
      console.error("Error fetching order details:", error);
      throw error; // Poți trata eroarea în componentă
    }
  }
  