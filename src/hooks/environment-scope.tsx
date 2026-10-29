import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { fetchCreationPolicy } from "@/services/controllers/onboarding";

type Scope = { currentEnvironmentOnly: boolean; environment: string };
const EnvironmentScope = createContext<Scope | null>(null);

/** One policy request per protected route session; children never load a default environment first. */
export function EnvironmentScopeProvider({ children }: { children: ReactNode }) {
  const [scope, setScope] = useState<Scope | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let cancelled = false;
    setError("");
    fetchCreationPolicy().then((response) => {
      if (cancelled) return;
      const policy = response?.result;
      if (!response?.status || typeof policy?.currentEnvironmentOnly !== "boolean" ||
          (policy.currentEnvironmentOnly && !["dev", "demo", "preprod", "app"].includes(policy.environment))) {
        throw new Error(response?.message || "Unable to load environment settings.");
      }
      setScope(policy);
    }).catch((reason) => {
      if (!cancelled) setError(reason?.message || "Unable to load environment settings.");
    });
    return () => { cancelled = true; };
  }, [attempt]);
  if (!scope) return <div className="p-6 space-y-3" role="status">
    <p>{error || "Loading environment settings..."}</p>
    {error && <Button onClick={() => setAttempt((value) => value + 1)}>Retry</Button>}
  </div>;
  return <EnvironmentScope.Provider value={scope}>{children}</EnvironmentScope.Provider>;
}

export function useEnvironmentScope() {
  const scope = useContext(EnvironmentScope);
  if (!scope) throw new Error("Environment scope is unavailable");
  return scope;
}

export function useScopedEnvironment(initial: string) {
  const scope = useEnvironmentScope();
  const [selected, setSelected] = useState(initial);
  const environment = scope.currentEnvironmentOnly ? scope.environment : selected;
  const setEnvironment = (value: string) => {
    if (!scope.currentEnvironmentOnly) setSelected(value);
  };
  return [environment, setEnvironment, scope.currentEnvironmentOnly] as const;
}
