// import { COUPON_CODES } from '@/sanity/lib/sales/couponCodes'
// import { getActiveSaleByCouponCode } from '@/sanity/lib/sales/getActiveSaleByCouponCode'
// import Echipa from "../public/stiliste/echipa.png"
import React from 'react'
// import Hero from './Hero'

const BlackFridayBanner = async () => {
    // const sale = await getActiveSaleByCouponCode(COUPON_CODES.BFRIDAY)

    // if (!sale?.isActive) {
    //     return null;
    // }
  return (
    // <Hero image={Echipa} />
    <div className='bg-gradient-to-r from-red-600 to-black text-white px-6 py-10 mx-4 mt-2 rounded-lg shadow-lg'>
        Black Friday Banner
    </div>
  )
}

export default BlackFridayBanner