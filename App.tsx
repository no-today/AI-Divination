import React, { useState, useCallback } from 'react';
import { DivinationCard } from './components/DivinationCard';
import { HEXAGRAMS } from './constants';
import { getWangBiInterpretation, getDeepInterpretation, getConcreteAdvice } from './services/geminiService';
import { DivinationResult, AppState } from './types';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<DivinationResult | null>(null);
  
  // Deep Dive States
  const [deepAnalysis, setDeepAnalysis] = useState<string | null>(null);
  const [deepError, setDeepError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Concrete Advice States (Level 4)
  const [concreteAnalysis, setConcreteAnalysis] = useState<string | null>(null);
  const [concreteError, setConcreteError] = useState<string | null>(null);
  const [analyzingConcrete, setAnalyzingConcrete] = useState(false);

  const performDivination = useCallback(async () => {
    if (!query.trim()) return;

    setState(AppState.DIVINING);
    setResult(null); 
    setDeepAnalysis(null);
    setDeepError(null);
    setConcreteAnalysis(null);
    setConcreteError(null);
    
    try {
      // Ritualistic delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Random Hexagram
      const randomIndex = Math.floor(Math.random() * HEXAGRAMS.length);
      const hexagram = HEXAGRAMS[randomIndex];

      // Interpretation
      const interpretation = await getWangBiInterpretation(query, hexagram);

      setResult({
        hexagram,
        interpretation,
        originalQuery: query
      });
      setState(AppState.RESULT);
    } catch (error) {
      console.error("Divination failed", error);
      setState(AppState.ERROR);
    }
  }, [query]);

  const handleDeepDive = async () => {
    if (!result || analyzing) return;
    setAnalyzing(true);
    setDeepError(null);
    try {
        const analysis = await getDeepInterpretation(
            result.originalQuery,
            result.hexagram,
            result.interpretation
        );
        setDeepAnalysis(analysis);
    } catch (e) {
        console.error(e);
        setDeepError("心不静，则道不明。请稍后再试。");
    } finally {
        setAnalyzing(false);
    }
  };

  const handleConcreteDive = async () => {
    if (!result || analyzingConcrete) return;
    setAnalyzingConcrete(true);
    setConcreteError(null);
    try {
        const advice = await getConcreteAdvice(
            result.originalQuery,
            result.hexagram
        );
        setConcreteAnalysis(advice);
    } catch (e) {
        console.error(e);
        setConcreteError("迷雾重重，暂且止步。请重试。");
    } finally {
        setAnalyzingConcrete(false);
    }
  };

  const handleReset = () => {
    setQuery('');
    setResult(null);
    setDeepAnalysis(null);
    setDeepError(null);
    setConcreteAnalysis(null);
    setConcreteError(null);
    setState(AppState.IDLE);
  };

  // Simple Markdown Parser for the simplified output
  const renderMarkdown = (text: string) => {
      const formatted = text
        // Remove Markdown headers if any sneak in
        .replace(/^#+\s*/gm, '') 
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#BC3632] font-bold font-serif tracking-wider">$1</strong>')
        // Paragraphs (double newline)
        .replace(/\n\s*\n/g, '</p><p class="mb-4">')
        // Single newlines
        .replace(/\n/g, '<br/>');

      return { __html: `<p class="mb-4">${formatted}</p>` };
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-x-hidden selection:bg-[#A63437] selection:text-white pb-20">
      
      {/* Background Atmosphere - Daoist Void */}
      <div className="absolute inset-0 pointer-events-none fixed">
         {/* Subtle Ink stains */}
         <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-[#EAE8E0] rounded-full opacity-40 blur-[120px] mix-blend-multiply"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#E3E0D4] rounded-full opacity-40 blur-[100px] mix-blend-multiply"></div>
      </div>

      <main className="w-full max-w-2xl px-6 z-10 flex flex-col items-center mt-10 mb-10">
        
        {/* 1. IDLE STATE: THE QUESTION */}
        {state === AppState.IDLE && (
          <div className="w-full flex flex-col items-center animate-[fadeIn_2s_ease-out] py-10">
            
            {/* Header Section */}
            <div className="relative mb-16 flex flex-col items-center">
                {/* Main Title: Zhou Yi */}
                <h1 className="font-calligraphy text-[8rem] leading-tight text-[#1A1A1A] opacity-90 select-none" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    周易
                </h1>
                
                {/* Seal and Subtitle Container */}
                <div className="flex items-center gap-4 mt-4">
                    {/* Red Seal: Wang Bi Zhu */}
                    <div className="border border-[#BC3632] p-1 opacity-80 rounded-sm">
                        <div className="bg-[#BC3632] text-[#F7F5F0] w-6 h-6 flex items-center justify-center text-[10px] font-serif leading-none pt-[1px]">
                            王弼
                        </div>
                    </div>
                    {/* Philosophical Line */}
                    <p className="font-serif text-sm tracking-[0.4em] text-[#574D45] opacity-70">
                        寂然不动 · 感而遂通
                    </p>
                </div>
            </div>

            {/* Input Section - Optimized Ancient Style */}
            <div className="relative w-full max-w-md group mt-8">
              <input
                type="text"
                className="w-full bg-transparent text-center text-2xl font-calligraphy text-[#1A1A1A] placeholder-[#A09B93] placeholder-opacity-40 border-none focus:ring-0 focus:outline-none py-4 transition-all duration-500 caret-[#BC3632]"
                placeholder="所问何事"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') performDivination();
                }}
                autoFocus
                spellCheck={false}
                autoComplete="off"
              />
              
              {/* Interaction: Hover Guide Line */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-[1px] bg-[#1A1A1A] opacity-0 group-hover:opacity-20 transition-all duration-500"></div>
              
              {/* Interaction: Focus Cinnabar Brush Stroke */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-transparent via-[#BC3632] to-transparent opacity-0 group-focus-within:opacity-90 group-focus-within:w-4/5 transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(188,54,50,0.3)]"></div>
            </div>
            
            {/* Action Button */}
            <div className={`mt-12 transition-all duration-1000 ${query ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
               <button
                 onClick={performDivination}
                 disabled={!query.trim()}
                 className="group relative px-8 py-3 overflow-hidden rounded-sm"
               >
                 <span className="relative z-10 font-serif text-[#574D45] text-sm tracking-[0.5em] group-hover:text-[#BC3632] transition-colors duration-500">
                    诚心一卜
                 </span>
                 {/* Subtle hover underline */}
                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-[#BC3632] group-hover:w-1/2 transition-all duration-500 ease-out opacity-50"></div>
               </button>
            </div>
          </div>
        )}

        {/* 2. LOADING STATE: THE PROCESS */}
        {state === AppState.DIVINING && (
           <div className="animate-[fadeIn_1s_ease-in-out]">
              <DivinationCard data={null} loading={true} />
           </div>
        )}

        {/* 3. RESULT STATE: THE IMAGE */}
        {state === AppState.RESULT && result && (
          <div className="flex flex-col items-center animate-[slideUp_1s_cubic-bezier(0.16,1,0.3,1)] w-full">
            <DivinationCard data={result} loading={false} />
            
            {/* Actions Area */}
            <div className="mt-10 flex flex-col items-center gap-4">
                <div className="flex items-center gap-8">
                    
                    {/* Reset / Ask Again */}
                    <button
                    onClick={handleReset}
                    className="group flex flex-col items-center space-y-2 opacity-50 hover:opacity-100 transition-opacity duration-300"
                    >
                    <div className="w-10 h-10 rounded-full border border-[#1A1A1A] flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                    </div>
                    <span className="text-xs tracking-[0.2em] text-[#1A1A1A] font-serif">重占</span>
                    </button>

                    {/* Deep Interpretation Button (Show if not analyzed yet) */}
                    {!deepAnalysis && (
                        <button
                        onClick={handleDeepDive}
                        disabled={analyzing}
                        className="group flex flex-col items-center space-y-2 opacity-80 hover:opacity-100 transition-opacity duration-300"
                        >
                        <div className={`w-12 h-12 rounded-full ${deepError ? 'bg-[#574D45]' : 'bg-[#BC3632]'} text-[#F7F5F0] flex items-center justify-center shadow-lg transition-transform duration-300 ${analyzing ? 'animate-spin' : 'group-hover:scale-110'}`}>
                                {analyzing ? (
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="32" strokeLinecap="round" /></svg>
                                ) : deepError ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
                                ) : (
                                    <span className="font-serif font-bold text-lg">解</span>
                                )}
                        </div>
                        <span className={`text-xs tracking-[0.2em] font-serif font-bold ${deepError ? 'text-[#574D45]' : 'text-[#BC3632]'}`}>
                            {deepError ? "重试" : "详解"}
                        </span>
                        </button>
                    )}
                </div>

                {/* Deep Interpretation Error Message */}
                {deepError && (
                    <p className="text-[#BC3632] font-serif text-sm tracking-widest opacity-80 animate-pulse">
                        {deepError}
                    </p>
                )}
            </div>

            {/* Deep Analysis Content Panel (Level 5.5) */}
            {deepAnalysis && (
                <div className="mt-12 w-full max-w-[480px] bg-[#F9F7F3] p-8 rounded-sm shadow-inner border-t-4 border-[#BC3632] animate-[fadeIn_1s_ease-out]">
                    <div className="flex flex-col items-center mb-6">
                        <h3 className="font-serif text-2xl text-[#1A1A1A] font-bold mb-2">注 疏</h3>
                        <div className="h-[1px] w-12 bg-[#BC3632]"></div>
                    </div>
                    <div 
                        className="font-serif text-[#2C2C2C] leading-loose text-justify tracking-wide text-lg opacity-90"
                        dangerouslySetInnerHTML={renderMarkdown(deepAnalysis)} 
                    />
                    <div className="mt-8 flex flex-col items-center space-y-6">
                        <span className="text-xs tracking-widest opacity-50">—— 王弼注</span>
                        
                        {/* Button for Level 4 (Concrete) */}
                        {!concreteAnalysis && (
                           <div className="flex flex-col items-center gap-2">
                               <button 
                                  onClick={handleConcreteDive}
                                  disabled={analyzingConcrete}
                                  className={`flex items-center space-x-2 px-4 py-2 border rounded-full transition-all duration-300 group ${concreteError ? 'border-[#BC3632] bg-[#BC3632] text-white' : 'border-[#D4C4B7] hover:bg-[#EAE8E0] hover:border-[#BC3632]'}`}
                               >
                                  {analyzingConcrete ? (
                                     <svg className={`w-4 h-4 animate-spin ${concreteError ? 'text-white' : 'text-[#BC3632]'}`} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="32" strokeLinecap="round" /></svg>
                                  ) : (
                                     <span className={`font-serif text-sm ${concreteError ? 'text-white' : 'text-[#574D45] group-hover:text-[#BC3632]'}`}>
                                        {concreteError ? "重试 指迷" : "指 迷"}
                                     </span>
                                  )}
                               </button>
                               {concreteError && (
                                   <span className="text-xs text-[#BC3632] font-serif tracking-wide">{concreteError}</span>
                               )}
                           </div>
                        )}
                    </div>
                </div>
            )}

            {/* Concrete Analysis Content Panel (Level 4) */}
            {concreteAnalysis && (
                <div className="mt-4 w-full max-w-[480px] bg-[#F0F0E8] p-6 rounded-sm shadow-sm border-l-4 border-[#574D45] animate-[fadeIn_1s_ease-out]">
                    <div className="flex items-center gap-3 mb-4 opacity-80">
                         <div className="w-2 h-2 bg-[#574D45] rounded-full"></div>
                         <h4 className="font-serif text-lg text-[#574D45] font-bold">行 止</h4>
                    </div>
                    <div 
                        className="font-serif text-[#3A3A3A] leading-relaxed text-justify tracking-wide text-base"
                        dangerouslySetInnerHTML={renderMarkdown(concreteAnalysis)} 
                    />
                </div>
            )}

          </div>
        )}

        {state === AppState.ERROR && (
            <div className="text-center font-serif text-gray-500">
                <p>The Dao is obscured. Try again.</p>
                <button onClick={handleReset} className="mt-4 underline">Return</button>
            </div>
        )}

      </main>
    </div>
  );
};

export default App;