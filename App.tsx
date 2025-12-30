
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Category, Part, CompatibilityReport, LaptopModel, Build, SavedBuild, ChatMessage, MatchType } from './types';
import { PARTS, LAPTOP_MODELS } from './constants';
import { checkCompatibility, getPerformanceEstimate } from './services/geminiService';
import {
  Monitor, Laptop, Database, HardDrive, Wifi, CheckCircle2, AlertTriangle,
  XCircle, ChevronRight, Trash2, Sparkles, Info, Cpu, Gamepad2,
  RotateCcw, Save, FolderOpen, ShoppingCart, MessageCircle, Send, X, ChevronLeft
} from 'lucide-react';

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  [Category.CPU]: <Cpu className="w-5 h-5" />,
  [Category.GPU]: <Gamepad2 className="w-5 h-5" />,
  [Category.RAM]: <Database className="w-5 h-5" />,
  [Category.STORAGE]: <HardDrive className="w-5 h-5" />,
  [Category.DISPLAY]: <Monitor className="w-5 h-5" />,
  [Category.WIFI]: <Wifi className="w-5 h-5" />,
};

const ALL_CATEGORIES = Object.values(Category);
const STORAGE_KEY = 'laptopconfig_build';
const SAVED_BUILDS_KEY = 'laptopconfig_saved_builds';

// Storage utilities
const loadCurrentBuild = (): Build => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const laptop = LAPTOP_MODELS.find(l => l.id === parsed.laptopId);
      const parts: Partial<Record<Category, Part>> = {};
      Object.entries(parsed.partIds || {}).forEach(([cat, id]) => {
        const part = PARTS.find(p => p.id === id);
        if (part) parts[cat as Category] = part;
      });
      return { laptop, parts };
    }
  } catch (e) { console.error('Load failed:', e); }
  return { parts: {} };
};

const saveCurrentBuild = (build: Build) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      laptopId: build.laptop?.id,
      partIds: Object.fromEntries(Object.entries(build.parts).map(([c, p]) => [c, p?.id]))
    }));
  } catch (e) { console.error('Save failed:', e); }
};

