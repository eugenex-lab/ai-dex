import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StakingPool } from "./types";

interface StakingCardProps {
  option: StakingPool;
}

export const StakingCard = ({ option }: StakingCardProps) => {
  const [selectedDays, setSelectedDays] = useState("30");
  const [dialogOpen, setDialogOpen] = useState(false);

  const selectedPeriod = option.lock_periods?.find(
    (period) => period.days === Number(selectedDays)
  );

  const getTokenIcon = (tokenName: string, defaultLogo: string) => {
    return defaultLogo;
  };

  const rewardTokenIcon = getTokenIcon(option.reward_token_name, option.logo_url);

  return (
    <div className="bg-secondary/20 backdrop-blur-lg rounded-lg p-6 flex flex-col space-y-6 animate-fade-in">
      {/* Token Info Section */}
      <div className="flex items-center">
        <div className="relative">
          <img 
            src={rewardTokenIcon} 
            alt={option.reward_token_name} 
            className="w-12 h-12 rounded-full" 
          />
        </div>
        <span className="text-lg font-medium ml-4">
          {`Stake ${option.token_name} Earn ${option.reward_token_name}`}
        </span>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-black/20">
          <div className="text-sm text-muted-foreground mb-1">Reward Tokens Available</div>
          <div className="font-medium">{option.total_reward_pool.toLocaleString()}</div>
        </div>

        <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-black/20">
          <div className="text-sm text-muted-foreground mb-1">APR</div>
          <div className="font-medium">{selectedPeriod?.apr ?? 0}%</div>
        </div>

        <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-black/20">
          <div className="text-sm text-muted-foreground mb-1">Total Stakers</div>
          <div className="font-medium">{option.total_stakers}/{option.max_stakers}</div>
        </div>

        <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-black/20">
          <div className="text-sm text-muted-foreground mb-1">Claim Frequency</div>
          <div className="font-medium">{option.claim_frequency} days</div>
        </div>
      </div>

      {/* Actions Section */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-2">
        <Select value={selectedDays} onValueChange={setSelectedDays}>
          <SelectTrigger className="w-full sm:w-[180px] bg-background/50 border-input">
            <SelectValue placeholder="Lock period" />
          </SelectTrigger>
          <SelectContent className="bg-background border-2 border-input">
            {option.lock_periods?.map((period) => (
              <SelectItem 
                key={period.days} 
                value={period.days.toString()}
                className="hover:bg-accent focus:bg-accent"
              >
                {period.days} days
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button 
          onClick={() => setDialogOpen(true)}
          className="w-full sm:w-[120px] h-10"
          disabled={!option.is_deployment_live}
        >
          Stake
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md bg-background">
          <DialogHeader>
            <DialogTitle>Stake {option.token_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-between items-center">
              <span>Lock Time</span>
              <span>{selectedDays} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span>APR</span>
              <span className="text-green-500">{selectedPeriod?.apr ?? 0}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Earn</span>
              <span>{option.reward_token_name}</span>
            </div>
            <Button className="w-full" onClick={() => setDialogOpen(false)}>
              Connect Wallet
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
