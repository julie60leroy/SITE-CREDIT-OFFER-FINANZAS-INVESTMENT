import React, { useRef, useState } from 'react';

interface CustomSliderProps {
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (val: number) => void;
    label: string;
    unit: string;
    unitPrefix?: boolean;
    minLabel: string;
    maxLabel: string;
}

const CustomSlider: React.FC<CustomSliderProps> = ({ 
    value, 
    min, 
    max, 
    step, 
    onChange,
    label,
    unit,
    unitPrefix = false,
    minLabel,
    maxLabel
}) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const percent = ((value - min) / (max - min)) * 100;
    
    // Calculate value based on pointer position relative to track width
    const getValueFromPointer = (clientX: number) => {
        if (!trackRef.current) return min;
        const rect = trackRef.current.getBoundingClientRect();
        
        // Calculate percentage (0 to 1)
        const percentage = Math.max(0, Math.min((clientX - rect.left) / rect.width, 1));
        
        // Convert to value range
        const rawValue = min + percentage * (max - min);
        
        // Snap to step
        const steppedValue = Math.round(rawValue / step) * step;
        
        return Math.min(Math.max(steppedValue, min), max);
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        // Prevent default browser actions (scrolling, text selection)
        e.preventDefault();
        
        setIsDragging(true);
        if (trackRef.current) {
            trackRef.current.setPointerCapture(e.pointerId);
        }
        
        // Update immediately on click
        onChange(getValueFromPointer(e.clientX));
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;
        onChange(getValueFromPointer(e.clientX));
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        setIsDragging(false);
        if (trackRef.current) {
            trackRef.current.releasePointerCapture(e.pointerId);
        }
    };

    return (
        <div className="mb-8 md:mb-10 select-none relative w-full touch-none">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 sm:gap-0 mb-4 sm:mb-5">
                <label className="text-slate-gray dark:text-gray-300 text-sm font-bold uppercase tracking-wide">
                    {label}
                </label>
                <div className="flex items-center bg-white dark:bg-slate-900 border-b-2 border-primary px-3 py-1.5 shadow-sm transition-colors self-start sm:self-auto rounded-t-md">
                    <span className="text-xl md:text-2xl font-bold text-slate-gray dark:text-white whitespace-nowrap leading-none">
                        {unitPrefix && <span className="text-sm font-semibold text-primary mr-1 align-top">{unit}</span>}
                        {value.toLocaleString()}
                    </span>
                    {!unitPrefix && <span className="text-sm font-semibold text-primary ml-1">{unit}</span>}
                </div>
            </div>
            
            {/* 
                Interactive Track Container 
                Uses Pointer Events for unified Mouse/Touch handling.
                touch-none class on parent prevents scrolling while interacting.
            */}
            <div 
                ref={trackRef}
                className="relative w-full h-12 flex items-center group cursor-pointer"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
            >
                {/* Track Background */}
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full absolute z-10 transition-colors overflow-hidden">
                     {/* This inner shadow adds depth to the track */}
                     <div className="absolute inset-0 bg-black/5 dark:bg-black/20"></div>
                </div>
                
                {/* Active Track (Fill) */}
                <div 
                    className="h-2 bg-primary rounded-full absolute z-20 transition-all duration-75 ease-out pointer-events-none" 
                    style={{ width: `${percent}%` }}
                ></div>
                
                {/* Custom Thumb */}
                <div 
                    className={`size-6 bg-primary clip-hexagon absolute z-30 shadow-xl pointer-events-none transition-transform duration-150 flex items-center justify-center will-change-transform ${isDragging ? 'scale-125' : 'group-hover:scale-110'}`}
                    style={{ left: `${percent}%`, transform: 'translateX(-50%)' }}
                >
                    <div className="size-1.5 bg-white/60 rounded-full"></div>
                </div>
            </div>
            
            {/* Hidden Input for Accessibility (Screen Readers / Keyboard) */}
            <input 
                type="range"
                className="sr-only"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                aria-label={label}
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={value}
            />
            
            <div className="flex justify-between mt-1 text-xs text-gray-400 font-medium">
                <span>{minLabel}</span>
                <span>{maxLabel}</span>
            </div>
        </div>
    );
};

export default CustomSlider;