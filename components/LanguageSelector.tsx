import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Icon } from './Icon';

interface LanguageSelectorProps {
    variant?: 'default' | 'dark';
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'default' }) => {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        { code: 'en', label: 'English', flagUrl: 'https://flagcdn.com/w40/us.png' },
        { code: 'fr', label: 'Français', flagUrl: 'https://flagcdn.com/w40/fr.png' },
        { code: 'es', label: 'Español', flagUrl: 'https://flagcdn.com/w40/es.png' }
    ];

    const currentLang = languages.find(l => l.code === language);

    // Variant styles
    let containerClasses = "";
    let textClasses = "";
    let iconClasses = "";

    if (variant === 'dark') {
        containerClasses = "bg-white/10 border-transparent hover:bg-white/20 text-white";
        textClasses = "text-white";
        iconClasses = "text-white/70 group-hover:text-white";
    } else {
        containerClasses = "bg-white/50 dark:bg-slate-800/50 border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600 text-slate-800 dark:text-white";
        textClasses = "text-slate-800 dark:text-white";
        iconClasses = "text-slate-500 group-hover:text-primary";
    }

    return (
        <div className="relative z-50">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors backdrop-blur-sm group ${containerClasses}`}
            >
                <img 
                    src={currentLang?.flagUrl} 
                    alt={currentLang?.label} 
                    className="w-5 h-3.5 object-cover rounded-[2px] shadow-sm"
                />
                <span className={`uppercase font-bold text-xs tracking-wider ${textClasses}`}>{language}</span>
                <Icon name="expand_more" className={`!text-[16px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${iconClasses}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-1 overflow-hidden z-50 animate-fade-in ring-1 ring-black/5">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    setLanguage(lang.code as any);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-slate-700/50
                                    ${language === lang.code ? 'bg-primary/5' : ''}
                                `}
                            >
                                <img 
                                    src={lang.flagUrl} 
                                    alt={lang.label} 
                                    className="w-5 h-3.5 object-cover rounded-[2px] shadow-sm"
                                />
                                <span className={`flex-1 text-left ${language === lang.code ? 'text-primary font-bold' : 'text-slate-600 dark:text-gray-300'}`}>
                                    {lang.label}
                                </span>
                                {language === lang.code && <Icon name="check" className="text-primary !text-[16px]" />}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default LanguageSelector;