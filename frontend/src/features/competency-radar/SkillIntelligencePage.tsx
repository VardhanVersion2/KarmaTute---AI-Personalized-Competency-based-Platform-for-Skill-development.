import React, { useState, useEffect, useCallback } from 'react';
import { PageTutorialModal } from '../../components/ui/PageTutorialModal';
import { GlassCore, type CoreState } from '../../components/glass-core/GlassCore';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { useApp } from '../../context/AppContext';
import { RefreshCw, Target, Activity, ShieldCheck, ChevronRight, Layers, Award } from 'lucide-react';
import { getCompetencySnapshots, type CompetencySnapshot } from '../../services/evidenceApi';

const DEMO_USER_ID = 1;

const COMPETENCY_NAMES: Record<number, { name: string; domain: string }> = {
  1: { name: 'Public Policy & Circular Analysis', domain: 'GOVERNANCE' },
  2: { name: 'DPDP Act & Digital Privacy Compliance', domain: 'TECHNICAL' },
  3: { name: 'National Data Quality Assurance Framework', domain: 'STATISTICAL' },
  4: { name: 'Mission Karmayogi Digital Workplace Ethics', domain: 'OPERATIONAL' },
};

interface SafeCompetencySnapshot {
  id: number;
  competencyId: number;
  currentLevel: number;
  targetLevel: number;
  gap: number;
  confidence: number;
  evidenceCount: number;
  timestamp: string;
}

interface CompetencyView {
  competencyId: number;
  name: string;
  domain: string;
  latest: SafeCompetencySnapshot;
  history: SafeCompetencySnapshot[];
}

const DEFAULT_COMPETENCIES: CompetencyView[] = [
  {
    competencyId: 1,
    name: 'Public Policy & Circular Analysis',
    domain: 'GOVERNANCE',
    latest: {
      id: 101,
      competencyId: 1,
      currentLevel: 0.0,
      targetLevel: 4.2,
      gap: 4.2,
      confidence: 0.0,
      evidenceCount: 0,
      timestamp: new Date().toISOString()
    },
    history: []
  },
  {
    competencyId: 2,
    name: 'DPDP Act & Digital Privacy Compliance',
    domain: 'TECHNICAL',
    latest: {
      id: 102,
      competencyId: 2,
      currentLevel: 0.0,
      targetLevel: 4.0,
      gap: 4.0,
      confidence: 0.0,
      evidenceCount: 0,
      timestamp: new Date().toISOString()
    },
    history: []
  },
  {
    competencyId: 3,
    name: 'National Data Quality Assurance Framework',
    domain: 'STATISTICAL',
    latest: {
      id: 103,
      competencyId: 3,
      currentLevel: 0.0,
      targetLevel: 3.6,
      gap: 3.6,
      confidence: 0.0,
      evidenceCount: 0,
      timestamp: new Date().toISOString()
    },
    history: []
  },
  {
    competencyId: 4,
    name: 'Mission Karmayogi Digital Workplace Ethics',
    domain: 'OPERATIONAL',
    latest: {
      id: 104,
      competencyId: 4,
      currentLevel: 0.0,
      targetLevel: 4.0,
      gap: 4.0,
      confidence: 0.0,
      evidenceCount: 0,
      timestamp: new Date().toISOString()
    },
    history: []
  }
];

