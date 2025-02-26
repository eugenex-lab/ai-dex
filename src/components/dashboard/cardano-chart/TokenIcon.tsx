
import { DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

interface TokenIconProps {
  ticker: string;
  unit?: string;
  className?: string;
}

export const TokenIcon = ({ ticker, unit, className }: TokenIconProps) => {
  const { data: iconUrl } = useQuery({
    queryKey: ['tokenIcon', unit],
    queryFn: () => unit ? api.getTokenIcon(unit) : null,
    enabled: !!unit,
  });

  return (
    <div className={cn("h-6 w-6 rounded-full bg-accent flex items-center justify-center overflow-hidden", className)}>
      {iconUrl ? (
        <img
          src={iconUrl}
          alt={`${ticker} icon`}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.removeAttribute('style');
          }}
        />
      ) : (
        <DollarSign className="h-4 w-4" />
      )}
    </div>
  );
};
