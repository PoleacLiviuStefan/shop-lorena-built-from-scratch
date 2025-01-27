"use client";
import Link from "next/link";

 // Aceasta este o Client Component

export default function InteractiveList() {
  return (
    <ul className='w-[10rem] mt-[1rem] lg:mt-0'>
      <li className='font-bold'>Navigare</li>
      <li className='mt-[1rem] cursor-pointer text-[14px]'>
        <Link

          href="/acasa"
        >
          ACASA
        </Link>
      </li>
      <li className='cursor-pointer text-[14px]'>
        <Link

          href="/magazin"
        >
          MAGAZIN
        </Link>
      </li>
      <li className='cursor-pointer text-[14px]'>
        <Link

          href="/cursuri"
        >
          CURSURI PROFESION
        </Link>
      </li>
      <li className='cursor-pointer text-[14px]'>
        <Link

          href="/contact"
        >
          CONTACT
        </Link>
      </li>
      <li className='cursor-pointer text-[14px]'>
        <Link

          href="/suport"
        >
          SUPORT
        </Link>
      </li>
    </ul>
  );
}
