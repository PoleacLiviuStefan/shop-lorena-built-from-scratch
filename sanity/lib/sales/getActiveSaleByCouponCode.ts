import { defineQuery } from "next-sanity"
import { CouponCode } from "./couponCodes"
import { sanityFetch } from "../live";

export const getActiveSaleByCouponCode = async (couponCode: CouponCode) => {
    const ACTIVE_SALE_BY_COUPON_CODE_QUERY = defineQuery(`*[
        _type == "sales" 
        && isActive == true
        && couponCode == $couponCode
        && dateTime(now()) >= dateTime(validForm)
        && dateTime(now()) <= dateTime(validUntil)
    ] | order(validForm desc)[0]`);
      
    try {
        const activeSale = await sanityFetch({
            query: ACTIVE_SALE_BY_COUPON_CODE_QUERY,
            params: { couponCode }
        });

        return activeSale || null;
    } catch (error) {
        console.error("Error fetching sale:", error);
        return null;
    }
}