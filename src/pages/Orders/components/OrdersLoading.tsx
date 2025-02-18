import { Table, TableBody, TableHeader } from "@/components/ui/table";
import OrdersSkeleton from "./OrdersSkeleton";

const OrdersLoading = () => {
  return (
    <div className="container mx-auto py-8 mt-16">
      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader></TableHeader>
            <TableBody>
              <OrdersSkeleton />
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default OrdersLoading;
