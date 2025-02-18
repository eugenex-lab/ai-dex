import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, Clock, DollarSign, Hash, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Order } from "../../hooks/useOrders";
import OrderRow from "./OrderRow";
import OrdersLoading from "../OrdersLoading"; // adjust the path as needed

type OrdersTableProps = {
  orders: Order[];
  isLoading: boolean;
};

const OrdersTable = ({ orders, isLoading }: OrdersTableProps) => {
  return (
    <div>
      {isLoading ? (
        <OrdersLoading />
      ) : orders?.length > 0 ? (
        <div className="rounded-lg border bg-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">
                    <Button variant="ghost" className="h-8 p-0">
                      <Hash className="mr-2 h-4 w-4" />
                      ID
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="h-8 p-0">
                      <Clock className="mr-2 h-4 w-4" />
                      Date
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Pair</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Side</TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" className="h-8 p-0">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Price
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" className="h-8 p-0">
                      <Percent className="mr-2 h-4 w-4" />
                      Amount
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <OrderRow key={order.id} order={order} />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <TableRow>
          <TableCell colSpan={9} className="text-center text-muted-foreground">
            No orders found
          </TableCell>
        </TableRow>
      )}
    </div>
  );
};

export default OrdersTable;
