import { Settings, AlignHorizontalDistributeCenter, List } from "lucide-react";
import { Button } from "../ui/button";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

interface SwapHeaderProps {
  activeTab: "swap" | "limit";
  setActiveTab: (value: "swap" | "limit") => void;
  onSettingsClick: () => void;
}

const SwapHeader = ({
  activeTab,
  setActiveTab,
  onSettingsClick,
}: SwapHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <TabsList className="w-full grid grid-cols-2">
        <TabsTrigger value="swap" className="flex items-center gap-2">
          <AlignHorizontalDistributeCenter className="h-4 w-4" />
          Swap
        </TabsTrigger>
        <TabsTrigger value="limit" className="flex items-center gap-2">
          <List className="h-4 w-4" />
          Limit Order
        </TabsTrigger>
      </TabsList>
      {activeTab === "swap" && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 ml-2"
          onClick={onSettingsClick}
        >
          <Settings className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default SwapHeader;
