import { useCallback } from "react";

// useNavigate is the custom hook itself.
export function useNavigate() {
  // useCallback is called at the top level of this custom hook.
  const navigateCallback = useCallback((path: string) => {
    window.location.href = path;
  }, []); // Dependency array for useCallback is empty, so navigateCallback is stable.
  return navigateCallback;
}
