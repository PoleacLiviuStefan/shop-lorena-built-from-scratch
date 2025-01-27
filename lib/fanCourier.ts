export default async function getCustomShippingCost(shippingAddress: { shipping_address: { city: string; province: string } }) {
  if (!shippingAddress.shipping_address?.city || !shippingAddress.shipping_address?.province) {
    throw new Error("Shipping address is incomplete.");
  }

  const apiUrl = `${
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"
  }/fanCourier/tariff`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tariffDetails: {
          "recipient[locality]": shippingAddress.shipping_address.city,
          "recipient[county]": shippingAddress.shipping_address.province,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response text:", errorText);
      throw new Error(`Failed to fetch shipping cost: ${response.statusText}`);
    }

    const textResponse = await response.text();
    if (!textResponse) {
      throw new Error("Empty response from shipping API.");
    }

    const data = JSON.parse(textResponse);
    console.log("Parsed API Response:", data);

    if (!data.tariff || typeof data.tariff.total !== "number") {
      throw new Error("Invalid response from shipping API.");
    }

    return data.tariff.total;
  } catch (error) {
    console.error("Error fetching shipping cost:", error);
    throw new Error("Unable to calculate shipping cost.");
  }
}

export  async function generateAwb(shippingDetails: {
  cart: {
    id: string;
    shipping_address: {
      first_name: string;
      last_name: string;
      phone: string;
      email: string;
      province: string;
      city: string;
      address_1: string;
      address_2?: string;
      postal_code: string;
    };
  };
}) {
  if (
    !shippingDetails.cart?.shipping_address?.city ||
    !shippingDetails.cart?.shipping_address?.province
  ) {
    throw new Error("Shipping address is incomplete.");
  }

  const apiUrl = `${
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"
  }/fanCourier/awb`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart: shippingDetails.cart,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response text:", errorText);
      throw new Error(`Failed to generate AWB: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Parsed API Response:", data);

    if (data.status !== "success" || !data.awbNumber) {
      throw new Error(
        data.message || "Invalid response from AWB generation API."
      );
    }

    return data.awbNumber;
  } catch (error) {
    console.error("Error generating AWB:", error);
    throw new Error("Unable to generate AWB.");
  }
}
