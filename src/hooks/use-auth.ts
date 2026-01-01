import { useAuthContext } from "@/components/providers/auth-provider";

// Re-export using the context for backward compatibility
export function useAuth() {
  return useAuthContext();
}