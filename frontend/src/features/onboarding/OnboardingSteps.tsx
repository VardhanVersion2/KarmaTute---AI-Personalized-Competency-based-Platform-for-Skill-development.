import React, { useState, useEffect } from 'react';
import { OnboardingData } from './OnboardingFlow';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Loader2, UploadCloud, FileText, CheckCircle, ShieldCheck, ArrowRight, BookOpen, BrainCircuit } from 'lucide-react';

interface StepProps {
  data: OnboardingData;
  setData?: React.Dispatch<React.SetStateAction<OnboardingData>>;
  onNext: () => void;
  onPrev?: () => void;
  onFinish?: () => void;
}

export function WelcomeStep({ data, setData, onNext }: StepProps) {
  const isComplete = data.designation.trim() !== '' && data.department.trim() !== '';

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-2xl font-bold text-gov-primary mb-2">Welcome to KarmaTute</h2>
      <p className="text-gray-600 mb-6">
        Let's set up your Initial Capability Profile. Please confirm your current role context.
      </p>
      
      <div className="space-y-4 mb-8">
        <Input 
          label="Designation / Title" 
          placeholder="e.g. Deputy Secretary, Junior Statistical Officer" 
          value={data.designation}
          onChange={(e) => setData?.({ ...data, designation: e.target.value })}
          required
        />
        <Input 
          label="Department / Ministry" 
          placeholder="e.g. Ministry of Statistics and Programme Implementation" 
          value={data.department}
          onChange={(e) => setData?.({ ...data, department: e.target.value })}
          required
        />
        <Textarea 
          label="Primary Responsibilities (Optional)" 
          placeholder="Briefly describe your day-to-day work..."
          value={data.responsibilities}
          onChange={(e) => setData?.({ ...data, responsibilities: e.target.value })}
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!isComplete} rightIcon={<ArrowRight size={16} />}>
          Next Step
        </Button>
      </div>
    </div>
  );
}

export function EvidenceUploadStep({ data, setData, onNext, onPrev }: StepProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => setIsDragging(false);
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
    if (droppedFiles.length > 0) {
      setFiles(prev => [...prev, ...droppedFiles]);
      setData?.({ ...data, hasUploadedEvidence: true });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
      setFiles(prev => [...prev, ...selected]);
      setData?.({ ...data, hasUploadedEvidence: true });
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-2xl font-bold text-gov-primary mb-2">Evidence & History</h2>
      <p className="text-gray-600 mb-6">
        Upload your resume, past certificates, or performance records (PDF only). 
        Our AI will securely analyze these to pre-fill your competencies.
      </p>

      <div 
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors mb-6 ${
          isDragging ? 'border-gov-accent bg-gov-accent/5' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <UploadCloud size={48} className="text-gray-400 mb-4" />
        <h3 className="font-semibold text-gov-primary mb-1">Drag and drop PDFs here</h3>
        <p className="text-sm text-gray-500 mb-4">or click to browse your files</p>
        <input 
          type="file" 
          accept="application/pdf"
          multiple
          className="hidden" 
          id="file-upload" 
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload">
          <Button variant="outline" type="button" onClick={() => document.getElementById('file-upload')?.click()}>
            Browse Files
          </Button>
        </label>
      </div>

      {files.length > 0 && (
        <div className="mb-8 space-y-2">
          <h4 className="text-sm font-bold text-gray-700">Uploaded Evidence:</h4>
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
              <FileText size={18} className="text-gov-accent" />
              <span className="text-sm font-medium flex-1 truncate">{f.name}</span>
              <CheckCircle size={16} className="text-green-500" />
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onPrev}>Back</Button>
        <Button onClick={onNext} rightIcon={<ArrowRight size={16} />}>
          {files.length > 0 ? 'Next Step' : 'Skip for now'}
        </Button>
      </div>
    </div>
  );
}

export function WorkContextStep({ data, setData, onNext, onPrev }: StepProps) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-2xl font-bold text-gov-primary mb-2">Work Context & Learning</h2>
      <p className="text-gray-600 mb-6">
        Help KarmaTute personalize your capability journey.
      </p>

      <div className="space-y-5 mb-8">
        <Select
          label="Preferred Learning Modality"
          options={[
            { label: 'Video & Interactive', value: 'video' },
            { label: 'Reading & Text-based', value: 'text' },
            { label: 'Hands-on / Labs', value: 'lab' },
            { label: 'Mixed / Balanced', value: 'mixed' },
          ]}
          value={data.learningModality}
          onChange={(e) => setData?.({ ...data, learningModality: e.target.value })}
        />
        <Textarea 
          label="Current Professional Challenges" 
          placeholder="e.g. Transitioning to a new data tool, managing larger teams..."
          value={data.challenges}
          onChange={(e) => setData?.({ ...data, challenges: e.target.value })}
        />
        <Input 
          label="Topics of Interest" 
          placeholder="e.g. Data Analytics, Public Policy, Leadership" 
          value={data.topics}
          onChange={(e) => setData?.({ ...data, topics: e.target.value })}
        />
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onPrev}>Back</Button>
        <Button onClick={onNext} rightIcon={<ArrowRight size={16} />}>
          Analyze Profile
        </Button>
      </div>
    </div>
  );
}

