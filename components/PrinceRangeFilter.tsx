import { useState } from "react";
import { Slider } from "./ui/slider";

const PriceRangeFilter = ({ maxPrice, priceRange, setPriceRange }) => {
    const [inputValues, setInputValues] = useState({
      min: priceRange[0],
      max: priceRange[1]
    });
  
    const handleInputChange = (type) => (e) => {
      const value = parseInt(e.target.value) || 0;
      setInputValues(prev => ({
        ...prev,
        [type]: value
      }));
    };
  
    const handleInputBlur = () => {
      const min = Math.max(0, Math.min(inputValues.min, maxPrice));
      const max = Math.max(min, Math.min(inputValues.max, maxPrice));
      setPriceRange([min, max]);
      setInputValues({ min, max });
    };
  
    return (
      <div className="border-b pb-4">
        <h3 className="font-medium mb-3">Preț</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="text-sm text-gray-500 mb-1 block">De la:</span>
            <input
              type="number"
              min="0"
              max={maxPrice}
              value={inputValues.min}
              onChange={handleInputChange('min')}
              onBlur={handleInputBlur}
              className="w-full p-2 border rounded-md text-sm"
            />
          </div>
          <div>
            <span className="text-sm text-gray-500 mb-1 block">Până la:</span>
            <input
              type="number"
              min="0"
              max={maxPrice}
              value={inputValues.max}
              onChange={handleInputChange('max')}
              onBlur={handleInputBlur}
              className="w-full p-2 border rounded-md text-sm"
            />
          </div>
        </div>
        <Slider
          max={maxPrice}
          step={1}
          value={priceRange}
          onValueChange={(value) => {
            setPriceRange(value);
            setInputValues({ min: value[0], max: value[1] });
          }}
          className="mb-4"
        />
      </div>
    );
  };
  
  export default PriceRangeFilter;