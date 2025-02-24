import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface TokenIconProps {
  ticker: string;
  unit?: string;
  className?: string;
}

export const TokenIcon = ({ ticker, unit, className }: TokenIconProps) => {
  const {
    data: iconUrl,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tokenIcon", unit],
    queryFn: () => (unit ? api.getTokenIcon(unit) : null),
    enabled: !!unit,
  });

  return (
    <div
      className={cn(
        "h-6 w-6 rounded-full flex items-center justify-center overflow-hidden bg-accent",
        className
      )}
    >
      {/* ✅ Show loading state while fetching */}
      {isLoading ? (
        <div className="h-full w-full animate-pulse bg-muted"></div>
      ) : iconUrl && !isError ? (
        <img
          src={iconUrl}
          alt={`${ticker} icon`}
          className="h-full w-full object-cover"
          onError={(e) => {
            console.warn(`Icon failed to load for ${ticker}:`, iconUrl);
            e.currentTarget.src = ""; // Prevents infinite loading
          }}
        />
      ) : (
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      )}
    </div>
  );
};
