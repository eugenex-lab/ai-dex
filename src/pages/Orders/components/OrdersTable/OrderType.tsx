
import { cn } from "@/lib/utils";

type OrderTypeProps = {
  orderType: 'trade' | 'copy_trade' | 'arbitrage' | 'limit' | 'market';
};

const OrderType = ({ orderType }: OrderTypeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        {
          "bg-primary/10 text-primary": orderType === "trade",
          "bg-secondary/10 text-secondary": orderType === "copy_trade",
          "bg-accent/10 text-accent": orderType === "arbitrage",
          "bg-blue-500/10 text-blue-500": orderType === "limit",
          "bg-green-500/10 text-green-500": orderType === "market",
        }
      )}
    >
      {orderType.replace('_', ' ')}
    </span>
  );
};

export default OrderType;
