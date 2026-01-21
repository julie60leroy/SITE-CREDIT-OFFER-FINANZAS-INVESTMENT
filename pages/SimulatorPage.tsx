import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import LanguageSelector from '../components/LanguageSelector';
import CurrencySelector from '../components/CurrencySelector';
import TopBar from '../components/TopBar';

const SimulatorPage: React.FC = () => {
    const { t } = useLanguage();
    const { currency, formatMoney } = useCurrency();
    
    // State management for the Journey
    const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Simulation, 2: Form, 3: Success
    const [isLoading, setIsLoading] = useState(false);
    const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

    // Simulation Data - Initialize with defaults from Currency Context
    const [amount, setAmount] = useState(currency.minAmount);
    const [months, setMonths] = useState(120); // Default to 10 years

    // Update amount if currency changes to ensure it is within new bounds
    useEffect(() => {
        // Ensure amount adheres to new limits (min/max)
        const safeAmount = Math.max(currency.minAmount, Math.min(amount, currency.maxAmount));
        if (safeAmount !== amount) {
            setAmount(safeAmount);
        }
    }, [currency, amount]);

    // Form Data
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        employment: ""
    });

    // Constants based on provided HTML design & Currency Context
    const MIN_MONTHS = 12;
    const MAX_MONTHS = 360; // 30 Years
    const INTEREST_RATE = 0.02; // Updated to 2.00%

    // Calculations
    const monthlyRate = INTEREST_RATE / 12;
    const monthlyPayment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
    const totalCost = (monthlyPayment * months) - amount; 
    const totalPayable = monthlyPayment * months;
    const totalInterest = totalPayable - amount;

    const handleNextStep = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setStep(2);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isCaptchaVerified) return;

        setIsLoading(true);

        // Simulate API call / processing
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setIsLoading(false);
        setStep(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Trigger WhatsApp
        setTimeout(() => {
            let message = t.simulator.whatsappMessage;
            message = message.replace('{amount}', `${currency.symbol}${formatMoney(amount)}`);
            message = message.replace('{months}', months);
            message = message.replace('{payment}', `${currency.symbol}${formatMoney(Math.round(monthlyPayment))}`);
            message = message.replace('{name}', `${formData.firstName} ${formData.lastName}`);
            message = message.replace('{email}', formData.email);
            message = message.replace('{phone}', formData.phone);
            message = message.replace('{status}', formData.employment);
            
            const encodedMessage = encodeURIComponent(message);
            window.open(`https://wa.me/15550123456?text=${encodedMessage}`, '_blank');
        }, 3000);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- Logarithmic Scale Helpers for Amount Slider ---
    // This solves the issue of selecting small amounts (10k, 15k) when max is huge (15M).
    // It spreads the lower values over more screen space.
    const getLogSliderValue = (val: number, min: number, max: number) => {
        const minv = Math.log(Math.max(min, 1));
        const maxv = Math.log(Math.max(max, 1));
        if (maxv === minv) return 0;
        const scale = (maxv - minv) / 100;
        return (Math.log(Math.max(val, 1)) - minv) / scale;
    };

    const getLogAmountValue = (sliderVal: number, min: number, max: number) => {
        const minv = Math.log(Math.max(min, 1));
        const maxv = Math.log(Math.max(max, 1));
        const scale = (maxv - minv) / 100;
        return Math.exp(minv + scale * sliderVal);
    };

    // Calculate slider position (0-100) for UI
    const amountSliderValue = getLogSliderValue(amount, currency.minAmount, currency.maxAmount);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sliderVal = parseFloat(e.target.value);
        let rawAmount = getLogAmountValue(sliderVal, currency.minAmount, currency.maxAmount);
        
        // Smart Rounding to make numbers clean and selection easier
        let step = 100;
        if (rawAmount >= 1000000) step = 10000;
        else if (rawAmount >= 100000) step = 1000;
        else if (rawAmount >= 10000) step = 500; // Granularity for 10k-100k
        
        let rounded = Math.round(rawAmount / step) * step;
        
        // Clamp to ensure we stay within bounds
        rounded = Math.max(currency.minAmount, Math.min(rounded, currency.maxAmount));
        
        setAmount(rounded);
    };

    // Linear scale is fine for months (12 to 360)
    const monthsProgress = ((months - MIN_MONTHS) / (MAX_MONTHS - MIN_MONTHS)) * 100;

    const isGlobalMode = currency.code === 'INTL';

    return (
        <div className="bg-[#FFFFFF] text-slate-gray font-display min-h-screen flex flex-col selection:bg-primary selection:text-white overflow-x-hidden">
            {/* Styles injected specifically for this page's components */}
            <style>{`
                input[type=range] {
                    -webkit-appearance: none;
                    width: 100%;
                    background: transparent;
                }
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 24px;
                    width: 24px;
                    border-radius: 50%;
                    background: #D92D20;
                    cursor: pointer;
                    margin-top: -10px;
                    box-shadow: 0 0 0 4px rgba(217, 45, 32, 0.1);
                    transition: all 0.2s ease-in-out;
                    border: 2px solid white;
                    position: relative;
                    z-index: 30;
                }
                input[type=range]::-webkit-slider-thumb:hover {
                    box-shadow: 0 0 0 8px rgba(217, 45, 32, 0.15);
                    transform: scale(1.1);
                }
                input[type=range]::-webkit-slider-runnable-track {
                    width: 100%;
                    height: 4px;
                    cursor: pointer;
                    background: transparent; /* Handled by divs */
                    border-radius: 2px;
                }
                .simulator-panel {
                    background: #FFFFFF;
                    border: 1px solid #EAECF0;
                    box-shadow: 0 20px 24px -4px rgba(16, 24, 40, 0.08), 0 8px 8px -4px rgba(16, 24, 40, 0.03);
                }
                .summary-card {
                    background: #F9FAFB;
                    border: 1px solid #EAECF0;
                }
                .filled {
                    font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                }
            `}</style>
            
            <TopBar />

            {/* Header */}
            <header className="w-full px-4 md:px-8 py-4 md:py-6 flex flex-wrap md:flex-nowrap items-center justify-between z-20 border-b border-gray-100 bg-white sticky top-0 gap-4">
                <Link to="/" className="flex items-center gap-3 md:gap-4 group shrink-0">
                    <div className="relative size-8 md:size-10 bg-primary flex items-center justify-center transition-transform group-hover:scale-105" style={{clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"}}>
                        <div className="size-3 md:size-4 bg-white rounded-full"></div>
                    </div>
                    <h2 className="text-slate-gray text-lg md:text-xl tracking-tight leading-none">
                        <span className="font-bold">FINANZAS</span>
                        <span className="font-light tracking-[0.2em] ml-2 text-slate-gray/60 hidden sm:inline text-sm md:text-base">INVESTMENT</span>
                    </h2>
                </Link>
                <div className="flex items-center gap-2 md:gap-4 ml-auto md:ml-0">
                    {/* Selectors moved to Top Bar */}
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center w-full px-4 py-8 md:py-12 relative bg-white">
                
                {/* Step Indicator */}
                <div className="w-full max-w-lg mb-8 md:mb-12 z-10 px-2">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute left-0 top-4 w-full h-[2px] bg-gray-100 -z-10"></div>
                        
                        {/* Step 1 Indicator */}
                        <div className={`flex flex-col items-center gap-2 md:gap-3 transition-colors duration-300 ${step === 1 ? 'opacity-100' : 'opacity-50'}`}>
                            <div className={`size-8 md:size-9 rounded-full flex items-center justify-center text-xs md:text-sm font-bold transition-all duration-300 ${step >= 1 ? 'bg-primary text-white shadow-[0_0_15px_rgba(217,45,32,0.3)] scale-110' : 'bg-white border-2 border-gray-200 text-gray-400'}`}>
                                {step > 1 ? <Icon name="check" className="text-sm font-bold" /> : '1'}
                            </div>
                            <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>Simulation</span>
                        </div>

                        {/* Step 2 Indicator */}
                        <div className={`flex flex-col items-center gap-2 md:gap-3 transition-colors duration-300 ${step === 2 ? 'opacity-100' : 'opacity-50'}`}>
                            <div className={`size-8 md:size-9 rounded-full flex items-center justify-center text-xs md:text-sm font-bold transition-all duration-300 ${step >= 2 ? 'bg-primary text-white shadow-[0_0_15px_rgba(217,45,32,0.3)] scale-110' : 'bg-white border-2 border-gray-200 text-gray-400'}`}>
                                {step > 2 ? <Icon name="check" className="text-sm font-bold" /> : '2'}
                            </div>
                            <span className={`text-[10px] md:text-xs font-medium uppercase tracking-widest ${step >= 2 ? 'text-primary font-bold' : 'text-gray-400'}`}>Informations</span>
                        </div>

                        {/* Step 3 Indicator */}
                        <div className={`flex flex-col items-center gap-2 md:gap-3 transition-colors duration-300 ${step === 3 ? 'opacity-100' : 'opacity-50'}`}>
                            <div className={`size-8 md:size-9 rounded-full flex items-center justify-center text-xs md:text-sm font-bold transition-all duration-300 ${step >= 3 ? 'bg-primary text-white shadow-[0_0_15px_rgba(217,45,32,0.3)] scale-110' : 'bg-white border-2 border-gray-200 text-gray-400'}`}>
                                3
                            </div>
                            <span className={`text-[10px] md:text-xs font-medium uppercase tracking-widest ${step >= 3 ? 'text-primary font-bold' : 'text-gray-400'}`}>Validation</span>
                        </div>
                    </div>
                </div>

                {/* STEP 1: SIMULATION */}
                {step === 1 && (
                    <div className="simulator-panel w-full max-w-[1100px] rounded-2xl md:rounded-3xl p-6 md:p-12 relative z-10 animate-fade-in">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                            <div className="lg:col-span-7 flex flex-col gap-8 md:gap-12">
                                
                                {/* REASSURANCE BANNER (Solution 2 & 4) */}
                                {isGlobalMode ? (
                                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
                                        <div className="bg-white p-2 rounded-full shadow-sm text-primary shrink-0"><Icon name="public" /></div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm">{t.simulator.inclusionTitle}</h4>
                                            <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">{t.simulator.inclusionText}</p>
                                        </div>
                                    </div>
                                ) : (
                                    /* Assistance Message (Normal mode) */
                                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 md:p-4 flex gap-3 items-start animate-fade-in">
                                        <Icon name="info" className="text-blue-500 mt-0.5 text-lg md:text-xl shrink-0" />
                                        <div>
                                            <p className="text-sm text-blue-900 font-bold mb-1">Commencez votre simulation</p>
                                            <p className="text-xs text-blue-700 leading-relaxed font-medium">Ajustez les curseurs ci-dessous pour définir le montant ({currency.code}) et la durée de votre crédit idéal.</p>
                                        </div>
                                    </div>
                                )}

                                {/* Amount Slider - Logarithmic Scale */}
                                <div className="flex flex-col gap-6 md:gap-8">
                                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                                        <h1 className="text-xl sm:text-2xl md:text-4xl font-black leading-tight uppercase tracking-tight text-slate-gray">
                                            Combien <br className="hidden sm:block"/>souhaitez-vous <br className="hidden sm:block"/><span className="text-primary">emprunter</span> ?
                                        </h1>
                                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-2 md:px-6 md:py-3 rounded-xl w-full sm:w-auto min-w-[180px] md:min-w-[200px] justify-between transition-colors">
                                            {/* Solution 1: Neutral display (no symbol in INTL mode) */}
                                            {/* Text size increased from xl/2xl to 3xl/5xl for better visibility */}
                                            <span className="text-3xl md:text-5xl font-black text-slate-gray tracking-tighter">
                                                {formatMoney(amount)}
                                            </span>
                                            
                                            {/* Integrated Selector */}
                                            <div className="scale-90 origin-right">
                                                {isGlobalMode ? (
                                                    <div className="relative group">
                                                        <div className="absolute -inset-2 bg-primary/10 rounded-lg animate-pulse"></div>
                                                        <div className="relative">
                                                            <CurrencySelector variant="minimal" />
                                                        </div>
                                                        {/* Tooltip hint */}
                                                        <div className="absolute top-full right-0 mt-2 px-2 py-1 bg-primary text-white text-[10px] rounded font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                            {t.simulator.selectCurrency}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <CurrencySelector variant="minimal" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative w-full h-10 md:h-12 flex items-center group touch-pan-y">
                                        <input 
                                            className="w-full z-20 relative cursor-pointer" 
                                            type="range" 
                                            min={0}
                                            max={100}
                                            step={0.1}
                                            value={amountSliderValue}
                                            onChange={handleAmountChange}
                                        />
                                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full z-0"></div>
                                        <div 
                                            className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full z-10 transition-all duration-75" 
                                            style={{ width: `${amountSliderValue}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-500 font-bold uppercase tracking-[0.2em]">
                                        <span>{formatMoney(currency.minAmount)} {currency.symbol}</span>
                                        <span>{formatMoney(currency.maxAmount)} {currency.symbol}</span>
                                    </div>
                                </div>

                                {/* Duration Slider - Linear Scale */}
                                <div className="flex flex-col gap-6 md:gap-8">
                                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                                        <h2 className="text-lg md:text-2xl font-bold text-slate-gray uppercase tracking-tight">
                                            Durée de remboursement
                                        </h2>
                                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-2 md:px-6 md:py-3 rounded-xl w-full sm:w-auto min-w-[160px] md:min-w-[180px] justify-center">
                                            <span className="text-2xl md:text-3xl font-black text-slate-gray">{months}</span>
                                            <span className="text-slate-500 font-bold text-sm uppercase tracking-widest">MOIS</span>
                                        </div>
                                    </div>
                                    <div className="relative w-full h-10 md:h-12 flex items-center group touch-pan-y">
                                        <input 
                                            className="w-full z-20 relative cursor-pointer" 
                                            type="range" 
                                            min={MIN_MONTHS} 
                                            max={MAX_MONTHS} 
                                            step={12} 
                                            value={months}
                                            onChange={(e) => setMonths(parseInt(e.target.value))}
                                        />
                                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full z-0"></div>
                                        <div 
                                            className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full z-10 transition-all duration-75"
                                            style={{ width: `${monthsProgress}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-500 font-bold uppercase tracking-[0.2em]">
                                        <span>{MIN_MONTHS} mois</span>
                                        <span>{MAX_MONTHS} mois</span>
                                    </div>
                                </div>
                            </div>

                            {/* Summary Card */}
                            <div className="lg:col-span-5">
                                <div className="summary-card rounded-2xl md:rounded-3xl p-6 md:p-10 flex flex-col items-center justify-between h-full gap-8">
                                    <div className="w-full flex flex-col gap-6 md:gap-8">
                                        <div className="flex flex-col gap-2 md:gap-3 text-center">
                                            <span className="text-slate-500 text-sm font-bold uppercase tracking-[0.25em]">Mensualité Estimée</span>
                                            <div className="flex items-baseline justify-center gap-2 flex-wrap">
                                                <span className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-gray tracking-tighter">
                                                    {formatMoney(Math.round(monthlyPayment))}
                                                </span>
                                                <span className="text-2xl md:text-3xl font-light text-primary">{currency.symbol}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-4 md:space-y-6">
                                            <div className="flex justify-between items-center py-4 border-y border-gray-200">
                                                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Coût total (Intérêts)</span>
                                                <span className="text-lg md:text-xl font-bold text-slate-gray">{formatMoney(Math.round(totalInterest))} {currency.symbol}</span>
                                            </div>
                                            
                                            {/* Enhanced Interest Rate Display with Tooltip */}
                                            <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-xl p-4 border border-primary/10 flex justify-between items-center group hover:bg-primary/10 transition-colors relative overflow-visible">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-white p-2 rounded-lg shadow-sm text-primary group-hover:scale-110 transition-transform">
                                                        <Icon name="verified" filled className="text-lg" />
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-slate-600 text-xs font-bold uppercase tracking-widest">TAEG Fixe</span>
                                                        <div className="group/tooltip relative cursor-help">
                                                            <Icon name="help" className="text-slate-400 text-sm hover:text-primary transition-colors" />
                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-800 text-white text-[10px] p-2.5 rounded-lg shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-50 text-center font-medium leading-relaxed pointer-events-none transform translate-y-2 group-hover/tooltip:translate-y-0">
                                                                Taux Annuel Effectif Global.<br/>Inclut intérêts et frais.<br/>Ne change jamais.
                                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-2xl font-black text-primary">{(INTEREST_RATE * 100).toFixed(2)} %</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleNextStep}
                                        className="w-full group relative flex items-center justify-center gap-3 md:gap-4 bg-primary hover:bg-primary-dark text-white font-black text-base md:text-lg py-4 md:py-5 px-6 md:px-8 rounded-xl md:rounded-2xl transition-all duration-300 shadow-[0_10px_30px_rgba(217,45,32,0.2)] hover:shadow-[0_15px_40px_rgba(217,45,32,0.3)] uppercase tracking-widest hover:-translate-y-1 active:scale-95"
                                    >
                                        <span className="whitespace-nowrap">Continuer ma procédure</span>
                                        <span className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-2 text-xl">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2: FORM */}
                {step === 2 && (
                    <div className="w-full max-w-[600px] animate-fade-in z-10">
                         {/* Recap of Simulation */}
                        <div className="mb-6 flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Votre Simulation</p>
                                <div className="flex gap-3 text-base font-black text-slate-gray mt-1">
                                    <span>{formatMoney(amount)} {currency.symbol}</span>
                                    <span className="text-gray-300">|</span>
                                    <span>{months} mois</span>
                                </div>
                            </div>
                            <button onClick={() => setStep(1)} className="text-xs text-primary font-bold hover:underline px-3 py-1.5 bg-primary/5 rounded-lg">Modifier</button>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                            <div className="text-center mb-8 md:mb-10">
                                <h1 className="text-2xl md:text-3xl font-black text-slate-gray mb-3 uppercase">Informations Personnelles</h1>
                                <p className="text-slate-500 text-xs font-bold tracking-widest uppercase">Étape 2 sur 3 : Sécurisation de votre profil</p>
                            </div>
                            <form className="space-y-6" onSubmit={handleFormSubmit}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold tracking-wider uppercase text-slate-700">Nom</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                                <span className="material-symbols-outlined text-xl">person</span>
                                            </div>
                                            <input 
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full bg-gray-50 border border-gray-200 hover:border-gray-300 hover:bg-white/50 text-slate-gray rounded-lg py-3.5 md:py-4 pl-12 pr-4 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary placeholder-gray-400 transition-all duration-300 outline-none text-sm md:text-base font-medium" 
                                                placeholder="Dupont" type="text"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold tracking-wider uppercase text-slate-700">Prénom</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                                <span className="material-symbols-outlined text-xl">person</span>
                                            </div>
                                            <input 
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full bg-gray-50 border border-gray-200 hover:border-gray-300 hover:bg-white/50 text-slate-gray rounded-lg py-3.5 md:py-4 pl-12 pr-4 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary placeholder-gray-400 transition-all duration-300 outline-none text-sm md:text-base font-medium" 
                                                placeholder="Jean" type="text"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-bold tracking-wider uppercase text-slate-700">Email Professionnel</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                            <span className="material-symbols-outlined text-xl">mail</span>
                                        </div>
                                        <input 
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-gray-50 border border-gray-200 hover:border-gray-300 hover:bg-white/50 text-slate-gray rounded-lg py-3.5 md:py-4 pl-12 pr-4 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary placeholder-gray-400 transition-all duration-300 outline-none text-sm md:text-base font-medium" 
                                            placeholder="jean@entreprise.com" type="email"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold tracking-wider uppercase text-slate-700">Téléphone</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                                <span className="material-symbols-outlined text-xl">call</span>
                                            </div>
                                            <input 
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full bg-gray-50 border border-gray-200 hover:border-gray-300 hover:bg-white/50 text-slate-gray rounded-lg py-3.5 md:py-4 pl-12 pr-4 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary placeholder-gray-400 transition-all duration-300 outline-none text-sm md:text-base font-medium" 
                                                placeholder="+33 6 12 34 56 78" type="tel"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold tracking-wider uppercase text-slate-700">Statut Professionnel</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                                <span className="material-symbols-outlined text-xl">work</span>
                                            </div>
                                            <select 
                                                name="employment"
                                                value={formData.employment}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full bg-gray-50 border border-gray-200 hover:border-gray-300 hover:bg-white/50 text-slate-gray rounded-lg py-3.5 md:py-4 pl-12 pr-10 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary appearance-none transition-all duration-300 outline-none cursor-pointer text-sm md:text-base font-medium"
                                            >
                                                <option disabled value="">Sélectionner...</option>
                                                <option value="salarie">Salarié</option>
                                                <option value="independant">Indépendant</option>
                                                <option value="retraite">Retraité</option>
                                                <option value="autre">Autre</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                                                <span className="material-symbols-outlined text-xl">expand_more</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Custom Captcha */}
                                <div className="flex justify-center mt-4">
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center gap-4 shadow-sm w-fit hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setIsCaptchaVerified(!isCaptchaVerified)}>
                                        <div className={`size-6 rounded border-2 flex items-center justify-center transition-colors ${isCaptchaVerified ? 'bg-primary border-primary' : 'border-gray-300 bg-white'}`}>
                                            {isCaptchaVerified && <Icon name="check" className="text-white text-sm font-bold" />}
                                        </div>
                                        <span className="text-sm text-slate-700 font-medium select-none">Je ne suis pas un robot</span>
                                        <div className="ml-2 flex flex-col items-center justify-center opacity-50">
                                            <Icon name="security" className="text-xl text-slate-400" />
                                            <span className="text-[8px] leading-none mt-0.5">reCAPTCHA</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center gap-6 mt-4">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100 max-w-full">
                                        <span className="material-symbols-outlined text-primary text-sm shrink-0">verified_user</span>
                                        <p className="text-xs text-slate-600 font-bold uppercase tracking-wider truncate">Vos données sont sécurisées et cryptées</p>
                                    </div>
                                    <button 
                                        type="submit"
                                        disabled={!isCaptchaVerified || isLoading}
                                        className="w-full bg-primary hover:bg-primary-dark active:scale-[0.98] text-white font-black text-sm uppercase py-5 rounded-lg shadow-xl shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex justify-center items-center gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Traitement...
                                            </>
                                        ) : "Soumettre ma demande pour approbation"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* STEP 3: SUCCESS */}
                {step === 3 && (
                     <div className="w-full max-w-[600px] animate-fade-in z-10 text-center">
                        <div className="bg-white border border-gray-100 rounded-2xl md:rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                            <div className="size-16 md:size-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Icon name="check_circle" className="text-3xl md:text-4xl text-green-500" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-gray mb-4">Demande Reçue</h2>
                            <p className="text-gray-500 text-base md:text-lg mb-8 leading-relaxed">
                                Merci {formData.firstName}. Votre dossier a bien été transmis à nos services.
                            </p>
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8 text-left">
                                <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2 text-sm md:text-base">
                                    <Icon name="schedule" className="text-blue-500" />
                                    Délai de traitement
                                </h3>
                                <p className="text-blue-700 text-xs md:text-sm leading-relaxed">
                                    Un gestionnaire analysera votre dossier dans un délai inférieur à <strong>12 heures</strong>. Vous recevrez une réponse définitive par email ou téléphone.
                                </p>
                            </div>
                            <button 
                                onClick={() => window.open('https://wa.me/15550123456', '_blank')}
                                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all text-sm md:text-base"
                            >
                                <Icon name="chat" />
                                Contacter le support sur WhatsApp
                            </button>
                        </div>
                     </div>
                )}

                {/* Social Proof (Only on Step 1) */}
                {step === 1 && (
                    <div className="mt-12 md:mt-16 flex flex-col items-center animate-fade-in delay-300 w-full px-4">
                        <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 px-6 py-4 rounded-2xl hover:bg-gray-100 transition-all duration-300 cursor-default w-full max-w-md md:w-auto">
                            <div className="relative shrink-0">
                                <div className="size-12 rounded-full bg-gray-200 overflow-hidden ring-2 ring-primary/10">
                                    <img alt="Portrait of a satisfied customer" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7tQ4v9_zP4e57cl3DY8pzicGv4A2UzY0_B9xIbVhRDOdbwi8KePoiNFx03Gh7WAuAbmNhQkPMYN4xeC3X7yzuNQoQmUx2LlgR0wRjWIUy0QfhZpNhncOFQ9-QixVr58YEAT0R-MyWh5fq43V68PIAoJa3sQHLYSLJn-xE-su0i8mz9nc00L0tfsV1queSYE03uvzCdaNWgAnBJ6psUlsuLc32AqhaQwgnBXkXlKvSod7Wo9mzoiXmnIWTvmdeFO3RsnuiEtx9tZzs"/>
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1 border-2 border-white">
                                    <span className="material-symbols-outlined text-[10px] text-white font-bold block">verified</span>
                                </div>
                            </div>
                            <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-black text-slate-gray uppercase tracking-tight whitespace-nowrap">Thomas R.</span>
                                    <div className="flex text-primary">
                                        <span className="material-symbols-outlined text-xs filled">star</span>
                                        <span className="material-symbols-outlined text-xs filled">star</span>
                                        <span className="material-symbols-outlined text-xs filled">star</span>
                                        <span className="material-symbols-outlined text-xs filled">star</span>
                                        <span className="material-symbols-outlined text-xs filled">star</span>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-gray/60 italic truncate">"Une expérience fluide, haut de gamme et transparente."</p>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <footer className="w-full py-6 md:py-8 px-4 md:px-8 flex flex-col-reverse md:flex-row items-center justify-between border-t border-gray-100 bg-white gap-4 md:gap-0">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-gray/40 font-medium uppercase tracking-[0.2em] text-center md:text-left">© 2024 FINANZAS INVESTMENT GROUP</span>
                </div>
                <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-[10px] text-slate-gray/50 font-bold uppercase tracking-widest">
                    <a className="hover:text-primary transition-colors" href="#">Mentions Légales</a>
                    <a className="hover:text-primary transition-colors" href="#">Confidentialité</a>
                    <a className="hover:text-primary transition-colors" href="#">Contact</a>
                </div>
            </footer>
        </div>
    );
};

export default SimulatorPage;