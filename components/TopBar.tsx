import React from 'react';
import CurrencySelector from './CurrencySelector';
import LanguageSelector from './LanguageSelector';
import { Icon } from './Icon';

const TopBar: React.FC = () => {
    return (
        <div className="w-full bg-slate-gray text-white py-2 px-4 md:px-8 flex justify-between items-center text-xs z-[60] relative border-b border-white/10">
            <div className="hidden md:flex items-center gap-6 opacity-90">
                <span className="flex items-center gap-1.5 text-[10px] font-medium tracking-wide uppercase text-slate-300">
                    <Icon name="lock" className="!text-[14px] text-green-400" /> 
                    Bank-Grade Security
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-medium tracking-wide uppercase text-slate-300">
                    <Icon name="public" className="!text-[14px] text-primary" /> 
                    Global Access
                </span>
            </div>
            
            <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-4">
                <span className="md:hidden font-bold tracking-widest text-[10px] text-slate-300">FINANZAS</span>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className="hidden sm:inline text-[10px] uppercase font-bold text-slate-500 tracking-wider mr-1">Region:</span>
                        <CurrencySelector variant="dark" />
                        <div className="w-px h-4 bg-white/20 mx-1"></div>
                        <LanguageSelector variant="dark" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TopBar;