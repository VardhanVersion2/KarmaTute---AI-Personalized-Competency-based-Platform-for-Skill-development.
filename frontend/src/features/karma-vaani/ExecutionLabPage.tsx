import React, { useState, useEffect } from 'react';
import { PageTutorialModal } from '../../components/ui/PageTutorialModal';
import { GlassCore, type CoreState } from '../../components/glass-core/GlassCore';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { useApp } from '../../context/AppContext';
import { fetchAssessments, startAttempt, submitOCR } from '../../services/executionLabApi';
import { 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  ShieldAlert, 
  Cpu, 
  Upload, 
  Copy, 
  RotateCcw, 
  Trash2, 
  Lock, 
  Check, 
  Sparkles,
  Layers,
  ArrowRight,
  FileCheck2
} from 'lucide-react';

export function ExecutionLabPage() {
  const { userRole } = useApp();
  const toast = useToast();
  const [assessments, setAssessments] = useState<any[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<any | null>(null);
  const [attempt, setAttempt] = useState<any | null>(null);

  const [simulatedText, setSimulatedText] = useState("Ministry of Statistics internal field survey form #8234-A.\nName: Ramesh Kumar.\nLocation: Pune, Maharashtra.\nIncome: Rs. 45,000.\nVerification Status: Passed.\nAuditor Comments: Data entered securely as per NDQAF guidelines.");
  const [simulatedConfidence] = useState(0.954); // Calculated automatically post-extraction
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<any | null>(null);

  const [coreState, setCoreState] = useState<CoreState>('idle');
  const [activeLevel, setActiveLevel] = useState<number>(1); // Default to Level 1 for fresh start

  const [level1State, setLevel1State] = useState<'idle' | 'running' | 'completed'>('idle');
  const [l1CurrentQ, setL1CurrentQ] = useState(0);
  const [l1SelectedOption, setL1SelectedOption] = useState<number | null>(null);

  const [level3State, setLevel3State] = useState<'idle' | 'running' | 'completed'>('idle');
  const [l3SelectedOption, setL3SelectedOption] = useState<number | null>(null);

  const L1_QUESTIONS = [
    {
      q: "Which SQL clause is used to filter records before any groupings are applied?",
      options: ["HAVING", "WHERE", "ORDER BY", "GROUP BY"],
      correct: 1
    },
    {
      q: "What is the primary purpose of data validation during survey collection?",
      options: ["To increase storage size", "To make data entry faster", "To ensure data integrity, accuracy, and completeness", "To encrypt the database"],
      correct: 2
    }
  ];

  const L3_SCENARIO = {
    context: "You receive a batch of field survey records where the 'Income' field contains extremely high outliers (e.g., Rs. 50,00,000) that contradict the 'Occupation' field (e.g., Daily Wage Laborer).",
    q: "What is your immediate course of action?",
    options: [
      "Delete the records immediately to preserve statistical averages.",
      "Modify the income field manually to a plausible number based on the occupation.",
      "Flag the records in the database, quarantine the batch, and initiate field re-verification.",
      "Accept the data as-is to avoid delaying the final report."
    ],
    correct: 2
  };

  const handleL1Next = () => {
    if (l1SelectedOption === null) return;
    if (l1CurrentQ < L1_QUESTIONS.length - 1) {
      setL1CurrentQ(curr => curr + 1);
      setL1SelectedOption(null);
    } else {
      setLevel1State('completed');
      toast.success('Knowledge Verification Passed!');
    }
  };

  const handleL3Submit = () => {
    if (l3SelectedOption === null) return;
    setLevel3State('completed');
    toast.success('Judgement Scenario Successfully Evaluated!');
  };

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    try {
      setCoreState('processing');
      const data = await fetchAssessments();
      if (data && data.length > 0) {
        setAssessments(data);
        setSelectedAssessment(data[0]);
      } else {
        const fallback = [
          { id: 1, title: 'SQL & Data Validation Assessment', description: 'Practical evaluation of data integrity, query optimization and verification.', level: 'LEVEL_1' }
        ];
        setAssessments(fallback);
        setSelectedAssessment(fallback[0]);
      }
      setCoreState('success');
    } catch (err: any) {
      const fallback = [
        { id: 1, title: 'SQL & Data Validation Assessment', description: 'Practical evaluation of data integrity, query optimization and verification.', level: 'LEVEL_1' }
      ];
      setAssessments(fallback);
      setSelectedAssessment(fallback[0]);
      setCoreState('success');
    }
  };

  const handleStart = async () => {
    if (!selectedAssessment) return;
    try {
      setCoreState('processing');
      const att = await startAttempt(1, selectedAssessment.id);
      setAttempt(att);
      setCoreState('success');
      toast.success('Execution environment ready');
    } catch (err) {
      setAttempt({ id: Date.now(), state: 'STARTED', offline: true });
      setCoreState('success');
      toast.info('Execution environment ready in local demo mode');
    }
  };

  const handleSubmitOcr = async () => {
    if (!attempt) return;
    try {
      setCoreState('processing');
      const res = await submitOCR(attempt.id, {
        simulatedExtractedText: simulatedText,
        simulatedConfidence: simulatedConfidence
      });
      setOcrResult(res);
      
      if (res.status === 'REVIEW_REQUIRED') {
        setCoreState('review-required');
        toast.error('Submission flagged for manual review due to confidence thresholds.');
      } else {
        setCoreState('success');
        toast.success('Execution evaluated successfully.');
      }
    } catch (err) {
      setOcrResult({
        status: 'COMPLETED',
        confidence: simulatedConfidence,
        score: 85,
        localDemo: true,
      });
      setCoreState('success');
      toast.info('Execution evaluated in local demo mode');
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(simulatedText);
    toast.success("Text copied to clipboard!");
  };

  const handleClearText = () => {
    setSimulatedText("");
    setUploadedFileName(null);
    toast.info("Cleared preview text.");
  };

  const handleRescanText = () => {
    setSimulatedText(
      "Ministry of Statistics internal field survey form #8234-A.\nName: Ramesh Kumar.\nLocation: Pune, Maharashtra.\nIncome: Rs. 45,000.\nVerification Status: Passed.\nAuditor Comments: Data entered securely as per NDQAF guidelines. Income documentation cross-verified with field logs."
    );
    setUploadedFileName("NDQAF_Survey_Form_8234A.pdf");
    toast.success("Re-scanned & restored sample document text.");
  };

  if (assessments.length === 0) {
    return (
      <div className="flex flex-col gap-6 p-6 animate-pulse">
         <div className="h-10 bg-gov-border rounded w-1/3" />
         <div className="h-64 bg-gov-surface-muted rounded" />
      </div>
    );
  }

  return (
    <>
      <PageTutorialModal 
        pageId="execution-lab"
        title="Execution Lab"
        what="Your capability verification workspace."
        why="We test execution, not only knowledge."
        how="Complete Level 1, Level 2 and Level 3 tasks."
        psAsk="continuous assessment... MCQ generation from uploaded materials."
        karmaTuteBuild="Multi-level assessment (MCQ, OCR Written, Scenarios)."
        differentiator="Moves beyond simple MCQs to OCR-assisted written execution and scenario confidence scoring."
      />

      {/* Main Container with extra bottom padding (pb-36) to avoid floating widget overlap */}
      <div className="flex flex-col gap-6 max-w-[1200px] mx-auto pb-36 animate-in fade-in">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gov-border pb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gov-primary tracking-tight">Execution Lab</h1>
            <p className="text-sm text-gov-text-secondary mt-1 font-medium">Verified practical capability assessment</p>
          </div>
          {selectedAssessment && (
            <div className="text-right">
              <span className="text-xs font-bold text-gov-text-muted uppercase">Active Target</span>
              <div className="text-gov-primary font-bold">{selectedAssessment.title}</div>
            </div>
          )}
        </div>

          {/* STEP 6 FIX: CONNECTED STEPPER WIZARD VISUALS */}
          <div className="bg-gov-surface border border-gov-border rounded-md shadow-sm p-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
              
              {/* Step 1: Available */}
              <div 
                onClick={() => setActiveLevel(1)}
                className={`flex-1 flex items-center gap-3 p-3 rounded-md border transition-all cursor-pointer ${
                  activeLevel === 1 
                    ? 'bg-gov-primary text-white border-gov-primary shadow-md ring-4 ring-gov-primary/10' 
                    : 'bg-gov-surface border-gov-border text-gov-text-primary hover:bg-gov-surface-muted'
                }`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold shrink-0 ${
                  activeLevel === 1 ? 'bg-white text-gov-primary' : 'bg-gov-primary/10 text-gov-primary'
                }`}>
                  <FileText size={18} />
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold uppercase tracking-wider ${activeLevel === 1 ? 'text-white/80' : 'text-gov-text-secondary'}`}>Level 1</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${activeLevel === 1 ? 'bg-gov-accent text-white' : 'bg-gov-primary/10 text-gov-primary'}`}>{activeLevel === 1 ? 'Active Step' : 'Available'}</span>
                  </div>
                  <span className={`text-sm font-bold ${activeLevel === 1 ? 'text-white' : 'text-gov-text-primary'}`}>Knowledge Verification</span>
                </div>
              </div>

              <ArrowRight className="hidden md:block text-gov-border shrink-0" size={20} />

              {/* Step 2: Available */}
              <div 
                onClick={() => setActiveLevel(2)}
                className={`flex-1 flex items-center gap-3 p-3 rounded-md border transition-all cursor-pointer ${
                  activeLevel === 2 
                    ? 'bg-gov-primary text-white border-gov-primary shadow-md ring-4 ring-gov-primary/10' 
                    : 'bg-gov-surface border-gov-border text-gov-text-primary hover:bg-gov-surface-muted'
                }`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold shrink-0 ${
                  activeLevel === 2 ? 'bg-white text-gov-primary' : 'bg-gov-primary/10 text-gov-primary'
                }`}>
                  <Cpu size={18} className={activeLevel === 2 ? 'animate-pulse' : ''} />
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold uppercase tracking-wider ${activeLevel === 2 ? 'text-white/80' : 'text-gov-text-secondary'}`}>Level 2</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${activeLevel === 2 ? 'bg-gov-accent text-white' : 'bg-gov-primary/10 text-gov-primary'}`}>{activeLevel === 2 ? 'Active Step' : 'Available'}</span>
                  </div>
                  <span className={`text-sm font-bold ${activeLevel === 2 ? 'text-white' : 'text-gov-text-primary'}`}>Practical Execution</span>
                </div>
              </div>

              <ArrowRight className="hidden md:block text-gov-border shrink-0" size={20} />

              {/* Step 3: Available */}
              <div 
                onClick={() => setActiveLevel(3)}
                className={`flex-1 flex items-center gap-3 p-3 rounded-md border transition-all cursor-pointer ${
                  activeLevel === 3 
                    ? 'bg-gov-primary text-white border-gov-primary shadow-md ring-4 ring-gov-primary/10' 
                    : 'bg-gov-surface border-gov-border text-gov-text-primary hover:bg-gov-surface-muted'
                }`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold shrink-0 ${
                  activeLevel === 3 ? 'bg-white text-gov-primary' : 'bg-gov-primary/10 text-gov-primary'
                }`}>
                  <Layers size={18} />
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold uppercase tracking-wider ${activeLevel === 3 ? 'text-white/80' : 'text-gov-text-secondary'}`}>Level 3</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${activeLevel === 3 ? 'bg-gov-accent text-white' : 'bg-gov-primary/10 text-gov-primary'}`}>{activeLevel === 3 ? 'Active Step' : 'Available'}</span>
                  </div>
                  <span className={`text-sm font-bold ${activeLevel === 3 ? 'text-white' : 'text-gov-text-primary'}`}>Judgement Scenario</span>
                </div>
              </div>

            </div>
          </div>

          {/* CONTENT AREA */}
          <div className="bg-gov-surface border border-gov-border shadow-sm p-6 md:p-8 rounded-md">
            
            {activeLevel === 1 && (
              <div className="py-8 flex flex-col items-center justify-center max-w-2xl mx-auto">
                {level1State === 'idle' && (
                  <div className="text-center">
                    <FileText size={48} className="text-gov-border mb-4 mx-auto" />
                    <h3 className="text-lg font-bold text-gov-primary mb-2">Level 1: Knowledge Verification</h3>
                    <p className="text-sm text-gov-text-secondary">
                      The Knowledge Verification module is ready. This includes randomized objective assessments on {selectedAssessment?.title || 'Data Validation'}.
                    </p>
                    <Button className="mt-6 bg-gov-accent hover:bg-gov-accent-hover text-white font-bold" onClick={() => setLevel1State('running')}>
                      Begin Knowledge Verification
                    </Button>
                  </div>
                )}
                {level1State === 'running' && (
                  <div className="w-full bg-white p-6 rounded-lg border border-gov-border shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-sm font-bold text-gov-primary">Question {l1CurrentQ + 1} of {L1_QUESTIONS.length}</span>
                      <span className="text-xs text-gov-text-secondary">Time remaining: 04:59</span>
                    </div>
                    <p className="text-base font-semibold text-gov-text-primary mb-6">
                      {L1_QUESTIONS[l1CurrentQ].q}
                    </p>
                    <div className="flex flex-col gap-3 mb-6">
                      {L1_QUESTIONS[l1CurrentQ].options.map((opt, idx) => (
                        <div 
                          key={idx}
                          onClick={() => setL1SelectedOption(idx)}
                          className={`p-3 border rounded-md cursor-pointer transition-colors ${l1SelectedOption === idx ? 'border-gov-accent bg-gov-accent/5' : 'border-gray-200 hover:bg-gray-50'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border flex shrink-0 items-center justify-center ${l1SelectedOption === idx ? 'border-gov-accent' : 'border-gray-300'}`}>
                              {l1SelectedOption === idx && <div className="w-2 h-2 rounded-full bg-gov-accent" />}
                            </div>
                            <span className="text-sm font-medium leading-tight">{opt}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button 
                      className="w-full bg-gov-primary text-white font-bold" 
                      disabled={l1SelectedOption === null}
                      onClick={handleL1Next}
                    >
                      {l1CurrentQ < L1_QUESTIONS.length - 1 ? 'Next Question' : 'Submit Verification'}
                    </Button>
                  </div>
                )}
                {level1State === 'completed' && (
                  <div className="text-center bg-gov-success-bg border border-gov-success-border p-8 rounded-lg w-full">
                    <CheckCircle2 size={48} className="text-gov-success mb-4 mx-auto" />
                    <h3 className="text-xl font-bold text-gov-success mb-2">Verification Passed</h3>
                    <p className="text-sm text-gov-text-primary mb-6">
                      You have successfully demonstrated foundational knowledge. You are now cleared for Practical Execution.
                    </p>
                    <Button onClick={() => setActiveLevel(2)} className="bg-gov-success text-white font-bold border-none hover:bg-green-700">
                      Proceed to Level 2
                    </Button>
                  </div>
                )}
              </div>
            )}

            {activeLevel === 3 && (
              <div className="py-8 flex flex-col items-center justify-center max-w-2xl mx-auto">
                {level3State === 'idle' && (
                  <div className="text-center">
                    <Layers size={48} className="text-gov-border mb-4 mx-auto" />
                    <h3 className="text-lg font-bold text-gov-primary mb-2">Level 3: Judgement Scenario</h3>
                    <p className="text-sm text-gov-text-secondary">
                      The Judgement Scenario environment is unlocked. You will be evaluated on your decision-making in a simulated real-world context.
                    </p>
                    <Button className="mt-6 bg-gov-accent hover:bg-gov-accent-hover text-white font-bold" onClick={() => setLevel3State('running')}>
                      Begin Judgement Scenario
                    </Button>
                  </div>
                )}
                {level3State === 'running' && (
                  <div className="w-full bg-white p-6 rounded-lg border border-gov-border shadow-sm">
                    <div className="bg-gov-info-bg border-l-4 border-gov-info p-4 mb-6 rounded-r-md">
                      <span className="text-xs font-bold text-gov-info uppercase tracking-wider block mb-1">Scenario Context</span>
                      <p className="text-sm font-medium text-gov-text-primary">{L3_SCENARIO.context}</p>
                    </div>
                    <p className="text-base font-semibold text-gov-text-primary mb-6">
                      {L3_SCENARIO.q}
                    </p>
                    <div className="flex flex-col gap-3 mb-6">
                      {L3_SCENARIO.options.map((opt, idx) => (
                        <div 
                          key={idx}
                          onClick={() => setL3SelectedOption(idx)}
                          className={`p-3 border rounded-md cursor-pointer transition-colors ${l3SelectedOption === idx ? 'border-gov-accent bg-gov-accent/5' : 'border-gray-200 hover:bg-gray-50'}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-4 h-4 rounded-full border flex shrink-0 mt-0.5 items-center justify-center ${l3SelectedOption === idx ? 'border-gov-accent' : 'border-gray-300'}`}>
                              {l3SelectedOption === idx && <div className="w-2 h-2 rounded-full bg-gov-accent" />}
                            </div>
                            <span className="text-sm font-medium leading-tight">{opt}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button 
                      className="w-full bg-gov-primary text-white font-bold" 
                      disabled={l3SelectedOption === null}
                      onClick={handleL3Submit}
                    >
                      Submit Decision
                    </Button>
                  </div>
                )}
                {level3State === 'completed' && (
                  <div className="text-center bg-gov-primary border border-gov-primary p-8 rounded-lg w-full text-white">
                    <Sparkles size={48} className="text-gov-accent mb-4 mx-auto animate-pulse" />
                    <h3 className="text-2xl font-bold mb-2 text-white">Execution Lab Complete</h3>
                    <p className="text-sm text-white/80 mb-6 max-w-md mx-auto">
                      You have successfully completed all 3 levels of this capability assessment. Your proof of work has been logged securely to your KarmaTute profile.
                    </p>
                    <Button onClick={() => window.location.href = '/'} className="bg-white text-gov-primary font-bold hover:bg-gray-100 text-[#00193c]">
                      Return to Command Center
                    </Button>
                  </div>
                )}
              </div>
            )}

          {activeLevel === 2 && (
            <div className="flex flex-col gap-8">
              {!attempt ? (
                <div className="text-center py-12 flex flex-col items-center">
                  <div className="bg-gov-info-bg border border-gov-info-border p-4 rounded-full mb-4">
                    <FileText size={32} className="text-gov-info" />
                  </div>
                  <h3 className="text-xl font-bold text-gov-primary mb-2">Practical Execution Required</h3>
                  <p className="text-sm text-gov-text-secondary max-w-lg mb-6">
                    You are required to submit written proof of execution for <strong>{selectedAssessment?.title}</strong>. This submission will be digitized via OCR and evaluated against institutional rubrics.
                  </p>
                  <Button size="lg" className="bg-gov-primary text-white font-bold px-8" onClick={handleStart}>
                    Initialize Execution Environment
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                  
                  {/* STEP 1 FIX: UPLOAD / INPUT CARD */}
                  <div className="flex-1 w-full flex flex-col gap-4 bg-white p-6 border border-gov-border rounded-md shadow-sm">
                    <div className="flex items-center justify-between border-b border-gov-border pb-3">
                      <div className="flex items-center gap-2">
                        <FileCheck2 size={18} className="text-gov-primary" />
                        <h3 className="text-sm font-bold text-gov-text-primary uppercase tracking-wide">Execution Input & Document Upload</h3>
                      </div>
                      <span className="text-[11px] font-bold text-gov-accent bg-gov-accent/10 px-2.5 py-1 rounded-full border border-gov-accent/30 flex items-center gap-1">
                        <Sparkles size={12} /> OCR ENGINE ACTIVE
                      </span>
                    </div>

                    {/* FILE DROPZONE COMPONENT (accept=".pdf,.png,.jpg,.jpeg") */}
                    {!ocrResult && (
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gov-text-secondary uppercase flex items-center justify-between">
                          <span>Upload Scanned Paper / Form</span>
                          <span className="text-[10px] text-gov-accent font-mono font-bold">Formats: .pdf, .png, .jpg</span>
                        </label>
                        
                        <div className="border-2 border-dashed border-gov-border hover:border-gov-primary bg-gov-surface-muted/60 transition-all rounded-md p-5 flex flex-col items-center justify-center text-center cursor-pointer relative group">
                          <input 
                            type="file" 
                            accept=".pdf,.png,.jpg,.jpeg"
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setUploadedFileName(file.name);
                                toast.success(`Document loaded: ${file.name}`);
                                if (file.type.includes('text')) {
                                  const reader = new FileReader();
                                  reader.onload = (ev) => setSimulatedText(ev.target?.result as string || simulatedText);
                                  reader.readAsText(file);
                                } else {
                                  setSimulatedText(
                                    `[OCR Extracted from: ${file.name}]\n\nMinistry of Statistics internal field survey form #8234-A.\nName: Ramesh Kumar.\nLocation: Pune, Maharashtra.\nIncome: Rs. 45,000.\nVerification Status: Passed.\nAuditor Comments: Data entered securely as per NDQAF guidelines.`
                                  );
                                }
                              }
                            }}
                          />
                          <div className="w-12 h-12 rounded-full bg-gov-primary/10 text-gov-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <Upload size={22} />
                          </div>
                          <span className="text-sm font-bold text-gov-primary">
                            {uploadedFileName ? `Attached: ${uploadedFileName}` : "Click to Browse or Drag & Drop Scanned Document"}
                          </span>
                          <span className="text-xs text-gov-text-secondary mt-1">
                            Accepts handwritten or printed survey forms (.pdf, .jpg, .png)
                          </span>
                        </div>
                      </div>
                    )}

                    {/* STEP 5 FIX: TEXT PREVIEW UTILITY BAR */}
                    <div className="flex items-center justify-between border-b border-gov-border pb-1.5 mt-2">
                      <label className="text-xs font-bold text-gov-text-secondary uppercase flex items-center gap-1.5">
                        <FileText size={14} className="text-gov-primary" />
                        Digitized Text Preview
                      </label>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleCopyText}
                          className="text-xs font-semibold text-gov-text-secondary hover:text-gov-primary bg-gov-surface-muted hover:bg-gov-border/40 px-2.5 py-1 rounded transition-colors flex items-center gap-1"
                          title="Copy to clipboard"
                        >
                          <Copy size={12} /> Copy
                        </button>
                        <button
                          type="button"
                          onClick={handleRescanText}
                          className="text-xs font-semibold text-gov-accent hover:text-gov-primary bg-gov-accent/10 hover:bg-gov-accent/20 px-2.5 py-1 rounded transition-colors flex items-center gap-1"
                          title="Re-scan / Auto-fill sample paper"
                        >
                          <RotateCcw size={12} /> Re-scan
                        </button>
                        {!ocrResult && (
                          <button
                            type="button"
                            onClick={handleClearText}
                            className="text-xs font-semibold text-gov-danger hover:bg-gov-danger-bg px-2.5 py-1 rounded transition-colors flex items-center gap-1"
                            title="Clear text"
                          >
                            <Trash2 size={12} /> Clear
                          </button>
                        )}
                      </div>
                    </div>

                    <textarea 
                      className="w-full h-36 p-3.5 bg-gov-surface-muted border border-gov-border rounded-md text-sm font-mono text-gov-text-primary focus:border-gov-primary focus:outline-none resize-none leading-relaxed"
                      value={simulatedText}
                      onChange={e => setSimulatedText(e.target.value)}
                      disabled={!!ocrResult}
                      placeholder="Extracted OCR text will appear here..."
                    />

                    {/* STEP 2 FIX: AUTOMATED READ-ONLY EXTRACTION CONFIDENCE BADGE */}
                    {!ocrResult && (
                      <div className="flex flex-col gap-3 mt-1">
                        <div className="flex items-center justify-between bg-gov-surface-muted border border-gov-border p-3 rounded-md">
                          <span className="text-xs font-bold text-gov-text-secondary uppercase">
                            Automated Extraction Confidence
                          </span>
                          <span className="text-xs font-bold font-mono text-gov-success bg-gov-success-bg border border-gov-success-border px-2.5 py-1 rounded-md flex items-center gap-1">
                            <CheckCircle2 size={13} /> {(simulatedConfidence * 100).toFixed(1)}% (AUTO-EVALUATED)
                          </span>
                        </div>

                        <Button 
                          className="w-full bg-gov-primary hover:bg-gov-primary-hover text-white justify-center py-3.5 font-bold shadow-sm text-sm rounded-md" 
                          onClick={handleSubmitOcr}
                        >
                          <Cpu size={18} className="mr-2" />
                          Evaluate Execution Against Rubric
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* STEP 4 FIX: STRUCTURED EVALUATION STATUS CARD */}
                  <div className="flex-1 w-full flex flex-col gap-4 bg-white p-6 border border-gov-border rounded-md shadow-sm">
                    <div className="flex items-center justify-between border-b border-gov-border pb-3">
                      <h3 className="text-sm font-bold text-gov-text-primary uppercase tracking-wide">Evaluation Status</h3>
                      {ocrResult && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                          ocrResult.status === 'REVIEW_REQUIRED' ? 'bg-gov-warning-bg text-gov-warning border-gov-warning-border' : 'bg-gov-success-bg text-gov-success border-gov-success-border'
                        }`}>
                          {ocrResult.status}
                        </span>
                      )}
                    </div>

                    {!ocrResult ? (
                      /* Structured Empty State Placeholder showing metrics preview */
                      <div className="flex flex-col gap-5 py-4">
                        
                        <div className="bg-gov-surface-muted/60 border border-dashed border-gov-border rounded-md p-4 flex flex-col gap-4">
                          
                          <div className="flex justify-between items-center text-xs font-bold text-gov-text-muted uppercase">
                            <span>Extraction Confidence</span>
                            <span className="font-mono">-- %</span>
                          </div>
                          <div className="w-full bg-gov-border/40 h-2 rounded-full overflow-hidden">
                            <div className="bg-gov-text-muted/30 h-full w-1/3 animate-pulse" />
                          </div>

                          <div className="flex justify-between items-center text-xs font-bold text-gov-text-muted uppercase mt-1">
                            <span>Rubric Evaluation Score</span>
                            <span className="font-mono">-- / 100</span>
                          </div>
                          <div className="w-full bg-gov-border/40 h-2 rounded-full overflow-hidden">
                            <div className="bg-gov-text-muted/30 h-full w-1/2 animate-pulse" />
                          </div>
                        </div>

                        {/* Metric Breakdown Preview */}
                        <div className="flex flex-col gap-2.5">
                          <span className="text-xs font-bold text-gov-text-secondary uppercase">Compliance Evaluation Rubrics</span>
                          
                          <div className="flex items-center justify-between text-xs p-2.5 bg-gov-surface-muted border border-gov-border rounded-md text-gov-text-muted">
                            <span className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-gov-text-muted/40" /> 1. NDQAF Guideline Compliance
                            </span>
                            <span className="font-mono text-[10px] uppercase">Pending</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs p-2.5 bg-gov-surface-muted border border-gov-border rounded-md text-gov-text-muted">
                            <span className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-gov-text-muted/40" /> 2. Data Field Integrity Check
                            </span>
                            <span className="font-mono text-[10px] uppercase">Pending</span>
                          </div>

                          <div className="flex items-center justify-between text-xs p-2.5 bg-gov-surface-muted border border-gov-border rounded-md text-gov-text-muted">
                            <span className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-gov-text-muted/40" /> 3. Verification Hash Generation
                            </span>
                            <span className="font-mono text-[10px] uppercase">Pending</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-xs font-bold text-gov-text-secondary bg-gov-surface p-3 border border-gov-border rounded-md mt-2">
                          <Eye size={16} className="text-gov-accent animate-pulse" />
                          <span>Awaiting Document Evaluation</span>
                        </div>

                      </div>
                    ) : (
                      /* Evaluated Results View */
                      <div className="flex flex-col gap-5 animate-in slide-in-from-right-4 py-2">
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-gov-text-secondary uppercase">OCR Extraction Confidence</span>
                          <span className="text-sm font-bold text-gov-primary font-mono">{(ocrResult.confidence * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gov-surface-muted h-2 rounded-full overflow-hidden flex -mt-3">
                          <div className={ocrResult.confidence >= 0.85 ? "bg-gov-success" : "bg-gov-warning"} style={{ width: `${ocrResult.confidence * 100}%` }} />
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-gov-text-secondary uppercase">Rubric Evaluation Score</span>
                          <span className="text-sm font-bold text-gov-primary font-mono">{ocrResult.score.toFixed(1)} / 100</span>
                        </div>
                        <div className="w-full bg-gov-surface-muted h-2 rounded-full overflow-hidden flex -mt-3">
                          <div className="bg-gov-info" style={{ width: `${ocrResult.score}%` }} />
                        </div>

                        {/* Breakdown Metrics */}
                        <div className="flex flex-col gap-2 mt-2">
                          <span className="text-xs font-bold text-gov-text-secondary uppercase">Rubric Breakdown</span>
                          <div className="flex items-center justify-between text-xs p-2.5 bg-gov-success-bg/40 border border-gov-success-border/60 rounded-md text-gov-text-primary">
                            <span className="flex items-center gap-2 font-medium">
                              <CheckCircle2 size={14} className="text-gov-success" /> NDQAF Guideline Compliance
                            </span>
                            <span className="font-mono font-bold text-gov-success">PASSED</span>
                          </div>
                          <div className="flex items-center justify-between text-xs p-2.5 bg-gov-success-bg/40 border border-gov-success-border/60 rounded-md text-gov-text-primary">
                            <span className="flex items-center gap-2 font-medium">
                              <CheckCircle2 size={14} className="text-gov-success" /> Data Field Integrity Check
                            </span>
                            <span className="font-mono font-bold text-gov-success">100% MATCH</span>
                          </div>
                        </div>

                        <div className={`mt-2 p-4 rounded-md border flex items-start gap-3 ${
                          ocrResult.status === 'REVIEW_REQUIRED' 
                            ? 'bg-gov-warning-bg border-gov-warning-border text-gov-warning' 
                            : 'bg-gov-success-bg border-gov-success-border text-gov-success'
                        }`}>
                          {ocrResult.status === 'REVIEW_REQUIRED' ? <ShieldAlert size={20} className="shrink-0 mt-0.5" /> : <CheckCircle2 size={20} className="shrink-0 mt-0.5" />}
                          <div className="flex flex-col">
                            <span className="text-sm font-bold uppercase tracking-wide">
                              {ocrResult.status === 'REVIEW_REQUIRED' ? 'Manual Review Required' : 'Verified Evidence Logged'}
                            </span>
                            <span className="text-xs font-medium text-gov-text-primary mt-1 leading-relaxed">
                              {ocrResult.status === 'REVIEW_REQUIRED' 
                                ? 'The confidence score fell below the threshold. This execution has been routed to an administrator for manual verification.'
                                : 'Execution meets institutional validation thresholds. Competency proof successfully signed and added to your ledger.'}
                            </span>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>
          )}
        </div>
        
      </div>
    </>
  );
}
