import React, { useState } from 'react';
import { useCurrency, CurrencyCode } from '../context/CurrencyContext';
import { Icon } from './Icon';

interface CurrencySelectorProps {
    variant?: 'default' | 'dark' | 'minimal';
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ variant = 'default' }) => {
    const { currency, setCurrencyCode, availableCurrencies } = useCurrency();
    const [isOpen, setIsOpen] = useState(false);

    // Styling logic based on variant
    const baseClasses = "flex items-center gap-1 md:gap-2 rounded-full px-2 md:px-3 py-1.5 text-sm font-medium transition-colors group";
    
    let variantClasses = "";
    if (variant === 'dark') {
        variantClasses = "bg-white/10 text-white hover:bg-white/20 border border-transparent";
    } else if (variant === 'minimal') {
        variantClasses = "bg-transparent hover:bg-gray-100 text-slate-gray border border-transparent";
    } else {
        variantClasses = "bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600 text-slate-800 dark:text-white";
    }

    const symbolClasses = variant === 'dark' 
        ? "bg-white/20 text-white" 
        : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300";

    const textClasses = variant === 'dark'
        ? "text-white"
        : "text-slate-800 dark:text-white";

    const iconClasses = variant === 'dark' ? "text-white/70 group-hover:text-white" : "text-slate-500 group-hover:text-primary";

    // Special display for INTL mode
    const isIntl = currency.code === 'INTL';

    return (
        <div className="relative z-[51]">
            <button 
                onClick={(e) => { e.preventDefault(); setIsOpen(!isOpen); }}
                className={`${baseClasses} ${variantClasses}`}
                title="Change Currency"
            >
                <div className={`size-5 rounded-full flex items-center justify-center text-[10px] font-bold ${symbolClasses}`}>
                    {isIntl ? <Icon name="public" className="!text-[14px]" /> : currency.symbol}
                </div>
                <span className={`uppercase font-bold text-xs tracking-wider ${textClasses}`}>
                    {isIntl && variant !== 'minimal' ? 'Select' : currency.code}
                </span>
                <Icon name="expand_more" className={`!text-[16px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${iconClasses}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-1 z-50 animate-fade-in ring-1 ring-black/5 max-h-[300px] overflow-y-auto no-scrollbar">
                         {/* Search or title could go here if needed, but simple list for now */}
                        {availableCurrencies.map((c) => (
                            <button
                                key={c.code}
                                onClick={() => {
                                    setCurrencyCode(c.code);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-slate-700/50 border-b border-gray-50 dark:border-gray-700/50 last:border-0
                                    ${currency.code === c.code ? 'bg-primary/5' : ''}
                                `}
                            >
                                <span className="font-bold w-6 text-center text-slate-500 text-xs shrink-0">
                                    {c.code === 'INTL' ? <Icon name="public" className="!text-[14px]" /> : c.symbol}
                                </span>
                                <div className="flex flex-col items-start flex-1 min-w-0">
                                    <span className={`text-left font-bold text-xs ${currency.code === c.code ? 'text-primary' : 'text-slate-700 dark:text-gray-200'}`}>
                                        {c.code}
                                    </span>
                                    <span className="text-[10px] text-slate-400 truncate w-full text-left">{c.name}</span>
                                </div>
                                {currency.code === c.code && <Icon name="check" className="text-primary !text-[14px]" />}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default CurrencySelector;