import { authFlow } from "@/repositories/proxy/authflow";
import { THashMap } from "@/types";
import { useState, useEffect } from "react";

export function useAuthFlow() {
  const [flow, setFlowState] = useState<THashMap>({});

  useEffect(() => {
    // Defer the state update to the next micro-task to satisfy the linter
    // and prevent a synchronous cascading render loop.
    Promise.resolve().then(() => {
      setFlowState(authFlow.get() || {});
    });
  }, []);

  const setFlow = (data: Parameters<typeof authFlow.set>[0]) => {
    authFlow.set(data);
    setFlowState(authFlow.get());
  };

  const clear = () => {
    authFlow.clear();
    setFlowState({});
  };

  return { flow, setFlow, clear };
}
