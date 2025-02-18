import { Table, TableBody, TableHeader } from "@/components/ui/table";
import OrdersSkeleton from "./OrdersSkeleton";

const OrdersLoading = () => {
  return (
    <div className="w-full mx-auto ">
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
