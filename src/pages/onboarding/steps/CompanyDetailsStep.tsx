"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Upload } from "lucide-react";
import { useEffect } from "react";

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
  onBack,
}: CompanyDetailsStepProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [firstName, setFirstName] = useState(formData.firstName || "");
  const [lastName, setLastName] = useState(formData.lastName || "");
  const [companyName, setCompanyName] = useState(formData.companyName || "");
  const [companyAddress, setCompanyAddress] = useState(formData.companyAddress || "");
  const [industry, setIndustry] = useState(formData.industry || "");
  const [companySize, setcompanySize] = useState(
    formData.companySize || "1-10"
  );
  const [environment, setEnvironment] = useState(formData.environment || "");
  const [email, setEmail] = useState(formData.email || "");
  const [phoneNumber, setPhoneNumber] = useState(formData.phoneNumber || "");
  const [instanceType, setInstanceType] = useState(formData.instanceType || "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [canContinue, setCanContinue] = useState(false);
  const environmentOptions = ["Dev", "Preprod", "App"].sort();
  const instanceOptions = ["Free", "Trial", "Paid", "Poc"].sort();
  const industryOptions = [
    { value: "technology", label: "Technology" },
    { value: "healthcare", label: "Healthcare" },
    { value: "finance", label: "Finance" },
    { value: "education", label: "Education" },
    { value: "retail", label: "Retail" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "other", label: "Other" },
  ];
  const sortedIndustries = industryOptions.sort((a, b) => {
    if (a.label === "Other") return 1;
    if (b.label === "Other") return -1;
    return a.label.localeCompare(b.label);
  });

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
      newErrors.companyName = "Company name is required";
    }

    if(!companyAddress.trim()){
      newErrors.companyAddress = "Company Address is required";
    }

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!industry) {
      newErrors.industry = "Please select an industry";
    }
    if (!environment) {
      newErrors.environment = "Please select an environment";
    }
    if (!instanceType) {
      newErrors.instanceType = "Please select an instance type";
    }
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email address is invalid";
    }
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(phoneNumber) || phoneNumber.length !== 10) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const isValid =
      firstName.trim() &&
      lastName.trim() &&
      companyName.trim() &&
      companyAddress.trim() &&
      industry &&
      companySize &&
      environment &&
      instanceType &&
      email.trim() &&
      /^\S+@\S+\.\S+$/.test(email) &&
      phoneNumber.trim();
    setCanContinue(!!isValid);
  }, [
    firstName,
    lastName,
    companyName,
    companyAddress,
    industry,
    environment,
    companySize,
    instanceType,
    email,
    phoneNumber,
  ]);

  useEffect(() => {
    if (formData.companyLogo && !logoPreview) {
      const file = formData.companyLogo;
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [formData.companyLogo, logoPreview]);

  const handleSubmit = () => {
    if (validateForm()) {
      updateFormData({
        firstName,
        lastName,
        companyName,
        companyAddress,
        industry,
        companySize,
        environment,
        email,
        phoneNumber,
        instanceType,
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
                  src={logoPreview || "/placeholder.svg"}
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
              onClick={() => document.getElementById("logo-upload")?.click()}
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Upload your company logo (optional)
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="environment">
            Environment <span className="text-red-500">*</span>
          </Label>
          <Select value={environment} onValueChange={setEnvironment}>
            <SelectTrigger
              id="environment"
              className={
                errors.environment ? "border-red-500 w-full" : "w-full"
              }
            >
              <SelectValue placeholder="Select environment" />
            </SelectTrigger>
            <SelectContent>
              {environmentOptions.map((env) => (
                <SelectItem key={env} value={env}>
                  {env}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.environment && (
            <p className="text-sm text-red-500">{errors.environment}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company-name">
            Instance Type<span className="text-red-500">*</span>
          </Label>
          <Select value={instanceType} onValueChange={setInstanceType}>
            <SelectTrigger
              id="instanceType"
              className={
                errors.instanceType ? "border-red-500 w-full" : "w-full"
              }
            >
              <SelectValue placeholder="Select instance type" />
            </SelectTrigger>
            <SelectContent>
              {instanceOptions.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first-name">
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="first-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="last-name">
              Last Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="last-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
              className={errors.lastName ? "border-red-500" : ""}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName}</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="company-name">
            Company Name {<span className="text-red-500">*</span>}
          </Label>
          <Input
            id="company-name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Acme Inc."
            className={errors.companyName ? "border-red-500" : ""}
          />
          {errors.companyName && (
            <p className="text-sm text-red-500">{errors.companyName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company-address">
            Company Address <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="company-address"
            value={companyAddress}
            onChange={(e) => setCompanyAddress(e.target.value)}
            placeholder="123 Main Street, City, State, ZIP"
            className={errors.companyAddress ? "border-red-500" : ""}
          />
          {errors.companyAddress && (
            <p className="text-sm text-red-500">{errors.companyAddress}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">
            Email {<span className="text-red-500">*</span>}
          </Label>
          <Input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Company Email"
            type="email"
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            value={phoneNumber}
            onChange={(e) => {
              const sanitized = e.target.value.replace(/\D/g, "");
              setPhoneNumber(sanitized);
            }}
            onKeyDown={(e) => {
              const invalidKeys = ["e", "E", ".", "+", "-", " "];
              if (invalidKeys.includes(e.key)) {
                e.preventDefault();
              }
            }}
            placeholder="Phone Number"
            type="text"
            maxLength={10}
            inputMode="numeric"
            pattern="\d*"
            className={errors.phoneNumber ? "border-red-500" : ""}
          />
          {errors.phoneNumber && (
            <p className="text-sm text-red-500">{errors.phoneNumber}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="industry">
          Industry <span className="text-red-500">*</span>
        </Label>
        <Select value={industry} onValueChange={setIndustry}>
          <SelectTrigger
            id="industry"
            className={errors.industry ? "border-red-500 w-full" : "w-full"}
          >
            <SelectValue placeholder="Select industry" />
          </SelectTrigger>
          <SelectContent>
            {sortedIndustries.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.industry && (
          <p className="text-sm text-red-500">{errors.industry}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="companySize">Company Size</Label>
        <Select value={companySize} onValueChange={setcompanySize}>
          <SelectTrigger
            id="companySize"
            className={errors.companySize ? "border-red-500 w-full" : "w-full"}
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
        {errors.companySize && (
          <p className="text-sm text-red-500">{errors.companySize}</p>
        )}
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={handleSubmit} disabled={!canContinue}>
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
