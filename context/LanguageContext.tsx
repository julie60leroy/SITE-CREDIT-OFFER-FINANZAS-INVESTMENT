import React, { createContext, useContext, useState, useEffect, ReactNode, PropsWithChildren } from 'react';

type Language = 'en' | 'fr' | 'es';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: any;
}

const translations = {
    en: {
        nav: {
            home: "Home",
            about: "Institutional Profile",
            products: "Solutions",
            process: "Commitment",
            testimonials: "Performance",
            help: "Help",
            clientArea: "Client Area",
            startSimulation: "Start Simulation"
        },
        hero: {
            pill: "Canadian Solidity",
            title1: "Canadian Excellence",
            title2: "Global Projects",
            subtitle: "Finanzas Investment: A private financial group based in Toronto, supported by Scotiabank. Financial inclusion without borders.",
            cta: "Apply for Credit",
            watch: "Our Mission",
            focus: "Strategic Anchor",
            focusTitle: "Toronto, Canada",
            focusDesc: "One of the most rigorous financial hubs in the world."
        },
        solutions: {
            pill: "Financial Inclusion",
            title: "Financing Without Borders",
            desc: "We operate at the intersection of Europe and Latin America, offering immediate financial assistance regardless of banking status.",
            card1: {
                title: "Consumer Credit",
                tags: { auto: "Personal", work: "Projects", personal: "Cash" },
                speed: "Immediate Transfer",
                fee: "Scotiabank Backing",
                limit: "Up to",
                btn: "Start Request"
            },
            card2: {
                title: "Mortgage & Real Estate",
                badge: "Fixed Rate",
                monthly: "Est. Monthly",
                insurance: "Canadian Rigor",
                btn: "Simulate Loan"
            },
            card3: {
                title: "Professional Credit",
                subtitle: "Business Growth & Treasury",
                rateFrom: "Rates from",
                durationMax: "Max Duration",
                btn: "Simulate"
            },
            stats: {
                reviews: "Client Satisfaction",
                financed: "Capital Deployed",
                secure: "Scotiabank Partner",
                delay: "Execution Speed"
            }
        },
        process: {
            header: "Finanzas Innovation",
            title: "Payment",
            titleHighlight: "Flexibility",
            desc: "We have removed the barrier of banking exclusion. Funds are disbursed immediately via two strategic options.",
            step1Title: "Direct Bank Transfer",
            step1Desc: "For clients with a local account, ensuring rapid and secure receipt via our banking infrastructure.",
            step2Title: "Cash Deposit",
            step2Desc: "Via Western Union or MoneyGram. A simple ID is enough to withdraw funds anywhere.",
            step3Title: "Institutional Security",
            step3Desc: "Strict compliance with North American financial regulations for total peace of mind.",
            cta: "Verify Eligibility"
        },
        promo: {
            fixedRate: "CANADIAN ANCHOR",
            title: "Why Choose",
            titleHighlight: "Finanzas?",
            subtitle: "More than a digital platform, we are a private financial group rooted in Toronto's stability.",
            promise: "Funds in 24h",
            cta: "Apply Now",
            availability: "Scotiabank Support",
            manager: "Senior Advisor"
        },
        about: {
            pill: "Who Are We?",
            title1: "Institutional",
            title2: "Excellence",
            desc: "Based in Toronto, Canada, we combine North American banking rigor with digital agility. Supported by the multinational Scotiabank, we guarantee robust financing.",
            securityTitle: "Scotiabank Strategy",
            securityDesc: "A world-class banking infrastructure ensuring fund security and sustainable financing capacity.",
            growthTitle: "Total Inclusion",
            growthDesc: "No bank account? No problem. We deliver results where traditional banks stop.",
            link: "View Legal Identity",
            regulated: "Toronto HQ",
            license: "Regulated Entity"
        },
        testimonials: {
            pill: "Social Proof",
            title: "Performance & Satisfaction",
            role1: "Verified Client (Europe)",
            quote1: "The ability to receive funds via Western Union changed everything for me. The Canadian rigor is felt in every step.",
            role2: "Entrepreneur (LATAM)",
            quote2: "87% satisfaction is not just a number. It's the reality of their speed and reliability."
        },
        ctaSection: {
            title: "Your Project, Our Solidity",
            subtitle: "Join the thousands of clients in Europe and Latin America who trust our Canadian expertise.",
            btnSimulate: "Start Free Simulation",
            btnSpeak: "Contact Support"
        },
        simulator: {
            pill: "Immediate Action",
            title: "Simulate your credit",
            subtitle: "Transparent calculation based on North American standards.",
            cardTitle: "Credit Simulator",
            cardSubtitle: "Define your needs",
            borrowLabel: "I need",
            durationLabel: "Duration",
            months: "months",
            monthlyPayment: "Monthly Payment",
            totalCost: "Total Cost",
            apr: "Fixed APR",
            disclaimer: "*Subject to file validation",
            formTitle: "Secure Application",
            formSubtitle: "Encrypted & Confidential",
            firstName: "First Name",
            lastName: "Last Name",
            email: "Email Address",
            phone: "Phone Number",
            employment: "Status",
            empOptions: {
                placeholder: "Select Status",
                full: "Employed",
                part: "Part-time",
                self: "Self-employed",
                retired: "Retired",
                other: "Other"
            },
            submit: "VALIDATE & CONTACT VIA WHATSAPP",
            legal: "By continuing, you accept our",
            terms: "Terms",
            privacy: "Privacy Policy",
            protected: "Secured by",
            features: {
                secure: "Bank Security",
                approval: "Fast Decision",
                rates: "Fixed Rates",
                support: "24/7 Expert"
            },
            whatsappMessage: "Hello Finanzas Team,\n\nI am contacting you regarding a credit request:\n\n*Simulation:*\n- Amount: {amount} {currency}\n- Duration: {months} months\n- Monthly: {payment} {currency}\n\n*Profile:*\n- Name: {name}\n- Email: {email}\n- Phone: {phone}\n- Status: {status}\n\nI await your instructions for the file.",
            inclusionTitle: "Inclusion Without Borders",
            inclusionText: "We serve Europe & Latin America. Choose your local currency to see our adapted limits.",
            selectCurrency: "Select Currency"
        },
        footer: {
            desc: "FINANZAS INVESTMENT: Private financial group based in Toronto, Canada. Supported by Scotiabank infrastructure.",
            col1: "Institution",
            col2: "Compliance",
            col3: "Contact",
            rights: "All rights reserved.",
            ssl: "Bank Grade Security"
        }
    },
    fr: {
        nav: {
            home: "Accueil",
            about: "Profil Institutionnel",
            products: "Solutions",
            process: "Engagement",
            testimonials: "Performance",
            help: "Aide",
            clientArea: "Espace Client",
            startSimulation: "Commencer la simulation"
        },
        hero: {
            pill: "Solidité Canadienne",
            title1: "L'Excellence",
            title2: "Financière",
            subtitle: "FINANZAS INVESTMENT : Groupe financier privé basé à Toronto, soutenu par Scotiabank. L'inclusion financière sans frontières.",
            cta: "Demander un crédit",
            watch: "Notre Mission",
            focus: "Ancrage Stratégique",
            focusTitle: "Toronto, Canada",
            focusDesc: "L'une des places financières les plus stables et rigoureuses au monde."
        },
        solutions: {
            pill: "Inclusion Financière",
            title: "Financement Sans Frontières",
            desc: "Nous opérons à l'intersection de l'Europe et l'Amérique Latine, offrant une assistance financière immédiate, quel que soit le statut bancaire.",
            card1: {
                title: "Crédit Conso",
                tags: { auto: "Personnel", work: "Projets", personal: "Cash" },
                speed: "Virement Immédiat",
                fee: "Appui Scotiabank",
                limit: "Jusqu'à",
                btn: "Lancer la demande"
            },
            card2: {
                title: "Crédit Immobilier",
                badge: "Taux Fixe",
                monthly: "Mensualité est.",
                insurance: "Rigueur Canadienne",
                btn: "Simuler mon prêt"
            },
            card3: {
                title: "Crédit Pro",
                subtitle: "Croissance & Trésorerie Entreprise",
                rateFrom: "Taux à partir de",
                durationMax: "Durée max",
                btn: "Simuler"
            },
            stats: {
                reviews: "Satisfaction Client",
                financed: "Capital Déployé",
                secure: "Partenaire Scotiabank",
                delay: "Vitesse d'Exécution"
            }
        },
        process: {
            header: "Innovation Finanzas",
            title: "Flexibilité de",
            titleHighlight: "Versement",
            desc: "Nous avons supprimé la barrière de l'exclusion bancaire. Le versement des fonds est immédiat via deux options stratégiques.",
            step1Title: "Virement Bancaire Direct",
            step1Desc: "Pour les clients possédant un compte local, garantissant une réception rapide et sécurisée via notre infrastructure.",
            step2Title: "Dépôt Cash (WU / MoneyGram)",
            step2Desc: "Pour les clients sans compte bancaire. Une simple pièce d'identité suffit pour retirer les fonds partout.",
            step3Title: "Sécurité Institutionnelle",
            step3Desc: "Conformité stricte aux régulations financières nord-américaines pour une tranquillité d'esprit totale.",
            cta: "Vérifier mon éligibilité"
        },
        promo: {
            fixedRate: "ANCRAGE CANADIEN",
            title: "Pourquoi Choisir",
            titleHighlight: "Finanzas ?",
            subtitle: "Plus qu'une plateforme digitale, nous sommes un groupe financier privé ancré dans la stabilité de Toronto.",
            promise: "Fonds en 24h",
            cta: "Faire une demande",
            availability: "Soutien Scotiabank",
            manager: "Conseiller Senior"
        },
        about: {
            pill: "Qui Sommes-Nous ?",
            title1: "Excellence",
            title2: "Institutionnelle",
            desc: "Basés à Toronto, Canada, nous conjuguons la rigueur bancaire nord-américaine avec l'agilité numérique. Soutenus par la multinationale Scotiabank, nous garantissons un financement robuste.",
            securityTitle: "Soutien Stratégique",
            securityDesc: "Une infrastructure bancaire de rang mondial assurant la sécurité des fonds et une capacité de financement pérenne.",
            growthTitle: "Inclusion Totale",
            growthDesc: "Pas de compte bancaire ? Aucun problème. Nous délivrons des résultats là où les banques traditionnelles s'arrêtent.",
            link: "Voir l'Identité Légale",
            regulated: "Siège Toronto",
            license: "Entité Régulée"
        },
        testimonials: {
            pill: "Preuve Sociale",
            title: "Performance & Satisfaction",
            role1: "Client Vérifié (Europe)",
            quote1: "La possibilité de recevoir les fonds par Western Union a tout changé pour moi. La rigueur canadienne se sent dans chaque étape.",
            role2: "Entrepreneur (LATAM)",
            quote2: "87% de satisfaction, ce n'est pas juste un chiffre. C'est la réalité de leur rapidité et fiabilité."
        },
        ctaSection: {
            title: "Votre Projet, Notre Solidité",
            subtitle: "Rejoignez les milliers de clients en Europe et Amérique Latine qui font confiance à notre expertise canadienne.",
            btnSimulate: "Simulation Gratuite",
            btnSpeak: "Contacter le Support"
        },
        simulator: {
            pill: "Action Immédiate",
            title: "Simulez votre crédit",
            subtitle: "Calcul transparent basé sur les standards nord-américains.",
            cardTitle: "Simulateur de Crédit",
            cardSubtitle: "Définissez vos besoins",
            borrowLabel: "J'ai besoin de",
            durationLabel: "Durée",
            months: "mois",
            monthlyPayment: "Mensualité",
            totalCost: "Coût Total",
            apr: "TAEG Fixe",
            disclaimer: "*Sous réserve de validation du dossier",
            formTitle: "Demande Sécurisée",
            formSubtitle: "Crypté & Confidentiel",
            firstName: "Prénom",
            lastName: "Nom",
            email: "Adresse Email",
            phone: "Numéro de Téléphone",
            employment: "Statut",
            empOptions: {
                placeholder: "Sélectionnez votre statut",
                full: "Salarié",
                part: "Temps partiel",
                self: "Indépendant",
                retired: "Retraité",
                other: "Autre"
            },
            submit: "VALIDER & CONTACTER VIA WHATSAPP",
            legal: "En continuant, vous acceptez nos",
            terms: "Conditions",
            privacy: "Politique de Confidentialité",
            protected: "Sécurisé par",
            features: {
                secure: "Sécurité Bancaire",
                approval: "Décision Rapide",
                rates: "Taux Fixes",
                support: "Expert 24/7"
            },
            whatsappMessage: "Bonjour l'équipe Finanzas,\n\nJe vous contacte pour une demande de crédit :\n\n*Simulation :*\n- Montant : {amount} {currency}\n- Durée : {months} mois\n- Mensualité : {payment} {currency}\n\n*Mon Profil :*\n- Nom : {name}\n- Email : {email}\n- Téléphone : {phone}\n- Statut : {status}\n\nJ'attends vos instructions pour le dossier.",
            inclusionTitle: "Inclusion Sans Frontières",
            inclusionText: "Nous servons l'Europe & l'Amérique Latine. Choisissez votre devise locale pour voir nos plafonds adaptés.",
            selectCurrency: "Choisir ma devise"
        },
        footer: {
            desc: "FINANZAS INVESTMENT : Groupe financier privé basé à Toronto, Canada. Soutenu par l'infrastructure Scotiabank.",
            col1: "Institution",
            col2: "Conformité",
            col3: "Contact",
            rights: "Tous droits réservés.",
            ssl: "Sécurité Bancaire"
        }
    },
    es: {
        nav: {
            home: "Inicio",
            about: "Perfil Institucional",
            products: "Soluciones",
            process: "Compromiso",
            testimonials: "Rendimiento",
            help: "Ayuda",
            clientArea: "Área Cliente",
            startSimulation: "Iniciar Simulación"
        },
        hero: {
            pill: "Solidez Canadiense",
            title1: "Excelencia",
            title2: "Financiera",
            subtitle: "FINANZAS INVESTMENT: Grupo financiero privado con sede en Toronto, respaldado por Scotiabank. Inclusión financiera sin fronteras.",
            cta: "Solicitar Crédito",
            watch: "Nuestra Misión",
            focus: "Anclaje Estratégico",
            focusTitle: "Toronto, Canadá",
            focusDesc: "Uno de los centros financieros más estables y rigurosos del mundo."
        },
        solutions: {
            pill: "Inclusión Financiera",
            title: "Financiación Sin Fronteras",
            desc: "Operamos en la intersección de Europa y América Latina, ofreciendo asistencia financiera inmediata, independientemente del estado bancario.",
            card1: {
                title: "Crédito Consumo",
                tags: { auto: "Personal", work: "Proyectos", personal: "Efectivo" },
                speed: "Transferencia Inmediata",
                fee: "Respaldo Scotiabank",
                limit: "Hasta",
                btn: "Iniciar Solicitud"
            },
            card2: {
                title: "Crédito Hipotecario",
                badge: "Tasa Fija",
                monthly: "Mensualidad est.",
                insurance: "Rigor Canadiense",
                btn: "Simular Préstamo"
            },
            card3: {
                title: "Crédito Profesional",
                subtitle: "Crecimiento y Tesorería",
                rateFrom: "Tasas desde",
                durationMax: "Duración máx",
                btn: "Simular"
            },
            stats: {
                reviews: "Satisfacción Cliente",
                financed: "Capital Desplegado",
                secure: "Socio Scotiabank",
                delay: "Velocidad Ejecución"
            }
        },
        process: {
            header: "Innovación Finanzas",
            title: "Flexibilidad de",
            titleHighlight: "Pago",
            desc: "Hemos eliminado la barrera de la exclusión bancaria. El desembolso de fondos es inmediato a través de dos opciones estratégicas.",
            step1Title: "Transferencia Bancaria Directa",
            step1Desc: "Para clientes con cuenta local, garantizando una recepción rápida y segura a través de nuestra infraestructura.",
            step2Title: "Depósito en Efectivo",
            step2Desc: "Vía Western Union o MoneyGram. Una simple identificación es suficiente para retirar fondos en cualquier lugar.",
            step3Title: "Seguridad Institucional",
            step3Desc: "Estricto cumplimiento de las regulaciones financieras norteamericanas para una total tranquilidad.",
            cta: "Verificar Elegibilidad"
        },
        promo: {
            fixedRate: "ANCLAJE CANADIENSE",
            title: "¿Por Qué Elegir",
            titleHighlight: "Finanzas?",
            subtitle: "Más que una plataforma digital, somos un grupo financiero privado arraigado en la estabilidad de Toronto.",
            promise: "Fondos en 24h",
            cta: "Solicitar Ahora",
            availability: "Soporte Scotiabank",
            manager: "Asesor Senior"
        },
        about: {
            pill: "¿Quiénes Somos?",
            title1: "Excelencia",
            title2: "Institucional",
            desc: "Con sede en Toronto, Canadá, combinamos el rigor bancario norteamericano con la agilidad digital. Respaldados por la multinacional Scotiabank, garantizamos una financiación robusta.",
            securityTitle: "Respaldo Estratégico",
            securityDesc: "Una infraestructura bancaria de clase mundial que garantiza la seguridad de los fondos y una capacidad financiera sostenible.",
            growthTitle: "Inclusión Total",
            growthDesc: "¿Sin cuenta bancaria? No hay problema. Entregamos resultados donde los bancos tradicionales se detienen.",
            link: "Ver Identidad Legal",
            regulated: "Sede Toronto",
            license: "Entidad Regulada"
        },
        testimonials: {
            pill: "Prueba Social",
            title: "Rendimiento y Satisfacción",
            role1: "Cliente Verificado (Europa)",
            quote1: "La capacidad de recibir fondos por Western Union cambió todo para mí. El rigor canadiense se siente en cada paso.",
            role2: "Emprendedor (LATAM)",
            quote2: "87% de satisfacción no es solo un número. Es la realidad de su velocidad y fiabilidad."
        },
        ctaSection: {
            title: "Tu Proyecto, Nuestra Solidez",
            subtitle: "Únete a los miles de clientes en Europa y América Latina que confían en nuestra experiencia canadiense.",
            btnSimulate: "Simulación Gratuita",
            btnSpeak: "Contactar Soporte"
        },
        simulator: {
            pill: "Acción Inmediata",
            title: "Simula tu crédito",
            subtitle: "Cálculo transparente basado en estándares norteamericanos.",
            cardTitle: "Simulador de Crédito",
            cardSubtitle: "Define tus necesidades",
            borrowLabel: "Necesito",
            durationLabel: "Duración",
            months: "meses",
            monthlyPayment: "Pago Mensual",
            totalCost: "Costo Total",
            apr: "TAE Fija",
            disclaimer: "*Sujeto a validación del expediente",
            formTitle: "Solicitud Segura",
            formSubtitle: "Encriptado y Confidencial",
            firstName: "Nombre",
            lastName: "Apellido",
            email: "Correo Electrónico",
            phone: "Número de Teléfono",
            employment: "Estatus",
            empOptions: {
                placeholder: "Selecciona Estatus",
                full: "Empleado",
                part: "Medio tiempo",
                self: "Autónomo",
                retired: "Jubilado",
                other: "Otro"
            },
            submit: "VALIDAR Y CONTACTAR VÍA WHATSAPP",
            legal: "Al continuar, aceptas nuestros",
            terms: "Términos",
            privacy: "Política de Privacidad",
            protected: "Protegido por",
            features: {
                secure: "Seguridad Bancaria",
                approval: "Decisión Rápida",
                rates: "Tasas Fijas",
                support: "Experto 24/7"
            },
            whatsappMessage: "Hola equipo Finanzas,\n\nLes contacto para una solicitud de crédito:\n\n*Simulación:*\n- Monto: {amount} {currency}\n- Duración: {months} meses\n- Mensualidad: {payment} {currency}\n\n*Mi Perfil:*\n- Nombre: {name}\n- Email: {email}\n- Teléfono: {phone}\n- Estatus: {status}\n\nEspero sus instrucciones para el expediente.",
            inclusionTitle: "Inclusión Sin Fronteras",
            inclusionText: "Servimos a Europa y América Latina. Elige tu moneda local para ver nuestros límites adaptados.",
            selectCurrency: "Elegir Moneda"
        },
        footer: {
            desc: "FINANZAS INVESTMENT: Grupo financiero privado con sede en Toronto, Canadá. Respaldado por la infraestructura Scotiabank.",
            col1: "Institución",
            col2: "Cumplimiento",
            col3: "Contacto",
            rights: "Todos los derechos reservados.",
            ssl: "Seguridad Bancaria"
        }
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('en');

    useEffect(() => {
        // Auto-detect language
        const browserLang = navigator.language.split('-')[0];
        if (browserLang === 'fr' || browserLang === 'es') {
            setLanguage(browserLang);
        }
    }, []);

    const t = translations[language];

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};