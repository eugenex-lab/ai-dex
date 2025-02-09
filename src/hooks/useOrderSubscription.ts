
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { type Order } from '@/pages/Orders/hooks/useOrders';

export const useOrderSubscription = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Fetch initial orders
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: 'Error fetching orders',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      setOrders(data as Order[]);
    };

    fetchOrders();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setOrders((prev) => [payload.new as Order, ...prev]);
            toast({
              title: 'New Order',
              description: `Order ${payload.new.id.slice(0, 8)} created`,
            });
          } else if (payload.eventType === 'UPDATE') {
            setOrders((prev) =>
              prev.map((order) =>
                order.id === payload.new.id ? { ...order, ...payload.new } : order
              )
            );
            toast({
              title: 'Order Updated',
              description: `Order ${payload.new.id.slice(0, 8)} ${payload.new.status}`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { orders };
};
