import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { X, CheckCircle, Info, Sparkles } from 'lucide-react';

interface PageTutorialModalProps {
  pageId: string;
  title: string;
  what: string;
  why: string;
  how: string;
  psAsk: string;
  karmaTuteBuild: string;
  differentiator: string;
}

export function PageTutorialModal({
  pageId, title, what, why, how, psAsk, karmaTuteBuild, differentiator
}: PageTutorialModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const hasSeen = localStorage.getItem(`tutorial_seen_${pageId}`);
    if (!hasSeen) {
      setIsOpen(true);
    }
  }, [pageId]);

  useEffect(() => {
    if (isOpen) {
      // 13 second timer
      let start = Date.now();
      const duration = 13000;
      
      const timer = setInterval(() => {
        const elapsed = Date.now() - start;
        const p = Math.min((elapsed / duration) * 100, 100);
        setProgress(p);
        if (p >= 100) {
          handleClose();
        }
      }, 50);

      // Typing animation for 'Why' & 'What' combined
      const fullText = `What it does: ${what}\nWhy it's useful: ${why}`;
      let i = 0;
      const typeTimer = setInterval(() => {
        setTypedText(fullText.slice(0, i));
        i++;
        if (i > fullText.length) clearInterval(typeTimer);
      }, 40);

      return () => {
        clearInterval(timer);
        clearInterval(typeTimer);
      };
    }
  }, [isOpen]);

  const handleClose = () => {
    localStorage.setItem(`tutorial_seen_${pageId}`, 'true');
    setIsOpen(false);
  };

  const handleReplay = () => {
    setTypedText('');
    setProgress(0);
    setIsOpen(true);
  };

  // Expose replay globally so Help button can trigger it if needed
  useEffect(() => {
    (window as any)[`replayTutorial_${pageId}`] = handleReplay;
    return () => { delete (window as any)[`replayTutorial_${pageId}`]; }
  }, [pageId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00193c]/60 backdrop-blur-sm p-4 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden max-h-[90vh]">
        
        {/* Header (Motion Graphic Placeholder) */}
        <div className="relative bg-gradient-to-r from-[#00193c] to-[#002b66] p-6 pb-12 overflow-hidden shrink-0">
          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>
          
          <button onClick={handleClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-20">
            <X size={20} />
          </button>
          <h2 className="text-2xl font-extrabold text-white relative z-10 flex items-center gap-2">
            <Sparkles className="text-[#fea619]" size={24} />
            {title}
          </h2>
          <p className="text-white/80 mt-1 text-sm relative z-10">Module Orientation</p>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto bg-[#f8f9fb] -mt-6 rounded-t-3xl relative z-10 flex-1">
          
          {/* Typing Animation Section */}
          <div className="bg-[#00193c] text-white p-5 rounded-xl shadow-inner mb-6 font-mono text-sm leading-relaxed min-h-[100px] border border-[#002b66]">
             <div className="flex items-center gap-2 mb-2 text-[#fea619]">
               <Info size={16} /> <span className="font-bold tracking-widest text-[10px] uppercase">Auto-Analysis</span>
             </div>
             <div className="whitespace-pre-wrap">{typedText}<span className="animate-pulse">_</span></div>
          </div>

          {/* PS-26101 Comparer Box */}
          <div className="bg-white border border-[#c4c6d0]/50 rounded-xl overflow-hidden">
            <div className="bg-[#e8eaf0] px-4 py-2 flex items-center gap-2 border-b border-[#c4c6d0]/50">
               <span className="text-xs font-bold text-[#00193c]">How KarmaTute Solves This</span>
            </div>
            <div className="p-4 grid gap-3 text-sm">
              <div className="flex gap-3">
                <div className="w-1.5 rounded-full bg-[#fea619]" />
                <div>
                  <span className="block text-[10px] font-bold text-[#747780] uppercase">How It Stands Out</span>
                  <span className="text-[#855300] font-bold">{differentiator}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer & Progress Bar */}
        <div className="bg-white flex flex-col shrink-0">
          <div className="p-4 flex justify-between items-center">
            <span className="text-xs font-bold text-[#747780] animate-pulse">Auto-closing in {Math.ceil(13 - (progress/100)*13)}s...</span>
            <Button onClick={handleClose} variant="primary" leftIcon={<CheckCircle size={16} />}>
              Understood, let's go
            </Button>
          </div>
          {/* Filling Progress Bar */}
          <div className="w-full h-1.5 bg-[#e8eaf0]">
             <div 
               className="h-full bg-gradient-to-r from-[#fea619] to-[#ff6b00]" 
               style={{ width: `${progress}%` }} 
             />
          </div>
        </div>
      </div>
    </div>
  );
}
