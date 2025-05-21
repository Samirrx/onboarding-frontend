"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

interface WorkspaceSetupStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export function WorkspaceSetupStep({
  formData,
  updateFormData,
  onNext,
  onBack,
}: WorkspaceSetupStepProps) {
  const [preferences, setPreferences] = useState({
    modules: formData.modules || formData.workspacePreferences?.modules || [],
  });

  useEffect(() => {
    const modulesData =
      formData.modules || formData.workspacePreferences?.modules || [];
    setPreferences((prev) => ({
      ...prev,
      modules: modulesData,
    }));
  }, [formData]);

  const modules = [
    {
      id: "CRM",
      name: "CRM",
      description:
        "A centralized platform for managing customer relationships, and activities.",
    },
    // {
    //   id: 'FSM',
    //   name: 'FSM',
    //   description: 'Efficiently manage field teams, job assignments, and on-site service tasks.'
    // },
    {
      id: "ITSM",
      name: "ITSM",
      description:
        "Track incidents, and automate IT workflows to enhance service delivery.",
    },
    {
      id: "Helpdesk",
      name: "Helpdesk",
      description:
        "Manage support requests, assign tickets, and ensure timely resolution.",
    },
    {
      id: "assetManagement",
      name: "Asset Management",
      description:
        "Track, manage, and maintain physical and digital assets across their lifecycle.",
    },
    // {
    //   id: 'HRMS',
    //   name: 'HRMS',
    //   description: 'Managing employee data, tracking performance, and automating.'
    // },
    {
      id: "attendanceManagement",
      name: "Attendance Management",
      description:
        "Track employee check-ins, working hours, leaves, and absences in real time.",
    },
    // {
    //   id: 'debtManagement',
    //   name: 'Debt Management',
    //   description: 'Keep records of debts, automate repayment schedules, reduce financial risk.'
    // }
  ];

  const handleModuleToggle = (moduleId: string) => {
    setPreferences((prev) => {
      let updatedModules = [...prev.modules];
      const isSelected = updatedModules.includes(moduleId);

      if (isSelected) {
        updatedModules = updatedModules.filter((id) => id !== moduleId);
        if (moduleId === "CRM") {
          updatedModules = updatedModules.filter(
            (id) => id !== "assetManagement"
          );
        }

        if (moduleId === "assetManagement") {
          updatedModules = updatedModules.filter((id) => id !== "CRM");
        }
      } else {
        updatedModules.push(moduleId);
        if (moduleId === "CRM" && !updatedModules.includes("assetManagement")) {
          updatedModules.push("assetManagement");
        }
      }

      return {
        ...prev,
        modules: updatedModules,
      };
    });
  };

  const handleSubmit = () => {
    updateFormData({
      modules: preferences.modules,
    });
    onNext();
  };

  return (
    <div className="space-y-6 py-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-justify">
          Workspace Setup
        </h2>
        <p className="text-muted-foreground text-justify">
          Customize your workspace to fit your team's needs.
        </p>
      </div>

      <div className="grid gap-8 pt-4">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-justify">Modules</h3>
          <p className="text-sm text-muted-foreground text-justify">
            Select the modules you want to enable for your workspace.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {[...modules]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((module) => (
                <div key={module.id} className="space-y-2">
                  <div
                    className={`flex items-start space-x-3 rounded-md border p-4 cursor-pointer transition-colors ${
                      preferences.modules.includes(module.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-accent"
                    }`}
                    onClick={() => handleModuleToggle(module.id)}
                  >
                    <div
                      className={`mt-0.5 rounded-full p-1 ${
                        preferences.modules.includes(module.id)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Check className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{module.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {module.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={handleSubmit}>
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
