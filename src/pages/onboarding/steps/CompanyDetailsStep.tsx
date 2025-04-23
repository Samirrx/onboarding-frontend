'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ArrowLeft, ArrowRight, Upload } from 'lucide-react';

interface CompanyDetailsStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export function CompanyDetailsStep({
  formData,
  updateFormData,
  onNext,
  onBack
}: CompanyDetailsStepProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState(formData.companyName || '');
  const [industry, setIndustry] = useState(formData.industry || '');
  const [size, setSize] = useState(formData.size || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        updateFormData({ companyLogo: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!industry) {
      newErrors.industry = 'Please select an industry';
    }

    if (!size) {
      newErrors.size = 'Please select company size';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      updateFormData({
        companyName,
        industry,
        size
      });
      onNext();
    }
  };

  return (
    <div className="space-y-6 py-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Company Details</h2>
        <p className="text-muted-foreground">
          Tell us about your company. This information will be used to
          personalize your experience.
        </p>
      </div>

      <div className="grid gap-6 pt-4">
        <div className="flex flex-col items-center justify-center">
          <div className="relative mb-4">
            <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-300">
              {logoPreview ? (
                <img
                  src={logoPreview || '/placeholder.svg'}
                  alt="Company logo preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4">
                  <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <span className="text-xs text-slate-500">Upload logo</span>
                </div>
              )}
            </div>
            <Input
              id="logo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoChange}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="absolute bottom-0 right-0 rounded-full"
              onClick={() => document.getElementById('logo-upload')?.click()}
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Upload your company logo (optional)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="company-name">Company Name</Label>
          <Input
            id="company-name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Acme Inc."
            className={errors.companyName ? 'border-red-500 w-full' : 'w-full'}
          />
          {errors.companyName && (
            <p className="text-sm text-red-500">{errors.companyName}</p>
          )}
        </div>

        <div className="space-y-2 w-full">
          <Label htmlFor="industry">Industry</Label>
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger
              id="industry"
              className={errors.industry ? 'border-red-500 w-full' : 'w-full'}
            >
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent className="w-full">
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.industry && (
            <p className="text-sm text-red-500">{errors.industry}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="size">Company Size</Label>
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger
              id="size"
              className={errors.size ? 'border-red-500 w-full ' : 'w-full'}
            >
              <SelectValue placeholder="Select company size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-10">1-10 employees</SelectItem>
              <SelectItem value="11-50">11-50 employees</SelectItem>
              <SelectItem value="51-200">51-200 employees</SelectItem>
              <SelectItem value="201-500">201-500 employees</SelectItem>
              <SelectItem value="501-1000">501-1000 employees</SelectItem>
              <SelectItem value="1000+">1000+ employees</SelectItem>
            </SelectContent>
          </Select>
          {errors.size && <p className="text-sm text-red-500">{errors.size}</p>}
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
