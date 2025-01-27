'use client';
import React from 'react';
import Image from 'next/image'; // Importă componenta Image
import Link from 'next/link';

const CursMainPreview = ({ imagine, subTitlu, titlu, descriere, redirectionare, secondTitle="", baza }) => {
  return (
    <div className="relative my-[5rem] w-[20rem] lg:w-[25rem] h-[900px]   bg-white flex flex-col   items-center border-[1px] border-yellow-400 font-montSerrat shadow-xl">
      {/* Folosește Image din next/image */}
      <Image
        src={imagine} // Imagini importate
        alt={titlu}

        className="top-0 w-full h-auto shadow-lg bg-black"
      />
      <div className="relative top-0 py-[4rem]  w-[90%]  flex flex-col items-center">
        <h3 className=" font-norican text-[#DAA520]">{subTitlu}</h3>
        <h2 className="text-[18px] lg:text-[22px]  font-oswald font-bold text-center">{titlu}</h2>
        <h3 className="font-norican">{secondTitle}</h3>
        <p className="h-[220px] text-[14px] lg:text-[16px] text-justify mt-[1rem]">{descriere}</p>
        <Link href={`/cursuri/${redirectionare}`}>
          <button
            onClick={() => {
              window.scrollTo({ top: 0, left: 0 });
            }}
            className="border-[1px] border-yellow-400 font-bold px-[4rem] py-[.5rem] mt-[1rem] transition ease-in-out duration-300 hover:bg-yellow-400 hover:text-white"
          >
            Afla mai multe
          </button>
        </Link>
        {/*
        <div
          className={`absolute flex justify-center items-center right-6 bottom-[-40px] lg:bottom-[-2rem] w-[85px] lg:w-[100px] h-[85px] lg:h-[100px] rounded-[50%] bg-[#0b2a24] text-white z-30 ${
            !baza && 'hidden'
          }`}
        >
          <h4 className="text-center text-[13px] lg:text-[15px] font-bold">REDUCERI LIMITATE</h4>
        </div>
        */}
      </div>
    </div>
  );
};

export default CursMainPreview;
