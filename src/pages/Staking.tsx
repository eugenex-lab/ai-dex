import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface StakingOption {
  id: string;
  title: string;
  stake: string;
  earn: string;
  tvl: string;
  icon: string;
  lockPeriods: {
    days: number;
    apr: number;
  }[];
}

const stakingOptions: StakingOption[] = [
  {
    id: "botly-botly",
    title: "Stake BOTLY Earn BOTLY",
    stake: "BOTLY",
    earn: "BOTLY",
    tvl: "$5.2M",
    icon: "/lovable-uploads/8ed67d82-31cd-4c3d-bbcf-986392a08e1c.png",
    lockPeriods: [
      { days: 30, apr: 3 },
      { days: 60, apr: 5 },
      { days: 90, apr: 7 },
      { days: 120, apr: 9 },
      { days: 180, apr: 12 },
      { days: 365, apr: 14.5 },
    ],
  },
  {
    id: "botly-ada",
    title: "Stake BOTLY Earn ADA",
    stake: "BOTLY",
    earn: "ADA",
    tvl: "$3.1M",
    icon: "/lovable-uploads/76d13a0a-84e4-4648-a383-ae586be0e16b.png",
    lockPeriods: [
      { days: 30, apr: 1.3 },
      { days: 60, apr: 2.59 },
      { days: 90, apr: 2.99 },
      { days: 120, apr: 3.9 },
      { days: 180, apr: 5.2 },
      { days: 365, apr: 6.5 },
    ],
  },
  {
    id: "botly-snek",
    title: "Stake BOTLY Earn SNEK",
    stake: "BOTLY",
    earn: "SNEK",
    tvl: "$2.8M",
    icon: "/lovable-uploads/3e5a23f1-0e01-49cb-86b5-d06452933afc.png",
    lockPeriods: [
      { days: 30, apr: 2.1 },
      { days: 60, apr: 2.9 },
      { days: 90, apr: 3.3 },
      { days: 120, apr: 3.9 },
      { days: 180, apr: 4.4 },
      { days: 365, apr: 4.9 },
    ],
  },
  {
    id: "cock-cock",
    title: "Stake COCK Earn COCK",
    stake: "COCK",
    earn: "COCK",
    tvl: "$1.5M",
    icon: "/lovable-uploads/c543bc8f-8c9f-4f67-8fa9-bedd95a77f33.png",
    lockPeriods: [
      { days: 30, apr: 15 },
      { days: 60, apr: 20 },
      { days: 90, apr: 19 },
      { days: 120, apr: 22 },
      { days: 180, apr: 25 },
      { days: 365, apr: 30 },
    ],
  },
];

const StakingCard = ({ option }: { option: StakingOption }) => {
  const [selectedDays, setSelectedDays] = useState("30");
  const [dialogOpen, setDialogOpen] = useState(false);

  const selectedPeriod = option.lockPeriods.find(
    (period) => period.days === Number(selectedDays)
  );

  return (
    <div className="bg-secondary/20 backdrop-blur-lg rounded-lg p-4 md:p-6 flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 animate-fade-in">
      <div className="flex items-center space-x-4 md:w-[300px] shrink-0">
        <img
          src={option.icon}
          alt={option.title}
          className="w-10 h-10 md:w-12 md:h-12"
        />
        <span className="text-base md:text-lg font-medium">{option.title}</span>
      </div>

      <div className="flex flex-wrap gap-4 md:flex-row md:items-center md:justify-between w-full">
        <div className="grid grid-cols-3 md:flex md:items-center gap-8 md:gap-16">
          <div className="text-center">
            <div className="text-xs md:text-sm text-muted-foreground">TVL</div>
            <div className="font-medium">{option.tvl}</div>
          </div>

          <div className="text-center">
            <div className="text-xs md:text-sm text-muted-foreground">APR</div>
            <div className="font-medium">{selectedPeriod?.apr}%</div>
          </div>

          <div className="text-center">
            <div className="text-xs md:text-sm text-muted-foreground">
              Rewards
            </div>
            <div className="font-medium">{option.earn}</div>
          </div>
        </div>

        <div className="flex items-center space-x-4 w-full md:w-auto md:ml-auto">
          <Select value={selectedDays} onValueChange={setSelectedDays}>
            <SelectTrigger className="w-full md:w-[180px] bg-background border-input">
              <SelectValue placeholder="Lock period" />
            </SelectTrigger>
            <SelectContent className="bg-background border-2 border-input">
              {option.lockPeriods.map((period) => (
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
            className="whitespace-nowrap w-[120px]"
          >
            Stake
          </Button>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md bg-background">
          <DialogHeader>
            <DialogTitle>Stake {option.stake}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-between items-center">
              <span>Lock Time</span>
              <span>{selectedDays} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span>APR</span>
              <span className="text-green-500">{selectedPeriod?.apr}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Earn</span>
              <span>{option.earn}</span>
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

const Staking = () => {
  return (
    <div className="pt-16 md:pt-20 pb-8 px-4 min-h-screen">
      <div className="w-full">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center">
          Staking
        </h1>
        <div className="space-y-4">
          {stakingOptions.map((option) => (
            <StakingCard key={option.id} option={option} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Staking;
