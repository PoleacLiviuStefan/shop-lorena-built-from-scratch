"use client";

import React, { useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

const SearchBar = ({showSearchBar=false} :{showSearchBar: boolean}) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search query:", query);
    // Redirect to search results page
    window.location.href = `/cautari?query=${encodeURIComponent(query)}`;
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="relative hidden lg:inline">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Caută produse..."
        className="w-full lg:w-[500px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        <FaMagnifyingGlass />
      </button>
    </form>
    <div className={`absolute top-0 left-0 w-screen h-screen flex items-center justify-center bg-white  lg:hidden ${showSearchBar ? "inline" : "hidden"}`}>
    <form onSubmit={handleSubmit} className={`relative `}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Caută produse..."
        className="w-full  px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        <FaMagnifyingGlass />
      </button>
    </form>
    </div>
    </>
  );
};

export default SearchBar;
