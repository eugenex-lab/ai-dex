
import { cn } from "@/lib/utils";

type OrderStatusProps = {
  status: "open" | "filled" | "cancelled";
};

const OrderStatus = ({ status }: OrderStatusProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        {
          "bg-success/10 text-success": status === "filled",
          "bg-warning/10 text-warning": status === "cancelled",
          "bg-muted/10 text-muted-foreground": status === "open",
        }
      )}
    >
      {status}
    </span>
  );
};

export default OrderStatus;
