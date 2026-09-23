import React, { useState, useEffect } from 'react';
import { PageTutorialModal } from '../../components/ui/PageTutorialModal';
import { Button } from '../../components/ui/Button';
import { Shield, Download, Upload, Key, Lock, FileJson, Layers, ShieldCheck, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const DEMO_USER_ID = 1;

// ... keeping tutorial unchanged ...

// KarmaDNA Explainer Modal
function KarmaDNATutorial({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => (s + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-gov-text-primary/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-gov-surface w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 md:p-8 flex flex-col gap-6">
          
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-extrabold text-gov-primary tracking-tight">Understanding KarmaDNA</h2>
              <p className="text-sm text-gov-text-secondary mt-1 font-medium">Sovereign Data Portability Protocol</p>
            </div>
            <ShieldCheck size={32} className="text-gov-accent" />
          </div>

          <p className="text-sm text-gov-text-primary leading-relaxed font-medium bg-gov-surface-muted p-4 border border-gov-border rounded-sm">
            KarmaDNA is a cryptographic protocol that packages your entire competency footprint (assessments, evidence, gaps, certificates) into an encrypted portable file. This guarantees data ownership and secure transferability across the government ecosystem.
          </p>

          {/* Animated Timeline */}
          <div className="py-6 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-gov-text-secondary uppercase tracking-widest text-center mb-2">How it works</h3>
            <div className="flex justify-between items-center relative">
              <div className="absolute left-6 right-6 top-5 h-0.5 bg-gov-border z-0" />
              <div className="absolute left-6 right-6 top-5 h-0.5 bg-gov-accent transition-all duration-1000 z-0" style={{ width: `${(step / 3) * 100}%` }} />
              
              <div className="relative z-10 flex flex-col items-center gap-2 w-20">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors ${step >= 0 ? 'bg-gov-primary border-gov-primary text-white shadow-md' : 'bg-gov-surface border-gov-border text-gov-text-muted'}`}>
                  <Layers size={16} />
                </div>
                <span className={`text-[10px] font-bold uppercase text-center ${step >= 0 ? 'text-gov-primary' : 'text-gov-text-muted'}`}>Aggregate</span>
              </div>
              
              <div className="relative z-10 flex flex-col items-center gap-2 w-20">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors ${step >= 1 ? 'bg-gov-primary border-gov-primary text-white shadow-md' : 'bg-gov-surface border-gov-border text-gov-text-muted'}`}>
                  <Lock size={16} />
                </div>
                <span className={`text-[10px] font-bold uppercase text-center ${step >= 1 ? 'text-gov-primary' : 'text-gov-text-muted'}`}>Encrypt</span>
              </div>
              
              <div className="relative z-10 flex flex-col items-center gap-2 w-20">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors ${step >= 2 ? 'bg-gov-accent border-gov-accent text-white shadow-md' : 'bg-gov-surface border-gov-border text-gov-text-muted'}`}>
                  <Download size={16} />
                </div>
                <span className={`text-[10px] font-bold uppercase text-center ${step >= 2 ? 'text-gov-accent' : 'text-gov-text-muted'}`}>Export</span>
              </div>

              <div className="relative z-10 flex flex-col items-center gap-2 w-20">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors ${step >= 3 ? 'bg-gov-success border-gov-success text-white shadow-md' : 'bg-gov-surface border-gov-border text-gov-text-muted'}`}>
                  <Key size={16} />
                </div>
                <span className={`text-[10px] font-bold uppercase text-center ${step >= 3 ? 'text-gov-success' : 'text-gov-text-muted'}`}>Unlock</span>
              </div>
            </div>
            <div className="text-center mt-2 h-8">
               <span className="text-xs font-bold text-gov-text-primary">
                 {step === 0 && "Aggregating all your operational evidence and capabilities..."}
                 {step === 1 && "Encrypting the payload using a unique AES-128 secure key..."}
                 {step === 2 && "Generating the immutable .karma portable file format..."}
                 {step === 3 && "You can securely unlock this data on any authorized portal."}
               </span>
            </div>
          </div>
        </div>

        <div className="bg-gov-surface-muted border-t border-gov-border p-4 flex justify-end">
          <Button onClick={onClose} className="bg-gov-primary hover:bg-gov-primary-hover text-white px-8 font-bold">
            Understand & Proceed
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DataChamberPage() {
  const toast = useToast();
  const [showTutorial, setShowTutorial] = useState(true);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [importKey, setImportKey] = useState('');
  const [importData, setImportData] = useState('');
  const [importedContent, setImportedContent] = useState<any>(null);

  const handleExport = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/karmadna/export/${DEMO_USER_ID}`);
      if (!res.ok) throw new Error('Failed to generate KarmaDNA');
      
      const data = await res.json();
      
      setGeneratedKey(data.secretKey);

      const blob = new Blob([data.karmaData], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `user_${DEMO_USER_ID}.karma`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('KarmaDNA Generated Successfully');
    } catch (err: any) {
      toast.error('Failed to generate KarmaDNA');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    if (!importKey || !importData) {
      toast.error('Please provide both the key and the .karma file data');
      return;
    }
    setIsProcessing(true);
    try {
      const res = await fetch('/api/karmadna/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretKey: importKey, karmaData: importData })
      });
      if (!res.ok) throw new Error('Invalid key or corrupted .karma file');
      
      const parsed = await res.json();
      setImportedContent(parsed);
      toast.success('KarmaDNA Successfully Imported!');
    } catch (err: any) {
      toast.error(err.message || 'Import failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setImportData(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  return (
    <>
      {showTutorial && <KarmaDNATutorial onClose={() => setShowTutorial(false)} />}
      
      <PageTutorialModal 
        pageId="data-chamber"
        title="Data Chamber"
        what="Data Portability Protocol."
        why="Ensure citizens own their capability ledger."
        how="Generate a secure key and .karma file to transfer capabilities."
        psAsk="Data security and user ownership of progress."
        karmaTuteBuild="AES encrypted export/import pipeline."
        differentiator="True sovereign data ownership for interoperability across government platforms."
      />

      <div className="flex flex-col gap-8 max-w-[1540px] mx-auto pb-12 animate-in fade-in">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gov-border pb-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-gov-primary tracking-tight">Data Chamber</h1>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-[10px] uppercase font-bold tracking-widest">
                <RefreshCw size={12} className="animate-spin" style={{ animationDuration: '3s' }} /> Syncing
              </div>
            </div>
            <p className="text-sm text-gov-text-secondary font-medium">Sovereign KarmaDNA Portability Protocol</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowTutorial(true)} className="bg-white border-gov-border text-gov-text-primary hover:bg-gov-surface-muted">
            What is KarmaDNA?
          </Button>
        </div>

        {generatedKey && (
          <div className="bg-gov-warning-bg border border-gov-warning-border p-6 rounded-sm shadow-sm flex flex-col gap-4 animate-in slide-in-from-top-4">
            <div className="flex items-center gap-3 text-gov-warning">
              <Key size={24} />
              <h3 className="text-lg font-bold uppercase tracking-wide">Store this Key Safely</h3>
            </div>
            <p className="text-sm text-gov-text-primary font-medium leading-relaxed">
              This is the cryptographic key to your Data Chamber. Your <strong>.karma</strong> file (KarmaDNA) contains your entire personalized data footprint (competencies, evidence, recommendations). 
              Share this file and key with trusted platforms or officials to grant full access to your learning DNA.
            </p>
            <div className="bg-white p-4 rounded-sm font-mono text-sm text-gov-primary font-bold break-all border border-gov-warning-border shadow-sm flex justify-between items-center">
              <span>{generatedKey}</span>
              <span className="text-[10px] text-gov-warning uppercase bg-gov-warning-bg px-2 py-1 rounded-sm border border-gov-warning-border">Decryption Key</span>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* EXPORT SECTION */}
          <div className="bg-gov-surface border border-gov-border p-8 rounded-sm shadow-sm flex flex-col gap-6">
            <div className="flex items-start justify-between border-b border-gov-border pb-4">
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-gov-primary">Generate KarmaDNA</h3>
                <span className="text-xs text-gov-text-secondary font-medium uppercase tracking-wide mt-1">Export your capability ledger</span>
              </div>
              <Download size={24} className="text-gov-primary" />
            </div>
            <p className="text-sm text-gov-text-primary font-medium flex-1">
              Download your entire system data footprint as an encrypted `.karma` file. This allows you to retain sovereign ownership of your learning metrics and evidence.
            </p>
            <Button onClick={handleExport} disabled={isProcessing} className="w-full justify-center bg-gov-primary hover:bg-gov-primary-hover text-white font-bold py-3">
              {isProcessing ? 'Generating...' : 'Generate & Download .karma'}
            </Button>
          </div>

          {/* IMPORT SECTION */}
          <div className="bg-gov-primary text-white p-8 rounded-sm shadow-sm flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
              <Shield size={160} />
            </div>
            <div className="flex items-start justify-between border-b border-white/20 pb-4 relative z-10">
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-white">Import Data Chamber</h3>
                <span className="text-xs text-white/60 font-medium uppercase tracking-wide mt-1">Unlock official footprint</span>
              </div>
              <Upload size={24} className="text-gov-accent" />
            </div>
            <p className="text-sm text-white/80 font-medium relative z-10">
              Provide a `.karma` file and its associated decryption key to pull official personalized data into this platform securely.
            </p>
            
            <div className="flex flex-col gap-4 mt-auto relative z-10">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Decryption Key</label>
                <input 
                  type="text" 
                  placeholder="e.g. 8f43-4346-648f-6b96" 
                  className="bg-white/10 border border-white/20 rounded-sm px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-gov-accent transition-colors"
                  value={importKey}
                  onChange={e => setImportKey(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Sovereign Data File</label>
                <label className="bg-white/5 border border-white/20 border-dashed rounded-sm px-4 py-3 text-sm text-center cursor-pointer hover:bg-white/10 transition-colors">
                  <span className="flex items-center justify-center gap-2 font-medium">
                    {importData ? <CheckCircle2 size={16} className="text-gov-success"/> : <FileJson size={16} className="text-white/60" />}
                    {importData ? "File successfully loaded" : "Select .karma payload"}
                  </span>
                  <input type="file" accept=".karma" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
              
              <Button onClick={handleImport} disabled={isProcessing} className="w-full justify-center py-3 bg-gov-accent hover:bg-gov-accent-hover text-white font-bold border-transparent mt-2">
                <Lock size={16} className="mr-2" />
                {isProcessing ? 'Decrypting...' : 'Unlock Data Chamber'}
              </Button>
            </div>
          </div>
        </div>

        {importedContent && (
          <div className="bg-gov-surface border border-gov-border p-6 rounded-sm shadow-sm animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-sm font-bold text-gov-primary uppercase tracking-wide border-b border-gov-border pb-2 mb-4 flex items-center gap-2">
              <ShieldCheck size={18} className="text-gov-success" /> Decrypted Ledger Contents
            </h3>
            <div className="bg-gov-surface-muted rounded-sm p-4 max-h-96 overflow-y-auto border border-gov-border">
              <pre className="text-[11px] text-gov-text-secondary font-mono leading-relaxed">
                {JSON.stringify(importedContent, null, 2)}
              </pre>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
