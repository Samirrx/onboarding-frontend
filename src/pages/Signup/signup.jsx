import React, { useState } from "react";
import { Check, ChevronRight, ArrowLeft, Eye, EyeOff } from "lucide-react";

import {
  createTenantAccount,
  verifyAuthToken,
} from "@/services/controllers/signup";

export default function Signup() {
  // --- STATE MANAGEMENT ---
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    company: "",
    phone: "",
    agreedToTerms: false,
  });

  const [selectedModules, setSelectedModules] = useState([]);
  const [errors, setErrors] = useState({});

  // Loading Screen States
  const [loadingStep, setLoadingStep] = useState(0);

  // --- DATA ---
  const availableModules = [
    {
      id: "crm",
      name: "CRM",
      description: "Customer Relationship Management",
    },
    {
      id: "Asset Management",
      name: "Asset Management",
      description:
        "Track, manage, and maintain physical and digital assets across their lifecycle.",
    },
    {
      id: "FSM",
      name: "FSM",
      description:
        "Efficiently manage field teams, job assignments, and on-site service tasks.",
    },
    {
      id: "Attendance Management",
      name: "Attendance Management",
      description:
        "Track employee check-ins, working hours, leaves, and absences in real time.",
    },
    {
      id: "HRMS",
      name: "HRMS",
      description:
        "Managing employee data, tracking performance, and automating.",
    },
  ];

  // --- HELPERS ---
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Min 8 characters required";
    if (!formData.phone) newErrors.phone = "Phone number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const toggleModule = (moduleName) => {
    setSelectedModules((prev) => {
      if (prev.includes(moduleName)) {
        return prev.filter((m) => m !== moduleName);
      } else {
        return [...prev, moduleName];
      }
    });
  };

  const splitFullName = (name) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return { firstName: parts[0], lastName: "" };
    return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
  };

  // --- ACTIONS ---
  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleFinalSignup = async () => {
    if (!formData.agreedToTerms) {
      setErrors({ agreedToTerms: "You must agree to the terms." });
      return;
    }

    setIsLoading(true);
    setLoadingStep(1); // Creating Account

    try {
      const { firstName, lastName } = splitFullName(formData.fullName);

      // Constructing the payload
      const tenantDetails = {
        firstName,
        lastName,
        email: formData.email,
        password: formData.password,
        phoneNumber: `+91${formData.phone}`,
        companyName: formData.company || "Default Company",
        companyAddress: "",
        industry: "",
        companySize: "",
        modules: selectedModules,
        environment: "app",
        teamMembers: formData.email,
        instanceType: "STANDARD",
      };

      const formDataPayload = new FormData();
      formDataPayload.append("tenantDtl", JSON.stringify(tenantDetails));

      console.log("🚀 Payload:", tenantDetails);

      // ========== API CALL: Create Tenant Account ==========
      const data = await createTenantAccount(formDataPayload);

      console.log("📥 API Response:", data);

      // Check if signup was successful
      if (data && data.result) {
        setLoadingStep(2); // Setting up workspace
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        setLoadingStep(3); // Finalizing
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const tenantId = data.result.tenantId;

        console.log("✅ Signup successful, redirecting to login...");
        
        setLoadingStep(4); // Success
        
        // Navigate to login with credentials in URL
        setTimeout(() => {
          window.location.href = `https://app.dglide.com/login?user=${encodeURIComponent(
            formData.email
          )}&tenant=${encodeURIComponent(tenantId)}&pass=${encodeURIComponent(
            formData.password
          )}`;
        }, 1500);
      } else {
        console.error("❌ Signup failed:", data);
        setLoadingStep(0);
        setIsLoading(false);
        setErrors({
          form: data?.message || "Signup failed. Please try again.",
        });
      }
    } catch (error) {
      console.error("❌ Signup error:", error);
      setLoadingStep(0);
      setIsLoading(false);
      setErrors({
        form: "Network error. Please check your connection and try again.",
      });
    }
  };

  // --- RENDER HELPERS ---
  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-100 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-red-600 rounded-full absolute top-0 left-0 animate-spin border-t-transparent"></div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-center text-gray-900 mb-6">
          {loadingStep === 4 ? "Success!" : "Building your HQ"}
        </h3>

        <div className="space-y-4">
          <LoadingStepItem
            status={
              loadingStep > 1
                ? "completed"
                : loadingStep === 1
                ? "current"
                : "pending"
            }
            text="Creating account"
          />
          <LoadingStepItem
            status={
              loadingStep > 2
                ? "completed"
                : loadingStep === 2
                ? "current"
                : "pending"
            }
            text="Configuring modules"
          />
          <LoadingStepItem
            status={
              loadingStep > 3
                ? "completed"
                : loadingStep === 3
                ? "current"
                : "pending"
            }
            text="Finalizing workspace"
          />
        </div>
      </div>
    </div>
  );

  const LoadingStepItem = ({ status, text }) => (
    <div
      className={`flex items-center gap-3 transition-colors duration-300 ${
        status === "pending" ? "opacity-40" : "opacity-100"
      }`}
    >
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center border-2 
        ${
          status === "completed"
            ? "bg-green-500 border-green-500"
            : status === "current"
            ? "border-red-600 text-red-600"
            : "border-gray-300"
        }`}
      >
        {status === "completed" && <Check className="w-3.5 h-3.5 text-white" />}
        {status === "current" && (
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
        )}
      </div>
      <span
        className={`text-sm font-medium ${
          status === "current" ? "text-gray-900" : "text-gray-600"
        }`}
      >
        {text}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans text-gray-800">
      {isLoading && <LoadingOverlay />}

      {/* LEFT SIDE - BRANDING */}
      <div className="hidden lg:flex w-5/12 bg-slate-900 relative flex-col justify-between p-12 overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-red-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-white font-bold text-2xl tracking-tight">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center">
              <span className="text-lg">D</span>
            </div>
            Dglide
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <blockquote className="space-y-4">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm mb-4">
              <span className="text-2xl">❝</span>
            </div>
            <p className="text-xl text-gray-200 leading-relaxed font-light">
              "Dglide has made it extremely simple for us to manage customers,
              track interactions, and automate workflows. The system is fast,
              modern, and reliable."
            </p>
          </blockquote>
        </div>

        <div className="text-xs text-gray-500 relative z-10">
          © 2024 Dglide Inc. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="w-full p-6 flex justify-between items-center z-20 bg-white/50 backdrop-blur-md sticky top-0">
          <div className="lg:hidden font-bold text-xl flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-md text-white flex items-center justify-center">
              D
            </div>
          </div>
          <div className="ml-auto text-sm font-medium">
            Already have an account?{" "}
            <a
              href="https://app.dglide.com/login"
              className="text-red-600 hover:text-red-700 hover:underline"
            >
              Sign in
            </a>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-6 py-12 lg:py-16">
            {/* Progress Stepper */}
            <div className="mb-10 flex items-center gap-3 text-sm font-medium">
              <span
                className={`flex items-center gap-2 ${
                  step === 1 ? "text-slate-900" : "text-green-600"
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border 
                  ${
                    step === 1
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-green-100 text-green-700 border-green-200"
                  }`}
                >
                  {step > 1 ? <Check className="w-3 h-3" /> : "1"}
                </span>
                Details
              </span>
              <div className="w-8 h-px bg-gray-200"></div>
              <span
                className={`flex items-center gap-2 ${
                  step === 2 ? "text-slate-900" : "text-gray-400"
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border transition-colors
                   ${
                     step === 2
                       ? "bg-slate-900 text-white border-slate-900"
                       : "bg-white border-gray-200"
                   }`}
                >
                  2
                </span>
                Workspace
              </span>
            </div>

            <div className="space-y-2 mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                {step === 1
                  ? "Get started with your 15-day free trial"
                  : "Customize your experience"}
              </h1>
            </div>

            {/* Error Banner */}
            {errors.form && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                {errors.form}
              </div>
            )}

            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              {/* STEP 1 FORM */}
              {step === 1 && (
                <div className="space-y-5 animate-in slide-in-from-right-8 fade-in duration-300">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Full Name
                    </label>
                    <input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-offset-1 transition-all outline-none
                        ${
                          errors.fullName
                            ? "border-red-300 focus:ring-red-200 bg-red-50"
                            : "border-gray-200 focus:border-red-500 focus:ring-red-100"
                        }`}
                      placeholder="e.g. John Doe"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Work Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-offset-1 transition-all outline-none
                        ${
                          errors.email
                            ? "border-red-300 focus:ring-red-200 bg-red-50"
                            : "border-gray-200 focus:border-red-500 focus:ring-red-100"
                        }`}
                      placeholder="john@company.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="relative">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-offset-1 transition-all outline-none pr-10
                            ${
                              errors.password
                                ? "border-red-300 focus:ring-red-200 bg-red-50"
                                : "border-gray-200 focus:border-red-500 focus:ring-red-100"
                            }`}
                          placeholder="8+ characters"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Phone
                      </label>
                      <div className="flex">
                        <span className="flex items-center justify-center px-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg text-gray-500 font-medium text-sm">
                          +91
                        </span>
                        <input
                          name="phone"
                          value={formData.phone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            handleInputChange({
                              target: { name: "phone", value: val },
                            });
                          }}
                          className={`w-full px-4 py-3 bg-gray-50 border rounded-r-lg focus:ring-2 focus:ring-offset-1 transition-all outline-none
                            ${
                              errors.phone
                                ? "border-red-300 focus:ring-red-200 bg-red-50"
                                : "border-gray-200 focus:border-red-500 focus:ring-red-100"
                            }`}
                          placeholder="98765 43210"
                          maxLength={10}
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Company Name
                    </label>
                    <input
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 focus:ring-offset-1 transition-all outline-none"
                      placeholder="Your Company Name"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="w-full bg-slate-900 text-white font-bold text-lg py-4 rounded-xl hover:bg-slate-800 transform transition-all active:scale-[0.99] shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                    >
                      Next Step
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Social Login */}
                  <div className="mt-8">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">
                          Or continue with
                        </span>
                      </div>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm text-gray-700">
                        <img
                          src="https://www.svgrepo.com/show/475656/google-color.svg"
                          className="w-5 h-5"
                          alt="Google"
                        />
                        Google
                      </button>
                      <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm text-gray-700">
                        <img
                          src="https://www.svgrepo.com/show/448234/linkedin.svg"
                          className="w-5 h-5"
                          alt="LinkedIn"
                        />
                        LinkedIn
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 MODULES */}
              {step === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableModules.map((module) => {
                      const isSelected = selectedModules.includes(module.name);
                      return (
                        <div
                          key={module.id}
                          onClick={() => toggleModule(module.name)}
                          className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 group
                            ${
                              isSelected
                                ? "border-red-600 bg-red-50/50 shadow-sm"
                                : "border-gray-200 bg-white hover:border-red-300 hover:shadow-md"
                            }`}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`p-2 rounded-lg ${
                                isSelected
                                  ? "bg-white"
                                  : "bg-gray-50 group-hover:bg-white transition-colors"
                              }`}
                            >
                              {module.icon}
                            </div>
                            <div className="flex-1">
                              <h3
                                className={`font-bold text-base ${
                                  isSelected ? "text-red-900" : "text-gray-900"
                                }`}
                              >
                                {module.name}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1 leading-snug">
                                {module.description}
                              </p>
                            </div>
                            <div
                              className={`w-5 h-5 rounded border flex items-center justify-center transition-colors
                              ${
                                isSelected
                                  ? "bg-red-600 border-red-600"
                                  : "border-gray-300 bg-white"
                              }`}
                            >
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-white" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.agreedToTerms}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              agreedToTerms: e.target.checked,
                            }));
                            setErrors((prev) => ({
                              ...prev,
                              agreedToTerms: "",
                            }));
                          }}
                          className="w-5 h-5 border-gray-300 rounded text-red-600 focus:ring-red-500 mt-0.5"
                        />
                      </div>
                      <div className="text-sm text-gray-600">
                        I agree to the{" "}
                        <span className="text-slate-900 font-semibold underline decoration-dotted cursor-pointer hover:text-red-600">
                          Terms of Service
                        </span>{" "}
                        and{" "}
                        <span className="text-slate-900 font-semibold underline decoration-dotted cursor-pointer hover:text-red-600">
                          Privacy Policy
                        </span>
                        .
                      </div>
                    </label>
                    {errors.agreedToTerms && (
                      <p className="text-xs text-red-600 mt-2 ml-8 font-medium">
                        {errors.agreedToTerms}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 py-4 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      type="button"
                      onClick={handleFinalSignup}
                      className="flex-1 bg-red-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-red-700 transform transition-all active:scale-[0.99] shadow-lg hover:shadow-xl hover:shadow-red-200"
                    >
                      Create Workspace
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
