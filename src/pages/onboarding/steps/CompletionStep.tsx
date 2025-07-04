"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { addTenant } from "@/services/controllers/onboarding";
import { notify } from "@/hooks/toastUtils";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface CompletionStepProps {
  formData: any;
  onBack: () => void;
}

export function CompletionStep({ formData, onBack }: CompletionStepProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { companyLogo, ...rest } = formData;

  const data = {
    ...rest,
    modules: formData.modules.map((module: string) => module),
    teamMembers: formData.teamMembers[0]?.email || "",
  };

  const submitTenant = async () => {
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("tenantDtl", JSON.stringify(data));

      if (formData.companyLogo) {
        formDataToSend.append("companyLogo", formData.companyLogo);
      }
      console.log("Form data to send:", formDataToSend);

      //Make API call using axios
      const response = await addTenant(formDataToSend);

      if (response?.status) {
        navigate("/", {
          state: {
            environment: data.environment,
          },
        });
        notify.success("Please wait... Creating new tenant", {
          autoClose: 5000,
        });
      }

      console.log("Tenant added successfully:", response);
    } catch (error) {
      console.error("Error adding tenant:", error);
    } finally {
      setLoading(false);
    }
  };

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
            <dt className="text-muted-foreground text-justify">Environment:</dt>
            <dd className="col-span-2 font-medium text-justify">
              {data.environment}
            </dd>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <dt className="text-muted-foreground text-justify">
              Instance Type
            </dt>
            <dd className="col-span-2 font-medium text-justify">
              {data.instanceType}
            </dd>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <dt className="text-muted-foreground text-justify">
              Company Name:
            </dt>
            <dd className="col-span-2 font-medium text-justify">
              {data.companyName}
            </dd>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <dt className="text-muted-foreground text-justify">Email:</dt>
            <dd className="col-span-2 font-medium text-justify">
              {data.email}
            </dd>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <dt className="text-muted-foreground text-justify">
              Phone Number:
            </dt>
            <dd className="col-span-2 font-medium text-justify">
              {data.phoneNumber}
            </dd>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <dt className="text-muted-foreground text-justify">Industry:</dt>
            <dd className="col-span-2 font-medium text-justify">
              {data.industry}
            </dd>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <dt className="text-muted-foreground text-justify">
              Company Size:
            </dt>
            <dd className="col-span-2 font-medium text-justify">
              {data.companySize}
            </dd>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <dt className="text-muted-foreground text-justify">
              Team Members:
            </dt>
            <dd className="col-span-2 font-medium text-justify">
              {data.teamMembers}
            </dd>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <dt className="text-muted-foreground text-justify">
              Modules Enabled:
            </dt>
            <dd className="col-span-2 font-medium text-justify">
              {data.modules
                .sort((a: string, b: string) => a.localeCompare(b))
                .map(
                  (module: string)=> 
                   module.charAt(0).toUpperCase() + module.slice(1)
                )
                .join(", ")}
            </dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
        <Button variant="outline" onClick={onBack} disabled={loading}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Settings
        </Button>
        <Button onClick={submitTenant} disabled={loading}>
          {`Onboard Tenant ${loading ? "..." : ""}`}
        </Button>
      </div>
    </div>
  );
}
