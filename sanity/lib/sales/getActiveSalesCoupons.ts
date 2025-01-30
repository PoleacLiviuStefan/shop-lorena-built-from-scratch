import { backendClient } from "../backendClient";

interface SaleCoupon {
    couponCode: string;
    discountAmount: number;
}

export async function getActiveSalesCoupons() {
    const query = `*[_type == "sales" && 
        isActive == true && 
        (validForm == null || dateTime(validForm) <= dateTime(now())) &&
        (validUntil == null || dateTime(validUntil) >= dateTime(now()))] {
        couponCode,
        discountAmount
    }`;

    const sales = await backendClient.fetch(query);
    return sales.reduce((acc: { [key: string]: number }, sale: SaleCoupon) => {
        if (sale.couponCode && sale.discountAmount) {
            acc[sale.couponCode] = sale.discountAmount;
        }
        return acc;
    }, {});
}