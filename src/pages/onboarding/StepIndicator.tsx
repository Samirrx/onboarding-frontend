import { CheckIcon } from "lucide-react"

interface Step {
  id: number
  name: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="mb-10">
      {/* Desktop progress bar */}
      <div className="hidden sm:block">
        <div className="relative">
          {/* Progress line */}
          <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200">
            <div
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 ease-in-out"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className="flex items-center justify-center mb-2">
                  {step.id < currentStep ? (
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center z-10">
                      <CheckIcon className="h-5 w-5 text-white" />
                    </div>
                  ) : step.id === currentStep ? (
                    <div className="w-10 h-10 rounded-full border-2 border-primary bg-white flex items-center justify-center z-10">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center z-10">
                      <div className="w-3 h-3 rounded-full bg-transparent" />
                    </div>
                  )}
                </div>
                <span className={`text-sm font-medium ${step.id <= currentStep ? "text-primary" : "text-gray-500"}`}>
                  {step.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile progress indicator */}
      <div className="sm:hidden text-center">
        <div className="flex items-center justify-center gap-1 mb-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`h-1.5 rounded-full transition-all ${
                step.id < currentStep
                  ? "w-8 bg-primary"
                  : step.id === currentStep
                    ? "w-8 bg-primary"
                    : "w-4 bg-gray-200"
              }`}
            />
          ))}
        </div>
        <p className="text-sm font-medium text-gray-500">
          Step {currentStep} of {steps.length}
        </p>
        <h3 className="text-lg font-medium leading-6 text-gray-900 mt-1">
          {steps.find((step) => step.id === currentStep)?.name}
        </h3>
      </div>
    </div>
  )
}
