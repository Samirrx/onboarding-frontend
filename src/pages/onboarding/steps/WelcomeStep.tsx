import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="space-y-6 py-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome to the platform
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Let's get your company set up in just a few easy steps. We'll help you
          customize your workspace and invite your team.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mt-10">
        <div className="bg-slate-50 p-6 rounded-lg text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M20 7h-9"></path>
              <path d="M14 17H5"></path>
              <circle cx="17" cy="17" r="3"></circle>
              <circle cx="7" cy="7" r="3"></circle>
            </svg>
          </div>
          <h3 className="font-medium mb-2">Company Profile</h3>
          <p className="text-sm text-muted-foreground">
            Set up your company details and upload your logo
          </p>
        </div>

        <div className="bg-slate-50 p-6 rounded-lg text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h3 className="font-medium mb-2">Invite Team</h3>
          <p className="text-sm text-muted-foreground">
            Add your team members and assign roles
          </p>
        </div>

        <div className="bg-slate-50 p-6 rounded-lg text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M2 9V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1"></path>
              <path d="M2 13h10"></path>
              <path d="m9 16 3-3-3-3"></path>
            </svg>
          </div>
          <h3 className="font-medium mb-2">Workspace Setup</h3>
          <p className="text-sm text-muted-foreground">
            Customize your workspace preferences
          </p>
        </div>
      </div>

      <div className="flex justify-center mt-10">
        <Button onClick={onNext} className="w-full sm:w-auto" size="lg">
          Get Started <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
