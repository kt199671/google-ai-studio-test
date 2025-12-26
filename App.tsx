
import React, { useState, useEffect, useCallback } from 'react';
import { MoleculeCanvas } from './components/MoleculeCanvas';
import { MOLECULES } from './constants/moleculeData';
import { Molecule, CPK_COLORS } from './types';
import { askGeminiAboutMolecule } from './services/geminiService';
import { 
  Beaker, 
  Info, 
  RotateCw, 
  ChevronRight, 
  ChevronLeft, 
  MessageSquare,
  Send,
  Loader2,
  Atom as AtomIcon
} from 'lucide-react';

const App: React.FC = () => {
  const [selectedMolecule, setSelectedMolecule] = useState<Molecule>(MOLECULES[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [userQuestion, setUserQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);

  const fetchExplanation = useCallback(async (molecule: Molecule) => {
    setIsLoadingAi(true);
    try {
      const explanation = await askGeminiAboutMolecule(molecule.name, molecule.formula);
      setAiExplanation(explanation);
    } catch (err) {
      setAiExplanation("解説の取得に失敗しました。");
    } finally {
      setIsLoadingAi(false);
    }
  }, []);

  useEffect(() => {
    fetchExplanation(selectedMolecule);
    setChatHistory([]);
  }, [selectedMolecule, fetchExplanation]);

  const handleMoleculeSelect = (m: Molecule) => {
    setSelectedMolecule(m);
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim() || isLoadingAi) return;

    const question = userQuestion;
    setUserQuestion('');
    setChatHistory(prev => [...prev, { role: 'user', text: question }]);
    
    setIsLoadingAi(true);
    try {
      const answer = await askGeminiAboutMolecule(selectedMolecule.name, selectedMolecule.formula, question);
      setChatHistory(prev => [...prev, { role: 'ai', text: answer }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'ai', text: "エラーが発生しました。" }]);
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-900/20">
            <AtomIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            3D分子シミュレーター・ラボ
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all transform active:scale-95 ${
              autoRotate ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin-slow' : ''}`} />
            自動回転: {autoRotate ? 'ON' : 'OFF'}
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative">
        {/* Sidebar Toggle */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-40 bg-slate-800 p-2 rounded-r-xl border border-l-0 border-slate-700 text-slate-400 hover:text-white transition-all shadow-xl"
          aria-label="Toggle Sidebar"
        >
          {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>

        {/* Sidebar */}
        <aside className={`${
          isSidebarOpen ? 'w-80 opacity-100' : 'w-0 opacity-0 overflow-hidden'
        } bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 transition-all duration-300 flex flex-col z-20`}>
          <div className="p-4 border-b border-slate-800">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">分子ライブラリ</h2>
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar px-1">
              {MOLECULES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleMoleculeSelect(m)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                    selectedMolecule.id === m.id 
                      ? 'bg-blue-600/20 border-blue-500/50 text-blue-400 border ring-1 ring-blue-500/20' 
                      : 'hover:bg-slate-800/50 text-slate-400 border border-transparent'
                  }`}
                >
                  <div>
                    <div className="font-bold text-slate-100">{m.name}</div>
                    <div className="text-[10px] opacity-70 font-mono tracking-tighter">{m.formula}</div>
                  </div>
                  <Beaker size={16} className={selectedMolecule.id === m.id ? 'text-blue-400' : 'text-slate-600'} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3 text-blue-400">
                <Info size={16} className="shrink-0" />
                <h3 className="text-sm font-bold uppercase tracking-wider">概要</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed bg-slate-800/30 p-3 rounded-xl border border-slate-700/30">
                {selectedMolecule.description}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-400">
                <MessageSquare size={16} className="shrink-0" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Gemini AI 解説</h3>
              </div>
              
              <div className="p-4 bg-indigo-950/20 rounded-2xl border border-indigo-500/10 text-xs leading-relaxed min-h-[80px]">
                {isLoadingAi && !aiExplanation ? (
                  <div className="flex flex-col items-center justify-center py-4 gap-2">
                    <Loader2 className="animate-spin text-indigo-500 w-5 h-5" />
                    <span className="text-[10px] text-indigo-400/60 font-medium">分子構造を解析中...</span>
                  </div>
                ) : (
                  <p className="text-slate-300 whitespace-pre-wrap">{aiExplanation}</p>
                )}
              </div>

              {/* Chat History */}
              <div className="space-y-3">
                {chatHistory.map((chat, idx) => (
                  <div key={idx} className={`flex flex-col ${chat.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[90%] p-3 rounded-2xl text-[11px] ${
                      chat.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-900/20' 
                        : 'bg-slate-800 text-slate-300 border border-slate-700 rounded-tl-none shadow-md'
                    }`}>
                      {chat.text}
                    </div>
                  </div>
                ))}
              </div>

              {isLoadingAi && chatHistory.length > 0 && chatHistory[chatHistory.length-1].role === 'user' && (
                <div className="flex items-center gap-2 text-[10px] text-slate-500 italic px-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  回答を生成しています...
                </div>
              )}
            </div>
          </div>

          {/* Question Input */}
          <div className="p-4 bg-slate-900 border-t border-slate-800">
            <form onSubmit={handleAskQuestion} className="relative">
              <input
                type="text"
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                placeholder="この分子の特性は？"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-full py-2.5 pl-4 pr-12 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
              <button
                type="submit"
                disabled={isLoadingAi || !userQuestion.trim()}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </aside>

        {/* 3D Viewport */}
        <section className="flex-1 flex flex-col relative bg-[#0a0f1d]">
          <MoleculeCanvas molecule={selectedMolecule} autoRotate={autoRotate} />
          
          {/* Legend Overlay */}
          <div className="absolute bottom-6 left-6 p-4 bg-slate-900/70 backdrop-blur-md rounded-2xl border border-white/5 pointer-events-none shadow-2xl">
            <h4 className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-tighter">元素カラー凡例</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {Array.from(new Set(selectedMolecule.atoms.map(a => a.element))).map((el: string) => (
                <div key={el} className="flex items-center gap-2">
                  <div 
                    className="w-2.5 h-2.5 rounded-full border border-white/10" 
                    // Explicitly typing 'el' as string ensures it can be used as an index for CPK_COLORS
                    style={{ backgroundColor: CPK_COLORS[el] || CPK_COLORS['DEFAULT'] }} 
                  />
                  <span className="text-[10px] font-bold text-slate-300">{el}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interaction Guide */}
          <div className="absolute top-6 right-6 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 pointer-events-none text-[9px] text-slate-400 space-y-1.5 font-medium shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <span className="opacity-60 uppercase">左ドラッグ</span>
              <span className="text-slate-200">回転</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="opacity-60 uppercase">右ドラッグ</span>
              <span className="text-slate-200">移動</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="opacity-60 uppercase">スクロール</span>
              <span className="text-slate-200">ズーム</span>
            </div>
          </div>

          {/* Display Name Overlay */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10">
            <h2 className="text-5xl font-black text-white/95 drop-shadow-[0_0_25px_rgba(59,130,246,0.3)] tracking-tight">
              {selectedMolecule.name}
            </h2>
            <p className="text-xl font-mono text-blue-400/90 tracking-[0.3em] mt-2 font-bold">
              {selectedMolecule.formula}
            </p>
          </div>
        </section>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
        .animate-spin-slow { animation: spin 12s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default App;
