import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">ImagePro</h1>

        <div className="hidden md:flex space-x-6 font-medium">
          <Link to="/" className="hover:text-indigo-600 transition">
            Home
          </Link>
          <Link to="/editor" className="hover:text-indigo-600 transition">
            Editor
          </Link>
          <a href="#about" className="hover:text-indigo-600 transition">
            About
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-700"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t">
          <Link
            to="/"
            className="block px-6 py-3 hover:bg-gray-50"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/editor"
            className="block px-6 py-3 hover:bg-gray-50"
            onClick={() => setOpen(false)}
          >
            Editor
          </Link>
          <a href="#about" className="block px-6 py-3 hover:bg-gray-50">
            About
          </a>
        </div>
      )}
    </nav>
  );
}
