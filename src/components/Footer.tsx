import { Github, Instagram, Mail, Heart } from "lucide-react";

// ========================================
// SOLUTION 1: Light Footer Theme
// ========================================
export default function FooterLight() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand Section */}
              <div className="space-y-4">
                <div className="flex flex-col items-center md:items-start gap-2">
                  <img 
                    src="../public/images/logo-whitetheme.png" 
                    alt="Clearity" 
                    className="h-8 md:h-9 w-auto select-none pointer-events-none"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              <p className="text-sm text-gray-600 leading-relaxed text-center md:text-left">
                Transform your images effortlessly with our browser-based editor. No installation needed.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-gray-900 font-semibold mb-4 text-lg">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="text-gray-600 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Home
                  </a>
                </li>
                <li>
                  <a href="/editor" className="text-gray-600 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Editor
                  </a>
                </li>
                <li>
                  <a href="/ai" className="text-gray-600 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    AI Features
                  </a>
                </li>
                <li>
                  <a href="/about" className="text-gray-600 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    About
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-gray-900 font-semibold mb-4 text-lg">Connect</h3>
              <div className="flex gap-4">
                <a 
                  href="https://github.com/BriantJasper/Clearity" 
                  className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:text-white hover:bg-cyan-400 hover:border-cyan-400 transition-all hover:scale-110 hover:shadow-lg hover:shadow-cyan-400/50"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-200 text-center">
            <p className="text-sm flex items-center justify-center gap-2 text-gray-600">
              © {currentYear} <span className="font-semibold text-cyan-500">Clearity</span>. 
              Made with <Heart className="w-4 h-4 text-red-400 inline animate-pulse" fill="currentColor" /> 
              for creators.
            </p>
          </div>
        </div>
      </footer>

    </>
  );
}