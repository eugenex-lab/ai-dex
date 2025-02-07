
import { useState, useEffect } from "react";
import { useOrders, type Order } from "./Orders/hooks/useOrders";
import { useOrdersRealtime } from "./Orders/hooks/useOrdersRealtime";
import OrdersTable from "./Orders/components/OrdersTable/OrdersTable";
import OrdersLoading from "./Orders/components/OrdersLoading";
import OrdersError from "./Orders/components/OrdersError";

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { data: initialOrders, isLoading, error } = useOrders();

  useEffect(() => {
    if (initialOrders) {
      setOrders(initialOrders);
    }
  }, [initialOrders]);

  useOrdersRealtime({ setOrders });

  if (isLoading) {
    return <OrdersLoading />;
  }

  if (error) {
    return <OrdersError />;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <OrdersTable orders={orders} />
    </div>
  );
};

export default Orders;
