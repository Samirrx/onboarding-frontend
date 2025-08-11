'use client';

import { useState } from 'react';
import { WelcomeStep } from './steps/WelcomeStep';
import { CompanyDetailsStep } from './steps/CompanyDetailsStep';
// import { InviteTeamStep } from './steps/InviteTeamStep';
import { WorkspaceSetupStep } from './steps/WorkspaceSetupStep';
import { CompletionStep } from './steps/CompletionStep';
import { StepIndicator } from './StepIndicator';

const steps = [
  { id: 1, name: 'Welcome' },
  { id: 2, name: 'Company Details' },
  // { id: 3, name: 'Invite Team' },
  { id: 3, name: 'Workspace' },
  { id: 4, name: 'Complete' }
];
function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    companyLogo: null,
    industry: '',
    companySize: '',
    // teamMembers: "",
    modules: []
  });

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 md:py-6">
        <StepIndicator steps={steps} currentStep={currentStep} />

        <div className="mt-8 bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-sm overflow-auto h-[calc(100vh-200px)]">
          {currentStep === 1 && <WelcomeStep onNext={nextStep} />}

          {currentStep === 2 && (
            <CompanyDetailsStep
              formData={formData}
              updateFormData={updateFormData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}

          {/* {currentStep === 3 && (
            <InviteTeamStep
              formData={formData}
              updateFormData={updateFormData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )} */}

          {currentStep === 3 && (
            <WorkspaceSetupStep
              formData={formData}
              updateFormData={updateFormData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}

          {currentStep === 4 && (
            <CompletionStep formData={formData} onBack={prevStep} />
          )}
        </div>
      </div>
    </div>
  );
}
export default OnboardingFlow;