export function AiAnalysisStep({ onNext }: StepProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Extracting context from evidence...');

  useEffect(() => {
    const phases = [
      { p: 20, t: 'Parsing PDF documents...' },
      { p: 45, t: 'Mapping skills to government taxonomy...' },
      { p: 75, t: 'Identifying capability gaps...' },
      { p: 90, t: 'Formulating next best actions...' },
      { p: 100, t: 'Profile generation complete.' }
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < phases.length) {
        setProgress(phases[current].p);
        setStatus(phases[current].t);
        current++;
      } else {
        clearInterval(interval);
        setTimeout(onNext, 600);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [onNext]);

  return (
    <div className="flex flex-col items-center justify-center py-12 animate-in fade-in duration-300">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gov-accent/20 animate-ping rounded-full" />
        <div className="bg-gov-primary p-6 rounded-full relative z-10 shadow-lg">
          <BrainCircuit size={48} className="text-white animate-pulse" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gov-primary mb-2">KarmaVaani AI Analysis</h3>
      <p className="text-sm font-medium text-gov-accent mb-6 animate-pulse">{status}</p>

      <div className="w-full max-w-md bg-gray-100 h-2 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gov-accent transition-all duration-300 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export function CapabilityProfileStep({ onFinish }: StepProps) {
  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
          <ShieldCheck size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gov-primary mb-2">Profile Initialized</h2>
        <p className="text-gray-600">
          Your initial Capability Profile has been generated based on your evidence and role context.
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8">
        <div className="flex items-start gap-4 mb-4 pb-4 border-b border-gray-200">
          <BookOpen className="text-gov-accent mt-1" />
          <div>
            <h4 className="font-bold text-gov-primary text-sm uppercase tracking-wider mb-1">Baseline Competencies Detected</h4>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-semibold bg-white border border-gray-200 px-2 py-1 rounded">Data Analysis (Level 2)</span>
              <span className="text-xs font-semibold bg-white border border-gray-200 px-2 py-1 rounded">Policy Admin (Level 1)</span>
              <span className="text-xs font-semibold bg-white border border-gray-200 px-2 py-1 rounded">Team Mgmt (Level 2)</span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-6" />
          <div>
            <h4 className="font-bold text-gov-primary text-sm uppercase tracking-wider mb-1">Recommended Next Action</h4>
            <p className="text-sm text-gray-700">
              Complete the <span className="font-semibold text-gov-primary">Data Ethics Baseline Assessment</span> to validate your current proficiency and unlock advanced paths.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button size="lg" onClick={onFinish} rightIcon={<ArrowRight size={18} />}>
          Start Journey
        </Button>
      </div>
    </div>
  );
}
