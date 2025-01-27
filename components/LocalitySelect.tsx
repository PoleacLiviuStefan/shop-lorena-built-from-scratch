'use client';

import { useEffect, useState } from "react";

interface LocalitySelectProps {
  placeholder?: string;
  county: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  disabled?: boolean;
}

const LocalitySelect = ({ 
  placeholder = "Selectează Localitatea", 
  county,
  value,
  onChange,
  className = "",
  disabled = false
}: LocalitySelectProps) => {
  const [localities, setLocalities] = useState<{ name: string }[]>([]);

  useEffect(() => {
    if (!county) {
      setLocalities([]);
      return;
    }

    const fetchLocalities = async () => {
      try {
        const response = await fetch(
          `https://api.fancourier.ro/reports/localities?county=${encodeURIComponent(
            county
          )}`,
          {
            method: "GET",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setLocalities(data.data || []);
        } else {
          console.error("Failed to fetch localities.");
        }
      } catch (error) {
        console.error("Error fetching localities:", error);
      }
    };

    fetchLocalities();
  }, [county]);

  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled || !county}
      className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${className}`}
    >
      <option value="">{placeholder}</option>
      {localities.map((locality, index) => (
        <option key={index} value={locality.name}>
          {locality.name}
        </option>
      ))}
    </select>
  );
};

export default LocalitySelect;