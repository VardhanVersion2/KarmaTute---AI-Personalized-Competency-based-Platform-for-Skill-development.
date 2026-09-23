import React, { useState, useEffect } from 'react';
import { useApp, PageId } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { SkipLink } from '../components/ui/A11y';
import { Button } from '../components/ui/Button';
import {
  LayoutDashboard,
  Compass,
  Mic,
  ShieldCheck,
  ShieldAlert,
  User,
  Volume2,
  VolumeX,
  Database,
  Building2,
  Loader2,
  Lock,
  LogOut
} from 'lucide-react';
import { CommandCenterPage } from '../features/command-center/CommandCenterPage';
import { SkillIntelligencePage } from '../features/competency-radar/SkillIntelligencePage';
import { ExecutionLabPage } from '../features/karma-vaani/ExecutionLabPage';
import { GrowthProofPage } from '../features/growth-proof/GrowthProofPage';
import { AdminPage } from '../features/admin/AdminPage';
import { DataChamberPage } from '../features/data-chamber/DataChamberPage';
import { LoginPage } from '../features/auth/LoginPage';
import { OnboardingFlow } from '../features/onboarding/OnboardingFlow';
import { KarmaVaaniAssistant } from '../components/assistant/KarmaVaaniAssistant';

// Global Splash Screen Component with Animated Progress Bar & Low-Net Safety
function GlobalLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(10);
  const [statusText, setStatusText] = useState('Initializing KarmaTute Core...');

  useEffect(() => {
    const steps = [
      { p: 25, text: 'Loading Competency Architecture...', delay: 350 },
      { p: 55, text: 'Synchronizing KarmaDNA Security Token...', delay: 450 },
      { p: 80, text: 'Connecting Local Voice Engine...', delay: 400 },
      { p: 100, text: 'System Operational - Ready!', delay: 350 },
    ];

    let currentIdx = 0;
    let timer: NodeJS.Timeout;

    const runStep = () => {
      if (currentIdx < steps.length) {
        const s = steps[currentIdx];
        timer = setTimeout(() => {
          setProgress(s.p);
          setStatusText(s.text);
          currentIdx++;
          runStep();
        }, s.delay);
      } else {
        timer = setTimeout(() => {
          onComplete();
        }, 300);
      }
    };

    runStep();

    // Absolute fallback safety timeout so it NEVER stays stuck on low network
    const safetyTimeout = setTimeout(() => {
      setProgress(100);
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(safetyTimeout);
    };
  }, []); // Run only once on mount to prevent infinite loop from unmemoized prop

  return (
    <div className="fixed inset-0 z-50 bg-gov-primary flex flex-col items-center justify-center text-white font-sans select-none px-6">
      <div className="flex flex-col items-center max-w-sm w-full animate-in fade-in zoom-in duration-500">
        <img
          alt="SIH Logo"
          className="h-20 object-contain drop-shadow-md mb-6"
          src="/sih-logo.png"
        />
        
        {/* Real Progress Bar */}
        <div className="w-full bg-white/15 h-1.5 rounded-full overflow-hidden mb-4 relative shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-gov-accent via-amber-400 to-gov-accent transition-all duration-300 ease-out rounded-full relative shadow"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>

        {/* Dynamic Percentage & Status */}
        <div className="flex items-center justify-between w-full text-[10px] font-bold font-sans uppercase tracking-widest text-white/80 mb-3">
          <span className="truncate pr-2">{statusText}</span>
          <span className="text-gov-accent shrink-0">{progress}%</span>
        </div>

        <div className="flex items-center gap-2.5 text-sm font-bold text-white/90 tracking-widest uppercase">
          <Loader2 size={16} className="animate-spin text-gov-accent" />
          KarmaTute Prototype
        </div>
      </div>
    </div>
  );
}

