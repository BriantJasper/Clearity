import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { ChangeEvent, FC, SVGProps, MouseEvent } from 'react';

// --- Type Definitions ---
interface IconProps extends SVGProps<SVGSVGElement> {
    className?: string;
}

type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'star' | 'fill';

interface Layer {
    id: string;
    name: string;
    dataUrl: string; // Storing image data as a data URL
    isVisible: boolean;
    opacity: number;
    blendMode: GlobalCompositeOperation;
    zIndex: number;
}


// --- SVG Icon Components (self-contained for portability) ---
const CropIcon: FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.13 1L6 16a2 2 0 0 0 2 2h15" /><path d="M1 6.13L16 6a2 2 0 0 1 2 2v15" />
    </svg>
);
const ResizeIcon: FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" /><path d="m16 16-3-3 3 3 3-3-3 3" /><path d="m16 21 3-3-3 3-3-3 3 3" /><path d="m16 16 3 3" /><path d="M13 21V10H3" />
    </svg>
);
const SunIcon: FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
    </svg>
);
const MoonIcon: FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
);
const ContrastIcon: FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 18a6 6 0 0 0 0-12v12z" />
    </svg>
);
const DropletIcon: FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
    </svg>
);
const PaletteIcon: FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /><circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".5" fill="currentColor" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.668 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.5-2.449 5.5-5.5S17.051 2 12 2z" />
    </svg>
);
const FilterIcon: FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
);
const PenToolIcon: FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 19 7-7 3 3-7 7-3-3z" /><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="m2 2 7.586 7.586" /><path d="m11 11 1 1" />
    </svg>
);
const TextIcon: FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 6.1H7v11.8" /><path d="M12 6.1V17.9" />
    </svg>
);
const ChevronDownIcon: FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 9 6 6 6-6" />
    </svg>
);
const ChevronsRightIcon: FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 17 5-5-5-5" /><path d="m13 17 5-5-5-5" />
    </svg>
);
const ResetIcon: FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v6h6" />
        <path d="M21 12A9 9 0 0 0 6 5.3L3 8" />
        <path d="M21 22v-6h-6" />
        <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7" />
    </svg>
);
const UndoIcon: FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7v6h6" />
        <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
    </svg>
);
const RedoIcon: FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 7v6h-6" />
        <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3-2.3" />
    </svg>
);
const MaximizeIcon: FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3H5a2 2 0 0 0-2 2v3" />
        <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
        <path d="M3 16v3a2 2 0 0 0 2 2h3" />
        <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
);
const LockIcon: FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);
const UnlockIcon: FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
    </svg>
);
const PerspectiveIcon: FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.1 6.3-8.6 3.3-8.6-3.3C2.8 5.8 2 6.6 2 7.7v8.6c0 1.1.8 1.9 1.9 1.4l8.6-3.3 8.6 3.3c1.1.4 1.9-.4 1.9-1.4V7.7c0-1.1-.8-1.9-1.9-1.4Z"/><path d="M12.5 11.5 22 7.7"/><path d="M12.5 11.5v8.8"/><path d="M12.5 11.5 2 7.7"/>
    </svg>
);
const ShapesIcon: FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-6.2-8.7" /><path d="M22 2 12 12" /><path d="M22 12h-4" /><path d="M12 2V6" /><circle cx="12" cy="12" r="2" /><path d="m2 22 5-5" />
    </svg>
);
const WandIcon: FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.21 1.21 0 0 0 1.72 0L21.64 5.36a1.21 1.21 0 0 0 0-1.72Z" /><path d="m14 7 3 3" /><path d="M5 6v4" /><path d="M19 14v4" /><path d="M10 2v2" /><path d="M7 8H3" /><path d="M17 18H3" /><path d="M21 12h-2" />
    </svg>
);
const MorphologyIcon: FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5V3" /><path d="M12 13v-2" /><path d="M12 21v-2" /><path d="M19 12h2" /><path d="M14 12h2" /><path d="M5 12h2" /><path d="m4.2 4.2 1.4 1.4" /><path d="M8.4 8.4 7 7" /><path d="M18.4 5.6 17 7" /><path d="m19.8 19.8-1.4-1.4" /><path d="M15.6 15.6 17 17" /><path d="m5.6 18.4 1.4-1.4" /><rect width="8" height="8" x="8" y="8" rx="2" />
    </svg>
);
const FrequencyIcon: FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v2l4 4h4l4-4V3" /><path d="M3 21v-2l4-4h4l4 4v2" /><path d="M11 3v18" />
    </svg>
);
const ZoomInIcon: FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        <line x1="11" y1="8" x2="11" y2="14"></line>
        <line x1="8" y1="11" x2="14" y2="11"></line>
    </svg>
);
const ZoomOutIcon: FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        <line x1="8" y1="11" x2="14" y2="11"></line>
    </svg>
);
const LayersIcon: FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
        <polyline points="2 17 12 22 22 17"></polyline>
        <polyline points="2 12 12 17 22 12"></polyline>
    </svg>
);
const EyeIcon: FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);
const EyeOffIcon: FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
);
const TrashIcon: FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);
const PlusIcon: FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="M12 5v14" />
    </svg>
);


// --- Reusable UI Components ---
interface IconButtonProps {
    icon: React.ReactNode;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
    disabled?: boolean;
}
const IconButton: FC<IconButtonProps> = ({ icon, label, isActive, onClick, disabled }) => (
    <button 
        onClick={onClick} 
        disabled={disabled} 
        className={`flex flex-col items-center justify-center w-full py-3 px-1 rounded-xl transition-all duration-200 tool-button ${
            isActive 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25 active' 
                : 'hover:bg-gray-100 text-gray-600 dark:hover:bg-gray-800/50 dark:text-gray-300 bg-white/50 dark:bg-gray-800/50'
        } disabled:text-gray-400 dark:disabled:text-gray-500 disabled:hover:bg-transparent disabled:cursor-not-allowed`} 
        title={label}
    >
        {icon}
        <span className="text-xs mt-1">{label}</span>
    </button>
);

interface SliderProps {
    icon: React.ReactNode;
    label: string;
    value: number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    min?: number;
    max?: number;
    step?: number;
}
const Slider: FC<SliderProps> = ({ icon, label, value, onChange, min = -100, max = 100, step = 1 }) => (
    <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <span className="text-gray-500 dark:text-gray-400">{icon}</span>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
            </div>
            <span className="text-sm font-mono px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-md">{value}</span>
        </div>
        <input type="range" min={min} max={max} step={step} value={value} onChange={onChange} className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer range-sm accent-teal-500" />
    </div>
);

