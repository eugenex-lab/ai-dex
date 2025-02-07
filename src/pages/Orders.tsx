import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableHeader } from "@/components/ui/table";
import { toast } from "sonner";
import OrdersTable from "./Orders/components/OrdersTable/OrdersTable";
import OrdersSkeleton from "./Orders/components/OrdersSkeleton";
import { useOrders, type Order } from "./Orders/hooks/useOrders";

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { data: initialOrders, isLoading, error } = useOrders();

  useEffect(() => {
    if (initialOrders) {
      setOrders(initialOrders);
    }
  }, [initialOrders]);

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          
          if (payload.eventType === 'INSERT') {
            setOrders(prev => [payload.new as Order, ...prev]);
            toast.success('New order placed');
          } else if (payload.eventType === 'UPDATE') {
            setOrders(prev => 
              prev.map(order => 
                order.id === payload.new.id ? { ...order, ...payload.new } : order
              )
            );
            toast.info(`Order ${payload.new.id.slice(0, 8)} updated`);
          } else if (payload.eventType === 'DELETE') {
            setOrders(prev => prev.filter(order => order.id !== payload.old.id));
            toast.info('Order removed');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="rounded-lg border bg-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
              </TableHeader>
              <TableBody>
                <OrdersSkeleton />
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="text-warning text-center">
          Error loading orders. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <OrdersTable orders={orders} />
    </div>
  );
};

export default Orders;