export function AppLayout() {
  const { currentPage, setCurrentPage, userRole, setUserRole, isAdmin, soundEnabled, setSoundEnabled, isAuthenticated, setIsAuthenticated, hasCompletedOnboarding } = useApp();
  const toast = useToast();
  const [appReady, setAppReady] = useState(false);

  const navItems: { id: PageId; label: string; icon: React.ReactNode }[] = [
    { id: 'command-center', label: 'Command Center', icon: <LayoutDashboard size={18} /> },
    { id: 'skill-intelligence', label: 'Skill Intelligence', icon: <Compass size={18} /> },
    { id: 'execution-lab', label: 'Execution Lab', icon: <Mic size={18} /> },
    { id: 'growth-proof', label: 'Proof of Work', icon: <ShieldCheck size={18} /> },
    { id: 'data-chamber', label: 'Data Chamber', icon: <Database size={18} /> },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'command-center':
        return <CommandCenterPage />;
      case 'skill-intelligence':
        return <SkillIntelligencePage />;
      case 'execution-lab':
        return <ExecutionLabPage />;
      case 'growth-proof':
        return <GrowthProofPage />;
      case 'admin':
        return <AdminPage />;
      case 'data-chamber':
        return <DataChamberPage />;
      default:
        return <CommandCenterPage />;
    }
  };

  return (
    <>
      {!appReady && <GlobalLoader onComplete={() => setAppReady(true)} />}
      
      <div className={`min-h-screen bg-gov-bg text-gov-text-primary font-sans antialiased selection:bg-gov-accent/30 flex flex-col transition-opacity duration-500 ${appReady ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
        {!isAuthenticated ? (
          <LoginPage />
        ) : !hasCompletedOnboarding ? (
          <OnboardingFlow />
        ) : (
          <>
        <SkipLink targetId="main-content" />
        <KarmaVaaniAssistant />

        {/* MAIN HEADER - Strictly Linear, Zero Scroll Issues */}
        <header className="bg-gov-primary text-white shadow-md z-20 sticky top-0">
          <div className="mx-auto flex max-w-[1540px] items-center justify-between gap-3 px-4 py-2.5 md:px-8">
            
            {/* Logo & Title */}
            <div
              className="flex items-center gap-2.5 md:gap-3 cursor-pointer select-none shrink-0"
              onClick={() => setCurrentPage('command-center')}
            >
              <img
                alt="KarmaTute Emblem"
                className="h-8 w-8 md:h-9 md:w-9 object-contain drop-shadow-sm shrink-0"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzug9S9MWcpaI0d2ukIlVUBov-EuSS94MCF65ylv8dLdUkxZG4IqQslad2svG162ULdUy04OUzA-dB4RxNJpKaQhF1Hbvj3LTwsfaXnyqse0sNo8qxZ8G5csQeFimXloL-fwXRJEHo_gJ7egBVOfybdd7E5dKntGN7_HG1b1qvvKH-r4x2ZjWBDOi-w0ohg-RUZtmNLaL9YCTXlw5wEY_56Yt0CHE-Y3s1o-UWOctKdiNgYb5B7c2wzj9PSEl7c9kU5g"
              />
              <div className="flex flex-col text-left">
                <h1 className="text-base md:text-lg font-bold tracking-tight text-white leading-tight">
                  KarmaTute
                </h1>
                <span className="text-[9px] md:text-[10px] font-bold text-gov-accent flex items-center gap-1 leading-tight"><Lock size={9} /> PROTOTYPE</span>
              </div>
            </div>

            {/* Navigation Tabs - Seamless Inline Flex, Zero Scroll Glitch */}
            <nav className="flex items-center justify-center gap-1 md:gap-1.5 flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-1">
              {navItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={[
                      'flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs md:text-sm font-semibold transition-colors cursor-pointer shrink-0 whitespace-nowrap',
                      isActive
                        ? 'bg-gov-accent text-white shadow-sm'
                        : 'text-white/80 hover:bg-white/10 hover:text-white',
                    ].join(' ')}
                  >
                    <span>{item.icon}</span>
                    <span className="inline">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* User Controls */}
            <div className="flex items-center shrink-0 gap-1.5 md:gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 rounded text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer shrink-0"
                aria-label={soundEnabled ? 'Disable audio cues' : 'Enable audio cues'}
                title={soundEnabled ? 'Audio cues enabled' : 'Audio cues muted'}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              <button
                onClick={() => {
                  if (isAdmin) {
                    setUserRole('ROLE_LEARNER');
                    if (currentPage === 'admin') setCurrentPage('command-center');
                  } else {
                    setUserRole('ROLE_ADMIN');
                    setCurrentPage('admin');
                  }
                }}
                className="flex items-center gap-1.5 border border-white/20 bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded text-xs font-medium transition-colors text-white shrink-0 whitespace-nowrap"
              >
                {isAdmin ? <ShieldAlert size={14} className="text-gov-accent" /> : <User size={14} />}
                <span className="hidden sm:inline">{isAdmin ? 'Admin Mode' : 'Learner View'}</span>
                <span className="inline sm:hidden">{isAdmin ? 'Admin' : 'Learner'}</span>
              </button>

              <button
                onClick={() => {
                  toast.success('Logging out securely...', { icon: <LogOut size={16} /> });
                  setTimeout(() => {
                    setIsAuthenticated(false);
                  }, 1000);
                }}
                className="flex items-center justify-center p-1.5 border border-transparent hover:border-gov-danger/50 bg-transparent hover:bg-gov-danger/10 text-white/80 hover:text-gov-danger rounded transition-colors cursor-pointer shrink-0"
                title="Logout / Reset Session"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* MAIN BODY AREA */}
        <main id="main-content" className="flex-1 w-full max-w-[1540px] mx-auto px-4 py-6 md:px-8 pb-32 md:pb-40 outline-none relative">
          {renderPage()}
        </main>
        </>
        )}
      </div>
    </>
  );
}
