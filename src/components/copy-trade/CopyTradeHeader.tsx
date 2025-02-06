
import { Copy } from "lucide-react";

const CopyTradeHeader = () => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
        <Copy className="h-8 w-8" />
        Copy Trade Setup
      </h1>
      <p className="text-lg text-muted-foreground">
        Set up and manage your copy trading strategy with ease
      </p>
    </div>
  );
};

export default CopyTradeHeader;
