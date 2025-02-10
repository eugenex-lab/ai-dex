
import { useOrderSubscription } from "@/hooks/useOrderSubscription";
import OrdersTable from "./Orders/components/OrdersTable/OrdersTable";
import OrdersLoading from "./Orders/components/OrdersLoading";
import OrdersError from "./Orders/components/OrdersError";

const Orders = () => {
  const { orders } = useOrderSubscription();

  if (!orders) {
    return <OrdersLoading />;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <OrdersTable orders={orders} />
    </div>
  );
};

export default Orders;
