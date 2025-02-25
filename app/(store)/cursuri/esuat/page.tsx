import Link from 'next/link';
import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';

const Cancel: React.FC = () => {


  return (
    <div className="font-montSerrat w-full h-full flex flex-col items-center justify-center py-[10rem]">
      <Link
        href="/"
        className="flex items-center border-2 border-black rounded-[4px] px-[8px] py-[4px] transition-colors duration-300 ease-in-out hover:bg-black hover:text-white"
      >
        <FaArrowLeft /> Acasa
      </Link>

      <h1 className="text-[28px] lg:text-[64px] font-bold text-center">
        OPERATIUNEA A FOST ANULATA
      </h1>
      <p className="lg:text-[20px] text-center">
        Te rugam sa incerci din nou
      </p>
    </div>
  );
};

export default Cancel;