const loadSavedBuilds = (): SavedBuild[] => {
  try {
    const saved = localStorage.getItem(SAVED_BUILDS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
};

const saveBuildToList = (build: Build, name: string): SavedBuild => {
  const builds = loadSavedBuilds();
  const newBuild: SavedBuild = {
    id: Date.now().toString(),
    name,
    laptopId: build.laptop?.id,
    partIds: Object.fromEntries(Object.entries(build.parts).map(([c, p]) => [c, p?.id])),
    createdAt: Date.now()
  };
  builds.push(newBuild);
  localStorage.setItem(SAVED_BUILDS_KEY, JSON.stringify(builds));
  return newBuild;
};

const deleteSavedBuild = (id: string) => {
  const builds = loadSavedBuilds().filter(b => b.id !== id);
  localStorage.setItem(SAVED_BUILDS_KEY, JSON.stringify(builds));
};

const loadBuildFromSaved = (saved: SavedBuild): Build => {
  const laptop = LAPTOP_MODELS.find(l => l.id === saved.laptopId);
  const parts: Partial<Record<Category, Part>> = {};
  Object.entries(saved.partIds).forEach(([cat, id]) => {
    const part = PARTS.find(p => p.id === id);
    if (part) parts[cat as Category] = part;
  });
  return { laptop, parts };
};

// Matching logic
const getPartMatch = (laptop: LaptopModel, part: Part): { matchType: MatchType; note?: string } => {
  const builtIn = laptop.builtInSpecs.find(b => b.category === part.category);
  if (builtIn) {
    const builtInVal = Number(String(builtIn.specs.Capacity || builtIn.specs.Cores || '').replace(/\D/g, '')) || 0;
    const partVal = Number(String(part.specs.Capacity || part.specs.Cores || '').replace(/\D/g, '')) || 0;

    if (part.category === Category.CPU || part.category === Category.GPU) {
      if (builtIn.name.includes(part.name.split(' ').slice(-1)[0]) ||
        builtIn.specs.Generation === part.specs.Generation ||
        builtIn.specs.Performance === part.specs.Performance) {
        return { matchType: 'built-in', note: builtIn.name };
      }
    } else if (part.category === Category.DISPLAY) {
      if (builtIn.specs.Resolution === part.specs.Resolution || builtIn.specs.Type === part.specs.Type) {
        return { matchType: 'built-in', note: 'Included' };
      }
      if (builtIn.upgradeable) {
        const slot = laptop.upgradeSlots.find(s => s.category === Category.DISPLAY);
        if (slot && part.interface === slot.interface) return { matchType: 'upgradeable', note: 'Can upgrade' };
      }
    } else if (part.category === Category.RAM) {
      if (builtInVal >= partVal) return { matchType: 'built-in', note: `Has ${builtIn.specs.Capacity}` };
      if (builtIn.upgradeable) {
        const slot = laptop.upgradeSlots.find(s => s.category === Category.RAM);
        if (slot && (part.interface === slot.interface || part.interface.includes(String(slot.interface).split('-')[0]))) {
          if (partVal <= (slot.maxCapacity || 64)) return { matchType: 'upgradeable', note: `Up to ${slot.maxCapacity}GB` };
        }
      }
    } else if (part.category === Category.STORAGE) {
      if (builtInVal >= partVal) return { matchType: 'built-in', note: `Has ${builtIn.specs.Capacity}` };
      const slot = laptop.upgradeSlots.find(s => s.category === Category.STORAGE);
      if (slot && part.interface === slot.interface) return { matchType: 'upgradeable', note: 'Can upgrade' };
    } else if (part.category === Category.WIFI) {
      if (builtIn.specs.Standard === part.specs.Standard) return { matchType: 'built-in', note: 'Included' };
      if (builtIn.upgradeable) {
        const slot = laptop.upgradeSlots.find(s => s.category === Category.WIFI);
        if (slot && part.interface === slot.interface) return { matchType: 'upgradeable', note: 'Can upgrade' };
      }
    }
  }
  const slot = laptop.upgradeSlots.find(s => s.category === part.category);
  if (slot && part.interface === slot.interface) return { matchType: 'upgradeable', note: 'Can add' };
  return { matchType: 'incompatible' };
};

const isLaptopCompatible = (laptop: LaptopModel, parts: Partial<Record<Category, Part>>): boolean => {
  return Object.values(parts).every(part => !part || getPartMatch(laptop, part).matchType !== 'incompatible');
};

type ViewMode = 'browse' | 'laptops' | 'review';

const App: React.FC = () => {
  const [build, setBuild] = useState<Build>(loadCurrentBuild);
  const [activeCategory, setActiveCategory] = useState<Category>(Category.CPU);
  const [compatibility, setCompatibility] = useState<CompatibilityReport | null>(null);
  const [performanceNote, setPerformanceNote] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('browse');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>(loadSavedBuilds);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { saveCurrentBuild(build); }, [build]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

  const totalPrice = useMemo(() => (Object.values(build.parts) as (Part | undefined)[]).reduce((s, p) => s + (p?.price || 0), 0), [build.parts]);
  const currentPartsList = useMemo(() => Object.values(build.parts).filter(Boolean) as Part[], [build.parts]);
  const compatibleLaptops = useMemo(() => {
    if (!Object.keys(build.parts).length) return LAPTOP_MODELS;
    return LAPTOP_MODELS.filter(l => isLaptopCompatible(l, build.parts));
  }, [build.parts]);

  useEffect(() => {
    if (!currentPartsList.length) { setCompatibility(null); setPerformanceNote(''); return; }
    const timeout = setTimeout(async () => {
      setIsAnalyzing(true);
      setCompatibility(await checkCompatibility(currentPartsList));
      setPerformanceNote(await getPerformanceEstimate(currentPartsList));
      setIsAnalyzing(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [currentPartsList]);

  const startOver = () => {
    setBuild({ parts: {} });
    setViewMode('browse');
    setChatMessages([]);
  };

  const handleSaveBuild = () => {
    if (!saveName.trim()) return;
    saveBuildToList(build, saveName.trim());
    setSavedBuilds(loadSavedBuilds());
    setSaveName('');
    setShowSaveModal(false);
  };

  const handleLoadBuild = (saved: SavedBuild) => {
    setBuild(loadBuildFromSaved(saved));
    setShowLoadModal(false);
  };

  const handleDeleteBuild = (id: string) => {
    deleteSavedBuild(id);
    setSavedBuilds(loadSavedBuilds());
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = { role: 'user', content: chatInput.trim(), timestamp: Date.now() };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    // Mock AI response for demo
    setTimeout(() => {
      const specs = currentPartsList.map(p => p.name).join(', ');
      const laptop = build.laptop?.name || 'your selection';
      const response: ChatMessage = {
        role: 'assistant',
        content: `Based on ${laptop} with ${specs || 'no specs selected'}: ${userMsg.content.toLowerCase().includes('gaming')
          ? "For gaming, I'd recommend focusing on GPU performance. The AMD Radeon 780M offers excellent integrated graphics."
          : userMsg.content.toLowerCase().includes('upgrade')
            ? "For upgrades, check the compatibility indicators. Green means built-in, yellow means upgradeable."
            : "I'm here to help with your laptop configuration. Ask about gaming, productivity, upgrades, or specific components!"
          }`,
        timestamp: Date.now()
      };
      setChatMessages(prev => [...prev, response]);
    }, 1000);
  };

  const getPurchaseUrl = () => {
    if (!build.laptop) return '#';
    const params = new URLSearchParams();
    (Object.entries(build.parts) as [string, Part | undefined][]).forEach(([cat, part]) => {
      if (part) params.append(cat.toLowerCase().replace(' ', '_'), part.id);
    });
    return `${build.laptop.purchaseUrl || '#'}?${params.toString()}`;
  };

  const partsInCategory = useMemo(() => PARTS.filter(p => p.category === activeCategory), [activeCategory]);

  // Review Screen
  if (viewMode === 'review') {
    return (
      <div className="min-h-screen flex flex-col bg-slate-900 animate-slideInRight">
        <header className="glass sticky top-0 z-50 border-b border-white/10 px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <button onClick={() => setViewMode('laptops')} className="flex items-center gap-2 text-slate-400 hover:text-white">
              <ChevronLeft className="w-5 h-5" /> Back
            </button>
            <h1 className="text-xl font-bold">Review Your Build</h1>
            <button onClick={startOver} className="flex items-center gap-2 text-slate-400 hover:text-red-400">
              <RotateCcw className="w-4 h-4" /> Start Over
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-5xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Laptop & Specs Summary */}
          <div className="lg:col-span-2 space-y-6">
            {build.laptop && (
              <div className="glass rounded-2xl overflow-hidden">
                <div className="h-48 relative">
                  <img src={build.laptop.image} alt={build.laptop.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h2 className="text-2xl font-bold">{build.laptop.name}</h2>
                    <p className="text-slate-400">{build.laptop.brand} • {build.laptop.releaseYear}</p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold mb-4">Your Configuration</h3>
                  <div className="space-y-3">
                    {ALL_CATEGORIES.map(cat => {
                      const part = build.parts[cat];
                      const builtIn = build.laptop?.builtInSpecs.find(b => b.category === cat);
                      return (
                        <div key={cat} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="text-blue-400">{CATEGORY_ICONS[cat]}</div>
                            <div>
                              <p className="text-xs text-slate-500 uppercase">{cat}</p>
                              <p className="font-medium">{part?.name || builtIn?.name || 'Stock'}</p>
                            </div>
                          </div>
                          {part?.price ? <span className="text-green-400">+${part.price}</span> : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* AI Validation */}
            {compatibility && (
              <div className={`p-5 rounded-2xl border ${compatibility.status === 'Compatible' ? 'bg-green-500/10 border-green-500/30' :
                compatibility.status === 'Warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
                  'bg-red-500/10 border-red-500/30'
                }`}>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  <span className="font-bold">AI Validation: {compatibility.status}</span>
                </div>
                <p className="text-sm text-slate-300 mb-3">{compatibility.message}</p>
                {compatibility.details.map((d, i) => (
                  <p key={i} className="text-xs text-slate-400 flex items-start gap-2">
                    <ChevronRight className="w-3 h-3 mt-1" /> {d}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Price & Purchase */}
          <div className="space-y-4">
            <div className="glass rounded-2xl p-6">
              <h3 className="font-bold mb-4">Price Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-400">Base Laptop</span><span>Included</span></div>
                {(Object.entries(build.parts) as [string, Part | undefined][]).map(([cat, part]) => part?.price ? (
                  <div key={cat} className="flex justify-between">
                    <span className="text-slate-400">{part.name}</span>
                    <span>+${part.price}</span>
                  </div>
                ) : null)}
                <hr className="border-white/10 my-3" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Upgrade Total</span>
                  <span className="text-blue-400">${totalPrice}</span>
                </div>
              </div>

              <a
                href={getPurchaseUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
              >
                <ShoppingCart className="w-5 h-5" />
                Purchase from {build.laptop?.brand}
              </a>
            </div>

            {/* Chat Button */}
            <button
              onClick={() => setIsChatOpen(true)}
              className="w-full p-4 bg-purple-600/20 border border-purple-500/30 rounded-xl flex items-center justify-center gap-2 hover:bg-purple-600/30 transition-all"
            >
              <MessageCircle className="w-5 h-5 text-purple-400" />
              <span className="font-medium">Ask AI Assistant</span>
            </button>
          </div>
        </main>

        {/* Chat Modal */}
        {isChatOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/50">
            <div className="w-full max-w-lg bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-400" /> AI Assistant</h3>
                <button onClick={() => setIsChatOpen(false)}><X className="w-5 h-5" /></button>
              </div>
              <div className="h-80 overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 && (
                  <p className="text-center text-slate-500 text-sm">Ask me anything about your laptop configuration!</p>
                )}
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-200'
                      }`}>{msg.content}</div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="p-4 border-t border-white/10 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Ask about gaming, upgrades, comparisons..."
                  className="flex-1 bg-slate-700 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
                <button onClick={sendChatMessage} className="bg-blue-600 p-2 rounded-xl"><Send className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main Browse/Laptop View
  return (
    <div className="min-h-screen flex flex-col animate-fadeIn">
      <header className="glass sticky top-0 z-50 border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg"><Laptop className="w-6 h-6 text-white" /></div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">Laptop Builder</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowLoadModal(true)} className="p-2 text-slate-400 hover:text-white" title="Load Build">
            <FolderOpen className="w-5 h-5" />
          </button>
          <button onClick={() => setShowSaveModal(true)} className="p-2 text-slate-400 hover:text-white" title="Save Build">
            <Save className="w-5 h-5" />
          </button>
          <button onClick={startOver} className="p-2 text-slate-400 hover:text-red-400" title="Start Over">
            <RotateCcw className="w-5 h-5" />
          </button>
          <div className="hidden md:flex flex-col items-end ml-4">
            <span className="text-xs text-slate-400 uppercase">Upgrades</span>
            <span className="text-lg font-bold text-blue-400">${totalPrice}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {/* View Toggle */}
          <div className="flex gap-2">
            <button onClick={() => setViewMode('browse')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${viewMode === 'browse' ? 'bg-blue-600 text-white' : 'bg-slate-800/50 text-slate-400 border border-white/5'}`}>
              <HardDrive className="w-4 h-4" /> Browse Specs
            </button>
            <button onClick={() => setViewMode('laptops')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${viewMode === 'laptops' ? 'bg-blue-600 text-white' : 'bg-slate-800/50 text-slate-400 border border-white/5'}`}>
              <Laptop className="w-4 h-4" /> Find Laptops
              {Object.keys(build.parts).length > 0 && <span className="bg-blue-500/30 text-xs px-2 py-0.5 rounded-full">{compatibleLaptops.length}</span>}
            </button>
          </div>

          {/* Browse Specs */}
          {viewMode === 'browse' && (
            <>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {ALL_CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap border transition-all ${activeCategory === cat ? 'bg-blue-600/20 border-blue-500 text-blue-300' : 'bg-slate-800/50 border-white/5 text-slate-400'}`}>
                    {CATEGORY_ICONS[cat]} {cat} {build.parts[cat] && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {partsInCategory.map(part => (
                  <div key={part.id} onClick={() => setBuild(p => ({ ...p, parts: { ...p.parts, [part.category]: p.parts[part.category]?.id === part.id ? undefined : part } }))} className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all ${build.parts[activeCategory]?.id === part.id ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-600/5' : 'border-white/10 bg-slate-800/40 hover:border-white/20'}`}>
                    <div className="h-36 relative overflow-hidden">
                      <img src={part.image} alt={part.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      {part.price > 0 && <div className="absolute top-3 right-3 bg-slate-900/80 px-3 py-1 rounded-full text-sm font-bold">+${part.price}</div>}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold group-hover:text-blue-400">{part.name}</h3>
                      <p className="text-slate-400 text-sm line-clamp-2 mt-1">{part.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Find Laptops */}
          {viewMode === 'laptops' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {compatibleLaptops.map(laptop => (
                <div key={laptop.id} onClick={() => { setBuild(p => ({ ...p, laptop })); setViewMode('review'); }} className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all ${build.laptop?.id === laptop.id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-white/10 bg-slate-800/40 hover:border-white/20'}`}>
                  <div className="h-36 relative overflow-hidden">
                    <img src={laptop.image} alt={laptop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute top-3 right-3 bg-slate-900/80 px-3 py-1 rounded-full text-sm font-bold">{laptop.releaseYear}</div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold group-hover:text-blue-400">{laptop.name}</h3>
                    <p className="text-slate-400 text-sm">{laptop.baseSpecs.cpu}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(Object.entries(build.parts) as [string, Part | undefined][]).filter(([, p]) => p).map(([cat, part]) => {
                        const match = getPartMatch(laptop, part!);
                        return <span key={cat} className={`text-[9px] uppercase font-bold px-2 py-1 rounded ${match.matchType === 'built-in' ? 'text-green-400 bg-green-900/30' : match.matchType === 'upgradeable' ? 'text-yellow-400 bg-yellow-900/30' : 'text-red-400 bg-red-900/30'}`}>{cat}: {match.note || match.matchType}</span>;
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4">
          <div className="glass rounded-3xl p-6 sticky top-28">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-yellow-400" /> Your Requirements</h2>
            <div className="space-y-2 mb-4">
              {ALL_CATEGORIES.map(cat => {
                const part = build.parts[cat];
                if (!part) return null;
                return (
                  <div key={cat} className="flex items-center justify-between p-3 rounded-xl bg-blue-600/10 border border-blue-500/30">
                    <div className="flex items-center gap-3">
                      <div className="text-blue-400">{CATEGORY_ICONS[cat]}</div>
                      <div>
                        <p className="text-[10px] uppercase text-slate-500">{cat}</p>
                        <p className="text-sm font-medium">{part.name}</p>
                      </div>
                    </div>
                    <button onClick={() => setBuild(p => { const n = { ...p.parts }; delete n[cat]; return { ...p, parts: n }; })} className="text-slate-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                );
              })}
              {!Object.keys(build.parts).length && <p className="text-sm text-slate-500 text-center py-4">Select specs to start</p>}
            </div>
            {Object.keys(build.parts).length > 0 && (
              <div className="p-3 bg-slate-800/50 rounded-xl text-sm flex justify-between">
                <span className="text-slate-400">Matching laptops</span>
                <span className="font-bold">{compatibleLaptops.length}</span>
              </div>
            )}
            {build.laptop && (
              <button onClick={() => setViewMode('review')} className="mt-4 w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Review Build
              </button>
            )}
          </div>
        </aside>
      </main>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-slate-800 p-6 rounded-2xl w-full max-w-md">
            <h3 className="font-bold mb-4">Save Build</h3>
            <input type="text" value={saveName} onChange={e => setSaveName(e.target.value)} placeholder="Build name..." className="w-full bg-slate-700 border border-white/10 rounded-xl px-4 py-3 mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setShowSaveModal(false)} className="flex-1 py-2 border border-white/10 rounded-xl">Cancel</button>
              <button onClick={handleSaveBuild} className="flex-1 py-2 bg-blue-600 rounded-xl font-bold">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Load Modal */}
      {showLoadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-slate-800 p-6 rounded-2xl w-full max-w-md">
            <h3 className="font-bold mb-4">Load Build</h3>
            {savedBuilds.length === 0 ? <p className="text-slate-500 text-center py-4">No saved builds</p> : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {savedBuilds.map(b => (
                  <div key={b.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-xl">
                    <div>
                      <p className="font-medium">{b.name}</p>
                      <p className="text-xs text-slate-500">{new Date(b.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleLoadBuild(b)} className="px-3 py-1 bg-blue-600 rounded-lg text-sm">Load</button>
                      <button onClick={() => handleDeleteBuild(b.id)} className="p-1 text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setShowLoadModal(false)} className="mt-4 w-full py-2 border border-white/10 rounded-xl">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
