'use client'
import React, { useEffect, useState } from "react";
import online from '../public/Imagini/cursuri/online.jpg';
import Image from "next/image";

const POPUP_VIEW_KEY = "popup_last_seen";
const POPUP_EXPIRATION_MINUTES = 30;

function shouldShowPopup(): boolean {
  const lastSeen = localStorage.getItem(POPUP_VIEW_KEY);
  if (!lastSeen) {
    return true;
  }

  const lastSeenDate = new Date(parseInt(lastSeen, 10));
  const now = new Date();
  const diffInMinutes = (now.getTime() - lastSeenDate.getTime()) / (1000 * 60);

  return diffInMinutes >= POPUP_EXPIRATION_MINUTES;
}

const PopupSales: React.FC = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    // Only run localStorage operations on the client side
    if (typeof window !== 'undefined' && shouldShowPopup()) {
      setIsPopupVisible(true);
      localStorage.setItem(POPUP_VIEW_KEY, Date.now().toString());
    }
  }, []);

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <>
      {isPopupVisible && (
        <div className="fixed bg-black bg-opacity-60 w-full h-full z-50 flex justify-center items-center">
          <div className="relative bg-[#FEC1E8] w-[90%] p-[16px] lg:w-[500px] h-[430px] lg:h-[560px] rounded-[16px] text-center font-oswald">
            <h2 className="text-white text-[20px] lg:text-[32px] font-oswald font-extrabold">VALENTINE&apos;S DAY SALES</h2>
            <p className="text-white">IN PERIOADA <span className="foht-extrabold">14.02.2025-16.02.2025</span></p>
            <div className="flex flex-col items-center w-full mt-[16px]">
            
    <h3 className="text-[16px] lg:text-[20px] text-white">REDUCERE CURS ONLINE DE <span className="text-red-500 font-extrabold">50%</span> </h3>
    <h3 className="text-[16px] lg:text-[20px] text-white">REDUCERE DE 20% LA TOATE PRODUSELE CU CODUL <span className="text-red-500 font-extrabold">VALENTINES20</span> </h3>
    <Image src={online} className=" w-[180px] lg:w-[280px] h-auto" alt="Promotional" />

             
            </div>
            <button
              onClick={handleClosePopup}
              className="absolute top-1 right-1 bg-white rounded-full w-[20px] lg:w-[25px] h-[20px] lg:h-[25px] text-[13px] lg:text-[18px] font-extrabold"
            >
              X
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PopupSales;
