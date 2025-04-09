
import { Wifi, WifiOff, Upload } from "lucide-react";
import { useInventory } from "../contexts/InventoryContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function OfflineIndicator() {
  const { syncStatus } = useInventory();
  const { isOnline, hasPendingChanges } = syncStatus;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center">
            {isOnline ? (
              hasPendingChanges ? (
                <Upload size={16} className="text-yellow-500" />
              ) : (
                <Wifi size={16} className="text-green-500" />
              )
            ) : (
              <WifiOff size={16} className="text-red-500" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {isOnline 
            ? (hasPendingChanges 
              ? "Online - Syncing changes" 
              : "Online - All changes synced")
            : "Offline - Changes saved locally"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
