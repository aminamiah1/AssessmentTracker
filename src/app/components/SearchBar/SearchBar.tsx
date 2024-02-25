import { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";

/**
 * Creates a SearchBar component.
 * @param onSearch - Function to handle search term input. Takes `term` as a parameter.
 * @param placeholder - The placeholder text. Defaults to `"Search..."`.
 */
export default function SearchBar({
  onSearch,
  placeholder = "Search...",
}: {
  onSearch: (term: string) => void;
  placeholder?: string;
}) {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <div className="flex items-center justify-center bg-white w-fit rounded-lg p-2 border border-gray-300">
      <input
        className="bg-none border-none focus:outline-none text-gray-900"
        type="text"
        name="search"
        id="search"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <IoSearchSharp
        className="text-gray-700 cursor-pointer"
        onClick={handleSearch}
      />
    </div>
  );
}
