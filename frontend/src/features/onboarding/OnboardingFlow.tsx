import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  WelcomeStep, 
  EvidenceUploadStep, 
  WorkContextStep, 
  AiAnalysisStep, 
  CapabilityProfileStep 
} from './OnboardingSteps';

export interface OnboardingData {
  role: string;
  designation: string;
  department: string;
  responsibilities: string;
  hasUploadedEvidence: boolean;
  challenges: string;
  topics: string;
  learningModality: string;
}

export function OnboardingFlow() {
  const { setHasCompletedOnboarding, userRole, setUserProfile } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    role: userRole,
    designation: '',
    department: '',
    responsibilities: '',
    hasUploadedEvidence: false,
    challenges: '',
    topics: '',
    learningModality: '',
  });

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  
  const finishOnboarding = () => {
    setUserProfile({
      designation: data.designation,
      department: data.department,
      responsibilities: data.responsibilities,
      challenges: data.challenges,
      topics: data.topics,
      learningModality: data.learningModality,
      hasUploadedEvidence: data.hasUploadedEvidence
    });
    setHasCompletedOnboarding(true);
  };

  return (
    <div className="min-h-screen bg-gov-bg flex flex-col items-center justify-center p-4">
      {/* Top Logo Area */}
      <div className="mb-6 flex flex-col items-center select-none">
        <img
          alt="SIH Logo"
          className="h-16 object-contain drop-shadow-md mb-2"
          src="/sih-logo.png"
        />
        <h1 className="text-xl font-bold text-gov-primary tracking-tight">KarmaTute Initialization</h1>
        <div className="text-sm text-gov-primary/70 font-medium">Step {currentStep} of 5</div>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
        
        <div className="mb-8">
          {/* Progress Bar */}
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gov-accent transition-all duration-500 ease-out" 
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        <div className="min-h-[300px]">
          {currentStep === 1 && (
            <WelcomeStep data={data} setData={setData} onNext={nextStep} />
          )}
          {currentStep === 2 && (
            <EvidenceUploadStep data={data} setData={setData} onNext={nextStep} onPrev={prevStep} />
          )}
          {currentStep === 3 && (
            <WorkContextStep data={data} setData={setData} onNext={nextStep} onPrev={prevStep} />
          )}
          {currentStep === 4 && (
            <AiAnalysisStep data={data} onNext={nextStep} />
          )}
          {currentStep === 5 && (
            <CapabilityProfileStep onFinish={finishOnboarding} />
          )}
        </div>
      </div>
    </div>
  );
}
