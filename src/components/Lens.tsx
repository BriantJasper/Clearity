import { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Move, Palette, Eye, Download, RefreshCw } from 'lucide-react';

interface LensProps {
  imageUrl?: string;
  className?: string;
}

export default function Lens({ imageUrl, className = '' }: LensProps) {
  const [isActive, setIsActive] = useState(false);
  const [zoom, setZoom] = useState(2);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [filter, setFilter] = useState('none');
  const [showPreview, setShowPreview] = useState(false);
  const lensRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!lensRef.current || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });
    setPosition({
      x: x - lensRef.current.offsetWidth / 2,
      y: y - lensRef.current.offsetHeight / 2
    });
  };

  const handleMouseEnter = () => setIsActive(true);
  const handleMouseLeave = () => setIsActive(false);

  const adjustZoom = (delta: number) => {
    setZoom(prev => Math.max(1, Math.min(5, prev + delta)));
  };

  const filters = [
    { name: 'Original', value: 'none' },
    { name: 'Vintage', value: 'sepia(1) contrast(1.2) saturate(1.3)' },
    { name: 'B&W', value: 'grayscale(1) contrast(1.2)' },
    { name: 'Vibrant', value: 'saturate(1.5) contrast(1.1) brightness(1.1)' },
    { name: 'Cool', value: 'hue-rotate(180deg) saturate(1.2)' },
    { name: 'Warm', value: 'hue-rotate(30deg) saturate(1.3) brightness(1.1)' }
  ];

  const getFilterStyle = () => {
    return {
      filter: filter,
      transform: isActive ? `scale(${zoom})` : 'scale(1)',
      transformOrigin: `${mousePosition.x}px ${mousePosition.y}px`
    };
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Enhanced Controls */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <button
          onClick={() => adjustZoom(-0.5)}
          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4 text-gray-700" />
        </button>
        <button
          onClick={() => adjustZoom(0.5)}
          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4 text-gray-700" />
        </button>
        <button
          onClick={() => setZoom(2)}
          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-colors"
          title="Reset Zoom"
        >
          <RotateCw className="w-4 h-4 text-gray-700" />
        </button>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-colors"
          title="Toggle Preview"
        >
          <Eye className="w-4 h-4 text-gray-700" />
        </button>
      </div>

      {/* Filter Controls */}
      <div className="absolute top-4 left-4 z-20">
        <div className="flex gap-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2">
          {filters.slice(0, 3).map((filterOption) => (
            <button
              key={filterOption.value}
              onClick={() => setFilter(filterOption.value)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                filter === filterOption.value 
                  ? 'bg-cyan-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filterOption.name}
            </button>
          ))}
        </div>
      </div>

      {/* Image Container */}
      <div className="relative overflow-hidden rounded-xl shadow-2xl">
        <img
          ref={imageRef}
          src={imageUrl || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center'}
          alt="Lens Preview - Beautiful Mountain Landscape"
          className="w-full h-auto transition-transform duration-200 rounded-lg"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={getFilterStyle()}
        />

        {/* Enhanced Magnifying Lens */}
        {isActive && (
          <div
            ref={lensRef}
            className="absolute pointer-events-none z-10 w-40 h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden"
            style={{
              left: position.x,
              top: position.y,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {/* Lens glass effect */}
            <div className="w-full h-full bg-gradient-to-br from-cyan-400/30 to-purple-400/30 backdrop-blur-sm"></div>
            <div className="absolute inset-0 border-2 border-cyan-400 rounded-full animate-pulse"></div>
            
            {/* Enhanced crosshair with glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-0.5 bg-white/90 shadow-lg shadow-white/50"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-0.5 h-full bg-white/90 shadow-lg shadow-white/50"></div>
            </div>
            
            {/* Corner indicators */}
            <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-cyan-400"></div>
            <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-cyan-400"></div>
            <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-cyan-400"></div>
            <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-cyan-400"></div>
            
            {/* Enhanced zoom indicator */}
            <div className="absolute bottom-2 right-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
              {zoom.toFixed(1)}x
            </div>
            
            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg"></div>
          </div>
        )}

        {/* Overlay when lens is active */}
        {isActive && (
          <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
        )}
      </div>

      {/* Preview Mode */}
      {showPreview && (
        <div className="mt-4 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800">Live Preview</h3>
            <div className="flex gap-2">
              {filters.map((filterOption) => (
                <button
                  key={filterOption.value}
                  onClick={() => setFilter(filterOption.value)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    filter === filterOption.value 
                      ? 'bg-cyan-500 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {filterOption.name}
                </button>
              ))}
            </div>
          </div>
          <div className="text-xs text-gray-600">
            <p>✨ <strong>Pro Tip:</strong> Hover over the image to activate the magnifying lens</p>
            <p>🎨 <strong>Filters:</strong> Try different styles to see the magic happen</p>
            <p>🔍 <strong>Zoom:</strong> Use the controls to zoom in up to 5x</p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
          <Move className="w-4 h-4" />
          Hover to activate lens • Use controls to adjust zoom and filters
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Beautiful mountain landscape from Unsplash • Try the vintage and B&W filters!
        </p>
      </div>

      <style>{`
        .lens-container {
          position: relative;
          overflow: hidden;
        }
        
        .lens-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
            transparent 60px,
            rgba(0, 0, 0, 0.3) 60px
          );
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
