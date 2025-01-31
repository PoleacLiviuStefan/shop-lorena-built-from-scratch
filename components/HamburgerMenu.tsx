'use client'

import React, { useState } from "react"
import { FiMenu, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi"
import Link from "next/link"
import Image from "next/image"
import logo from '../public/Imagini/logo.png'
import { FaMagnifyingGlass } from "react-icons/fa6";
import SearchBar from "./SearchBar"

// Definim interfața pentru items din meniu
interface MenuItem {
  name: string;
  href: string;
}

// Modificăm tipul MenuLink pentru a fi mai specific
type MenuLink = string | MenuItem[];

interface Category {
  name: string;
  href: string;
}

interface HamburgerProps {
  categories: Category[];
}

const menuItems: Record<string, MenuLink> = {
  ACASĂ: '/',
  MAGAZIN: '/magazin',
  'CURSURI PROFESIONALE': [
    { name: "ONLINE", href: "/cursuri/online" },
    { name: "CURS DE BAZA 1D-3D & FOXY", href: "/cursuri/curs-de-baza" },
    { name: "CURS DE BAZA PREMIUM (BAZA&EFECTE)", href: "/cursuri/curs-de-baza-premium" },
    { name: "CURS DE EFECTE SPECIALE", href: "/cursuri/curs-de-efecte-speciale" },
    { name: "CURS VIP", href: "/cursuri/curs-vip" },
  ],
  CONTACT: '/contact',
  SUPORT: '/suport',
};

export default function HamburgerMenu({ categories }: HamburgerProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [cursuriDropdownOpen, setCursuriDropdownOpen] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)

  // Funcție helper pentru a verifica dacă linkData este un array de MenuItem
  const isMenuItemArray = (linkData: MenuLink): linkData is MenuItem[] => {
    return Array.isArray(linkData);
  }

  return (
    <>
      {/* (1) The Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="relative h-full">
            <div className="flex items-center justify-center h-full">
              <SearchBar showSearchBar={showSearchModal} />
            </div>
          </div>
        </div>
      )}

      {/* (2) Hamburger & Search Buttons */}
      <div className="flex items-center relative z-50">
        <button
          className="text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
        <button
          onClick={() => setShowSearchModal(!showSearchModal)}
          className="absolute left-[40px] text-xl"
        >
          {showSearchModal ? <FiX /> : <FaMagnifyingGlass />}
        </button>
      </div>

      {/* If showSearchModal => Fullscreen search overlay */}
      {showSearchModal && (
        <div className="fixed inset-0 z-40 bg-white">
          <div className="relative h-full">
            <button
              onClick={() => setShowSearchModal(false)}
              className="absolute top-4 right-4 z-50 text-[24px] border-[1px] border-gray-400 p-[4px]"
            >
              <FiX />
            </button>

            <div className="flex items-center justify-center h-full">
              <SearchBar showSearchBar={showSearchModal} />
            </div>
          </div>
        </div>
      )}

      {/* (3) Dark overlay for menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* (4) Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-[320px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="relative w-full flex items-center justify-center p-8">
          <Image src={logo} alt="logo" className="h-[120px] w-auto" />
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute right-4 text-[16px] border-[1px] border-gray-400 p-[4px]"
          >
            <FiX />
          </button>
        </div>

        <ul className="p-4 mt-[20px]">
          {Object.entries(menuItems).map(([name, linkData]) => (
            <li key={name} className="relative py-2 text-black">
              {typeof linkData === 'string' && name !== "MAGAZIN" ? (
                <Link
                  href={linkData}
                  className="text-[16px] leading-10 hover:text-ui-fg-base"
                  onClick={() => setMenuOpen(false)}
                >
                  {name}
                </Link>
              ) : (
                <div className="flex flex-col">
                  <button
                    className="flex justify-between items-center text-[16px] leading-10 hover:text-ui-fg-base"
                    onClick={() => {
                      if (name === 'CURSURI PROFESIONALE') {
                        setCursuriDropdownOpen((prev) => !prev);
                      } else if (name === 'MAGAZIN') {
                        setDropdownOpen((prev) => !prev);
                      }
                    }}
                  >
                    {name}
                    {name === 'CURSURI PROFESIONALE' ? (
                      cursuriDropdownOpen ? <FiChevronUp /> : <FiChevronDown />
                    ) : name === 'MAGAZIN' ? (
                      dropdownOpen ? <FiChevronUp /> : <FiChevronDown />
                    ) : null}
                  </button>

                  {name === 'CURSURI PROFESIONALE' && cursuriDropdownOpen && isMenuItemArray(linkData) && (
                    <ul className="pl-4">
                      {linkData.map((course: MenuItem) => (
                        <li key={course.name} className="py-2">
                          <Link
                            href={course.href}
                            className="text-[14px] hover:text-ui-fg-base"
                            onClick={() => setMenuOpen(false)}
                          >
                            {course.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}

                  {name === 'MAGAZIN' && dropdownOpen && (
                    <ul className="pl-4">
                      <li className="py-2">
                        <Link
                          href="/magazin"
                          className="text-[14px] hover:text-ui-fg-base"
                          onClick={() => setMenuOpen(false)}
                        >
                          TOATE PRODUSELE
                        </Link>
                      </li>
                      {categories?.map((category) => (
                        <li key={category.href} className="py-2">
                          <Link
                            href={category.href}
                            className="text-[14px] hover:text-ui-fg-base uppercase"
                            onClick={() => setMenuOpen(false)}
                          >
                            {category.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              <span className="absolute left-0 bottom-0 w-full h-[1px] bg-gray-200" />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}