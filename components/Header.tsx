"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { PackageIcon } from "@sanity/icons";
import { useState } from "react";
import Logo from "../public/Imagini/logo.png";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import CartPreview from "./CartPreview";
import SearchBar from "./SearchBar";
import HamburgerMenu from "./HamburgerMenu";

const Header = ({ categories }: { categories: { name: string; href: string }[] }) => {
  const { user } = useUser();

  const [showCourses, setShowCourses] = useState(false);

  const [showCategories, setShowCategories] = useState(false);
  console.log("categories", categories);
  const coursesList = [
    { name: "ONLINE", href: "/cursuri/online" },
    { name: "CURS DE BAZA 1D-3D & FOXY", href: "/cursuri/curs-de-baza" },
    { name: "CURS DE BAZA PREMIUM (BAZA&EFECTE)", href: "/cursuri/curs-de-baza-premium" },
    { name: "CURS DE EFECTE SPECIALE", href: "/cursuri/curs-de-efecte-speciale" },
    { name: "CURS VIP", href: "/cursuri/curs-vip" },
  ];

  return (
    <header className="fixed top-0 z-50 bg-white w-full shadow-md">
      <div className="flex flex-col flex-wrap justify-between lg:justify-center items-center gap-4 px-4 pt-4 h-[60px] lg:h-full">
        <div className="flex items-center w-full">
          {/* Mobile View */}
          <div className="lg:hidden flex items-center justify-between w-full">
        
            <HamburgerMenu  categories={categories} />
         
          
            <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 ">
              <Image src={Logo} alt="Logo" className="w-[75px] lg:w-[90px] " />
            </Link>
            <div className="flex items-center gap-2">
            {user &&
              <Link
                href="/comenzi"
                className="flex items-center hover:opacity-50 cursor-pointer"
              >
                <PackageIcon className="text-[28px] " />
              </Link>
}
              <CartPreview />
              {user ? <UserButton /> :                         <SignInButton mode="modal">
      <button className="px-2 py-1 text-[14px] bg-[#FFC2EA] transition-colors rounded hover:bg-[#FC86D4]">
        Autentificare
      </button>
    </SignInButton>}
            </div>
          </div>

          {/* Desktop View */}
          <div className="hidden lg:flex items-center justify-center w-full">
            <div className="flex flex-col items-center justify-center w-full ">
              <div className="flex items-center justify-between lg:justify-center w-full ">
                <Link
                  href="/"
                  className="flex justify-center text-2xl font-bold text-blue-500 hover:opacity-50 cursor-pointer"
                >
                  <Image src={Logo} alt="Logo" className="w-[95px] mr-5" />
                </Link>
                <div className="flex items-center gap-4">
                  <SearchBar showSearchBar={true} />
                  <div className="flex items-center gap-4">
                    <CartPreview />
                    {user &&
                    <Link
                      href="/comenzi"
                      className="flex items-center hover:opacity-50 cursor-pointer"
                    >
                      <span className="font-bold text-[12px] text-gray-600">
                        COMENZI
                      </span>
                      <PackageIcon className="text-[24px]  ml-1" />
                    </Link>
}
                    {user ? (
                      <div className="hover:opacity-50 cursor-pointer">
                        {user.fullName} <UserButton />
                      </div>
                    ) : (
                      <div className=" cursor-pointer">
                         <SignInButton mode="modal">
      <button className="px-4 py-2 bg-[#FFC2EA] transition-colors rounded hover:bg-[#FC86D4]">
        Autentificare
      </button>
    </SignInButton>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="flex justify-center space-x-12 ">
                <Link href="/" className="hover:opacity-50 cursor-pointer">
                  ACASA
                </Link>
                <div
  className="relative group"
  onMouseEnter={() => setShowCategories(true)}
  onMouseLeave={() => setShowCategories(false)}
>
  <span className="hover:opacity-50 cursor-pointer flex items-center">
    MAGAZIN
    {showCategories ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />}
  </span>
  {showCategories && (
    <ul className="absolute w-[250px] top-full left-0 bg-white shadow-lg px-3 py-2 z-50 ">
      {/* Validăm dacă categories este un array */}
      <li  className="uppercase py-2">
            <Link href="/magazin" className="hover:opacity-50 cursor-pointer w-full block">TOATE PRODUSELE</Link>
          </li>
      {categories.map((category) => (
          <li key={category.href} className="uppercase py-2">
            <Link href={category.href} className="hover:opacity-50 cursor-pointer w-full block">{category.name}</Link>
          </li>
        ))}
    </ul>
  )}
</div>


                <div
                  className="relative group"
                  onMouseEnter={() => setShowCourses(true)}
                  onMouseLeave={() => setShowCourses(false)}
                >
                  <Link
                    href="/cursuri"
                    className="hover:opacity-50 cursor-pointer flex items-center"
                  >
                    CURSURI PROFESIONALE
                    {showCourses ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />}
                  </Link>
                  {showCourses && (
                    <ul className="absolute w-[250px] top-full left-0 bg-white shadow-lg px-3 py-2 z-50">
                      {coursesList.map((course) => (
                        <li key={course.href} className="py-2">
                          <Link
                            href={course.href}
                            className="hover:opacity-50 cursor-pointer w-full block"
                          >
                            {course.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <Link
                  href="/contact"
                  className="hover:opacity-50 cursor-pointer"
                >
                  CONTACT
                </Link>
                <Link 
                  href="/suport" 
                  className="hover:opacity-50 cursor-pointer"
                >
                  SUPORT
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;