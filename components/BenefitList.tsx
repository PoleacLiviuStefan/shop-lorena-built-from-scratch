'use client';
import React, { useRef, useEffect } from 'react';
import Benefit from './ui/benefit';
import CosmeticIcon from "../public/Imagini/icons/cosmetics-icon.svg";
import LashIcon from "../public/Imagini/icons/eyelash.svg";
import Mirror from "../public/Imagini/icons/mirror.svg";
import Tweezers from "../public/Imagini/icons/tweezers.svg";
import Adhesive from "../public/Imagini/icons/gene-adeziv.svg";

const BenefitList = () => {
  const sliderRef = useRef(null);

  useEffect(() => {
    const autoScroll = () => {
      console.log('Scrolling slider...');
      if (sliderRef.current) {
        // Detectăm lățimea primului element
        const scrollAmount =
          sliderRef.current.querySelector('.flex-shrink-0')?.offsetWidth + 16 || 200;

        // Verificăm dacă slider-ul a ajuns la capăt
        if (
          sliderRef.current.scrollLeft + sliderRef.current.clientWidth >=
          sliderRef.current.scrollWidth
        ) {
          sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    };

    const interval = setInterval(autoScroll, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-[300px] flex flex-col items-center justify-center overflow-hidden z-10">
      <div
        ref={sliderRef}
        className="flex justify-start lg:justify-center items-center w-full overflow-x-scroll lg:overflow-x-hidden gap-[16px] whitespace-nowrap max-w-[980px] h-full scrollbar-hide"
      >
        {/* Elementele din slider */}
        <div className="flex-shrink-0 w-[calc(33.333%-16px)] lg:w-[150px]">
          <Benefit iconSrc={LashIcon} name="Extensii Gene" path="extensii-gene" />
        </div>
        <div className="flex-shrink-0 w-[calc(33.333%-16px)] lg:w-[150px]">
          <Benefit iconSrc={Adhesive} name="Adezivi" path="adezivi" />
        </div>
        <div className="flex-shrink-0 w-[calc(33.333%-16px)] lg:w-[150px]">
          <Benefit iconSrc={Mirror} name="Accesorii" path="accesorii" />
        </div>
        <div className="flex-shrink-0 w-[calc(33.333%-16px)] lg:w-[150px]">
          <Benefit iconSrc={Tweezers} name="Pensete" path="pensete" />
        </div>
        <div className="flex-shrink-0 w-[calc(33.333%-16px)] lg:w-[150px]">
          <Benefit iconSrc={CosmeticIcon} name="Consumabile" path="consumabile" />
        </div>
      </div>
    </div>
  );
};

export default BenefitList;
