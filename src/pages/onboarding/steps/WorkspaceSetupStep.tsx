'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';

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
  onBack
}: WorkspaceSetupStepProps) {
  const [preferences, setPreferences] = useState({
    theme: formData.workspacePreferences?.theme || 'light',
    notifications: formData.workspacePreferences?.notifications !== false,
    modules: formData.workspacePreferences?.modules || [
      'dashboard',
      'projects',
      'calendar'
    ]
  });

  const modules = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      description: "Overview of your company's activity"
    },
    {
      id: 'projects',
      name: 'Projects',
      description: "Manage and track your team's projects"
    },
    {
      id: 'calendar',
      name: 'Calendar',
      description: 'Schedule and manage events'
    },
    {
      id: 'tasks',
      name: 'Tasks',
      description: 'Assign and track tasks for your team'
    },
    {
      id: 'documents',
      name: 'Documents',
      description: 'Store and share important files'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'Track performance and metrics'
    }
  ];

  const handleThemeChange = (value: string) => {
    setPreferences({
      ...preferences,
      theme: value
    });
  };

  const handleNotificationsChange = (checked: boolean) => {
    setPreferences({
      ...preferences,
      notifications: checked
    });
  };

  const handleModuleToggle = (moduleId: string) => {
    const updatedModules = preferences.modules.includes(moduleId)
      ? preferences.modules.filter((id) => id !== moduleId)
      : [...preferences.modules, moduleId];

    setPreferences({
      ...preferences,
      modules: updatedModules
    });
  };

  const handleSubmit = () => {
    updateFormData({
      workspacePreferences: preferences
    });
    onNext();
  };

  return (
    <div className="space-y-6 py-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Workspace Setup</h2>
        <p className="text-muted-foreground">
          Customize your workspace to fit your team's needs.
        </p>
      </div>

      <div className="grid gap-8 pt-4">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Appearance</h3>
          <RadioGroup
            value={preferences.theme}
            onValueChange={handleThemeChange}
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <RadioGroupItem
                value="light"
                id="theme-light"
                className="peer sr-only"
              />
              <Label
                htmlFor="theme-light"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <div className="mb-3 rounded-md border border-slate-200 p-1">
                  <div className="h-20 w-full rounded-sm bg-white"></div>
                </div>
                <p className="text-sm font-medium">Light</p>
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="dark"
                id="theme-dark"
                className="peer sr-only"
              />
              <Label
                htmlFor="theme-dark"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <div className="mb-3 rounded-md border border-slate-200 p-1">
                  <div className="h-20 w-full rounded-sm bg-slate-950"></div>
                </div>
                <p className="text-sm font-medium">Dark</p>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notifications</h3>
          <div className="flex items-center space-x-2">
            <Switch
              id="notifications"
              checked={preferences.notifications}
              onCheckedChange={handleNotificationsChange}
            />
            <Label htmlFor="notifications">Enable email notifications</Label>
          </div>
          <p className="text-sm text-muted-foreground">
            Receive notifications about important updates, mentions, and
            activity in your workspace.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Modules</h3>
          <p className="text-sm text-muted-foreground">
            Select the modules you want to enable for your workspace.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {modules.map((module) => (
              <div
                key={module.id}
                className={`flex items-start space-x-3 rounded-md border p-4 cursor-pointer transition-colors ${
                  preferences.modules.includes(module.id)
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-accent'
                }`}
                onClick={() => handleModuleToggle(module.id)}
              >
                <div
                  className={`mt-0.5 rounded-full p-1 ${
                    preferences.modules.includes(module.id)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
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
