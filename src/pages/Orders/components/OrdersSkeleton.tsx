import { TableCell, TableRow } from "@/components/ui/table";

const OrdersSkeleton = () => {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <TableRow key={i}>
          {[...Array(9)].map((_, j) => (
            <TableCell key={j}>
              <div className="h-4 bg-secondary/20 rounded animate-pulse" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

export default OrdersSkeleton;
