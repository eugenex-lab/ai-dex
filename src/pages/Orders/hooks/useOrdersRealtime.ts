
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { type Order } from "./useOrders";

type UseOrdersRealtimeProps = {
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
};

export const useOrdersRealtime = ({ setOrders }: UseOrdersRealtimeProps) => {
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
  }, [setOrders]);
};
