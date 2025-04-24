"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

interface CompletionStepProps {
  formData: any;
  onBack: () => void;
}

export function CompletionStep({ formData, onBack }: CompletionStepProps) {
  return (
    <div className="space-y-6 py-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Review Details</h2>
      </div>

      <div className="bg-slate-50 rounded-lg p-6 mt-8">
        <h3 className="font-medium mb-4 text-justify">Company Summary</h3>
        <dl className="grid gap-3 text-sm">
          <div className="grid grid-cols-3 gap-1">
            <dt className="text-muted-foreground text-justify">Company Name:</dt>
            <dd className="col-span-2 font-medium text-justify">{formData.companyName}</dd>
          </div>
          <div>
            <div className="grid grid-cols-3 gap-1">
              <dt className="text-muted-foreground text-justify">Email:</dt>
              <dd className="col-span-2 font-medium text-justify">{formData.email}</dd>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <dt className="text-muted-foreground text-justify">Phone Number:</dt>
            <dd className="col-span-2 font-medium text-justify">{formData.phoneNumber}</dd>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <dt className="text-muted-foreground text-justify">Industry:</dt>
            <dd className="col-span-2 font-medium text-justify">{formData.industry}</dd>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <dt className="text-muted-foreground text-justify">Company Size:</dt>
            <dd className="col-span-2 font-medium text-justify">{formData.size}</dd>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <dt className="text-muted-foreground text-justify">Environment:</dt>
            <dd className="col-span-2 font-medium text-justify">{formData.environment}</dd>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <dt className="text-muted-foreground text-justify">Team Members:</dt>
            <dd className="col-span-2 font-medium space-y-1 text-justify">
              {formData.teamMembers.map((member: any) => (
                <div key={member.id}>{member.email}</div>
              ))}
            </dd>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <dt className="text-muted-foreground text-justify">Modules Enabled:</dt>
            <dd className="col-span-2 font-medium text-justify">
              {formData.modules
                .map(
                  (module: string) =>
                    module.charAt(0).toUpperCase() + module.slice(1)
                )
                .join(", ")}
            </dd>
          </div>
        </dl>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Settings
        </Button>
        <Button>Onboard Tenant</Button>
      </div>
    </div>
  );
}
