'use client';

import Link from "next/link";
import { useState } from "react";

const ShopDropdown = ({ initialCategories }) => {
    const [showCategories, setShowCategories] = useState(false);

    return (
        <div 
            className="relative" 
            onMouseEnter={() => setShowCategories(true)}
            onMouseLeave={() => setShowCategories(false)}
        >
            <Link href="/magazin" className="hover:opacity-50 cursor-pointer">
                MAGAZIN
            </Link>
            <ul className={`absolute w-[200px] top-full flex flex-col bg-white shadow-lg ${!showCategories && "hidden"} mt-[8px]`}>
                <Link
                    href="/magazin"
                    className="text-sm text-gray-700 w-full"
                >
                    <li className="py-2 hover:bg-gray-100 w-full px-4">
                        TOATE PRODUSELE
                    </li>
                </Link>
                {initialCategories.map((category) => (
                    <Link
                        key={category._id}
                        href={`/categorie/${category.slug.current}`}
                        className="text-sm text-gray-700 w-full"
                    >
                        <li className="py-2 hover:bg-gray-100 w-full px-4">
                            {category.name.toUpperCase()}
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    );
};

export default ShopDropdown;