interface AccordionProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
}
const Accordion: FC<AccordionProps> = ({ title, icon, children, isOpen, onToggle }) => {
    return (
        <div className="border-b border-gray-200/50 dark:border-gray-700/50">
            <button 
                onClick={onToggle} 
                className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all duration-200 rounded-lg mx-2 my-1"
            >
                <div className="flex items-center space-x-3">
                    <span className="text-cyan-600 dark:text-cyan-400">{icon}</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{title}</span>
                </div>
                <ChevronDownIcon className={`w-5 h-5 text-gray-500 dark:text-gray-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="p-4 bg-gradient-to-br from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50 mx-2 mb-2 rounded-xl border border-gray-200/30 dark:border-gray-700/30">
                    {children}
                </div>
            )}
        </div>
    );
};

// --- Histogram Component ---
const Histogram: FC<{ data: number[] }> = ({ data }) => {
    if (!data || data.length === 0) {
        return null;
    }
    const maxVal = Math.max(...data);
    if (maxVal === 0) {
        return null; // Don't render an empty histogram
    }

    const width = 256;
    const height = 100;
    const margin = { top: 10, right: 5, bottom: 20, left: 35 };

    const svgWidth = width + margin.left + margin.right;
    const svgHeight = height + margin.top + margin.bottom;

    return (
        <div className="bg-white p-2 rounded-md mb-4 border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-24" preserveAspectRatio="xMidYMid meet">
                <g transform={`translate(${margin.left}, ${margin.top})`}>
                    {/* Y-axis labels */}
                    <text x={-5} y={0} dy="0.32em" textAnchor="end" fill="#6B7280" className="dark:fill-[#9CA3AF]" fontSize="10">
                        {maxVal.toLocaleString()}
                    </text>
                    <text x={-5} y={height} dy="0.32em" textAnchor="end" fill="#6B7280" className="dark:fill-[#9CA3AF]" fontSize="10">
                        0
                    </text>

                    {/* X-axis labels */}
                    <text x={0} y={height + 15} textAnchor="start" fill="#6B7280" className="dark:fill-[#9CA3AF]" fontSize="10">
                        0
                    </text>
                    <text x={width / 2} y={height + 15} textAnchor="middle" fill="#6B7280" className="dark:fill-[#9CA3AF]" fontSize="10">
                        128
                    </text>
                    <text x={width} y={height + 15} textAnchor="end" fill="#6B7280" className="dark:fill-[#9CA3AF]" fontSize="10">
                        255
                    </text>
                    
                    {/* Bars */}
                    {data.map((value, index) => (
                        <rect
                            key={index}
                            x={index}
                            y={height - (value / maxVal) * height}
                            width="1"
                            height={(value / maxVal) * height}
                            fill="#A5B4FC"
                        />
                    ))}
                </g>
            </svg>
        </div>
    );
};


// --- Color Space Conversion Helpers ---
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// --- Image Processing & Filtering Helpers ---

// Generic function to apply a convolution kernel to an image
function applyConvolution(pixels: ImageData, kernel: number[][]): ImageData {
    const src = pixels.data;
    const width = pixels.width;
    const height = pixels.height;
    const dstData = new Uint8ClampedArray(src.length);
    const kernelSize = kernel.length;
    const halfKernel = Math.floor(kernelSize / 2);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let r = 0, g = 0, b = 0;
            for (let ky = 0; ky < kernelSize; ky++) {
                for (let kx = 0; kx < kernelSize; kx++) {
                    const px = x + kx - halfKernel;
                    const py = y + ky - halfKernel;

                    if (px >= 0 && px < width && py >= 0 && py < height) {
                        const i = (py * width + px) * 4;
                        const weight = kernel[ky][kx];
                        r += src[i] * weight;
                        g += src[i + 1] * weight;
                        b += src[i + 2] * weight;
                    }
                }
            }
            const dstIndex = (y * width + x) * 4;
            dstData[dstIndex] = r;
            dstData[dstIndex + 1] = g;
            dstData[dstIndex + 2] = b;
            dstData[dstIndex + 3] = src[dstIndex + 3]; // Alpha
        }
    }
    return new ImageData(dstData, width, height);
}

// Sobel Edge Detection
function applySobel(pixels: ImageData): ImageData {
    const src = pixels.data;
    const width = pixels.width;
    const height = pixels.height;
    const grayscale = new Uint8ClampedArray(width * height);
    const dstData = new Uint8ClampedArray(src.length);

    for (let i = 0; i < src.length; i += 4) {
        const r = src[i];
        const g = src[i + 1];
        const b = src[i + 2];
        grayscale[i / 4] = 0.299 * r + 0.587 * g + 0.114 * b;
    }

    const kernelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
    const kernelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let pixelX = 0;
            let pixelY = 0;

            for (let ky = 0; ky < 3; ky++) {
                for (let kx = 0; kx < 3; kx++) {
                    const i = (y + ky - 1) * width + (x + kx - 1);
                    pixelX += grayscale[i] * kernelX[ky][kx];
                    pixelY += grayscale[i] * kernelY[ky][kx];
                }
            }

            const magnitude = Math.sqrt(pixelX * pixelX + pixelY * pixelY);
            const dstIndex = (y * width + x) * 4;
            dstData[dstIndex] = magnitude;
            dstData[dstIndex + 1] = magnitude;
            dstData[dstIndex + 2] = magnitude;
            dstData[dstIndex + 3] = 255;
        }
    }
    return new ImageData(dstData, width, height);
}

// Median, Min, Max filters
function applyNeighborhoodFilter(pixels: ImageData, type: 'median' | 'min' | 'max'): ImageData {
    const src = pixels.data;
    const width = pixels.width;
    const height = pixels.height;
    const dstData = new Uint8ClampedArray(src.length);

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const rValues: number[] = [];
            const gValues: number[] = [];
            const bValues: number[] = [];

            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const i = ((y + ky) * width + (x + kx)) * 4;
                    rValues.push(src[i]);
                    gValues.push(src[i + 1]);
                    bValues.push(src[i + 2]);
                }
            }
            
            const dstIndex = (y * width + x) * 4;
            if (type === 'median') {
                rValues.sort((a, b) => a - b);
                gValues.sort((a, b) => a - b);
                bValues.sort((a, b) => a - b);
                dstData[dstIndex] = rValues[4];
                dstData[dstIndex + 1] = gValues[4];
                dstData[dstIndex + 2] = bValues[4];
            } else if (type === 'min') {
                dstData[dstIndex] = Math.min(...rValues);
                dstData[dstIndex + 1] = Math.min(...gValues);
                dstData[dstIndex + 2] = Math.min(...bValues);
            } else if (type === 'max') {
                dstData[dstIndex] = Math.max(...rValues);
                dstData[dstIndex + 1] = Math.max(...gValues);
                dstData[dstIndex + 2] = Math.max(...bValues);
            }
            dstData[dstIndex + 3] = 255;
        }
    }
    return new ImageData(dstData, width, height);
}

// --- Shape Drawing Helpers ---
const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
}

const drawTriangle = (ctx: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number) => {
    const p1 = { x: startX, y: startY }; // Top point
    const p2 = { x: endX, y: endY }; // Bottom right
    const p3 = { x: startX - (endX - startX), y: endY }; // Bottom left
    
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
}


// --- Main Application Component ---
export default function ImageEditor() {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    const [activeTool, setActiveTool] = useState('Adjust');
    const [openAccordion, setOpenAccordion] = useState('Adjust');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [zoom, setZoom] = useState(1);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    // --- Export States ---
    const [isExporting, setIsExporting] = useState(false);
    const [exportFormat, setExportFormat] = useState<'png' | 'jpeg'>('png');
    const [exportQuality, setExportQuality] = useState(92);
    const exportRef = useRef<HTMLDivElement>(null);
    
    // --- Import Modal State ---
    const [showImportModal, setShowImportModal] = useState(false);
    
    // --- Drag and Drop States ---
    const [draggedLayerId, setDraggedLayerId] = useState<string | null>(null);
    const [isDraggingText, setIsDraggingText] = useState(false);
    const [textPosition, setTextPosition] = useState<{x: number, y: number} | null>(null);

    // --- Layer States ---
    const [layers, setLayers] = useState<Layer[]>([]);
    const [activeLayerId, setActiveLayerId] = useState<string | null>(null);

    // History states for Undo/Redo
    const [history, setHistory] = useState<Layer[][]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    
    // Adjustment states
    const [brightness, setBrightness] = useState(0);
    const [contrast, setContrast] = useState(0);
    const [saturation, setSaturation] = useState(0);
    const [hue, setHue] = useState(0);
    const [histogramData, setHistogramData] = useState<number[] | null>(null);
    
    // Transform states
    const [rotation, setRotation] = useState(0);
    const [scale, setScale] = useState({ x: 1, y: 1 });
    const [perspectiveX, setPerspectiveX] = useState(0);
    const [perspectiveY, setPerspectiveY] = useState(0);

    // Resize states
    const [resizeWidth, setResizeWidth] = useState(0);
    const [resizeHeight, setResizeHeight] = useState(0);
    const [aspectRatioLocked, setAspectRatioLocked] = useState(true);

    // Drawing states
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawColor, setDrawColor] = useState('#000000');
    const [drawSize, setDrawSize] = useState(5);
    
    // Text states
    const [textInput, setTextInput] = useState('');
    const [textColor, setTextColor] = useState('#000000');
    const [textSize, setTextSize] = useState(48);

    // Crop states
    const [isCropping, setIsCropping] = useState(false);
    const [cropRect, setCropRect] = useState<{ x: number, y: number, w: number, h: number } | null>(null);
    const [cropStart, setCropStart] = useState<{ x: number, y: number } | null>(null);
    
    // New states for advanced features
    const [gamma, setGamma] = useState(1);
    const [globalThreshold, setGlobalThreshold] = useState(128);
    const [adaptiveWindowSize, setAdaptiveWindowSize] = useState(15);
    const [adaptiveC, setAdaptiveC] = useState(10);
    const [activeShape, setActiveShape] = useState<ShapeType>('rectangle');
    const [shapeFill, setShapeFill] = useState(true);
    const [shapeColor, setShapeColor] = useState('#000000');
    const [isDrawingShape, setIsDrawingShape] = useState(false);
    const [shapeStart, setShapeStart] = useState<{x: number, y: number} | null>(null);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const resetAdjustments = useCallback(() => {
        setBrightness(0);
        setContrast(0);
        setSaturation(0);
        setHue(0);
        setRotation(0);
        setScale({ x: 1, y: 1 });
        setPerspectiveX(0);
        setPerspectiveY(0);
        setGamma(1);
        setGlobalThreshold(128);
    }, []);

    const commitHistory = useCallback((updatedLayers: Layer[]) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(JSON.parse(JSON.stringify(updatedLayers))); // Deep copy
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }, [history, historyIndex]);

    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    setCanvasSize({ width: img.width, height: img.height });
                    setResizeWidth(img.width);
                    setResizeHeight(img.height);

                    const newLayer: Layer = {
                        id: crypto.randomUUID(),
                        name: 'Background',
                        dataUrl: e.target?.result as string,
                        isVisible: true,
                        opacity: 1,
                        blendMode: 'source-over',
                        zIndex: 0,
                    };

                    setLayers([newLayer]);
                    setActiveLayerId(newLayer.id);
                    commitHistory([newLayer]);
                    resetAdjustments();
                    setZoom(1);
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    const drawCanvas = useCallback(async () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas || layers.length === 0) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex);

        for (const layer of sortedLayers) {
            if (!layer.isVisible) continue;

            if (layer.dataUrl) {
                const img = new Image();
                // This is a Promise wrapper for image loading
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = layer.dataUrl;
                });
    
                ctx.save();
                ctx.globalAlpha = layer.opacity;
                ctx.globalCompositeOperation = layer.blendMode;
    
                if (layer.id === activeLayerId) {
                    // Apply live adjustments only to the active layer
                    const rad = rotation * Math.PI / 180;
                    ctx.filter = `brightness(${100 + brightness}%) contrast(${100 + contrast}%) saturate(${100 + saturation}%) hue-rotate(${hue}deg)`;
                    
                    // Note: transforms like rotate and perspective change the canvas context itself
                    // for simplicity in this refactor, they apply to the whole canvas view
                    ctx.translate(canvas.width / 2, canvas.height / 2);
                    const Px = perspectiveX / 200;
                    const Py = perspectiveY / 200;
                    ctx.transform(1, Py, Px, 1, 0, 0);
                    ctx.rotate(rad);
                    ctx.scale(scale.x, scale.y);
                    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    
                } else {
                    // Draw image to fit canvas dimensions
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                }
                ctx.restore();
            }
        }

        // Draw text preview if dragging
        if (isDraggingText && textPosition && textInput) {
            ctx.save();
            ctx.font = `${textSize}px Arial`;
            ctx.fillStyle = textColor;
            ctx.globalAlpha = 0.7;
            ctx.fillText(textInput, textPosition.x, textPosition.y);
            ctx.restore();
        }

    }, [layers, activeLayerId, brightness, contrast, saturation, hue, rotation, scale, perspectiveX, perspectiveY, isDraggingText, textPosition, textInput, textSize, textColor]);
    
    const calculateHistogram = useCallback((canvas: HTMLCanvasElement) => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const hist = new Array(256).fill(0);
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const luminance = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
            hist[luminance]++;
        }
        setHistogramData(hist);
    }, []);

    useEffect(() => {
        if (layers.length > 0 && canvasRef.current) {
            // Set canvas size to match the largest layer or canvas size
            let maxWidth = canvasSize.width;
            let maxHeight = canvasSize.height;
            
            layers.forEach(layer => {
                if (layer.dataUrl) {
                    const img = new Image();
                    img.onload = () => {
                        if (img.width > maxWidth) maxWidth = img.width;
                        if (img.height > maxHeight) maxHeight = img.height;
                        
                        canvasRef.current!.width = maxWidth;
                        canvasRef.current!.height = maxHeight;
            drawCanvas().then(() => {
                if(canvasRef.current) calculateHistogram(canvasRef.current);
            });
                    };
                    img.src = layer.dataUrl;
                }
            });
            
            // If no images loaded yet, use current canvas size
            if (maxWidth === canvasSize.width && maxHeight === canvasSize.height) {
                canvasRef.current.width = maxWidth;
                canvasRef.current.height = maxHeight;
                drawCanvas().then(() => {
                    if(canvasRef.current) calculateHistogram(canvasRef.current);
                });
            }
        }
    }, [layers, canvasSize, drawCanvas, calculateHistogram]);


    // This function applies an operation to the active layer and commits the result
    const applyToActiveLayer = useCallback(async (operation: (ctx: CanvasRenderingContext2D, img: HTMLImageElement | null) => void) => {
        const activeLayer = layers.find(l => l.id === activeLayerId);
        if (!activeLayer) return;

        let img: HTMLImageElement | null = null;
        if (activeLayer.dataUrl) {
            img = new Image();
            await new Promise(resolve => {
                img!.onload = resolve;
                img!.src = activeLayer.dataUrl;
            });
        }


        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = canvasSize.width;
        offscreenCanvas.height = canvasSize.height;
        const offscreenCtx = offscreenCanvas.getContext('2d');
        if (!offscreenCtx) return;

        operation(offscreenCtx, img);
        
        const newDataUrl = offscreenCanvas.toDataURL();
        const updatedLayers = layers.map(l =>
            l.id === activeLayerId ? { ...l, dataUrl: newDataUrl } : l
        );

        setLayers(updatedLayers);
        commitHistory(updatedLayers);
        resetAdjustments();

    }, [layers, activeLayerId, canvasSize, commitHistory, resetAdjustments]);

    const handleExport = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const link = document.createElement('a');
            const format = `image/${exportFormat}`;
            link.download = `edited-image.${exportFormat}`;
            link.href = canvas.toDataURL(format, exportQuality / 100);
            link.click();
            setIsExporting(false);
        }
    };
    
    // Close export popover on outside click
    useEffect(() => {
        const handleClickOutside = (event: globalThis.MouseEvent) => {
            if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
                setIsExporting(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    const handleResetToOriginal = () => {
        if (history.length === 0) return;
        const originalState = history[0];
        setLayers(originalState);
        commitHistory(originalState);
        resetAdjustments();
    };

    const handleUndo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            const prevState = history[newIndex];
            setLayers(prevState);
            resetAdjustments();
        }
    };
    
    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            const nextState = history[newIndex];
            setLayers(nextState);
            resetAdjustments();
        }
    };
    
    const handleToolClick = (toolName: string) => {
        setActiveTool(toolName);
        setOpenAccordion(toolName);
        setIsCropping(toolName === 'Crop');
        if (toolName !== 'Crop') {
            setCropRect(null);
            setCropStart(null);
        }
    };

    const handleAccordionToggle = (accordionName: string) => {
        const newOpenState = openAccordion === accordionName ? '' : accordionName;
        setOpenAccordion(newOpenState);
        setActiveTool(newOpenState);
        setIsCropping(newOpenState === 'Crop');
    };

    const getCanvasMousePos = (e: MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY,
        };
    };

    const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
        const pos = getCanvasMousePos(e);
        if (activeTool === 'Draw') {
            setIsDrawing(true);
            const ctx = canvasRef.current?.getContext('2d');
            if (ctx) {
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y);
            }
        } else if (activeTool === 'Crop' && isCropping) {
             setCropStart(pos);
             setCropRect({ ...pos, w: 0, h: 0 });
        } else if (activeTool === 'Shapes') {
            setIsDrawingShape(true);
            setShapeStart(pos);
        }
    };

    const handleMouseMove = async (e: MouseEvent<HTMLCanvasElement>) => {
        const pos = getCanvasMousePos(e);
        if (isDrawing && activeTool === 'Draw') {
            const ctx = canvasRef.current?.getContext('2d');
            if (ctx) {
                ctx.lineTo(pos.x, pos.y);
                ctx.strokeStyle = drawColor;
                ctx.lineWidth = drawSize;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.stroke();
            }
        } else if (isCropping && cropStart && activeTool === 'Crop') {
            const width = pos.x - cropStart.x;
            const height = pos.y - cropStart.y;
            setCropRect({ x: cropStart.x, y: cropStart.y, w: width, h: height });
        } else if (isDrawingShape && shapeStart && activeTool === 'Shapes') {
            await drawCanvas(); // FIX: Await canvas redraw before drawing preview shape
            const ctx = canvasRef.current?.getContext('2d');
            if(ctx) {
                ctx.beginPath();
                const width = pos.x - shapeStart.x;
                const height = pos.y - shapeStart.y;
                if(activeShape === 'rectangle'){
                    // Make rectangle have consistent sizing - use the larger dimension for both width and height
                    const size = Math.max(Math.abs(width), Math.abs(height));
                    const signX = width >= 0 ? 1 : -1;
                    const signY = height >= 0 ? 1 : -1;
                    ctx.rect(shapeStart.x, shapeStart.y, size * signX, size * signY);
                } else if (activeShape === 'circle') {
                    const radius = Math.sqrt(width * width + height * height);
                    ctx.arc(shapeStart.x, shapeStart.y, radius, 0, 2 * Math.PI);
                } else if (activeShape === 'triangle') {
                    drawTriangle(ctx, shapeStart.x, shapeStart.y, pos.x, pos.y);
                } else if (activeShape === 'star') {
                    const radius = Math.sqrt(width * width + height * height);
                    drawStar(ctx, shapeStart.x, shapeStart.y, 5, radius, radius / 2.5);
                }

                if(shapeFill){
                    ctx.fillStyle = shapeColor;
                    ctx.fill();
                } else {
                    ctx.strokeStyle = shapeColor;
                    ctx.lineWidth = drawSize;
                    ctx.stroke();
                }
            }
        } else if (isDraggingText && activeTool === 'Text') {
            handleTextDrag(e);
        }
    };

    const handleMouseUp = (e: MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        if(isDrawing || isDrawingShape) {
            setIsDrawing(false);
            setIsDrawingShape(false);
            
            // This logic flattens layers, so it should be improved in the future
            // For now, it provides basic drawing functionality
            const currentCanvasState = canvas.toDataURL();
            const updatedLayers = layers.map(l =>
                l.id === activeLayerId ? { ...l, dataUrl: currentCanvasState } : l
            );
            setLayers(updatedLayers);
            commitHistory(updatedLayers);
        }
        if(isCropping) {
            setCropStart(null);
        }
        if(isDraggingText) {
            handleTextDrop();
        }
    };
    
    const handleCanvasClick = (e: MouseEvent<HTMLCanvasElement>) => {
        if(activeTool === 'Text' && textInput) {
            handleApplyText(e);
        } else if (activeTool === 'Shapes' && activeShape === 'fill') {
            handleFloodFill(e);
        }
    }
    
    const handleApplyText = (e: MouseEvent<HTMLCanvasElement>) => {
        const pos = getCanvasMousePos(e);
        setTextPosition(pos);
        setIsDraggingText(true);
    };

    const handleTextDrag = (e: MouseEvent<HTMLCanvasElement>) => {
        if (isDraggingText && textPosition) {
            const newPos = getCanvasMousePos(e);
            setTextPosition(newPos);
        }
    };

    const handleTextDrop = () => {
        if (isDraggingText && textPosition && textInput) {
        applyToActiveLayer((ctx, img) => {
            if (img) ctx.drawImage(img, 0, 0);
            ctx.font = `${textSize}px Arial`;
            ctx.fillStyle = textColor;
                ctx.fillText(textInput, textPosition.x, textPosition.y);
        });
        setTextInput('');
            setIsDraggingText(false);
            setTextPosition(null);
        }
    };
    
    const handleApplyFilter = (filter: string) => {
        const kernels: { [key: string]: number[][] } = {
            meanBlur: [[1/9, 1/9, 1/9], [1/9, 1/9, 1/9], [1/9, 1/9, 1/9]],
            gaussianBlur: [[1/16, 2/16, 1/16], [2/16, 4/16, 2/16], [1/16, 2/16, 1/16]],
            sharpen: [[0, -1, 0], [-1, 5, -1], [0, -1, 0]],
            laplacian: [[0, 1, 0], [1, -4, 1], [0, 1, 0]],
        };

        applyToActiveLayer((ctx, img) => {
            if (img) ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
            let newImageData;
            switch (filter) {
                case 'grayscale':
                    for (let i = 0; i < imageData.data.length; i += 4) {
                        const r = imageData.data[i], g = imageData.data[i + 1], b = imageData.data[i + 2];
                        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
                        imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = gray;
                    }
                    newImageData = imageData;
                    break;
                case 'meanBlur': case 'gaussianBlur': case 'sharpen': case 'laplacian':
                    newImageData = applyConvolution(imageData, kernels[filter]);
                    break;
                case 'sobel':
                    newImageData = applySobel(imageData);
                    break;
                case 'median': case 'min': case 'max':
                    newImageData = applyNeighborhoodFilter(imageData, filter as 'median' | 'min' | 'max');
                    break;
                default:
                    newImageData = imageData;
            }
            ctx.putImageData(newImageData, 0, 0);
        });
    };


    const handleApplyCrop = async () => {
        if (!cropRect || cropRect.w === 0 || cropRect.h === 0) return;
        
        const x = cropRect.w >= 0 ? cropRect.x : cropRect.x + cropRect.w;
        const y = cropRect.h >= 0 ? cropRect.y : cropRect.y + cropRect.h;
        const w = Math.abs(cropRect.w);
        const h = Math.abs(cropRect.h);

        const newCanvasSize = { width: w, height: h };
        
        const updatedLayersPromises = layers.map(async (l) => {
            if (!l.dataUrl) return l;
            const img = new Image();
            // FIX: Wait for image to load before drawing
            await new Promise(resolve => {
                img.onload = resolve;
                img.src = l.dataUrl;
            });

            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = w;
            tempCanvas.height = h;
            const tempCtx = tempCanvas.getContext('2d');
            if (!tempCtx) return l;
            tempCtx.drawImage(img, x, y, w, h, 0, 0, w, h);
            return { ...l, dataUrl: tempCanvas.toDataURL() };
        });

        const updatedLayers = await Promise.all(updatedLayersPromises);

        setCanvasSize(newCanvasSize);
        setLayers(updatedLayers);
        commitHistory(updatedLayers);

        setCropRect(null); setCropStart(null); setIsCropping(false);
        setActiveTool('Adjust');
        setOpenAccordion('Adjust');
    };

    const handleApplyTransforms = () => {
        applyToActiveLayer((ctx, img) => {
            if (!img) return;
            const rad = rotation * Math.PI / 180;
            const Px = perspectiveX / 200;
            const Py = perspectiveY / 200;

            ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
            ctx.transform(1, Py, Px, 1, 0, 0);
            ctx.rotate(rad);
            ctx.scale(scale.x, scale.y);
            ctx.drawImage(img, -img.width / 2, -img.height / 2);
        });
    };

    useEffect(() => {
        if (layers.length > 0) {
            setResizeWidth(canvasSize.width);
            setResizeHeight(canvasSize.height);
        }
    }, [layers, canvasSize]);

    const handleResizeWidthChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newWidth = Number(e.target.value);
        setResizeWidth(newWidth);
        if (aspectRatioLocked && canvasSize.width > 0) {
            setResizeHeight(Math.round(newWidth * (canvasSize.height / canvasSize.width)));
        }
    };
    const handleResizeHeightChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newHeight = Number(e.target.value);
        setResizeHeight(newHeight);
        if (aspectRatioLocked && canvasSize.height > 0) {
            setResizeWidth(Math.round(newHeight * (canvasSize.width / canvasSize.height)));
        }
    };

    const handleApplyResize = async () => {
        if (layers.length === 0 || resizeWidth <= 0 || resizeHeight <= 0) return;
        
        const newCanvasSize = { width: resizeWidth, height: resizeHeight };

        const updatedLayersPromises = layers.map(async (l) => {
            if (!l.dataUrl) return l;
            const img = new Image();
             // FIX: Wait for image to load before drawing
            await new Promise(resolve => {
                img.onload = resolve;
                img.src = l.dataUrl;
            });
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = resizeWidth;
            tempCanvas.height = resizeHeight;
            const tempCtx = tempCanvas.getContext('2d');
            if(!tempCtx) return l;
            tempCtx.drawImage(img, 0, 0, resizeWidth, resizeHeight);
            return {...l, dataUrl: tempCanvas.toDataURL()};
        });

        const updatedLayers = await Promise.all(updatedLayersPromises);
        
        setCanvasSize(newCanvasSize);
        setLayers(updatedLayers);
        commitHistory(updatedLayers);
    };
    
    const applyLiveAdjustments = () => {
       applyToActiveLayer((ctx, img) => {
          if (!img) return;
          ctx.filter = `brightness(${100 + brightness}%) contrast(${100 + contrast}%) saturate(${100 + saturation}%) hue-rotate(${hue}deg)`;
          ctx.drawImage(img, 0, 0);
       });
    };

    const applyHistogramEqualization = () => {
       applyToActiveLayer((ctx, img) => {
          if (!img) return;
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
          // ... (rest of the logic remains the same)
          const data = imageData.data;
          const totalPixels = data.length / 4;
          const lightnessHistogram = new Array(256).fill(0);
          const hslPixels = [];
          for (let i = 0; i < data.length; i += 4) {
              const hsl = rgbToHsl(data[i], data[i + 1], data[i + 2]);
              hslPixels.push(hsl);
              const lIndex = Math.round(hsl[2] * 255);
              lightnessHistogram[lIndex]++;
          }
          const cdf = new Array(256).fill(0);
          cdf[0] = lightnessHistogram[0];
          for (let i = 1; i < 256; i++) {
              cdf[i] = cdf[i - 1] + lightnessHistogram[i];
          }
          const cdfMin = cdf.find(val => val > 0) || 0;
          for (let i = 0; i < totalPixels; i++) {
              const [h, s, l] = hslPixels[i];
              const lIndex = Math.round(l * 255);
              const newL = (cdf[lIndex] - cdfMin) / (totalPixels - cdfMin);
              const [r, g, b] = hslToRgb(h, s, newL);
              data[i * 4] = r;
              data[i * 4 + 1] = g;
              data[i * 4 + 2] = b;
          }
          ctx.putImageData(imageData, 0, 0);
       });
    };
    
    const applyContrastStretching = () => {
       applyToActiveLayer((ctx, img) => {
          if (!img) return;
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
          // ... (rest of the logic remains the same)
          const data = imageData.data;
          const totalPixels = data.length / 4;
          let minL = 1, maxL = 0;
          const hslPixels = [];
          for (let i = 0; i < data.length; i += 4) {
              const hsl = rgbToHsl(data[i], data[i + 1], data[i + 2]);
              hslPixels.push(hsl);
              if (hsl[2] < minL) minL = hsl[2];
              if (hsl[2] > maxL) maxL = hsl[2];
          }
          if (maxL === minL) return; // Avoid division by zero
          for (let i = 0; i < totalPixels; i++) {
              const [h, s, l] = hslPixels[i];
              const newL = (l - minL) * (1 / (maxL - minL));
              const [r, g, b] = hslToRgb(h, s, newL);
              data[i * 4] = r;
              data[i * 4 + 1] = g;
              data[i * 4 + 2] = b;
          }
          ctx.putImageData(imageData, 0, 0);
       });
    };
    
    const applyGammaCorrection = () => {
        applyToActiveLayer((ctx, img) => {
            if (!img) return;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
            const data = imageData.data;
            const gammaCorrection = 1 / gamma;
            for (let i = 0; i < data.length; i += 4) {
                data[i] = 255 * Math.pow(data[i] / 255, gammaCorrection);
                data[i + 1] = 255 * Math.pow(data[i + 1] / 255, gammaCorrection);
                data[i + 2] = 255 * Math.pow(data[i + 2] / 255, gammaCorrection);
            }
            ctx.putImageData(imageData, 0, 0);
        });
    };

    const applyThreshold = (isAdaptive: boolean) => {
        if(isAdaptive) {
            applyAdaptiveThreshold();
        } else {
        applyToActiveLayer((ctx, img) => {
            if (!img) return;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const luminance = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
                const value = luminance > globalThreshold ? 255 : 0;
                data[i] = data[i+1] = data[i+2] = value;
            }
                ctx.putImageData(imageData, 0, 0);
            });
        }
    }

    const applyAdaptiveThreshold = () => {
        applyToActiveLayer((ctx, img) => {
            if (!img) return;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
            const data = imageData.data;
            const width = imageData.width;
            const height = imageData.height;
            
            // Convert to grayscale first
            const grayscale = new Uint8ClampedArray(width * height);
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                grayscale[i / 4] = 0.299 * r + 0.587 * g + 0.114 * b;
            }
            
            // Adaptive threshold parameters
            const windowSize = adaptiveWindowSize; // Local window size (should be odd)
            const C = adaptiveC; // Constant subtracted from mean
            const halfWindow = Math.floor(windowSize / 2);
            
            // Apply adaptive threshold
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    let sum = 0;
                    let count = 0;
                    
                    // Calculate local mean in window
                    for (let wy = -halfWindow; wy <= halfWindow; wy++) {
                        for (let wx = -halfWindow; wx <= halfWindow; wx++) {
                            const ny = y + wy;
                            const nx = x + wx;
                            
                            if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
                                sum += grayscale[ny * width + nx];
                                count++;
                            }
                        }
                    }
                    
                    const localMean = sum / count;
                    const currentPixel = grayscale[y * width + x];
                    const threshold = localMean - C;
                    
                    const value = currentPixel > threshold ? 255 : 0;
                    const index = (y * width + x) * 4;
                    data[index] = data[index + 1] = data[index + 2] = value;
                }
            }
            
            ctx.putImageData(imageData, 0, 0);
        });
    }

    const applyMorphology = (type: 'erode' | 'dilate') => {
        applyToActiveLayer((ctx, img) => {
            if (!img) return;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
            // ... (rest of logic remains the same)
            const src = imageData.data;
            const width = imageData.width;
            const height = imageData.height;
            const dstData = new Uint8ClampedArray(src.length);
            const binary = new Uint8ClampedArray(width * height);
            for(let i=0; i < src.length; i+=4) {
                const luminance = 0.299 * src[i] + 0.587 * src[i+1] + 0.114 * src[i+2];
                binary[i/4] = luminance > 128 ? 1 : 0;
            }
            for (let y = 1; y < height - 1; y++) {
                for (let x = 1; x < width - 1; x++) {
                    let hit = (type === 'erode'); // Start with opposite assumption
                    for (let ky = -1; ky <= 1; ky++) {
                        for (let kx = -1; kx <= 1; kx++) {
                            const pixel = binary[(y + ky) * width + (x + kx)];
                            if (type === 'erode' && pixel === 0) {
                                hit = false;
                            } else if (type === 'dilate' && pixel === 1) {
                                hit = true;
                            }
                        }
                    }
                    const dstIndex = (y * width + x) * 4;
                    const value = hit ? 255 : 0;
                    dstData[dstIndex] = dstData[dstIndex+1] = dstData[dstIndex+2] = value;
                    dstData[dstIndex+3] = 255;
                }
            }
            ctx.putImageData(new ImageData(dstData, width, height), 0, 0);
        });
    }
    
    const handleFloodFill = (e: MouseEvent<HTMLCanvasElement>) => {
        const pos = getCanvasMousePos(e);
        applyToActiveLayer((ctx, img) => {
            if (!img) return;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
            const data = imageData.data;
            const width = imageData.width;
            const height = imageData.height;
            
            // Get the target color at the clicked position
            const x = Math.floor(pos.x);
            const y = Math.floor(pos.y);
            const index = (y * width + x) * 4;
            
            if (x < 0 || x >= width || y < 0 || y >= height) return;
            
            const targetR = data[index];
            const targetG = data[index + 1];
            const targetB = data[index + 2];
            const targetA = data[index + 3];
            
            // Parse fill color
            const fillColor = shapeColor;
            const fillR = parseInt(fillColor.slice(1, 3), 16);
            const fillG = parseInt(fillColor.slice(3, 5), 16);
            const fillB = parseInt(fillColor.slice(5, 7), 16);
            
            // Check if already filled
            if (targetR === fillR && targetG === fillG && targetB === fillB) return;
            
            // Flood fill using stack-based approach
            const stack: [number, number][] = [[x, y]];
            const visited = new Set<string>();
            
            while (stack.length > 0) {
                const [currentX, currentY] = stack.pop()!;
                const key = `${currentX},${currentY}`;
                
                if (visited.has(key)) continue;
                if (currentX < 0 || currentX >= width || currentY < 0 || currentY >= height) continue;
                
                const currentIndex = (currentY * width + currentX) * 4;
                const currentR = data[currentIndex];
                const currentG = data[currentIndex + 1];
                const currentB = data[currentIndex + 2];
                const currentA = data[currentIndex + 3];
                
                // Check if pixel matches target color (with tolerance)
                const tolerance = 10;
                if (Math.abs(currentR - targetR) <= tolerance &&
                    Math.abs(currentG - targetG) <= tolerance &&
                    Math.abs(currentB - targetB) <= tolerance &&
                    Math.abs(currentA - targetA) <= tolerance) {
                    
                    // Fill the pixel
                    data[currentIndex] = fillR;
                    data[currentIndex + 1] = fillG;
                    data[currentIndex + 2] = fillB;
                    data[currentIndex + 3] = 255;
                    
                    visited.add(key);
                    
                    // Add neighbors to stack
                    stack.push([currentX + 1, currentY]);
                    stack.push([currentX - 1, currentY]);
                    stack.push([currentX, currentY + 1]);
                    stack.push([currentX, currentY - 1]);
                }
            }
            
            ctx.putImageData(imageData, 0, 0);
        });
    };

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 5));
    const handleZoomOut = () => setZoom(prev => Math.max(0.2, prev - 0.1));
    const handleZoomReset = () => setZoom(1);

    // --- Layer management functions ---
    const handleAddNewLayer = () => {
        const newLayer: Layer = {
            id: crypto.randomUUID(),
            name: `Layer ${layers.length + 1}`,
            dataUrl: '', // Will be transparent
            isVisible: true,
            opacity: 1,
            blendMode: 'source-over',
            zIndex: (Math.max(...layers.map(l => l.zIndex)) || -1) + 1,
        };
        const updatedLayers = [...layers, newLayer];
        setLayers(updatedLayers);
        setActiveLayerId(newLayer.id);
        commitHistory(updatedLayers);
    };

    const handleAddImageLayer = () => {
        fileInputRef.current?.click();
    };

    const handleImageUploadAsLayer = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const newLayer: Layer = {
                        id: crypto.randomUUID(),
                        name: file.name.split('.')[0] || `Image Layer ${layers.length + 1}`,
                        dataUrl: e.target?.result as string,
                        isVisible: true,
                        opacity: 1,
                        blendMode: 'source-over',
                        zIndex: (Math.max(...layers.map(l => l.zIndex)) || -1) + 1,
                    };

                    const updatedLayers = [...layers, newLayer];
                    setLayers(updatedLayers);
                    setActiveLayerId(newLayer.id);
                    commitHistory(updatedLayers);

                    // Update canvas size if this is the first layer or if it's larger
                    if (layers.length === 0 || img.width > canvasSize.width || img.height > canvasSize.height) {
                        setCanvasSize({ width: img.width, height: img.height });
                        setResizeWidth(img.width);
                        setResizeHeight(img.height);
                    }
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteLayer = (id: string) => {
        const updatedLayers = layers.filter(l => l.id !== id);
        setLayers(updatedLayers);
        if (activeLayerId === id) {
            setActiveLayerId(updatedLayers.length > 0 ? updatedLayers[updatedLayers.length - 1].id : null);
        }
        commitHistory(updatedLayers);
    };

    const handleLayerUpdate = (id: string, updates: Partial<Layer>) => {
        const updatedLayers = layers.map(l => l.id === id ? { ...l, ...updates } : l);
        setLayers(updatedLayers);
        // Do not commit to history for every minor slider change for performance.
    };

    const handleLayerUpdateAndCommit = (id: string, updates: Partial<Layer>) => {
        const updatedLayers = layers.map(l => l.id === id ? { ...l, ...updates } : l);
        setLayers(updatedLayers);
        commitHistory(updatedLayers);
    };

    // --- Layer Drag and Drop Functions ---
    const handleLayerDragStart = (e: React.DragEvent, layerId: string) => {
        setDraggedLayerId(layerId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleLayerDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleLayerDrop = (e: React.DragEvent, targetLayerId: string) => {
        e.preventDefault();
        if (!draggedLayerId || draggedLayerId === targetLayerId) return;

        const draggedLayer = layers.find(l => l.id === draggedLayerId);
        const targetLayer = layers.find(l => l.id === targetLayerId);
        
        if (!draggedLayer || !targetLayer) return;

        const updatedLayers = layers.map(layer => {
            if (layer.id === draggedLayerId) {
                return { ...layer, zIndex: targetLayer.zIndex };
            } else if (layer.id === targetLayerId) {
                return { ...layer, zIndex: draggedLayer.zIndex };
            }
            return layer;
        });

        setLayers(updatedLayers);
        commitHistory(updatedLayers);
        setDraggedLayerId(null);
    };

    const handleLayerDragEnd = () => {
        setDraggedLayerId(null);
    };


    const mainTools = [
        { name: 'Crop', icon: <CropIcon className="w-6 h-6" /> },
        { name: 'Transform', icon: <ResizeIcon className="w-6 h-6" /> },
        { name: 'Resize', icon: <MaximizeIcon className="w-6 h-6" /> },
        { name: 'Adjust', icon: <SunIcon className="w-6 h-6" /> },
        { name: 'Filter', icon: <FilterIcon className="w-6 h-6" /> },
        { name: 'Enhance', icon: <WandIcon className="w-6 h-6" />},
        { name: 'Morphology', icon: <MorphologyIcon className="w-6 h-6" />},
        { name: 'Frequency', icon: <FrequencyIcon className="w-6 h-6" />},
        { name: 'Draw', icon: <PenToolIcon className="w-6 h-6" /> },
        { name: 'Text', icon: <TextIcon className="w-6 h-6" /> },
        { name: 'Shapes', icon: <ShapesIcon className="w-6 h-6" />},
        
    ];
    
    return (
        <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 h-screen w-screen flex flex-col font-sans overflow-hidden fixed inset-0">
            <style>{`
                /* Full Screen Reset */
                body, html { margin: 0; padding: 0; overflow: hidden; }
                
                /* Custom Scrollbar Styling */
                .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                html.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #4B5563; }
                html.light .custom-scrollbar::-webkit-scrollbar-thumb { background: #D1D5DB; }
                html.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #6B7280; }
                html.light .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9CA3AF; }
                
                /* Professional Tool Animations */
                .tool-button {
                    transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .tool-button:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }
                .tool-button.active {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(20, 184, 166, 0.2);
                }
                
                /* Full-screen canvas styling */
                .canvas-container {
                    background: #f8f9fa;
                    background-image: 
                        radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0);
                    background-size: 20px 20px;
                }
                html.dark .canvas-container {
                    background: #1a1a1a;
                    background-image: 
                        radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0);
                }
            `}</style>
            
            {/* Minimal Professional Header */}
            <header className="flex items-center justify-between h-12 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 z-30 flex-shrink-0">
                <div className="flex items-center space-x-4">
                    {/* Logo - Made Smaller */}
                    <div className="flex items-center space-x-1">
                        <img 
                            src="/images/logo-darktheme.png" 
                            onClick={() => window.location.href = '/'}
                            alt="Clearity" 
                            className="h-6 w-auto cursor-pointer hover:opacity-80 transition"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                            }}
                        />
                        <div className="hidden text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                            Clearity
                        </div>
                    </div>

                    {/* Breadcrumb Navigation */}
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <a 
                            href="/" 
                            className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
                        >
                            Home
                        </a>
                        <span className="text-gray-400 dark:text-gray-500">›</span>
                        <span className="text-gray-900 dark:text-gray-100 font-medium">Editor</span>
                    </div>
                </div>
                
                <div className="flex items-center space-x-2">
                    {/* Essential Controls */}
                    <button 
                        onClick={toggleTheme} 
                        className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                        title="Toggle Theme"
                    >
                        {theme === 'light' ? <MoonIcon className="w-4 h-4"/> : <SunIcon className="w-4 h-4"/>}
                    </button>
                    
                    <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                    
                    {/* Zoom Controls */}
                    <div className="flex items-center space-x-1 bg-gray-50 dark:bg-gray-700 rounded px-2 py-1">
                        <button 
                            onClick={handleZoomOut} 
                            disabled={layers.length === 0} 
                            className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                            title="Zoom Out"
                        >
                            <ZoomOutIcon className="w-3.5 h-3.5"/>
                        </button>
                        <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[40px] text-center">
                            {Math.round(zoom * 100)}%
                        </span>
                        <button 
                            onClick={handleZoomIn} 
                            disabled={layers.length === 0} 
                            className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                            title="Zoom In"
                        >
                            <ZoomInIcon className="w-3.5 h-3.5"/>
                        </button>
                    </div>
                    <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                    {/* Undo/Redo */}
                    <button 
                        onClick={handleUndo} 
                        disabled={historyIndex <= 0} 
                        className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                        title="Undo"
                    >
                        <UndoIcon className="w-4 h-4"/>
                    </button>
                    <button 
                        onClick={handleRedo} 
                        disabled={historyIndex >= history.length - 1} 
                        className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                        title="Redo"
                    >
                        <RedoIcon className="w-4 h-4"/>
                    </button>
                    
                    <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                    
                    {/* Action Buttons */}
                    <button 
                        onClick={() => fileInputRef.current?.click()} 
                        className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                        Open
                    </button>
                    <div className="relative" ref={exportRef}>
                        <button 
                            onClick={() => setIsExporting(!isExporting)} 
                            disabled={layers.length === 0} 
                            className="px-3 py-1.5 text-sm bg-cyan-600 hover:bg-cyan-700 text-white rounded transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Export
                        </button>
                        {isExporting && (
                            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 space-y-3 z-50">
                                <h3 className="font-medium text-sm">Export Options</h3>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-600 dark:text-gray-400">Format</label>
                                    <div className="flex gap-1">
                                        <button 
                                            onClick={() => setExportFormat('png')} 
                                            className={`flex-1 p-2 text-xs rounded ${
                                                exportFormat === 'png' 
                                                    ? 'bg-cyan-600 text-white' 
                                                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }`}
                                        >
                                            PNG
                                        </button>
                                        <button 
                                            onClick={() => setExportFormat('jpeg')} 
                                            className={`flex-1 p-2 text-xs rounded ${
                                                exportFormat === 'jpeg' 
                                                    ? 'bg-cyan-600 text-white' 
                                                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }`}
                                        >
                                            JPG
                                        </button>
                                    </div>
                                </div>
                                {exportFormat === 'jpeg' && (
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-600 dark:text-gray-400">Quality: {exportQuality}%</label>
                                        <input 
                                            type="range" 
                                            min="1" 
                                            max="100" 
                                            value={exportQuality} 
                                            onChange={(e) => setExportQuality(Number(e.target.value))} 
                                            className="w-full h-1 bg-gray-200 dark:bg-gray-600 rounded appearance-none cursor-pointer accent-cyan-500" 
                                        />
                                    </div>
                                )}
                                <button 
                                    onClick={handleExport} 
                                    className="w-full p-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs rounded transition-colors"
                                >
                                    Download
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* 3-Panel Layout */}
            <main className="flex-grow flex overflow-hidden">
                <input type="file" ref={fileInputRef} onChange={layers.length === 0 ? handleImageUpload : handleImageUploadAsLayer} accept="image/*" className="hidden" />
                
                {/* Left Panel - Layers */}
                <aside className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Layers</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                        <div className="space-y-2 mb-4">
                            <button onClick={handleAddNewLayer} className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm">
                                <PlusIcon className="w-4 h-4" /> Add Empty Layer
                            </button>
                            <button onClick={handleAddImageLayer} className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Add Image Layer
                            </button>
                        </div>
                        <div className="space-y-2">
                            {[...layers].sort((a,b) => b.zIndex - a.zIndex).map(layer => (
                                <div 
                                    key={layer.id} 
                                    draggable
                                    onDragStart={(e) => handleLayerDragStart(e, layer.id)}
                                    onDragOver={handleLayerDragOver}
                                    onDrop={(e) => handleLayerDrop(e, layer.id)}
                                    onDragEnd={handleLayerDragEnd}
                                    onClick={() => setActiveLayerId(layer.id)} 
                                    className={`p-3 rounded-lg flex flex-col space-y-2 cursor-pointer transition-colors ${activeLayerId === layer.id ? 'bg-cyan-100 dark:bg-cyan-900/50 border border-cyan-300 dark:border-cyan-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800/50 border border-transparent'} ${draggedLayerId === layer.id ? 'opacity-50' : ''}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <input 
                                            type="text" 
                                            value={layer.name} 
                                            onChange={(e) => handleLayerUpdate(layer.id, { name: e.target.value })}
                                            onBlur={() => commitHistory(layers)}
                                            className="bg-transparent text-sm font-semibold focus:bg-gray-100 dark:focus:bg-gray-800 rounded px-1 flex-1"
                                        />
                                        <div className="flex items-center space-x-2">
                                            <button onClick={(e) => {e.stopPropagation(); handleLayerUpdateAndCommit(layer.id, { isVisible: !layer.isVisible });}}>
                                                {layer.isVisible ? <EyeIcon className="w-4 h-4 text-gray-600 dark:text-gray-300"/> : <EyeOffIcon className="w-4 h-4 text-gray-400 dark:text-gray-500"/>}
                                            </button>
                                            <button onClick={(e) => {e.stopPropagation(); handleDeleteLayer(layer.id);}}>
                                                <TrashIcon className="w-4 h-4 text-red-500 hover:text-red-600"/>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-xs">
                                        <label>Opacity: {Math.round(layer.opacity * 100)}%</label>
                                        <input 
                                            type="range" min="0" max="1" step="0.01" value={layer.opacity} 
                                            onChange={(e) => handleLayerUpdate(layer.id, { opacity: parseFloat(e.target.value) })}
                                            onMouseUp={() => commitHistory(layers)}
                                            className="w-full h-1 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                        />
                                        <label>Blend Mode</label>
                                        <select 
                                            value={layer.blendMode} 
                                            onChange={(e) => handleLayerUpdateAndCommit(layer.id, { blendMode: e.target.value as GlobalCompositeOperation })}
                                            className="w-full bg-gray-200 border-gray-300 rounded p-1 text-xs dark:bg-gray-700 dark:border-gray-600"
                                        >
                                            {['source-over', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'].map(mode => (
                                                <option key={mode} value={mode}>{mode}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Middle Panel - Canvas */}
                <div className="flex-1 canvas-container relative overflow-hidden flex items-center justify-center">
                    {layers.length === 0 && (
                        <div className="flex flex-col items-center justify-center text-center text-gray-500 p-16">
                            <div className="w-20 h-20 bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900 dark:to-blue-900 rounded-2xl flex items-center justify-center mb-6">
                                <svg className="w-10 h-10 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">Ready to Edit</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Import an image to get started with editing</p>
                            <button 
                                onClick={() => setShowImportModal(true)} 
                                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-cyan-500/25"
                            >
                                Import Image
                            </button>
                        </div>
                    )}
                    
                    {layers.length > 0 && (
                        <div 
                            className="relative bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-auto max-w-full max-h-full" 
                            style={{ 
                                transform: `scale(${zoom})`, 
                                transformOrigin: 'center', 
                                transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)' 
                            }}
                        >
                            <canvas 
                                ref={canvasRef} 
                                className={`bg-transparent ${activeTool === 'Draw' ? 'cursor-crosshair' : activeTool === 'Text' ? 'cursor-text' : (activeTool === 'Crop' || activeTool === 'Shapes') ? 'cursor-crosshair' : 'cursor-default'}`}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain'
                                }}
                                onMouseDown={handleMouseDown} 
                                onMouseMove={handleMouseMove} 
                                onMouseUp={handleMouseUp} 
                                onMouseLeave={handleMouseUp} 
                                onClick={handleCanvasClick} 
                            />
                            {isCropping && cropRect && (
                                <div className="absolute border-2 border-dashed border-cyan-500 dark:border-cyan-400 pointer-events-none rounded-lg" style={{
                                    left: cropRect.w >= 0 ? cropRect.x : cropRect.x + cropRect.w,
                                    top: cropRect.h >= 0 ? cropRect.y : cropRect.y + cropRect.h,
                                    width: Math.abs(cropRect.w),
                                    height: Math.abs(cropRect.h),
                                }}>
                                    <div className="absolute -top-2 -left-2 w-4 h-4 bg-cyan-500 dark:bg-cyan-400 rounded-full border-2 border-white dark:border-gray-900"></div>
                                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-cyan-500 dark:bg-cyan-400 rounded-full border-2 border-white dark:border-gray-900"></div>
                                    <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-cyan-500 dark:bg-cyan-400 rounded-full border-2 border-white dark:border-gray-900"></div>
                                    <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-cyan-500 dark:bg-cyan-400 rounded-full border-2 border-white dark:border-gray-900"></div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Panel - Tools */}
                <aside className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Tools</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {/* Tool Selection */}
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select Tool</h3>
                            <div className="grid grid-cols-3 gap-2">
                        {mainTools.map(tool => (
                            <button
                                key={tool.name}
                                onClick={() => handleToolClick(tool.name)}
                                disabled={layers.length === 0 && tool.name !== 'Adjust'}
                                        className={`p-3 rounded-lg transition-all duration-200 tool-button flex flex-col items-center ${
                                    activeTool === tool.name
                                        ? 'bg-cyan-600 text-white shadow-lg'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                title={tool.name}
                            >
                                {tool.icon}
                                        <span className="text-xs mt-1">{tool.name}</span>
                            </button>
                        ))}
                    </div>
                        </div>

                        {/* Tool Properties */}
                    <div className="p-4">
                            <Accordion title="Crop" icon={<CropIcon className="w-5 h-5" />} isOpen={openAccordion === 'Crop'} onToggle={() => handleAccordionToggle('Crop')}>
                                <div className="space-y-4">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Click and drag on the image to select an area.</p>
                                <button 
                                    onClick={handleApplyCrop} 
                                    disabled={!cropRect || cropRect.w === 0 || cropRect.h === 0} 
                                    className="w-full text-center p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium transition-all duration-200 disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-600 dark:disabled:to-gray-700 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
                                >
                                    Apply Crop
                                </button>
                            </div>
                        </Accordion>
                        <Accordion title="Transform" icon={<ResizeIcon className="w-5 h-5" />} isOpen={openAccordion === 'Transform'} onToggle={() => handleAccordionToggle('Transform')}>
                            <div className="p-4 space-y-4">
                                <div className="grid grid-cols-2 gap-2">
                                    <button className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-sm" onClick={() => setRotation(r => r - 90)}>Rotate Left</button>
                                    <button className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-sm" onClick={() => setRotation(r => r + 90)}>Rotate Right</button>
                                    <button className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-sm" onClick={() => setScale(s => ({ ...s, x: -s.x }))}>Flip H</button>
                                    <button className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-sm" onClick={() => setScale(s => ({ ...s, y: -s.y }))}>Flip V</button>
                                </div>
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                                    <Slider icon={<PerspectiveIcon className="w-5 h-5" />} label="Perspective H" value={perspectiveX} onChange={(e) => setPerspectiveX(Number(e.target.value))} />
                                    <Slider icon={<PerspectiveIcon className="w-5 h-5 -rotate-90" />} label="Perspective V" value={perspectiveY} onChange={(e) => setPerspectiveY(Number(e.target.value))} />
                                </div>
                                <button onClick={handleApplyTransforms} className="w-full text-center p-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 text-sm">Apply Transforms</button>
                            </div>
                        </Accordion>
                        <Accordion title="Resize" icon={<MaximizeIcon className="w-5 h-5" />} isOpen={openAccordion === 'Resize'} onToggle={() => handleAccordionToggle('Resize')}>
                            <div className="p-4 space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 space-y-1">
                                        <label className="text-xs text-gray-500 dark:text-gray-400">Width (px)</label>
                                        <input type="number" value={resizeWidth} onChange={handleResizeWidthChange} className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200" />
                                    </div>
                                    <button onClick={() => setAspectRatioLocked(!aspectRatioLocked)} className="mt-5 p-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md">
                                        {aspectRatioLocked ? <LockIcon className="w-5 h-5"/> : <UnlockIcon className="w-5 h-5"/>}
                                    </button>
                                    <div className="flex-1 space-y-1">
                                        <label className="text-xs text-gray-500 dark:text-gray-400">Height (px)</label>
                                        <input type="number" value={resizeHeight} onChange={handleResizeHeightChange} className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200" />
                                    </div>
                                </div>
                                <button onClick={handleApplyResize} className="w-full text-center p-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 text-sm">Apply Resize</button>
                            </div>
                        </Accordion>
                        <Accordion title="Adjust" icon={<PaletteIcon className="w-5 h-5" />} isOpen={openAccordion === 'Adjust'} onToggle={() => handleAccordionToggle('Adjust')}>
                            <div className="p-4 space-y-4">
                                {histogramData && <Histogram data={histogramData} />}
                                <Slider icon={<SunIcon className="w-5 h-5" />} label="Brightness" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} />
                                <Slider icon={<ContrastIcon className="w-5 h-5" />} label="Contrast" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} />
                                <Slider icon={<DropletIcon className="w-5 h-5" />} label="Saturation" value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} />
                                <Slider icon={<PaletteIcon className="w-5 h-5" />} label="Hue" value={hue} onChange={(e) => setHue(Number(e.target.value))} min={0} max={360} />
                                 <button onClick={applyLiveAdjustments} className="w-full text-center p-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 text-sm">Apply Adjustments</button>
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                                    <button onClick={applyHistogramEqualization} className="w-full text-sm text-center p-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">Histogram Equalization</button>
                                    <button onClick={applyContrastStretching} className="w-full text-sm text-center p-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">Contrast Stretching</button>
                                </div>
                            </div>
                        </Accordion>
                         <Accordion title="Filter" icon={<FilterIcon className="w-5 h-5" />} isOpen={openAccordion === 'Filter'} onToggle={() => handleAccordionToggle('Filter')}>
                              <div className="p-4 space-y-2">
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                      <button className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600" onClick={() => handleApplyFilter('meanBlur')}>Mean Blur</button>
                                      <button className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600" onClick={() => handleApplyFilter('gaussianBlur')}>Gaussian Blur</button>
                                      <button className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600" onClick={() => handleApplyFilter('sharpen')}>Sharpen</button>
                                      <button className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600" onClick={() => handleApplyFilter('grayscale')}>Grayscale</button>
                                  </div>
                                   <div className="pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                                       <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-2">Edge Detection</p>
                                       <div className="grid grid-cols-2 gap-2 text-sm">
                                           <button className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600" onClick={() => handleApplyFilter('laplacian')}>Laplacian</button>
                                           <button className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600" onClick={() => handleApplyFilter('sobel')}>Sobel</button>
                                       </div>
                                  </div>
                                   <div className="pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                                       <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-2">Noise Reduction</p>
                                       <div className="grid grid-cols-3 gap-2 text-sm">
                                           <button className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600" onClick={() => handleApplyFilter('median')}>Median</button>
                                           <button className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600" onClick={() => handleApplyFilter('min')}>Min</button>
                                           <button className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600" onClick={() => handleApplyFilter('max')}>Max</button>
                                       </div>
                                  </div>
                              </div>
                         </Accordion>
                        <Accordion title="Enhance" icon={<WandIcon className="w-5 h-5" />} isOpen={openAccordion === 'Enhance'} onToggle={() => handleAccordionToggle('Enhance')}>
                            <div className="p-4 space-y-4">
                                <Slider icon={<SunIcon className="w-5 h-5" />} label="Gamma" value={gamma} onChange={(e) => setGamma(Number(e.target.value))} min={0.1} max={5} step={0.1} />
                                <button onClick={applyGammaCorrection} className="w-full text-center p-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 text-sm">Apply Gamma</button>
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                                    <Slider icon={<ContrastIcon className="w-5 h-5" />} label="Global Threshold" value={globalThreshold} onChange={(e) => setGlobalThreshold(Number(e.target.value))} min={0} max={255} />
                                    <button onClick={() => applyThreshold(false)} className="w-full text-center p-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 text-sm">Apply Global Threshold</button>
                                    
                                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-3">
                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Adaptive Threshold</h4>
                                        <Slider icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>} label="Window Size" value={adaptiveWindowSize} onChange={(e) => setAdaptiveWindowSize(Number(e.target.value))} min={3} max={51} step={2} />
                                        <Slider icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} label="C Value" value={adaptiveC} onChange={(e) => setAdaptiveC(Number(e.target.value))} min={0} max={50} />
                                        <button onClick={() => applyThreshold(true)} className="w-full text-center p-2 rounded-md bg-cyan-600 text-white hover:bg-cyan-700 text-sm">Apply Adaptive Threshold</button>
                                    </div>
                                </div>
                            </div>
                        </Accordion>
                        <Accordion title="Morphology" icon={<MorphologyIcon className="w-5 h-5" />} isOpen={openAccordion === 'Morphology'} onToggle={() => handleAccordionToggle('Morphology')}>
                            <div className="p-4 grid grid-cols-2 gap-2 text-sm">
                               <button className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600" onClick={() => applyMorphology('erode')}>Erosion</button>
                               <button className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600" onClick={() => applyMorphology('dilate')}>Dilation</button>
                               <button className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600" onClick={() => {applyMorphology('erode'); setTimeout(()=> applyMorphology('dilate'), 50)}}>Opening</button>
                               <button className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600" onClick={() => {applyMorphology('dilate'); setTimeout(()=> applyMorphology('erode'), 50)}}>Closing</button>
                            </div>
                        </Accordion>
                        <Accordion title="Frequency" icon={<FrequencyIcon className="w-5 h-5" />} isOpen={openAccordion === 'Frequency'} onToggle={() => handleAccordionToggle('Frequency')}>
                            <div className="p-4 grid grid-cols-2 gap-2 text-sm">
                               <button className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600" onClick={() => handleApplyFilter('gaussianBlur')}>Low-pass Filter</button>
                               <button className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600" onClick={() => handleApplyFilter('laplacian')}>High-pass Filter</button>
                            </div>
                        </Accordion>
                        <Accordion title="Draw" icon={<PenToolIcon className="w-5 h-5" />} isOpen={openAccordion === 'Draw'} onToggle={() => handleAccordionToggle('Draw')}>
                            <div className="p-4 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-700 dark:text-gray-300">Brush Color</label>
                                    <input type="color" value={drawColor} onChange={(e) => setDrawColor(e.target.value)} className="w-full h-8 p-0 rounded-md cursor-pointer border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"/>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-700 dark:text-gray-300">Brush Size: {drawSize}</label>
                                    <input type="range" min="1" max="100" value={drawSize} onChange={(e) => setDrawSize(Number(e.target.value))} className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-teal-500" />
                                </div>
                            </div>
                        </Accordion>
                        <Accordion title="Text" icon={<TextIcon className="w-5 h-5" />} isOpen={openAccordion === 'Text'} onToggle={() => handleAccordionToggle('Text')}>
                            <div className="p-4 space-y-4">
                                <input type="text" value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="Enter text..." className="w-full p-2 bg-gray-100 dark:bg-gray-800 rounded-md text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600" />
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-700 dark:text-gray-300">Text Color</label>
                                    <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full h-8 p-0 rounded-md cursor-pointer border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-700 dark:text-gray-300">Font Size: {textSize}</label>
                                    <input type="range" min="8" max="128" value={textSize} onChange={(e) => setTextSize(Number(e.target.value))} className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-teal-500" />
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Click on the image to place your text.</p>
                            </div>
                        </Accordion>
                         <Accordion title="Shapes" icon={<ShapesIcon className="w-5 h-5" />} isOpen={openAccordion === 'Shapes'} onToggle={() => handleAccordionToggle('Shapes')}>
                              <div className="p-4 space-y-4">
                                  <div className="grid grid-cols-3 gap-2 text-sm">
                                      <button onClick={()=>setActiveShape('rectangle')} className={`p-2 rounded-md ${activeShape === 'rectangle' ? 'bg-teal-600 text-white' : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'}`}>Rectangle</button>
                                      <button onClick={()=>setActiveShape('circle')} className={`p-2 rounded-md ${activeShape === 'circle' ? 'bg-teal-600 text-white' : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'}`}>Circle</button>
                                      <button onClick={()=>setActiveShape('triangle')} className={`p-2 rounded-md ${activeShape === 'triangle' ? 'bg-teal-600 text-white' : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'}`}>Triangle</button>
                                      <button onClick={()=>setActiveShape('star')} className={`p-2 rounded-md ${activeShape === 'star' ? 'bg-teal-600 text-white' : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'}`}>Star</button>
                                      <button onClick={()=>setActiveShape('fill')} className={`p-2 rounded-md ${activeShape === 'fill' ? 'bg-teal-600 text-white' : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'}`}>Fill</button>
                                  </div>
                                   <div className="space-y-2">
                                       <label className="text-sm text-gray-700 dark:text-gray-300">Color</label>
                                       <input type="color" value={shapeColor} onChange={(e) => setShapeColor(e.target.value)} className="w-full h-8 p-0 rounded-md cursor-pointer border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"/>
                                   </div>
                                   <div className="flex items-center justify-between">
                                       <label className="text-sm text-gray-700 dark:text-gray-300">Fill Shape</label>
                                       <input type="checkbox" checked={shapeFill} onChange={(e) => setShapeFill(e.target.checked)} className="form-checkbox h-5 w-5 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 dark:bg-gray-800 dark:border-gray-600" />
                                   </div>
                                  <div className="space-y-2">
                                      <label className="text-sm text-gray-700 dark:text-gray-300">Line Width: {drawSize}</label>
                                      <input type="range" min="1" max="100" value={drawSize} onChange={(e) => setDrawSize(Number(e.target.value))} className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-teal-500" />
                                  </div>
                                   <p className="text-xs text-gray-500 dark:text-gray-400">{activeShape === 'fill' ? 'Click on an area to fill with color.' : 'Click and drag on the image to draw.'}</p>
                           </div>
                        </Accordion>
                        </div>
                    </div>
                </aside>

            </main>

            {/* Import Image Modal */}
            {showImportModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900 dark:to-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Import Image</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Choose an image file to start editing</p>
                            
                            <div className="space-y-4">
                                <button 
                                    onClick={() => {
                                        fileInputRef.current?.click();
                                        setShowImportModal(false);
                                    }} 
                                    className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-cyan-500/25"
                                >
                                    Choose File
                                </button>
                                
                                <button 
                                    onClick={() => setShowImportModal(false)} 
                                    className="w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                            </div>
                    </div>
                </div>
            )}
        </div>
    );
}
