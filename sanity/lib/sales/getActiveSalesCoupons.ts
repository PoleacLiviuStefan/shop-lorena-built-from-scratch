// lib/getSalesCoupons.ts
import { backendClient } from "../backendClient";

export async function getActiveSalesCoupons() {
    const query = `*[_type == "sales" && 
        isActive == true && 
        (validForm == null || dateTime(validForm) <= dateTime(now())) &&
        (validUntil == null || dateTime(validUntil) >= dateTime(now()))] {
        couponCode,
        discountAmount
    }`;

    const sales = await backendClient.fetch(query);
    return sales.reduce((acc: { [key: string]: number }, sale: any) => {
        if (sale.couponCode && sale.discountAmount) {
            acc[sale.couponCode] = sale.discountAmount;
        }
        return acc;
    }, {});
}