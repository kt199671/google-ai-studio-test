
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
    const explanation = await askGeminiAboutMolecule(molecule.name, molecule.formula);
    setAiExplanation(explanation);
    setIsLoadingAi(false);
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
    if (!userQuestion.trim()) return;

    const question = userQuestion;
    setUserQuestion('');
    setChatHistory(prev => [...prev, { role: 'user', text: question }]);
    
    setIsLoadingAi(true);
    const answer = await askGeminiAboutMolecule(selectedMolecule.name, selectedMolecule.formula, question);
    setChatHistory(prev => [...prev, { role: 'ai', text: answer }]);
    setIsLoadingAi(false);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <AtomIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            3D分子シミュレーター・ラボ
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              autoRotate ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
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
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-slate-800 p-1 rounded-r-lg border border-l-0 border-slate-700 text-slate-400 hover:text-white transition-all"
        >
          {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>

        {/* Sidebar */}
        <aside className={`${
          isSidebarOpen ? 'w-80' : 'w-0 overflow-hidden'
        } bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col z-10`}>
          <div className="p-4 border-b border-slate-800">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">分子ライブラリ</h2>
            <div className="grid grid-cols-1 gap-2">
              {MOLECULES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleMoleculeSelect(m)}
                  className={`flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                    selectedMolecule.id === m.id 
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400 border' 
                      : 'hover:bg-slate-800 text-slate-400 border border-transparent'
                  }`}
                >
                  <div>
                    <div className="font-bold text-slate-100">{m.name}</div>
                    <div className="text-xs opacity-70 font-mono">{m.formula}</div>
                  </div>
                  <Beaker size={18} className={selectedMolecule.id === m.id ? 'text-blue-400' : 'text-slate-600'} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2 text-blue-400">
                <Info size={18} />
                <h3 className="font-semibold">基本情報</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed italic">
                {selectedMolecule.description}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-400">
                <MessageSquare size={18} />
                <h3 className="font-semibold">Gemini AI 解説</h3>
              </div>
              
              <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 text-sm leading-relaxed relative min-h-[100px]">
                {isLoadingAi && !aiExplanation ? (
                  <div className="flex flex-col items-center justify-center h-full gap-2">
                    <Loader2 className="animate-spin text-blue-500" />
                    <span className="text-xs text-slate-500">解析中...</span>
                  </div>
                ) : (
                  <p className="text-slate-300">{aiExplanation}</p>
                )}
              </div>

              {/* Chat History */}
              {chatHistory.map((chat, idx) => (
                <div key={idx} className={`flex flex-col ${chat.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[90%] p-3 rounded-2xl text-xs ${
                    chat.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-slate-800 text-slate-300 border border-slate-700 rounded-tl-none'
                  }`}>
                    {chat.text}
                  </div>
                </div>
              ))}

              {isLoadingAi && chatHistory.length > 0 && chatHistory[chatHistory.length-1].role === 'user' && (
                <div className="flex items-center gap-2 text-xs text-slate-500 italic">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Geminiが回答を作成しています...
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
                placeholder="この分子について質問..."
                className="w-full bg-slate-800 border border-slate-700 rounded-full py-2.5 pl-4 pr-12 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="submit"
                disabled={isLoadingAi || !userQuestion.trim()}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 rounded-full disabled:opacity-50 transition-opacity"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </aside>

        {/* 3D Viewport */}
        <section className="flex-1 flex flex-col relative">
          <MoleculeCanvas molecule={selectedMolecule} autoRotate={autoRotate} />
          
          {/* Legend Overlay */}
          <div className="absolute bottom-6 left-6 p-4 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 pointer-events-none">
            <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase">元素カラー凡例</h4>
            <div className="flex gap-4 flex-wrap max-w-xs">
              {Array.from(new Set(selectedMolecule.atoms.map(a => a.element))).map(el => (
                <div key={el} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: CPK_COLORS[el] || '#dddddd' }} 
                  />
                  <span className="text-[10px] font-medium text-slate-300">{el}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interaction Guide */}
          <div className="absolute top-6 right-6 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 pointer-events-none text-[10px] text-slate-400 space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 bg-white/10 rounded">左ドラッグ</span>
              <span>回転</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 bg-white/10 rounded">右ドラッグ</span>
              <span>移動</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 bg-white/10 rounded">スクロール</span>
              <span>ズーム</span>
            </div>
          </div>

          {/* Display Name Overlay */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center pointer-events-none">
            <h2 className="text-4xl font-black text-white/90 drop-shadow-2xl">
              {selectedMolecule.name}
            </h2>
            <p className="text-xl font-mono text-blue-400/80 tracking-widest mt-1">
              {selectedMolecule.formula}
            </p>
          </div>
        </section>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default App;
