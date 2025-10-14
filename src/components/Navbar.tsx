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

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 font-medium">
            <Link 
              to="/" 
              className="relative text-gray-700 hover:text-cyan-400 transition-colors group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            <Link 
              to="/about" 
              className="relative text-gray-700 hover:text-cyan-400 transition-colors group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            {/* CTA Button */}
            <Link
              to="/editor"
              className="group relative bg-gradient-to-r from-cyan-400 to-cyan-500 text-white px-5 py-2 rounded-lg font-semibold overflow-hidden transition-all hover:shadow-lg hover:shadow-cyan-200 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                Try Now
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-700 hover:text-cyan-400 transition-colors p-2 hover:bg-cyan-50 rounded-lg"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden bg-white border-t overflow-hidden transition-all duration-300 ${
            open ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
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
          <Link 
            to="/about" 
            className="block px-6 py-3 hover:bg-cyan-50 hover:text-cyan-500 transition-all border-l-4 border-transparent hover:border-cyan-400"
            onClick={() => setOpen(false)}
          >
            About
          </a>
        </div>
      </nav>

    </>
  );
}
