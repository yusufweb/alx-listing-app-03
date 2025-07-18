import { FilterControlsProps } from "@/interfaces";
import React, { useState, useRef, useEffect } from "react";
import Button from "./Button";
import Image from "next/image";

const FilterControls: React.FC<FilterControlsProps> = ({
  quickCategories,
  allCategories,
  selectedFilters,
  onQuickFilterChange,
  onAdvancedFiltersApply,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  // Internal state for categories currently selected within the dropdown
  const [tempSelectedCategories, setTempSelectedCategories] =
    useState<string[]>(selectedFilters);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Effect to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Sync internal state with selectedFilters from parent when it changes
  useEffect(() => {
    setTempSelectedCategories(selectedFilters);
  }, [selectedFilters]);

  const handleCheckboxChange = (category: string) => {
    setTempSelectedCategories((prevSelected) => {
      if (category === "All") {
        return prevSelected.includes("All") && prevSelected.length === 1
          ? []
          : ["All"];
      } else {
        let newSelection = prevSelected.filter((cat) => cat !== "All");

        if (newSelection.includes(category)) {
          newSelection = newSelection.filter((cat) => cat !== category);
        } else {
          newSelection = [...newSelection, category];
        }

        return newSelection.length === 0 ? ["All"] : newSelection;
      }
    });
  };

  const handleApplyClick = () => {
    onAdvancedFiltersApply(tempSelectedCategories);
    setIsOpen(false);
  };

  const isAllSelectedInDropdown = tempSelectedCategories.includes("All");

  // Determine the active quick filter for styling purposes
  // If multiple advanced filters are selected, no quick filter button will be "active"
  const activeQuickFilter =
    selectedFilters.length === 1 ? selectedFilters[0] : "";

  return (
    <div className="flex justify-between gap-4 px-8 bg-white rounded-lg mt-8">
      {/* Quick Filter Buttons */}
      <div className="flex items-center justify-between gap-2">
        {allCategories.map((category) => (
          <Button
            key={category}
            onClick={() => onQuickFilterChange(category)}
            size="medium"
            shape="rounded-full"
            className={`
            transition-all duration-200 ease-in-out
            border border-gray-300
            ${
              activeQuickFilter === category
                ? "bg-emerald-500 text-white shadow-md hover:bg-emerald-500"
                : "bg-white text-gray-800 hover:bg-emerald-400"
            }
            focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2
          `}
          >
            {category}
          </Button>
        ))}
      </div>
      {/* Advanced Filter Dropdown Button */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative inline-block text-left" ref={dropdownRef}>
          <Button size="medium" shape="rounded-full" id="advanced-filter-button"
              aria-expanded={isOpen}
              aria-haspopup="true"
              onClick={() => setIsOpen(!isOpen)}>
          <div className="flex justify-center items-center gap-4">
            <p>Filter</p>
            <Image
              src="/assets/icons/Linear/Essentional, UI/Filter.png"
              width={20}
              height={20}
              alt="filter"
            />
          </div>
        </Button>

          {isOpen && (
            <div
              className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-emerald-300 ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="advanced-filter-button"
              tabIndex={-1}
            >
              <div className="py-1" role="none">
                {/* 'All' checkbox */}
                <div className="flex items-center px-4 py-2">
                  <input
                    id="filter-all-adv"
                    name="filter-all-adv"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    checked={isAllSelectedInDropdown}
                    onChange={() => handleCheckboxChange("All")}
                  />
                  <label
                    htmlFor="filter-all-adv"
                    className="ml-3 text-sm font-medium text-gray-900"
                  >
                    All
                  </label>
                </div>

                {/* Other categories */}
                {allCategories
                  .filter((cat) => cat !== "All")
                  .map((category) => (
                    <div key={category} className="flex items-center px-4 py-2">
                      <input
                        id={`filter-adv-${category}`}
                        name={`filter-adv-${category}`}
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        checked={tempSelectedCategories.includes(category)}
                        onChange={() => handleCheckboxChange(category)}
                      />
                      <label
                        htmlFor={`filter-adv-${category}`}
                        className="ml-3 text-sm font-medium text-gray-900"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                <div className="border-t border-gray-200 mt-2 pt-2 px-4">
                  <button
                    onClick={handleApplyClick}
                    className="w-full rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
         <Button size="medium" shape="rounded-full">
          <div className="flex justify-center items-center gap-4">
            <p>Sort by:</p>
            <p className="text-gray-400">Highest Price</p>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default FilterControls;
