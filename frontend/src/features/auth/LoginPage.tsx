import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, ArrowRight, Loader2, Database, BrainCircuit, Activity, UploadCloud, Fingerprint } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export function LoginPage() {
  const { setIsAuthenticated, setCurrentPage } = useApp();
  const toast = useToast();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // KarmaDNA Gati-Login state
  const [loginMode, setLoginMode] = useState<'standard' | 'gati'>('standard');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setTimeout(() => {
      localStorage.setItem('demo_fresh_start', 'true');
      toast.success('Authentication successful');
      setIsAuthenticated(true);
      setCurrentPage('command-center');
    }, 1200);
  };

  const handleKarmaFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.name.endsWith('.karma')) {
      toast.error('Invalid file format. Please upload a .karma security token.');
      return;
    }

    setIsUploading(true);
    // Simulate KarmaDNA processing
    setTimeout(() => {
      setIsUploading(false);
      toast.success('KarmaDNA Verified. Secure Gati-Login active.');
      setIsAuthenticated(true);
      setCurrentPage('command-center');
    }, 1800);
  };

  return (
    <div className="min-h-screen w-full bg-gov-surface flex overflow-hidden font-sans">
      
      {/* LEFT: BACKGROUND / VISUAL ENVIRONMENT */}
      <div className="hidden lg:flex flex-1 relative bg-gov-primary flex-col justify-between overflow-hidden">
        {/* Subtle geometric data pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute left-0 right-0 top-0 -mt-20 h-96 bg-gov-accent/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 right-0 -mr-20 h-96 w-96 bg-amber-500/10 blur-[100px] rounded-full"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 p-12 flex flex-col h-full justify-between max-w-2xl text-white">
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mb-8 backdrop-blur-md">
              <ShieldCheck size={16} className="text-gov-accent" />
              <span className="text-xs font-bold tracking-widest uppercase text-white/90">SMART INDIA HACKATHON 2026 • WORKING PROTOTYPE</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-6 flex flex-col items-start gap-4">
              <img src="/sih-logo.png" alt="SIH Logo" className="h-20 object-contain drop-shadow-md mb-2" />
              <span>AI Skill Intelligence for<br /><span className="text-gov-accent">India's Official Statistical System</span></span>
            </h1>
            
            <p className="text-lg text-white/70 max-w-lg leading-relaxed font-medium">
              Turns workforce competency gaps into evidence-backed learning actions.
            </p>
          </div>

          <div className="space-y-8 mt-12">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <Database size={20} className="text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">01 — KNOW THE GAP</h3>
                <p className="text-sm text-white/60 leading-relaxed">Role-aware competency profiling identifies what is missing and why it matters.</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <BrainCircuit size={20} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">02 — PROVE THE CAPABILITY</h3>
                <p className="text-sm text-white/60 leading-relaxed">MCQ → Practical + OCR → Scenario. Tests application, not recall alone.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <Activity size={20} className="text-gov-accent" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">03 — ADAPT THE NEXT ACTION</h3>
                <p className="text-sm text-white/60 leading-relaxed">Assessment evidence updates competency and changes the next learning recommendation.</p>
              </div>
            </div>
          </div>
          
          <div className="pt-12 mt-12 border-t border-white/10">
            <h4 className="text-sm font-bold text-white mb-2 tracking-wide uppercase">INDIEFORGE</h4>
            <p className="text-xs text-white/50 mb-3 uppercase tracking-wider font-semibold">Team behind KarmaTute · SIH 2026</p>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[11px] text-white/60 font-mono">
              <div><span className="text-white/90 font-semibold">Vardhan Kushwaha</span> — Team Lead · Architecture</div>
              <div><span className="text-white/90 font-semibold">Unnati Pal</span> — Research & Domain Analysis</div>
              <div><span className="text-white/90 font-semibold">Yashi Srivastava</span> — Idea Framing & Debugging</div>
              <div><span className="text-white/90 font-semibold">Mohammad Owais</span> — AI Integration & Debugging</div>
              <div><span className="text-white/90 font-semibold">Mohit Kumar</span> — Presentation & Debugging</div>
              <div><span className="text-white/90 font-semibold">Vaibhav Jauhari</span> — Presentation & Debugging</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: AUTHENTICATION PANEL */}
      <div className="flex-1 lg:flex-none lg:w-[480px] xl:w-[540px] bg-white flex flex-col justify-center relative shadow-2xl">
        <div className="p-8 sm:p-12 md:p-16 w-full max-w-md mx-auto">
          
          {/* Mobile Identity */}
          <div className="lg:hidden mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gov-primary/5 border border-gov-border mb-6">
              <ShieldCheck size={14} className="text-gov-primary" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-gov-text-secondary">SMART INDIA HACKATHON 2026 • WORKING PROTOTYPE</span>
            </div>
            <img src="/sih-logo.png" alt="SIH Logo" className="h-14 object-contain mb-4" />
            <h1 className="text-3xl font-extrabold tracking-tight text-gov-primary mb-2">Welcome to KarmaTute</h1>
            <p className="text-sm text-gov-text-secondary font-medium">Access your competency intelligence workspace.</p>
          </div>

          <div className="hidden lg:block mb-10">
            <h2 className="text-3xl font-extrabold text-gov-primary tracking-tight">Welcome to KarmaTute</h2>
            <p className="text-sm text-gov-text-secondary font-medium mt-1">Access your competency intelligence workspace.</p>
          </div>

          <div className="flex bg-gov-surface p-1 rounded-md mb-8 border border-gov-border">
            <button 
              onClick={() => setLoginMode('standard')}
              className={`flex-1 text-xs font-bold py-2 px-4 rounded transition-colors ${loginMode === 'standard' ? 'bg-white text-gov-primary shadow-sm border border-black/5' : 'text-gov-text-secondary hover:text-gov-primary'}`}
            >
              Standard Login
            </button>
            <button 
              onClick={() => setLoginMode('gati')}
              className={`flex-1 text-xs font-bold py-2 px-4 rounded transition-colors flex items-center justify-center gap-1.5 ${loginMode === 'gati' ? 'bg-gov-primary text-white shadow-sm' : 'text-gov-text-secondary hover:text-gov-primary'}`}
            >
              <Fingerprint size={14} />
              Gati-Login
            </button>
          </div>

          {loginMode === 'standard' ? (
            <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs font-bold text-gov-text-primary uppercase tracking-wider">
                  Government Email ID / Username
                </label>
                <input
                  id="email"
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded bg-gov-surface border border-gov-border focus:border-gov-primary focus:ring-1 focus:ring-gov-primary outline-none transition-colors text-sm text-gov-text-primary placeholder:text-gov-text-muted"
                  placeholder="officer@nic.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-xs font-bold text-gov-text-primary uppercase tracking-wider">
                    Password
                  </label>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 rounded bg-gov-surface border border-gov-border focus:border-gov-primary focus:ring-1 focus:ring-gov-primary outline-none transition-colors text-sm text-gov-text-primary"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full flex items-center justify-center gap-2 bg-gov-primary hover:bg-gov-primary-hover text-white py-3.5 px-4 rounded font-bold transition-all shadow-md active:scale-[0.98] disabled:opacity-80 disabled:cursor-not-allowed mt-2"
              >
                {isAuthenticating ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Authenticating Session...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-2 border-dashed border-gov-border hover:border-gov-primary/50 bg-gov-surface/50 rounded-lg p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".karma" 
                  onChange={handleKarmaFileUpload} 
                />
                
                {isUploading ? (
                  <div className="flex flex-col items-center gap-4 text-gov-primary">
                    <Loader2 size={32} className="animate-spin" />
                    <div className="space-y-1">
                      <p className="text-sm font-bold">Verifying KarmaDNA...</p>
                      <p className="text-xs text-gov-text-secondary">Decrypting secure token</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 text-gov-text-secondary group-hover:text-gov-primary transition-colors">
                    <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center border border-gov-border group-hover:border-gov-primary/30">
                      <UploadCloud size={28} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-gov-text-primary">Upload .karma Identity File</p>
                      <p className="text-xs text-gov-text-muted">Direct authentication via KarmaDNA token</p>
                    </div>
                    <div className="mt-2 text-[10px] font-bold bg-gov-primary/10 text-gov-primary px-2 py-1 rounded">
                      GATI-LOGIN ENABLED
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gov-border flex flex-col items-center gap-2 text-center">
            <p className="text-xs font-bold text-gov-text-primary">Prototype access for SIH 2026 demonstration</p>
            <p className="text-[11px] text-gov-text-muted font-medium">Secure access • Role-based workspace • Evidence-backed intelligence</p>
          </div>
        </div>
      </div>
      
    </div>
  );
}
