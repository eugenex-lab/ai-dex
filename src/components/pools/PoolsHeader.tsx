import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface PoolsHeaderProps {
  onCreatePool: () => void;
}

export const PoolsHeader = ({ onCreatePool }: PoolsHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-4xl font-bold">Pools</h1>
      <Button 
        onClick={onCreatePool}
        className="bg-primary hover:bg-primary/90"
      >
        <Plus className="mr-2 h-4 w-4" />
        Create Pool
      </Button>
    </div>
  );
};