
import { Copy } from "lucide-react";

const CopyTradeHeader = () => {
  return (
    <div className="text-center mb-12">
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
          <Copy className="h-8 w-8" />
          Copy Trade Setup
        </h1>
        <p className="text-lg text-muted-foreground">
          Set up and manage your copy trading strategy with ease
        </p>
        <span 
          className="bg-[#FF0000] text-white rounded-full text-xs font-bold px-6 py-2 uppercase border-2 border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]"
        >
          Coming Soon
        </span>
      </div>
    </div>
  );
};

export default CopyTradeHeader;
