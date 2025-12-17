import React, { useEffect } from 'react';
import { useEmotion } from './useEmotion';

function App() {
  const { videoRef, emotion, loading, error, detect } = useEmotion();

  useEffect(() => {
    const interval = setInterval(() => detect(), 500);
    return () => clearInterval(interval);
  }, [detect]);

  // HIGH-CONTRAST THEMES
  const themes = {
    neutral: { 
      color: 'text-[#E50914]', 
      glow: 'shadow-[inset_0_0_150px_rgba(229,9,20,0.3)]',
      bgWash: 'from-red-900/20'
    },
    happy: { 
      color: 'text-[#FFFF00]', // Neon Yellow
      glow: 'shadow-[inset_0_0_250px_rgba(255,255,0,0.5)]',
      bgWash: 'from-yellow-400/50'
    },
    surprised: { 
      color: 'text-[#FF00FF]', // Neon Magenta/Purple
      glow: 'shadow-[inset_0_0_350px_rgba(255,0,255,0.6)]',
      bgWash: 'from-purple-600/50' 
    },
    sad: { 
      color: 'text-[#00BFFF]', // Deep Sky Blue
      glow: 'shadow-[inset_0_0_200px_rgba(0,191,255,0.3)]',
      bgWash: 'from-blue-900/30'
    },
    angry: { 
      color: 'text-[#FF3131]', // Fluorescent Red-Orange
      glow: 'shadow-[inset_0_0_250px_rgba(255,49,49,0.5)]',
      bgWash: 'from-red-600/40' 
    },
    fearful: {
      color: 'text-[#39FF14]', // Neon Green
      glow: 'shadow-[inset_0_0_350px_rgba(57,255,20,0.5)]',
      bgWash: 'from-green-950/60' 
    }
  };

  const ui = themes[emotion] || themes.neutral;

  return (
    <div className="min-h-screen bg-[#141414] text-white transition-all duration-1000 overflow-hidden relative">
      <video 
        ref={videoRef} 
        autoPlay 
        muted 
        playsInline 
        className="fixed top-0 left-0 w-1 h-1 opacity-0 pointer-events-none" 
      />

      {/* BACKGROUND ATMOSPHERE LAYER */}
      <div className={`fixed inset-0 bg-gradient-to-br ${ui.bgWash} via-transparent to-transparent pointer-events-none transition-all duration-1000 z-0 opacity-100`} />

      {loading ? (
        <div className="h-screen flex flex-col items-center justify-center relative z-10">
          <div className="w-12 h-12 border-4 border-t-[#E50914] border-gray-800 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 tracking-widest text-xs animate-pulse">
            {error ? `ERROR: ${error}` : "SYNCHRONIZING WITH EMOTIONS..."}
          </p>
        </div>
      ) : (
        <div className={`min-h-screen transition-all duration-1000 z-10 relative ${ui.glow}`}>
          {/* NAV */}
          <nav className="p-8 flex justify-between items-center fixed top-0 w-full z-50 bg-gradient-to-b from-black/80 to-transparent">
            <h1 className={`text-3xl font-black tracking-tighter transition-colors duration-700 ${ui.color}`}>EMOTIONFLIX</h1>
            <div className={`px-4 py-1 rounded-full border border-white/20 text-[10px] font-bold backdrop-blur-md`}>
              MOOD: <span className={`uppercase ${ui.color}`}>{emotion}</span>
            </div>
          </nav>

          {/* HERO */}
          <div className="h-screen flex items-center px-12">
            <div className="max-w-2xl">
              <div className="mb-4 inline-block">
                <span className={`text-xs font-bold tracking-[0.3em] uppercase ${ui.color}`}>Responsive Experiment</span>
                <div className={`h-[2px] w-full transition-all duration-700 bg-current ${ui.color}`}></div>
              </div>
              <h2 className="text-7xl font-bold mb-6 leading-tight uppercase italic tracking-tighter">
                The UI <br/> That Sees.
              </h2>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed max-w-lg">
                Currently adapting to your <span className={`font-bold transition-colors ${ui.color}`}>{emotion}</span> state. 
                Try acting <span className="text-white italic">angry</span> or <span className="text-white italic">surprised</span>.
              </p>
              <div className="flex gap-4">
                <button className="bg-white text-black px-10 py-3 font-bold rounded-sm hover:scale-105 transition">Play Demo</button>
                <button className="bg-gray-500/40 px-10 py-3 font-bold rounded-sm backdrop-blur-md border border-white/10">More Info</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;