import React, { useRef, useState, useEffect } from 'react';
import { DivinationResult } from '../types';

interface DivinationCardProps {
  data: DivinationResult | null;
  loading: boolean;
}

export const DivinationCard: React.FC<DivinationCardProps> = ({ data, loading }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [loadingText, setLoadingText] = useState("推演中");
  const [isVisible, setIsVisible] = useState(true);
  
  // Dimensions for the card
  const width = 480;
  const height = 800; // Slightly taller for breathing room
  
  // Li Jigang Style Palette
  const colors = {
    bg: "#F7F5F0",            // Rice Paper White
    cardBg: "#F9F7F3",
    borderOuter: "#4A4A4A",   // Dark Grey Border
    borderInner: "#D4C4B7",   // Soft inner border
    questionBg: "#EFE9DC",    // Distinct beige box
    textTitle: "#1F1F1F",     // Near Black
    textMain: "#0F0F0F",      // Pitch Black
    textSub: "#574D45",       // Dark Brown-Grey
    accent: "#BC3632",        // Cinnabar Red
    line: "#D4C4B7"
  };

  useEffect(() => {
    if (!loading) return;
    
    const phrases = ["推演中"];
    let index = 0;
    setLoadingText(phrases[0]);
    setIsVisible(true);

    let timeoutId: any;
    // Very Slow cycle: Total 4000ms per phrase (2s fade out, 2s fade in)
    const interval = setInterval(() => {
      // 1. Start Fade Out (takes 2000ms)
      setIsVisible(false);

      // 2. Wait for fade out to complete (2000ms), then swap text and Fade In
      timeoutId = setTimeout(() => {
        index = (index + 1) % phrases.length;
        setLoadingText(phrases[index]);
        setIsVisible(true);
      }, 2000);
      
    }, 4000); 

    return () => {
        clearInterval(interval);
        clearTimeout(timeoutId);
    };
  }, [loading]);

  // --- LOADING STATE: EXQUISITE LUO PAN ---
  if (loading) {
    return (
      <div className="relative w-full max-w-[480px] aspect-[48/80] flex flex-col items-center justify-center overflow-hidden rounded-sm shadow-2xl bg-[#F7F5F0] border border-[#D4C4B7]">
         
         {/* 1. Ambient Background Effects */}
         <div className="absolute inset-0 opacity-30 mix-blend-multiply pointer-events-none" 
              style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`}}>
         </div>
         
         {/* 2. Central Animation Container */}
         <div className="relative z-10 scale-100 sm:scale-110 transition-transform duration-1000">
            <svg width="360" height="360" viewBox="0 0 360 360" className="text-[#1A1A1A]">
               <defs>
                  <radialGradient id="centerGlow" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0%" stopColor="#BC3632" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#F7F5F0" stopOpacity="0" />
                  </radialGradient>
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000" floodOpacity="0.1"/>
                  </filter>
               </defs>

               {/* Core Glow */}
               <circle cx="180" cy="180" r="100" fill="url(#centerGlow)" className="animate-pulse" />

               {/* Outer Static Decoration */}
               <circle cx="180" cy="180" r="170" fill="none" stroke="#D4C4B7" strokeWidth="0.5" opacity="0.6" />
               <circle cx="180" cy="180" r="165" fill="none" stroke="#D4C4B7" strokeWidth="3" strokeDasharray="1 5" opacity="0.2" />

               {/* Ring 1: 64 Hexagrams (Ticks) - Slow Rotation CW */}
               <g className="animate-[spin_60s_linear_infinite]" style={{ transformOrigin: '180px 180px' }}>
                  <circle cx="180" cy="180" r="145" fill="none" stroke="#D4C4B7" strokeWidth="0.5" />
                  {Array.from({ length: 64 }).map((_, i) => (
                    <line 
                      key={i} 
                      x1="180" y1="35" x2="180" y2="45" 
                      transform={`rotate(${i * (360/64)} 180 180)`} 
                      stroke="#3A3A3A" 
                      strokeWidth={i % 8 === 0 ? 1.5 : 0.5} 
                      opacity={i % 8 === 0 ? 0.6 : 0.3} 
                    />
                  ))}
               </g>

               {/* Ring 2: Bagua (Trigrams) - Medium Rotation CCW */}
               <g className="animate-[spin_20s_linear_infinite_reverse]" style={{ transformOrigin: '180px 180px' }}>
                   <path id="baguaPath" d="M 180, 180 m -115, 0 a 115,115 0 1,1 230,0 a 115,115 0 1,1 -230,0" fill="none" />
                   {['☰','☱','☲','☳','☴','☵','☶','☷'].map((char, i) => (
                      <text key={i} fontSize="24" fill="#2C2C2C" fontWeight="bold" dy="-5" style={{fontFamily: '"Noto Serif SC", serif'}}>
                        <textPath href="#baguaPath" startOffset={`${i * 12.5 + 6.25}%`} textAnchor="middle">
                           {char}
                        </textPath>
                      </text>
                   ))}
               </g>

               {/* Ring 3: Heavenly Stems - Fast Rotation CW */}
               <g className="animate-[spin_12s_linear_infinite]" style={{ transformOrigin: '180px 180px' }}>
                   <circle cx="180" cy="180" r="85" fill="none" stroke="#BC3632" strokeWidth="0.5" opacity="0.3"/>
                   <path id="stemsPath" d="M 180, 180 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0" fill="none" />
                   {['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'].map((char, i) => (
                      <text key={i} fontSize="16" fill="#574D45" className="font-cursive" fontWeight="bold">
                        <textPath href="#stemsPath" startOffset={`${i * 10 + 2}%`} textAnchor="middle">
                           {char}
                        </textPath>
                      </text>
                   ))}
               </g>

               {/* Center: Yin Yang Taiji */}
               <g className="animate-[spin_4s_linear_infinite]" style={{ transformOrigin: '180px 180px' }} filter="url(#shadow)">
                   {/* Border for contrast */}
                   <circle cx="180" cy="180" r="33" fill="none" stroke="#F7F5F0" strokeWidth="1" opacity="0.5" />
                   
                   {/* Taiji Shape */}
                   <circle cx="180" cy="180" r="32" fill="#1A1A1A" />
                   <path d="M 180 148 A 16 16 0 0 1 180 180 A 16 16 0 0 0 180 212 A 32 32 0 1 1 180 148" fill="#F7F5F0" />
                   
                   {/* Eyes */}
                   <circle cx="180" cy="164" r="5" fill="#1A1A1A" />
                   <circle cx="180" cy="196" r="5" fill="#F7F5F0" />
               </g>
            </svg>
         </div>

         {/* 3. Text Status */}
         <div className="absolute bottom-8 flex flex-col items-center space-y-3 z-20">
             <div className="h-8 w-[1px] bg-gradient-to-b from-transparent via-[#1A1A1A] to-transparent opacity-30"></div>
             <p className={`font-serif text-[#1A1A1A] text-xl tracking-[0.5em] font-bold transition-opacity duration-[2000ms] ease-in-out min-h-[1.75rem] whitespace-nowrap ${isVisible ? 'opacity-90' : 'opacity-0'}`}>
                {loadingText}
             </p>
             <p className="font-serif text-[#8C7B70] text-xs tracking-[0.2em] opacity-70">
                THE TAO IS MOVING
             </p>
         </div>
      </div>
    );
  }

  if (!data) return null;

  // --- RESULT CARD ---
  return (
    <div className="group relative shadow-2xl transition-all duration-500">
        <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="auto"
        className="max-w-[480px] mx-auto bg-[#F9F7F3] select-none rounded-sm"
        xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <filter id="noise">
                    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0.05 0"/>
                </filter>
                <filter id="seal-texture">
                    <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" result="noise" />
                    <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.4 0" in="noise" result="coloredNoise" />
                    <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="composite" />
                    <feBlend mode="multiply" in="composite" in2="SourceGraphic" />
                </filter>
            </defs>

            {/* --- BACKGROUND --- */}
            <rect width="100%" height="100%" fill={colors.cardBg} />
            <rect width="100%" height="100%" filter="url(#noise)" opacity="0.4" />

            {/* --- OUTER FRAME --- */}
            <rect x="20" y="20" width={width - 40} height={height - 40} fill="none" stroke={colors.borderOuter} strokeWidth="2" rx="4" />
            
            {/* --- HEADER (Compact) --- */}
            {/* Title */}
            <text x={width/2} y="70" textAnchor="middle" fill={colors.textTitle} className="font-serif" fontSize="32" letterSpacing="8" fontWeight="600">
                卜 卦
            </text>
            
            {/* Divider */}
            <line x1="50" y1="100" x2={width-50} y2="100" stroke={colors.line} strokeWidth="1.5" />

            {/* --- QUERY AREA (Refined & Compact) --- */}
            {/* 1. Background Box */}
            <rect x="50" y="120" width={width - 100} height="80" fill={colors.questionBg} rx="4" opacity="0.5" />
            
            {/* 2. Text Content */}
            <foreignObject x="50" y="120" width={width - 100} height="80">
                <div className="w-full h-full flex items-center justify-center px-4">
                     <div className="text-center flex flex-col items-center w-full">
                        <div className="font-serif text-[#1A1A1A] text-lg font-bold leading-relaxed line-clamp-2 tracking-wide" 
                              style={{
                                  fontFamily: '"Noto Serif SC", serif',
                                  textShadow: '0 0 0px rgba(0,0,0,0.8)'
                              }}>
                            {data.originalQuery}
                        </div>
                     </div>
                </div>
            </foreignObject>

            {/* --- VISUAL CENTERPIECE (Moved Up for Balance) --- */}
            
            {/* Hexagram Symbol */}
            <text x={width/2} y="310" textAnchor="middle" fill={colors.textMain} fontSize="110" fontFamily="sans-serif" fontWeight="900" className="opacity-90">
                {data.hexagram.symbol}
            </text>

            {/* Hexagram Name */}
            <text x={width/2} y="385" textAnchor="middle" fill={colors.textMain} className="font-serif" fontSize="42" letterSpacing="6" fontWeight="700">
                {data.hexagram.name} <tspan fontSize="28" dy="-5">卦</tspan>
            </text>
            
            {/* Judgment (Summary) */}
            <text x={width/2} y="435" textAnchor="middle" fill={colors.textSub} className="font-serif" fontSize="20" letterSpacing="2" fontWeight="500">
                {data.interpretation.judgment}
            </text>

            {/* --- POETIC INTERPRETATION (Closer to Center) --- */}
            <foreignObject x="40" y="480" width={width - 80} height="220">
                <div className="w-full h-full flex flex-col justify-center items-center">
                    <div className="space-y-5 text-center">
                    {data.interpretation.poem.map((line, idx) => (
                        <p key={idx} className="font-serif text-[#1A1A1A] text-2xl font-medium tracking-[0.15em] whitespace-nowrap leading-relaxed"
                           style={{ textShadow: '0 0 1px rgba(0,0,0,0.1)' }}>
                            {line}
                        </p>
                    ))}
                    </div>
                </div>
            </foreignObject>

            {/* --- FOOTER --- */}
            <line x1="50" y1="740" x2={width-50} y2="740" stroke={colors.line} strokeWidth="1.5" />
            
            {/* Signature: Wang Bi (Subtle, as requested) */}
            <text 
                x={width - 50} 
                y={height - 35} 
                textAnchor="end" 
                fill={colors.textSub} 
                fontSize="18" 
                className="font-serif" 
                letterSpacing="4"
                opacity="0.4"
            >
               王弼
            </text>

        </svg>
    </div>
  );
};