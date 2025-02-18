
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StepTwoProps {
  formData: {
    totalRewardPool: string;
    maxStakers: string;
    claimFrequency: string;
  };
  setFormData: (data: any) => void;
}

export const StepTwo = ({ formData, setFormData }: StepTwoProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Total Reward Pool</Label>
        <Input
          type="number"
          value={formData.totalRewardPool}
          onChange={(e) => setFormData({ ...formData, totalRewardPool: e.target.value })}
          placeholder="Enter total reward pool amount"
        />
      </div>
      <div>
        <Label>Maximum Stakers</Label>
        <Input
          type="number"
          value={formData.maxStakers}
          onChange={(e) => setFormData({ ...formData, maxStakers: e.target.value })}
          placeholder="Enter maximum number of stakers"
        />
      </div>
      <div>
        <Label>Claim Frequency (Days)</Label>
        <Select
          value={formData.claimFrequency}
          onValueChange={(value) => setFormData({ ...formData, claimFrequency: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select claim frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">Every Epoch (5 days)</SelectItem>
            <SelectItem value="30">Every 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
