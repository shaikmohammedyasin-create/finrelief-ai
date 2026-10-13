import React from "react";
import { FiSearch } from "react-icons/fi";

export default function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="relative w-full max-w-xs">
      <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="input-field pl-9"
      />
    </div>
  );
}
