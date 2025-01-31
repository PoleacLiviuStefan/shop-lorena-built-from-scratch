import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import CursDeBaza from "../public/Imagini/cursuri/curs_de_baza.jpg"
import CursDeBazaPremium from "../public/Imagini/cursuri/curs_de_baza_premium.jpg"
import CursDeEfecteSpeciale from "../public/Imagini/cursuri/curs_de_efecte_speciale.jpg"
import CursVip from "../public/Imagini/cursuri/cursVip.jpeg"

const HomeCoursesPreview = () => {
  return (
    <div className="grid grid-cols-2 gap-6 justify-items-center py-4">
    <Link href="/cursuri/curs-de-baza" className="relative flex flex-col items-center">
        <Image
          src={CursDeBaza}
        
          alt="Curs de bază"
className="w-[300px] h-auto"
        />
        <div className="flex items-center justify-center absolute bottom-0  bg-black text-white  h-[50px] z-10 w-full ">
          <h2 className="text-[16px] lg:text-[22px] font-extrabold text-center ">Curs De Baza</h2>
          </div>
        </Link>
        <Link href="/cursuri/curs-de-baza-premium" className="relative"  >
        <Image
       
          src={CursDeBazaPremium}
        
          alt="Curs de bază premium"
        className="relative w-[300px] h-auto"
        />
           <div className="flex items-center justify-center absolute bottom-0  bg-black text-white  h-[50px] z-10 w-full ">
          <h2 className="text-[16px] lg:text-[22px] font-extrabold text-center">Curs De Baza Premium</h2>
          </div>
        </Link>
        <Link href="/cursuri/curs-de-efecte-speciale" className="relative" >
        <Image
       
          src={CursDeEfecteSpeciale}
        
          alt="Curs de efecte speciale"
className="w-[300px] h-auto"
        />
            <div className="flex items-center justify-center absolute bottom-0  bg-black text-white  h-[50px] z-10 w-full ">
            <h2 className="text-[16px] lg:text-[22px] font-extrabold text-center">Curs De Efecte Speciale</h2>
            </div>
        </Link>
        <Link href="/cursuri/curs-VIP" className="relative"  >
        <Image
       
          src={CursVip}
        
          alt="Curs VIP"
      
          className="w-[300px] h-auto"
        />
           <div className="flex items-center justify-center absolute bottom-0  bg-black text-white  h-[50px] z-10 w-full ">
        <h2 className="text-[16px] lg:text-[22px] font-extrabold text-center">Curs VIP</h2>
        </div>
        </Link>
      
    </div>
  )
}

export default HomeCoursesPreview