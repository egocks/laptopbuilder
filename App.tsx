
import React, { useState, useEffect, useMemo } from 'react';
import { Category, Part, CompatibilityReport } from './types';
import { MOCK_PARTS } from './constants';
import { checkCompatibility, getPerformanceEstimate } from './services/geminiService';
import { 
  Monitor, 
  Cpu, 
  Gamepad2, 
  Database, 
  HardDrive, 
  Wifi, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ChevronRight, 
  Trash2, 
  Sparkles,
  Info
} from 'lucide-react';

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  [Category.CHASSIS]: <Monitor className="w-5 h-5" />,
  [Category.CPU]: <Cpu className="w-5 h-5" />,
  [Category.GPU]: <Gamepad2 className="w-5 h-5" />,
  [Category.RAM]: <Database className="w-5 h-5" />,
  [Category.STORAGE]: <HardDrive className="w-5 h-5" />,
  [Category.DISPLAY]: <Monitor className="w-5 h-5" />,
  [Category.WIFI]: <Wifi className="w-5 h-5" />,
};

const App: React.FC = () => {
  const [selectedParts, setSelectedParts] = useState<Partial<Record<Category, Part>>>({});
  const [activeCategory, setActiveCategory] = useState<Category>(Category.CHASSIS);
  const [compatibility, setCompatibility] = useState<CompatibilityReport | null>(null);
  const [performanceNote, setPerformanceNote] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const totalPrice = useMemo(() => {
    // Fixed: Explicitly typed reduce parameters to resolve the 'unknown' inference error on line 40
    return Object.values(selectedParts).reduce((sum: number, part: Part | undefined) => sum + (part?.price || 0), 0);
  }, [selectedParts]);

  const currentPartsList = useMemo(() => Object.values(selectedParts).filter(Boolean) as Part[], [selectedParts]);

  useEffect(() => {
    const analyzeBuild = async () => {
      if (currentPartsList.length === 0) {
        setCompatibility(null);
        setPerformanceNote("");
        return;
      }
      
      setIsAnalyzing(true);
      const report = await checkCompatibility(currentPartsList);
      setCompatibility(report);
      
      const estimate = await getPerformanceEstimate(currentPartsList);
      setPerformanceNote(estimate);
      setIsAnalyzing(false);
    };

    const timeoutId = setTimeout(analyzeBuild, 500);
    return () => clearTimeout(timeoutId);
  }, [currentPartsList]);

  const togglePart = (part: Part) => {
    setSelectedParts(prev => {
      const next = { ...prev };
      if (next[part.category]?.id === part.id) {
        delete next[part.category];
      } else {
        next[part.category] = part;
      }
      return next;
    });
  };

  const removePart = (category: Category) => {
    setSelectedParts(prev => {
      const next = { ...prev };
      delete next[category];
      return next;
    });
  };

  const categories = Object.values(Category);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
            LaptopConfig
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Total Build Cost</span>
            <span className="text-xl font-bold text-blue-400">${totalPrice.toLocaleString()}</span>
          </div>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full font-semibold transition-all shadow-lg shadow-blue-900/20 active:scale-95">
            Checkout Build
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Part Selection */}
        <div className="lg:col-span-8 space-y-6">
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all border ${
                  activeCategory === cat 
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300' 
                    : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {CATEGORY_ICONS[cat]}
                <span className="font-medium">{cat}</span>
                {selectedParts[cat] && <CheckCircle2 className="w-4 h-4 text-green-400 ml-1" />}
              </button>
            ))}
          </div>

          {/* Part Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_PARTS.filter(p => p.category === activeCategory).map(part => (
              <div 
                key={part.id}
                onClick={() => togglePart(part)}
                className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all ${
                  selectedParts[activeCategory]?.id === part.id
                    ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-600/5 shadow-2xl shadow-blue-500/10'
                    : 'border-white/10 bg-slate-800/40 hover:border-white/20'
                }`}
              >
                <div className="h-48 relative overflow-hidden">
                  <img src={part.image} alt={part.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur px-3 py-1 rounded-full border border-white/10 text-sm font-bold">
                    ${part.price}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg leading-tight group-hover:text-blue-400 transition-colors">{part.name}</h3>
                      <p className="text-slate-400 text-sm">{part.brand}</p>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                    {part.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(part.specs).map(([key, value]) => (
                      <span key={key} className="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-900 px-2 py-1 rounded border border-white/5">
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Build Summary & AI Insights */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Current Build List */}
          <div className="glass rounded-3xl p-6 shadow-xl sticky top-28">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Build Configuration
            </h2>
            
            <div className="space-y-3 mb-8">
              {categories.map(cat => {
                const part = selectedParts[cat];
                return (
                  <div key={cat} className="group relative">
                    <div className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      part ? 'bg-blue-600/10 border-blue-500/30' : 'bg-slate-900/50 border-white/5 border-dashed'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${part ? 'bg-blue-600/20 text-blue-400' : 'text-slate-600'}`}>
                          {CATEGORY_ICONS[cat]}
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold leading-none mb-1">
                            {cat}
                          </p>
                          <p className={`text-sm font-medium ${part ? 'text-white' : 'text-slate-600'}`}>
                            {part ? part.name : 'Not Selected'}
                          </p>
                        </div>
                      </div>
                      {part && (
                        <button 
                          onClick={() => removePart(cat)}
                          className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI Compatibility Panel */}
            <div className={`p-5 rounded-2xl border transition-all duration-500 ${
              isAnalyzing ? 'bg-slate-800/50 animate-pulse' :
              compatibility?.status === 'Compatible' ? 'bg-green-500/10 border-green-500/30' :
              compatibility?.status === 'Warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
              compatibility?.status === 'Incompatible' ? 'bg-red-500/10 border-red-500/30' :
              'bg-slate-800/50 border-white/5'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                {isAnalyzing ? (
                  <Sparkles className="w-5 h-5 text-blue-400 animate-spin" />
                ) : compatibility?.status === 'Compatible' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                ) : compatibility?.status === 'Warning' ? (
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                <span className="font-bold text-sm">
                  {isAnalyzing ? 'AI Analyzing...' : (compatibility?.status || 'Select parts to begin')}
                </span>
              </div>
              
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                {compatibility?.message || 'The Gemini AI engine will verify physical clearances, thermal headroom, and component synergy.'}
              </p>

              {compatibility?.details && compatibility.details.length > 0 && (
                <ul className="space-y-1">
                  {compatibility.details.map((detail, i) => (
                    <li key={i} className="text-[11px] flex items-start gap-2 text-slate-300">
                      <ChevronRight className="w-3 h-3 mt-0.5 text-slate-500" />
                      {detail}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Performance Panel */}
            {performanceNote && !isAnalyzing && (
              <div className="mt-4 p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl">
                <div className="flex items-center gap-2 mb-2 text-blue-400">
                  <Info className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Performance Insight</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{performanceNote}"
                </p>
              </div>
            )}
          </div>
        </aside>
      </main>

      <footer className="mt-12 py-12 bg-slate-900 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5 text-blue-500" />
            <span className="font-bold">LaptopConfig</span>
          </div>
          <p className="text-slate-500 text-sm">© 2024 Built with Gemini AI & Modern Stack. All rights reserved.</p>
          <div className="flex gap-6 text-slate-400 text-sm">
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
