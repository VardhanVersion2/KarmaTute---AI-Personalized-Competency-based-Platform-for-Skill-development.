import React, { useEffect, useState, useCallback } from 'react';
import { PageTutorialModal } from '../../components/ui/PageTutorialModal';
import { GlassCore } from '../../components/glass-core/GlassCore';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import {
  fetchCommandCenterData,
  CommandCenterData,
} from '../../services/commandCenterApi';
import {
  Target,
  ArrowRight,
  Clock,
  Briefcase,
  User,
  X,
  Activity,
  CalendarDays,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

const DEFAULT_COMMAND_CENTER_DATA: CommandCenterData = {
  state: 'success',
  userContext: {
    id: 1,
    fullName: 'Demo Officer',
    role: 'ROLE_LEARNER',
    department: 'General Administration',
    designation: 'Newly Onboarded Officer',
    targetRole: 'Probationary Officer'
  },
  nextBestAction: {
    id: 101,
    title: 'Complete Baseline Skills Diagnostic',
    description: 'Take the initial knowledge verification assessment to establish your baseline competency profile.',
    whyThis: 'As a newly onboarded officer, establishing your baseline is required to unlock personalized learning paths and skill intelligence.',
    actionType: 'ASSESSMENT',
    estimatedMinutes: 30,
    actionRoute: 'execution-lab'
  },
  progress: {
    overallProgressPercent: 0,
    completedMilestones: 0,
    totalMilestones: 5,
    activeStreakDays: 0
  },
  competencyPulse: {
    overallMastery: 0,
    verifiedCount: 0,
    totalTracked: 4,
    resolutionProgress: 0,
    pulseStatus: 'NEEDS_BASELINE'
  },
  priorityGap: {
    competencyId: 1,
    competencyName: 'Core Administrative Skills',
    domain: 'GOVERNANCE',
    currentLevel: 0,
    targetLevel: 4,
    gapPercentage: 100,
    priority: 'HIGH'
  }
};

export function CommandCenterPage() {
  const { setCurrentPage, userProfile } = useApp();
  const toast = useToast();

  const [data, setData] = useState<CommandCenterData>(DEFAULT_COMMAND_CENTER_DATA);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showTimeWidget, setShowTimeWidget] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const isFresh = localStorage.getItem('demo_fresh_start') === 'true';
      if (isFresh) {
        setData(DEFAULT_COMMAND_CENTER_DATA);
        setIsLoading(false);
        return;
      }
      
      const response = await fetchCommandCenterData();
      if (response && response.state !== 'error') {
        setData(response);
      }
    } catch (error) {
      // Fallback to default mock data silently so user never sees a blank screen
      console.warn('Using local pre-cached command center dataset:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 max-w-[1200px] mx-auto animate-pulse p-4">
        {/* Profile Card Skeleton */}
        <div className="h-28 bg-white border border-gov-border rounded-sm p-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gov-border/40" />
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-5 bg-gov-border/50 rounded w-1/3" />
            <div className="h-3 bg-gov-border/30 rounded w-1/4" />
          </div>
        </div>
        {/* KPI Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-24 bg-white border border-gov-border rounded-sm p-4" />
          <div className="h-24 bg-white border border-gov-border rounded-sm p-4" />
          <div className="h-24 bg-white border border-gov-border rounded-sm p-4" />
        </div>
        {/* Main Sections Skeleton */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 h-64 bg-white border border-gov-border rounded-sm" />
          <div className="h-64 bg-white border border-gov-border rounded-sm" />
        </div>
      </div>
    );
  }

  const nextAction = data.nextBestAction || DEFAULT_COMMAND_CENTER_DATA.nextBestAction;

  // Fake 30 days activity for Heatmap
  const activityDays = Array.from({length: 35}, () => 0); // Starting fresh demo
  const getHeatmapColor = (level: number) => {
    switch(level) {
      case 0: return 'bg-gov-bg border border-gov-border/50';
      case 1: return 'bg-[#c6e48b] border border-[#7bc96f]/30';
      case 2: return 'bg-[#7bc96f] border border-[#239a3b]/30';
      case 3: return 'bg-[#196127] border border-[#196127]/30';
      default: return 'bg-gov-bg';
    }
  };

  return (
    <>
      <PageTutorialModal 
        pageId="command-center"
        title="Command Center"
        what="Your personalized starting point."
        why="Shows what deserves attention now."
        how="Follow the Next Best Action."
        psAsk="recommendation system that maps learning to competencies."
        karmaTuteBuild="Composed dashboard showing top priority gap and Next Best Action."
        differentiator="Connects real-time competency gaps directly to actionable learning without dashboard wallpaper."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left max-w-[1540px] mx-auto pb-24 animate-in fade-in">
        
        {/* LEFT COLUMN (30%) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* USER PROFILE COMPACT WITH TIME CHIP */}
          <div className="bg-white border-t-[4px] border-t-gov-primary border border-gov-border shadow-sm p-6 flex flex-col gap-4 rounded">
             <div className="flex items-center gap-4">
                <div className="w-14 h-14 min-w-[56px] min-h-[56px] aspect-square shrink-0 bg-gov-primary text-white rounded-full flex items-center justify-center text-xl font-extrabold shadow-inner border-2 border-white ring-2 ring-gov-border">
                   DU
                </div>
                <div className="flex flex-col min-w-0">
                   <h1 className="text-xl font-extrabold text-gov-primary tracking-tight leading-tight truncate">{data.userContext?.fullName || 'Demo Officer'}</h1>
                   <span className="text-xs text-gov-text-secondary font-medium mt-1 truncate">
                     {userProfile?.designation || data.userContext?.designation} · {userProfile?.department || data.userContext?.department}
                   </span>
                </div>
             </div>
             
             <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="font-mono text-[10px] text-gov-accent border-gov-accent/30 bg-gov-accent/5 px-2 py-0.5 shrink-0">
                  KRMA-7742-99A1
                </Badge>
                <div className="flex items-center gap-1.5 bg-gov-surface-muted border border-gov-border px-2 py-0.5 rounded text-[10px] font-bold text-gov-text-secondary shrink-0">
                  <Clock size={12} className="text-gov-accent" /> 0h 0m Logged
                </div>
             </div>
          </div>

          {/* HIGH-LEVEL KPIs STACKED */}
          <div className="flex flex-col gap-4">
            <div className="bg-white border border-gov-border shadow-sm rounded p-5 flex items-center gap-4 hover:border-gov-primary/30 transition-colors">
               <div className="w-12 h-12 min-w-[48px] min-h-[48px] aspect-square rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                 <Activity size={24} />
               </div>
               <div>
                 <div className="text-[10px] font-bold text-gov-text-secondary uppercase tracking-wider">Operational Readiness</div>
                 <div className="text-2xl font-bold text-gov-primary">0%</div>
               </div>
            </div>
            
            <div className="bg-white border border-gov-border shadow-sm rounded p-5 flex items-center gap-4 hover:border-gov-primary/30 transition-colors cursor-pointer" onClick={() => setCurrentPage('data-chamber')}>
               <div className="w-12 h-12 min-w-[48px] min-h-[48px] aspect-square rounded-full bg-green-50 border border-green-100 flex items-center justify-center text-green-600 shrink-0">
                 <ShieldCheck size={24} />
               </div>
               <div>
                 <div className="text-[10px] font-bold text-gov-text-secondary uppercase tracking-wider">Verified Tokens</div>
                 <div className="text-2xl font-bold text-gov-primary flex items-center gap-2">0 <span className="text-[10px] font-medium text-gov-text-muted">(Data Chamber)</span></div>
               </div>
            </div>
            
            <div className="bg-white border border-gov-border shadow-sm rounded p-5 flex items-center gap-4 hover:border-gov-primary/30 transition-colors">
               <div className="w-12 h-12 min-w-[48px] min-h-[48px] aspect-square rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
                 <Target size={24} />
               </div>
               <div>
                 <div className="text-[10px] font-bold text-gov-text-secondary uppercase tracking-wider">Active Skill Gaps</div>
                 <div className="text-2xl font-bold text-gov-primary">0</div>
               </div>
            </div>
          </div>

          {/* GLASS CORE PIPELINE */}
          <div className="bg-white border border-gov-border rounded p-6 shadow-sm flex flex-col justify-center mt-1">
            <h3 className="text-xs font-bold text-gov-primary uppercase tracking-wider mb-4 border-b border-gov-border pb-2">Intelligence Pipeline</h3>
            <GlassCore 
              state="idle" 
              title="System Operational" 
              subtitle="Closed-loop competency sync active."
            />
          </div>

        </div>

        {/* RIGHT COLUMN (70%) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* HERO BANNER: NEXT BEST ACTION */}
          <div className="bg-white border border-gov-border rounded shadow-sm overflow-hidden flex flex-col">
            <div className="bg-gov-surface border-b border-gov-border p-6 md:p-8 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <Target className="text-gov-accent" size={20} />
                <h2 className="text-xs font-bold text-gov-text-secondary uppercase tracking-wider">Priority Next Action</h2>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-extrabold text-gov-primary mb-3 leading-tight">
                {nextAction?.title || "Complete SQL Data Validation Practice"}
              </h3>
              
              <div className="bg-gov-surface-muted border-l-[3px] border-l-gov-warning p-4 w-full mb-6 text-sm text-gov-text-primary rounded-r">
                <p className="font-medium leading-relaxed">
                  <strong>Why this?</strong> {userProfile?.challenges ? `Based on your stated challenge: "${userProfile.challenges}", this task will directly close your competency gap and boost your operational readiness.` : (nextAction?.whyThis || 'You need this skill for your current role. Completing this task will close your gap and boost your readiness.')}
                </p>
                {userProfile?.topics && (
                  <p className="mt-2 text-xs text-gov-text-secondary">
                    <strong>Aligns with your interests:</strong> {userProfile.topics}
                  </p>
                )}
                {userProfile?.learningModality && (
                  <p className="mt-1 text-xs text-gov-text-secondary">
                    <strong>Format:</strong> Adjusted for your preferred modality ({userProfile.learningModality}).
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="bg-gov-primary hover:bg-gov-primary-hover text-white px-8 py-3 rounded text-sm md:text-base font-bold shadow-sm" onClick={() => setCurrentPage('execution-lab')}>
                  Start Execution Task
                </Button>
                <Button size="lg" variant="outline" className="text-gov-primary border-gov-border bg-white" onClick={() => setCurrentPage('skill-intelligence')}>
                  Inspect Reasoning <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* COMPETENCY TWIN PANEL */}
            <div className="bg-white border border-gov-border rounded p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 border-b border-gov-border pb-3">
                  <User size={18} className="text-gov-primary" />
                  <h3 className="text-xs font-bold text-gov-primary uppercase tracking-wider">Competency Twin</h3>
                </div>

                <div className="flex items-center justify-between mb-5 text-[9px] uppercase font-bold text-gov-text-secondary bg-gov-surface-muted p-1.5 rounded">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gov-success"></div> Target Met</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gov-warning"></div> Approaching</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gov-danger"></div> Below Target</div>
                </div>
              </div>
              
              <div className="flex flex-col gap-5 flex-1 justify-center py-2">
                <div>
                  <div className="flex justify-between items-end mb-1.5">
                    <div className="text-xs font-bold text-gov-text-primary">Survey Sampling</div>
                    <div className="text-[10px] text-gov-text-secondary font-bold">0%</div>
                  </div>
                  <div className="w-full bg-gov-surface-muted h-2.5 rounded-full relative shadow-inner overflow-hidden">
                    <div className="bg-gov-danger h-full rounded-full transition-all duration-1000" style={{ width: '0%' }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-end mb-1.5">
                    <div className="text-xs font-bold text-gov-text-primary">Data Quality</div>
                    <div className="text-[10px] text-gov-text-secondary font-bold">0%</div>
                  </div>
                  <div className="w-full bg-gov-surface-muted h-2.5 rounded-full relative shadow-inner overflow-hidden">
                    <div className="bg-gov-danger h-full rounded-full transition-all duration-1000" style={{ width: '0%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-1.5">
                    <div className="text-xs font-bold text-gov-text-primary">SQL Operations</div>
                    <div className="text-[10px] text-gov-text-secondary font-bold">0%</div>
                  </div>
                  <div className="w-full bg-gov-surface-muted h-2.5 rounded-full relative shadow-inner overflow-hidden">
                    <div className="bg-gov-danger h-full rounded-full transition-all duration-1000" style={{ width: '0%' }} />
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-gov-text-muted mt-2 text-center pt-2 border-t border-gov-border/60">
                Baseline profile initialized · Ready for evaluation
              </div>
            </div>

            {/* DAILY ATTENDANCE HEATMAP PANEL */}
            <div className="bg-white border border-gov-border rounded p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 border-b border-gov-border pb-3">
                  <CalendarDays size={18} className="text-gov-primary" />
                  <h3 className="text-xs font-bold text-gov-primary uppercase tracking-wider">Activity Heatmap</h3>
                </div>
                <p className="text-[11px] text-gov-text-secondary mb-4 leading-relaxed">Daily platform engagement and verified executions over the last 35 days.</p>
              </div>
              
              <div className="py-2 flex-1 flex items-center justify-center">
                <div className="grid grid-cols-7 gap-2 w-full max-w-[280px]">
                  {activityDays.map((level, i) => (
                    <div 
                      key={i} 
                      className={`w-6 h-6 rounded-[3px] ${getHeatmapColor(level)} transition-transform hover:scale-110 hover:shadow-sm cursor-pointer mx-auto`} 
                      title={`Day ${i+1} Activity Level: ${level}`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 mt-3 text-[9px] uppercase text-gov-text-secondary font-bold justify-end pt-2 border-t border-gov-border/60">
                <span>Less</span>
                <div className="w-2.5 h-2.5 rounded-[2px] bg-gov-bg border border-gov-border/50" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-[#c6e48b]" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-[#7bc96f]" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-[#196127]" />
                <span>More</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
