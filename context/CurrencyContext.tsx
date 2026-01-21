import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';

export type CurrencyCode = 
    'INTL' | 
    'EUR' | 'USD' | 'ARS' | 'BOB' | 'BRL' | 'CLP' | 'COP' | 'PYG' | 'PEN' | 'UYU' | 'VES' | 
    'MXN' | 'GTQ' | 'HNL' | 'NIO' | 'CRC' | 'PAB' | 'CUP' | 'DOP' | 
    'GBP' | 'CHF' | 'DKK' | 'NOK' | 'SEK' | 'ISK' | 'PLN' | 'HUF' | 'CZK' | 'RON' | 'BGN';

interface CurrencyConfig {
    code: CurrencyCode;
    symbol: string;
    name: string;
    minAmount: number;
    maxAmount: number;
    step: number;
    locale: string; // For Intl.NumberFormat
}

interface CurrencyContextType {
    currency: CurrencyConfig;
    setCurrencyCode: (code: CurrencyCode) => void;
    formatMoney: (amount: number) => string;
    availableCurrencies: CurrencyConfig[];
}

const currencies: Record<CurrencyCode, CurrencyConfig> = {
    // --- SPECIAL ---
    INTL: { code: 'INTL', symbol: '', name: 'Global', minAmount: 5000, maxAmount: 15000000, step: 1000, locale: 'en-US' },

    // --- MAJORS (Requested First) ---
    EUR: { code: 'EUR', symbol: '€', name: 'Euro', minAmount: 5000, maxAmount: 15000000, step: 5000, locale: 'fr-FR' },
    USD: { code: 'USD', symbol: '$', name: 'US Dollar', minAmount: 5000, maxAmount: 15000000, step: 5000, locale: 'en-US' },

    // --- SOUTH AMERICA ---
    ARS: { code: 'ARS', symbol: '$', name: 'Peso Arg.', minAmount: 500000, maxAmount: 15000000000, step: 100000, locale: 'es-AR' },
    BOB: { code: 'BOB', symbol: 'Bs.', name: 'Boliviano', minAmount: 35000, maxAmount: 100000000, step: 5000, locale: 'es-BO' },
    BRL: { code: 'BRL', symbol: 'R$', name: 'Real', minAmount: 25000, maxAmount: 75000000, step: 5000, locale: 'pt-BR' },
    CLP: { code: 'CLP', symbol: '$', name: 'Peso Chil.', minAmount: 4000000, maxAmount: 14000000000, step: 1000000, locale: 'es-CL' },
    COP: { code: 'COP', symbol: '$', name: 'Peso Col.', minAmount: 20000000, maxAmount: 60000000000, step: 5000000, locale: 'es-CO' },
    PYG: { code: 'PYG', symbol: '₲', name: 'Guaraní', minAmount: 35000000, maxAmount: 110000000000, step: 5000000, locale: 'es-PY' },
    PEN: { code: 'PEN', symbol: 'S/', name: 'Sol', minAmount: 20000, maxAmount: 60000000, step: 5000, locale: 'es-PE' },
    UYU: { code: 'UYU', symbol: '$U', name: 'Peso Uru.', minAmount: 200000, maxAmount: 600000000, step: 50000, locale: 'es-UY' },
    VES: { code: 'VES', symbol: 'Bs.', name: 'Bolívar', minAmount: 200000, maxAmount: 600000000, step: 50000, locale: 'es-VE' },

    // --- CENTRAL / NORTH AMERICA ---
    MXN: { code: 'MXN', symbol: '$', name: 'Peso Mex.', minAmount: 100000, maxAmount: 300000000, step: 50000, locale: 'es-MX' },
    GTQ: { code: 'GTQ', symbol: 'Q', name: 'Quetzal', minAmount: 40000, maxAmount: 120000000, step: 5000, locale: 'es-GT' },
    HNL: { code: 'HNL', symbol: 'L', name: 'Lempira', minAmount: 125000, maxAmount: 375000000, step: 25000, locale: 'es-HN' },
    NIO: { code: 'NIO', symbol: 'C$', name: 'Córdoba', minAmount: 180000, maxAmount: 550000000, step: 20000, locale: 'es-NI' },
    CRC: { code: 'CRC', symbol: '₡', name: 'Colón', minAmount: 2500000, maxAmount: 7500000000, step: 500000, locale: 'es-CR' },
    PAB: { code: 'PAB', symbol: 'B/.', name: 'Balboa', minAmount: 5000, maxAmount: 15000000, step: 5000, locale: 'es-PA' },
    CUP: { code: 'CUP', symbol: '$', name: 'Peso Cub.', minAmount: 125000, maxAmount: 375000000, step: 25000, locale: 'es-CU' },
    DOP: { code: 'DOP', symbol: 'RD$', name: 'Peso Dom.', minAmount: 300000, maxAmount: 900000000, step: 50000, locale: 'es-DO' },

    // --- REST OF EUROPE & MAJORS ---
    GBP: { code: 'GBP', symbol: '£', name: 'British Pound', minAmount: 5000, maxAmount: 15000000, step: 5000, locale: 'en-GB' },
    CHF: { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', minAmount: 5000, maxAmount: 15000000, step: 5000, locale: 'de-CH' },
    DKK: { code: 'DKK', symbol: 'kr.', name: 'Danish Kr.', minAmount: 35000, maxAmount: 100000000, step: 5000, locale: 'da-DK' },
    NOK: { code: 'NOK', symbol: 'kr', name: 'Norw. Kr.', minAmount: 55000, maxAmount: 160000000, step: 5000, locale: 'nb-NO' },
    SEK: { code: 'SEK', symbol: 'kr', name: 'Swed. Kr.', minAmount: 55000, maxAmount: 160000000, step: 5000, locale: 'sv-SE' },
    ISK: { code: 'ISK', symbol: 'kr', name: 'Ice. Kr.', minAmount: 700000, maxAmount: 2000000000, step: 100000, locale: 'is-IS' },
    PLN: { code: 'PLN', symbol: 'zł', name: 'Złoty', minAmount: 20000, maxAmount: 60000000, step: 5000, locale: 'pl-PL' },
    HUF: { code: 'HUF', symbol: 'Ft', name: 'Forint', minAmount: 2000000, maxAmount: 6000000000, step: 500000, locale: 'hu-HU' },
    CZK: { code: 'CZK', symbol: 'Kč', name: 'Czech Kr.', minAmount: 120000, maxAmount: 350000000, step: 20000, locale: 'cs-CZ' },
    RON: { code: 'RON', symbol: 'lei', name: 'Leu', minAmount: 25000, maxAmount: 75000000, step: 5000, locale: 'ro-RO' },
    BGN: { code: 'BGN', symbol: 'лв', name: 'Lev', minAmount: 10000, maxAmount: 30000000, step: 2500, locale: 'bg-BG' }
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    const [currencyCode, setStateCurrencyCode] = useState<CurrencyCode>('INTL');

    // Load from localStorage or default
    useEffect(() => {
        const saved = localStorage.getItem('finanzas_currency') as CurrencyCode;
        if (saved && currencies[saved]) {
            setStateCurrencyCode(saved);
        }
    }, []);

    const setCurrencyCode = (code: CurrencyCode) => {
        setStateCurrencyCode(code);
        localStorage.setItem('finanzas_currency', code);
    };

    const formatMoney = (amount: number) => {
        const config = currencies[currencyCode];
        return new Intl.NumberFormat(config.locale, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Specific order requested by user
    const orderList: CurrencyCode[] = [
        'INTL', // Default
        'EUR', 'USD', 'ARS', 'BOB', 'BRL', 'CLP', 'COP', 'PYG', 'PEN', 'UYU', 'VES', 
        'MXN', 'GTQ', 'HNL', 'NIO', 'CRC', 'PAB', 'CUP', 'DOP', 
        'GBP', 'CHF', 'DKK', 'NOK', 'SEK', 'ISK', 'PLN', 'HUF', 'CZK', 'RON', 'BGN'
    ];

    const sortedCurrencies = orderList
        .map(code => currencies[code])
        .filter(c => c !== undefined);

    return (
        <CurrencyContext.Provider value={{
            currency: currencies[currencyCode],
            setCurrencyCode,
            formatMoney,
            availableCurrencies: sortedCurrencies
        }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};