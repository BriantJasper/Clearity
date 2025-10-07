// src/components/CustomHeaderButtons.tsx

import { useState, useRef, useEffect } from "react";

// Define the props for our component
interface CustomHeaderButtonsProps {
  editorInstance: any; // The TUI Image Editor instance
}

export default function CustomHeaderButtons({
  editorInstance,
}: CustomHeaderButtonsProps) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // --- DOWNLOAD LOGIC ---
  const handleDownload = (format: "png" | "jpeg" | "webp") => {
    if (!editorInstance) return;

    const dataURL = editorInstance.toDataURL({ format });

    // Create a temporary link element to trigger the download
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `edited-image.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDropdownOpen(false); // Close dropdown after download
  };

  // --- CLOSE DROPDOWN ON OUTSIDE CLICK ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const downloadOptions = [
    { format: "png" as const, label: "Save as PNG" },
    { format: "jpeg" as const, label: "Save as JPG" },
    { format: "webp" as const, label: "Save as WEBP" },
  ];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* --- CUSTOM DROPDOWN BUTTON --- */}
      <button
        type="button"
        onClick={() => setDropdownOpen(!isDropdownOpen)}
        // The ml-2 class is removed as this is now the first button
        className="px-3 py-1 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
      >
        Save As ▼
      </button>

      {/* --- DROPDOWN MENU --- */}
      {isDropdownOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {downloadOptions.map((option) => (
              <button
                key={option.format}
                onClick={() => handleDownload(option.format)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
