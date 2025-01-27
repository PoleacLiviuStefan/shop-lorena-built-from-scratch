'use client';

import { useEffect, useState } from "react";

interface CountySelectProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  disabled?: boolean;
}

const CountySelect = ({
  placeholder = "Selectează Județul",
  value,
  onChange,
  className = "",
  disabled = false
}: CountySelectProps) => {
  const [counties, setCounties] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchCounties = async () => {
      try {
        const response = await fetch("https://api.fancourier.ro/reports/counties", {
          method: "GET",
        });

        if (response.ok) {
          const data = await response.json();
          setCounties(data.data || []);
        } else {
          console.error("Failed to fetch counties.");
        }
      } catch (error) {
        console.error("Error fetching counties:", error);
      }
    };

    fetchCounties();
  }, []);

  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${className}`}
    >
      <option value="">{placeholder}</option>
      {counties.map((county) => (
        <option key={county.id} value={county.name}>
          {county.name}
        </option>
      ))}
    </select>
  );
};

export default CountySelect;