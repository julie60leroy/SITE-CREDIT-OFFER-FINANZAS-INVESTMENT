import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';
import CurrencySelector from '../components/CurrencySelector';
import TopBar from '../components/TopBar';

const LandingPage: React.FC = () => {
    const { t } = useLanguage();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);
    
    // Stacked Carousel State
    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false); // State to pause autoplay on hover/touch
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // Images URLs
    const images = {
        heroAvatars: [
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80",
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80"
        ],
        heroMain: "https://images.unsplash.com/photo-1556740979-1a8ac78ef819?auto=format&fit=crop&w=1000&q=80",
        promoManager: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&h=100&q=80",
        promoLarge: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&h=1200&q=80",
        aboutMain: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&h=800&q=80",
        testimonial1: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&h=500&q=80",
        testimonial2: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&h=500&q=80"
    };

    // Unified Card Data Definition
    const cards = [
        {
            id: 'consumer',
            title: t.solutions.card1.title, // Crédit Conso
            mainIcon: 'person',
            tags: [
                { icon: 'account_balance_wallet', label: t.solutions.card1.tags.personal }, // Cash/Efectivo
                { icon: 'construction', label: t.solutions.card1.tags.work },
                { icon: 'shopping_bag', label: t.solutions.card1.tags.auto }
            ],
            features: [
                { icon: 'speed', title: t.solutions.card1.speed, sub: 'Western Union / Virement' }, // WU explicitly mentioned in sub if possible or generic
                { icon: 'verified', title: t.solutions.card1.fee, sub: 'Partenaire Scotiabank' }
            ],
            highlight: { label: t.solutions.card1.limit, value: '200 000€' },
            btnText: t.solutions.card1.btn
        },
        {
            id: 'mortgage',
            title: t.solutions.card2.title, // Crédit Immo
            mainIcon: 'home_work',
            tags: [
                { icon: 'key', label: 'Achat' },
                { icon: 'construction', label: 'Travaux' },
                { icon: 'real_estate_agent', label: 'Invest' }
            ],
            features: [
                { icon: 'trending_down', title: t.solutions.card2.badge, sub: 'Standards Canadiens' },
                { icon: 'security', title: t.solutions.card2.insurance, sub: 'Protection complète' }
            ],
            highlight: { label: t.solutions.card2.monthly, value: '700€ / mois' },
            btnText: t.solutions.card2.btn
        },
        {
            id: 'pro',
            title: t.solutions.card3.title, // Crédit Pro
            mainIcon: 'business_center',
            tags: [
                { icon: 'rocket_launch', label: 'Start' },
                { icon: 'inventory', label: 'Stock' },
                { icon: 'store', label: 'Equip' }
            ],
            features: [
                { icon: 'percent', title: `${t.solutions.card3.rateFrom} 2.45%`, sub: 'B2B Competitif' },
                { icon: 'calendar_month', title: t.solutions.card3.durationMax, sub: 'Max 120 mois' }
            ],
            highlight: { label: 'Plafond Disponible', value: '5 000 000€' },
            btnText: t.solutions.card3.btn
        }
    ];

    const rotateCards = () => {
        setActiveCardIndex((prev) => (prev + 1) % cards.length);
    };

    const prevCard = () => {
        setActiveCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
    };

    // Auto-slide effect
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            rotateCards();
        }, 4000); // Rotate every 4 seconds

        return () => clearInterval(interval);
    }, [isPaused, cards.length]);

    // Touch handlers for swipe functionality
    const minSwipeDistance = 50;
    
    const onTouchStart = (e: React.TouchEvent) => {
        setIsPaused(true); // Pause on touch
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        setIsPaused(false); // Resume after touch
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            rotateCards(); // Next
        }
        if (isRightSwipe) {
            prevCard(); // Prev
        }
    };

    // Calculate dynamic styles for the stack effect
    const getCardStyle = (index: number) => {
        // Calculate the card's position relative to the active card
        // 0 = Active, 1 = Next (Underneath), 2 = Last (Bottom)
        const position = (index - activeCardIndex + cards.length) % cards.length;

        // Base transition styles
        const transition = "transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)]";
        const base = "absolute w-full h-full rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden";

        if (position === 0) {
            // Front Card (Active)
            return `${base} ${transition} z-30 opacity-100 scale-100 translate-y-0 cursor-default`;
        } else if (position === 1) {
            // Second Card (Peeking underneath)
            return `${base} ${transition} z-20 opacity-60 scale-[0.95] translate-y-4 cursor-pointer hover:opacity-80`;
        } else {
            // Third Card (Bottom of stack)
            return `${base} ${transition} z-10 opacity-30 scale-[0.90] translate-y-8 pointer-events-none`;
        }
    };

    // Intersection Observer for Scroll Animation
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (id: string) => {
        setIsMobileMenuOpen(false);
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const openLightbox = (imgUrl: string) => {
        setLightboxImage(imgUrl);
    };

    const closeLightbox = () => {
        setLightboxImage(null);
    };

    return (
        <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-white antialiased overflow-x-hidden">
            {/* Lightbox Overlay */}
            {lightboxImage && (
                <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={closeLightbox}>
                    <button onClick={closeLightbox} className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full transition-colors z-[70]">
                        <Icon name="close" className="!text-3xl" />
                    </button>
                    <img 
                        src={lightboxImage} 
                        alt="Enlarged view" 
                        className="max-h-[85vh] max-w-full rounded-lg shadow-2xl object-contain animate-scale-up" 
                        onClick={(e) => e.stopPropagation()} 
                    />
                </div>
            )}
            
            <TopBar />

            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md dark:bg-slate-gray/95 dark:border-slate-800 transition-colors">
                <div className="px-4 md:px-10 py-3 md:py-4 max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-3 text-slate-900 dark:text-white cursor-pointer select-none group z-50 relative" onClick={() => scrollToSection('simulator')}>
                        <div className="size-8 text-primary group-hover:scale-110 transition-transform duration-500 group-hover:rotate-180">
                            <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L20.66 7V17L12 22L3.34 17V7L12 2Z" fill="currentColor"></path>
                                <path d="M12 8.5L15.5 10.5V14.5L12 16.5L8.5 14.5V10.5L12 8.5Z" fill="white"></path>
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-lg md:text-xl font-black leading-none tracking-tight text-slate-900 dark:text-white">FINANZAS</h2>
                            <span className="text-[0.6rem] md:text-[0.65rem] tracking-[0.2em] uppercase text-slate-500 font-medium">Investment</span>
                        </div>
                    </div>
                    
                    {/* Desktop Nav */}
                    <nav className="hidden md:flex flex-1 justify-center gap-8">
                        {['about', 'process', 'testimonials'].map((section) => (
                            <button key={section} onClick={() => scrollToSection(section)} className="cursor-pointer text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary text-sm font-semibold transition-colors uppercase tracking-wide hover:underline decoration-2 underline-offset-4 decoration-primary">
                                {t.nav[section]}
                            </button>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2 md:gap-4">
                        <Link to="/simulator" className="bg-primary hover:bg-primary-dark text-white rounded-full px-6 py-2.5 text-sm font-bold transition-all shadow-lg shadow-primary/20 hidden md:block tracking-wide hover:-translate-y-0.5 hover:shadow-glow">
                            {t.nav.startSimulation}
                        </Link>
                        
                        {/* Mobile Menu Toggle */}
                        <button onClick={toggleMobileMenu} className="md:hidden text-slate-800 dark:text-white z-50 relative p-1">
                            <Icon name={isMobileMenuOpen ? "close" : "menu"} className="!text-[28px]" />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-40 bg-white dark:bg-slate-900 pt-24 px-6 md:hidden animate-fade-in flex flex-col h-screen overflow-y-auto">
                        <div className="flex flex-col gap-6 text-xl font-medium text-slate-gray dark:text-white">
                            <button onClick={() => scrollToSection('about')} className="text-left border-b border-gray-100 dark:border-gray-800 pb-4">{t.nav.about}</button>
                            <button onClick={() => scrollToSection('process')} className="text-left border-b border-gray-100 dark:border-gray-800 pb-4">{t.nav.process}</button>
                            <button onClick={() => scrollToSection('testimonials')} className="text-left border-b border-gray-100 dark:border-gray-800 pb-4">{t.nav.testimonials}</button>
                            <div className="py-2 flex gap-4"></div>
                            <Link to="/simulator" className="mt-4 bg-primary text-white py-4 rounded-lg shadow-lg font-bold text-center">
                                {t.nav.startSimulation}
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <section className="relative w-full overflow-hidden hero-gradient py-12 md:py-24 lg:py-32" id="simulator">
                {/* Floating Blobs */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-20 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float-delayed"></div>
                
                <div className="layout-container max-w-7xl mx-auto px-4 md:px-10 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
                        <div className="flex flex-col gap-8 lg:w-1/2 text-white reveal active">
                            <div className="flex flex-col gap-6 text-left">
                                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold text-white uppercase tracking-widest backdrop-blur-sm shadow-lg animate-pulse-slow">
                                    <span className="size-2 rounded-full bg-primary"></span>
                                    {t.hero.pill}
                                </div>
                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight drop-shadow-lg">
                                    {t.hero.title1} <br/>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">{t.hero.title2}</span>
                                </h1>
                                <p className="text-slate-300 text-lg md:text-xl font-light leading-relaxed max-w-lg">
                                    {t.hero.subtitle}
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/simulator" className="flex h-14 items-center justify-center rounded-full bg-primary px-8 text-base font-bold text-white shadow-xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 tracking-wide hover:shadow-glow">
                                    {t.hero.cta}
                                </Link>
                                <button onClick={() => scrollToSection('about')} className="flex h-14 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 text-base font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/10">
                                    <Icon name="arrow_forward" />
                                    {t.hero.watch}
                                </button>
                            </div>
                            <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                                <div className="flex -space-x-3">
                                    {images.heroAvatars.map((url, i) => (
                                        <div 
                                            key={i} 
                                            className="size-10 rounded-full border-2 border-slate-gray bg-slate-200 bg-cover bg-center cursor-pointer hover:scale-110 transition-transform shadow-lg relative z-10 hover:z-20" 
                                            style={{ backgroundImage: `url('${url}')` }}
                                            onClick={() => openLightbox(url)}
                                        ></div>
                                    ))}
                                    <div className="size-10 rounded-full border-2 border-slate-gray bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white relative z-0">
                                        +2k
                                    </div>
                                </div>
                                <div className="text-sm font-medium text-slate-300">
                                    <span className="text-white font-bold">87%</span> {t.stats.reviews}
                                </div>
                            </div>
                        </div>
                        <div className="relative lg:w-1/2 w-full reveal delay-200">
                            <div className="absolute -right-20 -top-20 -z-10 h-[300px] w-[300px] md:h-[500px] md:w-[500px] rounded-full bg-primary/20 blur-[80px] md:blur-[100px] animate-pulse-slow"></div>
                            
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-[16/9] group cursor-pointer transform hover:scale-[1.01] transition-transform duration-500" onClick={() => openLightbox(images.heroMain)}>
                                <div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('${images.heroMain}')` }}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full z-20 pointer-events-none">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-primary font-bold uppercase tracking-wider text-xs mb-2">{t.hero.focus}</p>
                                            <h3 className="text-xl md:text-2xl font-bold text-white mb-1 shadow-black/50 drop-shadow-md">{t.hero.focusTitle}</h3>
                                            <p className="text-slate-300 text-sm shadow-black/50 drop-shadow-md">{t.hero.focusDesc}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

             {/* SOLUTIONS SECTION (UNIFIED STACK CAROUSEL) */}
             <section className="py-16 md:py-24 relative overflow-hidden bg-background-light dark:bg-background-dark" id="solutions">
                <div className="max-w-[1200px] mx-auto px-6 lg:px-20">
                    <div className="mb-20 text-center max-w-2xl mx-auto reveal">
                        <span className="text-primary font-bold tracking-widest text-xs uppercase">{t.solutions.pill}</span>
                        <h1 className="text-4xl md:text-5xl font-extrabold mt-4 mb-6 tracking-tight text-slate-900 dark:text-white">{t.solutions.title}</h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">{t.solutions.desc}</p>
                    </div>

                    {/* Stack Container */}
                    <div 
                        className="relative h-[480px] w-full max-w-[700px] mx-auto reveal delay-100 perspective-1000"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        {/* Touch Area */}
                        <div 
                            className="relative w-full h-full"
                            onTouchStart={onTouchStart}
                            onTouchMove={onTouchMove}
                            onTouchEnd={onTouchEnd}
                        >
                            {cards.map((card, index) => {
                                const isClickable = (index - activeCardIndex + cards.length) % cards.length !== 0; // Not front card
                                
                                return (
                                    <div
                                        key={card.id}
                                        onClick={() => { if (isClickable) rotateCards(); }}
                                        className={getCardStyle(index)}
                                    >
                                        {/* UNIFIED CARD DESIGN (Dark Theme for All) */}
                                        <div className="w-full h-full bg-[#1e2330] p-8 md:p-10 flex flex-col justify-between relative bg-gradient-to-br from-[#1e2330] to-[#151922]">
                                            {/* Abstract Background Blob */}
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                                            
                                            {/* Header */}
                                            <div className="relative z-10">
                                                <div className="flex justify-between items-start mb-8">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className="bg-primary/20 p-2 rounded-lg text-primary">
                                                                <Icon name={card.mainIcon} className="text-xl" />
                                                            </div>
                                                            <span className="text-xs font-bold text-primary tracking-widest uppercase">Finanzas Pro</span>
                                                        </div>
                                                        <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{card.title}</h3>
                                                    </div>
                                                    <div className="bg-white/5 p-2 rounded-full hover:bg-white/10 transition-colors cursor-help">
                                                        <Icon name="info" className="text-white/50" />
                                                    </div>
                                                </div>

                                                {/* Tags Row */}
                                                <div className="flex flex-wrap gap-3 mb-8">
                                                    {card.tags.map((tag, i) => (
                                                        <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/5 px-4 py-2 rounded-full hover:bg-white/10 transition-colors cursor-default">
                                                            <Icon name={tag.icon} className="text-sm text-primary" />
                                                            <span className="text-xs font-bold text-white">{tag.label}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Features List */}
                                                <div className="space-y-5">
                                                    {card.features.map((feat, i) => (
                                                        <div key={i} className="flex items-center gap-4 group">
                                                            <div className={`size-12 rounded-xl flex items-center justify-center transition-colors ${i === 0 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-white/70 group-hover:bg-white/10'}`}>
                                                                <Icon name={feat.icon} />
                                                            </div>
                                                            <div>
                                                                <p className="text-white font-bold text-base">{feat.title}</p>
                                                                <p className="text-white/50 text-xs font-medium uppercase tracking-wide">{feat.sub}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Footer Action */}
                                            <div className="relative z-10 flex items-center justify-between pt-8 border-t border-white/5 mt-4">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] uppercase tracking-widest text-white/40 font-black mb-1">{card.highlight.label}</span>
                                                    <span className="text-2xl md:text-3xl font-black text-white">{card.highlight.value}</span>
                                                </div>
                                                <Link to="/simulator" className="bg-white text-slate-900 px-8 py-4 rounded-xl font-black text-sm tracking-widest uppercase transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-white/20 group/btn flex items-center gap-2">
                                                    {card.btnText}
                                                    <Icon name="arrow_forward" className="text-lg group-hover/btn:translate-x-1 transition-transform" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination Dots (Visual Indicator of Stack) */}
                        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
                            {cards.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        // Calculate closest distance to rotate to this card
                                        const diff = (idx - activeCardIndex + cards.length) % cards.length;
                                        if (diff === 1) rotateCards();
                                        if (diff === 2) prevCard();
                                    }}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeCardIndex ? 'w-8 bg-primary' : 'w-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400'}`}
                                    aria-label={`Go to slide ${idx}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-32 border-t border-gray-100 dark:border-white/5 pt-16 reveal">
                        <div className="flex flex-col items-center text-center">
                            <span className="text-3xl font-black text-gray-900 dark:text-white mb-2">87%</span>
                            <div className="flex text-primary mb-2">
                                {[1,2,3,4,5].map(i => <Icon key={i} name="star" className="text-xs" filled />)}
                            </div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{t.solutions.stats.reviews}</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <span className="text-3xl font-black text-gray-900 dark:text-white mb-2">10M€+</span>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-4">{t.solutions.stats.financed}</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <span className="text-3xl font-black text-gray-900 dark:text-white mb-2">100%</span>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-4">{t.solutions.stats.secure}</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <span className="text-3xl font-black text-gray-900 dark:text-white mb-2">24h</span>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-4">{t.solutions.stats.delay}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-16 md:py-24 bg-slate-50 dark:bg-[#0f1623] relative" id="process">
                <div className="max-w-7xl mx-auto px-4 md:px-10">
                    <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20 reveal">
                        <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-3">{t.process.header}</h2>
                        <h3 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                            {t.process.title} <span className="text-primary">{t.process.titleHighlight}</span>
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 text-lg">
                            {t.process.desc}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Hide dashed line on mobile */}
                        <div className="hidden md:block absolute top-[24px] left-[16%] right-[16%] h-[2px] border-t-2 border-dashed border-primary/30 z-0 opacity-50"></div>
                        {[
                            { step: 1, icon: "account_balance", title: t.process.step1Title, desc: t.process.step1Desc },
                            { step: 2, icon: "payments", title: t.process.step2Title, desc: t.process.step2Desc },
                            { step: 3, icon: "verified_user", title: t.process.step3Title, desc: t.process.step3Desc }
                        ].map((item, idx) => (
                            <div key={item.step} className={`relative flex flex-col items-center text-center group z-10 reveal delay-${(idx + 1) * 100}`}>
                                <div className="mb-8 relative">
                                    <div className="size-12 rounded-full bg-primary text-white text-xl font-bold flex items-center justify-center shadow-[0_0_0_8px_rgba(248,250,252,1)] dark:shadow-[0_0_0_8px_rgba(15,22,35,1)] relative z-10 group-hover:scale-110 transition-transform duration-300">
                                        {item.step}
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 w-full h-full hover:-translate-y-2 transition-transform duration-300 hover:shadow-card">
                                    <div className="size-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                                        <Icon name={item.icon} className="text-3xl" />
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h4>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-16 text-center reveal">
                        <Link to="/simulator" className="bg-primary hover:bg-primary-dark text-white rounded-full px-10 py-4 text-lg font-bold transition-all shadow-xl shadow-primary/20 inline-block hover:-translate-y-1 hover:shadow-glow">
                            {t.process.cta}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Promo Section */}
            <section className="flex flex-col lg:flex-row w-full bg-slate-gray relative overflow-hidden" id="promo">
                <div className="lg:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center relative z-10 bg-slate-gray reveal">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"></div>
                    <div className="inline-flex items-center justify-center -rotate-2 mb-10 self-start shadow-xl transform hover:rotate-0 transition-transform duration-300">
                        <div className="bg-white text-primary font-black text-xl md:text-2xl px-6 py-3 rounded-sm shadow-sm border-2 border-primary border-dashed">
                            {t.promo.fixedRate}
                        </div>
                    </div>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tight">
                        {t.promo.title} <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">{t.promo.titleHighlight}</span>
                    </h2>
                    <p className="text-slate-300 text-lg mb-10 leading-relaxed max-w-lg font-light">
                        {t.promo.subtitle}
                    </p>
                    <div className="bg-white rounded-xl p-6 mb-12 flex items-center gap-5 shadow-2xl shadow-black/20 max-w-md transform transition-transform hover:scale-[1.02] cursor-pointer">
                        <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <Icon name="rocket_launch" className="text-3xl" />
                        </div>
                        <div>
                            <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Finanzas Promise</div>
                            <div className="text-2xl font-black text-slate-900">{t.promo.promise}</div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
                        <Link to="/simulator" className="bg-primary hover:bg-primary-dark text-white rounded-full px-8 py-4 text-lg font-bold transition-all shadow-lg shadow-primary/30 flex items-center gap-2 group hover:shadow-glow">
                            {t.promo.cta}
                            <Icon name="arrow_forward" className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <div className="flex items-center gap-3 pl-2 pr-4 py-2 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors">
                            <div className="size-10 rounded-full bg-cover bg-center border-2 border-primary cursor-pointer" style={{ backgroundImage: `url('${images.promoManager}')` }} onClick={() => openLightbox(images.promoManager)}></div>
                            <div className="flex flex-col">
                                <span className="text-white text-xs font-bold">Jean Rivière</span>
                                <span className="text-[10px] text-slate-400">{t.promo.manager}</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 ml-2">
                        <span className="text-green-400 text-xs font-medium flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            {t.promo.availability}
                        </span>
                    </div>
                </div>
                {/* Replaced Veo Video with Static Image */}
                <div className="lg:w-1/2 relative min-h-[500px] lg:min-h-full bg-white group overflow-hidden reveal delay-200" onClick={() => openLightbox(images.promoLarge)}>
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 cursor-pointer" style={{ backgroundImage: `url('${images.promoLarge}')` }}></div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-16 md:py-20 bg-white dark:bg-slate-gray" id="about">
                <div className="max-w-7xl mx-auto px-4 md:px-10">
                    <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-center">
                        <div className="md:w-1/2 relative reveal">
                            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl cursor-pointer group transform hover:-translate-y-2 transition-transform duration-500" onClick={() => openLightbox(images.aboutMain)}>
                                <div className="h-[350px] md:h-[500px] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('${images.aboutMain}')` }}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-gray/80 to-transparent"></div>
                                <div className="absolute bottom-8 left-8 text-white">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="bg-primary p-2 rounded-lg">
                                            <Icon name="verified" className="text-white" />
                                        </div>
                                        <span className="font-bold text-lg">{t.about.regulated}</span>
                                    </div>
                                    <p className="opacity-80 text-sm">{t.about.license}</p>
                                </div>
                            </div>
                            <div className="absolute -top-10 -left-10 z-0 text-slate-200 dark:text-slate-800 opacity-60 animate-float">
                                <svg fill="currentColor" height="200" viewBox="0 0 200 200" width="200">
                                    <path d="M100 0L186.6 50V150L100 200L13.4 150V50L100 0Z"></path>
                                </svg>
                            </div>
                        </div>
                        <div className="md:w-1/2 flex flex-col gap-6 md:gap-8 reveal delay-200">
                            <div>
                                <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-3">{t.about.pill}</h2>
                                <h3 className="text-slate-900 dark:text-white text-3xl md:text-5xl font-black leading-tight mb-6">
                                    {t.about.title1} <br/>
                                    <span className="text-slate-400">{t.about.title2}</span>
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                                    {t.about.desc}
                                </p>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4 group">
                                    <div className="mt-1 flex items-center justify-center size-12 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <Icon name="security" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">{t.about.securityTitle}</h4>
                                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                                            {t.about.securityDesc}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 group">
                                    <div className="mt-1 flex items-center justify-center size-12 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <Icon name="public" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">{t.about.growthTitle}</h4>
                                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                                            {t.about.growthDesc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4">
                                <button onClick={() => scrollToSection('process')} className="inline-flex items-center text-primary font-bold hover:text-primary-dark transition-colors group">
                                    {t.about.link}
                                    <Icon name="arrow_forward" className="ml-2 transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 md:py-24 bg-slate-50 dark:bg-[#151c2a]" id="testimonials">
                <div className="max-w-7xl mx-auto px-4 md:px-10">
                    <div className="flex flex-col items-center text-center mb-12 md:mb-16 reveal">
                        <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-3">{t.testimonials.pill}</h2>
                        <h3 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">{t.testimonials.title}</h3>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {[
                            { name: "Marc Dubois", role: t.testimonials.role1, quote: t.testimonials.quote1, imgUrl: images.testimonial1 },
                            { name: "Carlos M.", role: t.testimonials.role2, quote: t.testimonials.quote2, imgUrl: images.testimonial2 }
                        ].map((item, idx) => (
                            <div key={idx} className="testimonial-parallax-wrapper relative" data-speed={idx % 2 === 0 ? "0.1" : "0.05"}>
                                <div className="parallax-mover will-change-transform">
                                     <div className={`bg-white dark:bg-slate-900 p-8 md:p-10 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 relative hover:-translate-y-2 transition-transform duration-300 reveal delay-${idx * 200}`}>
                                        <div className="absolute top-8 right-8 text-slate-200 dark:text-slate-800">
                                            <Icon name="format_quote" className="text-6xl" />
                                        </div>
                                        <div className="flex items-center gap-2 mb-6 text-amber-500">
                                            {[...Array(5)].map((_, i) => <Icon key={i} name="star" filled />)}
                                        </div>
                                        <blockquote className="text-xl md:text-2xl font-medium text-slate-900 dark:text-white leading-relaxed mb-8 relative z-10">
                                            "{item.quote}"
                                        </blockquote>
                                        <div className="flex items-center gap-4">
                                            <div className="size-14 rounded-full bg-cover bg-center border-2 border-white dark:border-slate-700 shadow-md cursor-pointer hover:scale-110 transition-transform" style={{ backgroundImage: `url('${item.imgUrl}')` }} onClick={() => openLightbox(item.imgUrl)}></div>
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white text-lg">{item.name}</div>
                                                <div className="text-primary text-sm font-medium uppercase tracking-wide">{item.role}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 md:py-24 bg-slate-gray text-white relative overflow-hidden reveal">
                <div className="absolute inset-0 opacity-10">
                    <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                        <pattern height="43.4" id="hexagons" patternTransform="scale(2)" patternUnits="userSpaceOnUse" width="50">
                            <path d="M25 0 L50 14.4 L50 43.3 L25 57.7 L0 43.3 L0 14.4 Z" fill="none" stroke="currentColor" strokeWidth="1"></path>
                        </pattern>
                        <rect fill="url(#hexagons)" height="100%" width="100%"></rect>
                    </svg>
                </div>
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-6xl font-black mb-6 tracking-tight">{t.ctaSection.title}</h2>
                    <p className="text-slate-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                        {t.ctaSection.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link to="/simulator" className="px-10 py-5 bg-primary hover:bg-white hover:text-primary text-white rounded-full font-bold text-lg transition-all shadow-xl shadow-primary/30 transform hover:-translate-y-1 hover:shadow-glow">
                            {t.ctaSection.btnSimulate}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-background-dark text-slate-400 py-12 md:py-16 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 md:px-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-2 text-white mb-6">
                                <div className="size-6 text-primary animate-pulse-slow">
                                    <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2L20.66 7V17L12 22L3.34 17V7L12 2Z" fill="currentColor"></path>
                                        <path d="M12 8.5L15.5 10.5V14.5L12 16.5L8.5 14.5V10.5L12 8.5Z" fill="#101828"></path>
                                    </svg>
                                </div>
                                <h2 className="text-lg font-bold tracking-tight">FINANZAS INVESTMENT</h2>
                            </div>
                            <p className="text-sm leading-relaxed mb-6 text-slate-500">
                                {t.footer.desc}
                            </p>
                            <div className="flex gap-4">
                                {['public', 'mail', 'share'].map((icon) => (
                                    <a key={icon} className="text-slate-500 hover:text-primary transition-colors bg-slate-800 p-2 rounded-full hover:scale-110 transform duration-200" href="#">
                                        <Icon name={icon} className="!text-[20px]" />
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6 tracking-wide text-sm uppercase">{t.footer.col1}</h4>
                            <ul className="flex flex-col gap-3 text-sm">
                                <li><button onClick={() => scrollToSection('about')} className="hover:text-primary transition-colors text-left">{t.nav.about}</button></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Why Finanzas</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Careers</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Press</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6 tracking-wide text-sm uppercase">{t.footer.col2}</h4>
                            <ul className="flex flex-col gap-3 text-sm">
                                <li><a className="hover:text-primary transition-colors" href="#">{t.simulator.privacy}</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">{t.simulator.terms}</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Cookie Policy</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Risk Disclosure</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6 tracking-wide text-sm uppercase">{t.footer.col3}</h4>
                            <ul className="flex flex-col gap-4 text-sm">
                                <li className="flex items-center gap-3">
                                    <Icon name="call" className="text-primary text-lg" />
                                    +1 (555) 123-4567
                                </li>
                                <li className="flex items-center gap-3">
                                    <Icon name="mail" className="text-primary text-lg" />
                                    support@finanzas.com
                                </li>
                                <li className="flex items-center gap-3">
                                    <Icon name="location_on" className="text-primary text-lg" />
                                    123 Finance St, New York
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
                        <p>© 2024 Finanzas Investment Group. {t.footer.rights}</p>
                        <div className="flex gap-6 items-center">
                            <span>Regulatory ID: #883921</span>
                            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                            <span className="flex items-center gap-1">
                                <Icon name="lock" className="!text-[14px]" /> {t.footer.ssl}
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;