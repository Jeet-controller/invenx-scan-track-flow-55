
import { useToast as useHookToast, toast as hookToast } from "@/hooks/use-toast";

// Re-export the hook
export const useToast = useHookToast;
export const toast = hookToast;