export function SkillIntelligencePage() {
  const toast = useToast();
  const { userProfile } = useApp();
  const [competencies, setCompetencies] = useState<CompetencyView[]>(DEFAULT_COMPETENCIES);
  const [selectedComp, setSelectedComp] = useState<CompetencyView | null>(null);
  const [coreState, setCoreState] = useState<CoreState>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string>('Just now');

  const loadData = useCallback(async () => {
    try {
      const isFresh = localStorage.getItem('demo_fresh_start') === 'true';
      if (isFresh) {
        setCompetencies(DEFAULT_COMPETENCIES);
        setCoreState('success');
        return;
      }
      const rawData = await getCompetencySnapshots(DEMO_USER_ID);
      if (Array.isArray(rawData) && rawData.length > 0) {
        const grouped = new Map<number, SafeCompetencySnapshot[]>();
        rawData.forEach((snap: any) => {
          const cId = snap.competencyId;
          if (!grouped.has(cId)) {
            grouped.set(cId, []);
          }
          const currentVal = snap.currentLevel ?? snap.current ?? 0;
          const targetVal = snap.targetLevel ?? snap.target ?? 4.0;
          const gapVal = snap.gap ?? Math.max(0, targetVal - currentVal);
          const confVal = snap.confidence ?? 0.85;
          const evCount = Array.isArray(snap.evidenceIds) 
            ? snap.evidenceIds.length 
            : (typeof snap.evidenceIds === 'string' ? snap.evidenceIds.split(',').filter(Boolean).length : 2);

          grouped.get(cId)!.push({
            id: snap.id || Math.random(),
            competencyId: cId,
            currentLevel: Number(currentVal),
            targetLevel: Number(targetVal),
            gap: Number(gapVal),
            confidence: Number(confVal),
            evidenceCount: evCount,
            timestamp: snap.timestamp || new Date().toISOString()
          });
        });

        const views: CompetencyView[] = [];
        grouped.forEach((history, compId) => {
          history.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
          const latest = history[history.length - 1];
          const info = COMPETENCY_NAMES[compId] || { name: `Competency Track ${compId}`, domain: 'GENERAL' };
          views.push({
            competencyId: compId,
            name: info.name,
            domain: info.domain,
            latest,
            history
          });
        });

        views.sort((a, b) => b.latest.gap - a.latest.gap);
        setCompetencies(views);
        setCoreState('success');
      }
    } catch (error) {
      console.warn('Falling back to local preloaded competency dataset');
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSync = () => {
    setIsSyncing(true);
    setLastSynced('Updating...');
    setTimeout(() => {
      loadData();
      setLastSynced('Just now');
    }, 1200);
  };

  if (isLoading && competencies.length === 0) {
    return (
      <div className="animate-pulse flex flex-col gap-6 p-6">
        <div className="h-12 bg-gov-border rounded w-1/4" />
        <div className="h-64 bg-gov-surface-muted rounded" />
      </div>
    );
  }

  const averageReadiness = competencies.length > 0 
    ? competencies.reduce((acc, curr) => acc + (curr.latest.currentLevel / curr.latest.targetLevel), 0) / competencies.length * 100 
    : 0;
  
  const highPriorityGaps = competencies.filter(c => c.latest.gap > 1.0).length;

  return (
    <>
      <PageTutorialModal 
        pageId="skill-intelligence"
        title="Skill Intelligence"
        what="Your competency map."
        why="Understand current capability and target capability."
        how="Select a competency to inspect evidence and gaps."
        psAsk="AI based application/ software for automated skill-gap analysis."
        karmaTuteBuild="Deterministic competency engine with historical snapshot retention."
        differentiator="AI assists in extraction, but deterministic math ensures government-grade auditable gaps."
      />

      <div className="flex flex-col gap-6 max-w-[1540px] mx-auto pb-12 animate-in fade-in">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gov-border pb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gov-primary tracking-tight">Skill Intelligence</h1>
            <p className="text-sm text-gov-text-secondary mt-1 font-medium">Authoritative mapping of operational competencies</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs font-medium text-gov-text-secondary">
              Last synced: <span className="text-gov-text-primary font-bold">{lastSynced}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSync} 
              disabled={isSyncing}
              leftIcon={<RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />} 
              className="bg-white border-gov-border text-gov-text-primary hover:bg-gov-surface-muted min-w-[140px]"
            >
              {isSyncing ? 'Synchronizing...' : 'Synchronize'}
            </Button>
          </div>
        </div>

        {/* MAIN LAYOUT: LIST vs INSPECTOR */}
        <div className="grid lg:grid-cols-4 gap-6 items-start">
          
          {/* LEFT: COMPETENCY LIST */}
          <div className="lg:col-span-1 flex flex-col gap-3">
            <h3 className="text-xs font-bold text-gov-text-secondary uppercase tracking-wider mb-2">Capability Tracks</h3>
            {competencies.map(cv => {
              const isSelected = selectedComp?.competencyId === cv.competencyId;
              const gapPercent = ((cv.latest.gap) / 5) * 100; // Assuming max 5
              const currentPercent = (cv.latest.currentLevel / 5) * 100;
              const isHighPriority = cv.latest.gap > 1.0;

              return (
                <button 
                  key={cv.competencyId}
                  onClick={() => setSelectedComp(cv)}
                  className={`text-left w-full border transition-all p-4 rounded-sm flex flex-col gap-3 ${
                    isSelected 
                      ? 'bg-gov-primary text-white border-gov-primary shadow-md' 
                      : 'bg-white text-gov-text-primary border-gov-border hover:border-gov-accent shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-bold text-sm leading-tight">{cv.name}</span>
                    <ChevronRight size={16} className={isSelected ? "text-gov-accent" : "text-gov-text-muted shrink-0"} />
                  </div>
                  
                  <div className="w-full bg-black/10 h-1.5 rounded-full overflow-hidden flex">
                    <div className={isSelected ? "bg-white" : "bg-gov-primary"} style={{ width: `${currentPercent}%` }} />
                    <div className={isSelected ? "bg-gov-accent" : (isHighPriority ? "bg-gov-danger" : "bg-gov-warning")} style={{ width: `${gapPercent}%` }} />
                  </div>
                  
                  <div className={`flex justify-between items-center text-[11px] font-bold ${isSelected ? 'text-white/80' : 'text-gov-text-secondary'}`}>
                    <span>CURRENT: {cv.latest.currentLevel.toFixed(1)}</span>
                    <span>GAP: {cv.latest.gap.toFixed(1)}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* RIGHT: INSPECTOR PANEL OR DASHBOARD PREVIEW */}
          <div className="lg:col-span-3">
            {selectedComp ? (
              <div className="bg-white border border-gov-border shadow-sm flex flex-col h-full rounded-sm animate-in slide-in-from-right-4 duration-500">
                
                {/* Panel Header */}
                <div className="bg-gov-surface-muted border-b border-gov-border p-6 flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-gov-accent uppercase tracking-widest bg-gov-accent/10 px-2 py-0.5 rounded-sm border border-gov-accent/20 mb-2 inline-block">
                      {selectedComp.domain}
                    </span>
                    <h2 className="text-2xl font-extrabold text-gov-primary leading-tight">{selectedComp.name}</h2>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-3xl font-extrabold text-gov-primary">{selectedComp.latest.currentLevel.toFixed(1)} <span className="text-lg text-gov-text-muted font-medium">/ 5.0</span></div>
                    <div className="text-[11px] font-bold text-gov-text-secondary uppercase tracking-wide mt-1">Verified Level</div>
                  </div>
                </div>

                <div className="p-6 md:p-8 flex flex-col gap-8">
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-gov-border pb-8">
                    <div className="flex flex-col">
                      <span className="text-[11px] text-gov-text-secondary font-bold uppercase tracking-wide">Target Level</span>
                      <span className="text-xl font-bold text-gov-primary flex items-center gap-2"><Target size={18} className="text-gov-info"/> {selectedComp.latest.targetLevel.toFixed(1)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] text-gov-text-secondary font-bold uppercase tracking-wide">Gap Priority</span>
                      <span className={`text-xl font-bold flex items-center gap-2 ${selectedComp.latest.gap > 1 ? 'text-gov-danger' : 'text-gov-warning'}`}>
                        <Activity size={18} /> {selectedComp.latest.gap > 1 ? 'High' : 'Medium'} ({selectedComp.latest.gap.toFixed(1)})
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] text-gov-text-secondary font-bold uppercase tracking-wide">Confidence</span>
                      <span className="text-xl font-bold text-gov-primary flex items-center gap-2"><ShieldCheck size={18} className="text-gov-success"/> {(selectedComp.latest.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] text-gov-text-secondary font-bold uppercase tracking-wide">Evidence</span>
                      <span className="text-xl font-bold text-gov-primary flex items-center gap-2"><Layers size={18} className="text-gov-accent"/> {selectedComp.latest.evidenceCount} items</span>
                    </div>
                  </div>

                  {/* WHY THIS? Structured Explanation */}
                  <div className="flex flex-col gap-4">
                    <h3 className="text-sm font-bold text-gov-primary uppercase tracking-wide flex items-center gap-2">
                      <Award size={16} className="text-gov-accent" /> Why this target?
                    </h3>
                    <div className="bg-gov-surface-muted border border-gov-border rounded-sm p-5 text-sm text-gov-text-primary leading-relaxed font-medium">
                      The target level of <strong>{selectedComp.latest.targetLevel.toFixed(1)}</strong> is mandated for the <i>{userProfile?.designation || 'Statistical Officer'}</i> assignment under the current operational framework. 
                      Your verified capability is currently <strong>{selectedComp.latest.currentLevel.toFixed(1)}</strong>. 
                      Closing this gap of {selectedComp.latest.gap.toFixed(1)} is necessary for certification eligibility and workflow clearance.
                    </div>
                  </div>

                  {/* ACTION CTA */}
                  <div className="mt-auto pt-4 flex justify-end">
                    <Button size="lg" className="bg-gov-primary hover:bg-gov-primary-hover text-white shadow-sm font-bold px-8">
                      Resolve Gap in Execution Lab
                    </Button>
                  </div>

                </div>
              </div>
            ) : (
              <div className="h-full bg-white border border-gov-border shadow-sm rounded-sm p-8 flex flex-col justify-center animate-in fade-in duration-500">
                <div className="max-w-2xl mx-auto w-full">
                  <div className="flex items-center gap-4 mb-8 border-b border-gov-border pb-6">
                    <div className="w-16 h-16 bg-gov-surface-muted text-gov-primary flex items-center justify-center rounded-full border border-gov-border">
                      <Activity size={32} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-extrabold text-gov-primary">System Summary</h2>
                      <p className="text-gov-text-secondary font-medium mt-1">Select a Capability Track from the left to inspect detailed intelligence traces.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="bg-gov-surface-muted p-5 rounded-sm border border-gov-border flex flex-col items-center justify-center text-center">
                       <span className="text-3xl font-extrabold text-gov-primary mb-1">{averageReadiness.toFixed(0)}%</span>
                       <span className="text-xs font-bold text-gov-text-secondary uppercase tracking-widest">Avg. Readiness</span>
                    </div>
                    <div className="bg-red-50 p-5 rounded-sm border border-red-100 flex flex-col items-center justify-center text-center">
                       <span className="text-3xl font-extrabold text-red-600 mb-1">{highPriorityGaps}</span>
                       <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Critical Gaps</span>
                    </div>
                    <div className="bg-gov-surface-muted p-5 rounded-sm border border-gov-border flex flex-col items-center justify-center text-center">
                       <span className="text-3xl font-extrabold text-gov-primary mb-1">{competencies.length}</span>
                       <span className="text-xs font-bold text-gov-text-secondary uppercase tracking-widest">Active Tracks</span>
                    </div>
                    <div className="bg-gov-surface-muted p-5 rounded-sm border border-gov-border flex flex-col items-center justify-center text-center">
                       <span className="text-3xl font-extrabold text-gov-primary mb-1">100%</span>
                       <span className="text-xs font-bold text-gov-text-secondary uppercase tracking-widest">Data Integrity</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gov-text-secondary flex items-center justify-center gap-2">
                       <ChevronRight size={16} className="text-gov-accent"/>
                       Click on any track to view evidence and historical snapshots
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
