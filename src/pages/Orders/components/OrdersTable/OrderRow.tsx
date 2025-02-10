
import { TableCell, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { type Order } from "../../hooks/useOrders";
import OrderStatus from "./OrderStatus";
import OrderType from "./OrderType";

type OrderRowProps = {
  order: Order;
};

const OrderRow = ({ order }: OrderRowProps) => {
  return (
    <TableRow>
      <TableCell className="font-mono">{order.id.slice(0, 8)}</TableCell>
      <TableCell>{format(new Date(order.created_at), "MMM d, yyyy HH:mm")}</TableCell>
      <TableCell>{order.pair}</TableCell>
      <TableCell><OrderType orderType={order.order_type} /></TableCell>
      <TableCell>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            order.side === "buy"
              ? "bg-success/10 text-success"
              : "bg-warning/10 text-warning"
          }`}
        >
          {order.side}
        </span>
      </TableCell>
      <TableCell className="text-right">${order.price.toFixed(2)}</TableCell>
      <TableCell className="text-right">{order.amount.toFixed(8)}</TableCell>
      <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
      <TableCell><OrderStatus status={order.status} /></TableCell>
    </TableRow>
  );
};

export default OrderRow;
