import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Icon } from './Icon';

interface VeoVideoProps {
    prompt: string;
    aspectRatio: '16:9' | '9:16';
    placeholderUrl: string;
    className?: string;
}

const VeoVideo: React.FC<VeoVideoProps> = ({ prompt, aspectRatio, placeholderUrl, className = "" }) => {
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasKey, setHasKey] = useState(false);
    const [progress, setProgress] = useState(0); // Mock progress for UX

    useEffect(() => {
        checkKey();
    }, []);

    const checkKey = async () => {
        const aistudio = (window as any).aistudio;
        if (aistudio) {
            const selected = await aistudio.hasSelectedApiKey();
            setHasKey(selected);
        }
    };

    const handleGenerate = async () => {
        const aistudio = (window as any).aistudio;
        
        if (!hasKey) {
            if (aistudio) {
                await aistudio.openSelectKey();
                // Assume success per guidelines to handle race condition
                setHasKey(true);
            } else {
                return;
            }
        }

        setIsLoading(true);
        setProgress(10); // Start progress

        try {
            // Initialize Client with fresh key
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            let operation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt: prompt,
                config: {
                    numberOfVideos: 1,
                    resolution: '720p',
                    aspectRatio: aspectRatio
                }
            });

            // Polling loop
            while (!operation.done) {
                // Update mock progress
                setProgress(prev => Math.min(prev + 5, 90));
                
                await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
                operation = await ai.operations.getVideosOperation({ operation: operation });
            }

            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (downloadLink) {
                // Determine fetch URL
                const fetchUrl = `${downloadLink}&key=${process.env.API_KEY}`;
                
                // Fetch blob to avoid auth issues in video tag if needed, or use directly
                // For simplicity and speed, we try using the signed URL directly but usually fetch is safer for headers
                const videoRes = await fetch(fetchUrl);
                const blob = await videoRes.blob();
                const objectUrl = URL.createObjectURL(blob);
                
                setVideoUrl(objectUrl);
                setProgress(100);
            }
        } catch (error) {
            console.error("Video generation failed:", error);
            // Optionally reset key if 404/auth error
            if (error instanceof Error && error.message.includes("Requested entity was not found")) {
                setHasKey(false);
                if (aistudio) {
                    await aistudio.openSelectKey();
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (videoUrl) {
        return (
            <div className={`relative overflow-hidden ${className}`}>
                <video 
                    src={videoUrl} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover animate-fade-in"
                />
                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur px-2 py-1 rounded text-[10px] text-white font-mono border border-white/20">
                    AI GENERATED
                </div>
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden group ${className}`}>
            {/* Background Placeholder */}
            <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${placeholderUrl}')` }}
            ></div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>

            {/* Controls */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                {isLoading ? (
                    <div className="flex flex-col items-center gap-3 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10">
                        <div className="relative size-12">
                            <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                                <path className="text-gray-600" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                                <path className="text-primary transition-all duration-500 ease-out" strokeDasharray={`${progress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                                {Math.round(progress)}%
                            </div>
                        </div>
                        <span className="text-xs font-medium text-white animate-pulse">Generating Video...</span>
                    </div>
                ) : (
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleGenerate(); }}
                        className="flex flex-col items-center gap-2 group/btn"
                    >
                        <div className="size-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover/btn:bg-primary group-hover/btn:scale-110 transition-all shadow-lg shadow-black/20">
                            <Icon name={hasKey ? "auto_awesome" : "key"} className="text-white text-3xl" />
                        </div>
                        <div className="px-4 py-2 bg-black/60 backdrop-blur rounded-full text-xs font-bold text-white uppercase tracking-wider border border-white/10 group-hover/btn:bg-black/80 transition-colors">
                            {hasKey ? "Generate AI Video" : "Unlock AI Video"}
                        </div>
                    </button>
                )}
            </div>
        </div>
    );
};

export default VeoVideo;