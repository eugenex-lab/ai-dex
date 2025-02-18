import { useState, useEffect } from "react";
import { useOrders, type Order } from "./Orders/hooks/useOrders";
import { useOrdersRealtime } from "./Orders/hooks/useOrdersRealtime";
import OrdersTable from "./Orders/components/OrdersTable/OrdersTable";
import OrdersLoading from "./Orders/components/OrdersLoading";
import OrdersError from "./Orders/components/OrdersError";
import { PortfolioSection } from "@/components/orders/PortfolioSection";

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const {
    data: initialOrders,
    isLoading: ordersLoading,
    error: ordersError,
  } = useOrders();

  useEffect(() => {
    if (initialOrders) {
      setOrders(initialOrders);
    }
  }, [initialOrders]);

  useOrdersRealtime({ setOrders });

  return (
    <div className="mx-auto py-8 space-y-8 pt-16 md:pt-20 pb-8">
      <h1 className="text-3xl font-bold">Orders</h1>
      <OrdersTable orders={orders} isLoading={ordersLoading} />
      <div className="mt-16 space-y-8">
        <h2 className="text-2xl font-bold">Your Staking Pools</h2>
        {/* Pass the preloaded portfolio data to the component */}
        <PortfolioSection />
      </div>
    </div>
  );
};

export default Orders;
