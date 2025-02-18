
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { toast } from "sonner";

interface StepOneProps {
  formData: {
    tokenName: string;
    tokenContractAddress: string;
    stakeTokenName: string;
    stakeTokenAddress: string;
  };
  setFormData: (data: any) => void;
  logoFile: File | null;
  setLogoFile: (file: File | null) => void;
  logoPreview: string | null;
  setLogoPreview: (preview: string | null) => void;
}

export const StepOne = ({ 
  formData, 
  setFormData, 
  logoFile, 
  setLogoFile, 
  logoPreview, 
  setLogoPreview 
}: StepOneProps) => {
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("File must be an image");
        return;
      }

      setLogoFile(file);
      
      // Create object URL for preview
      const objectUrl = URL.createObjectURL(file);
      setLogoPreview(objectUrl);

      // Cleanup the object URL when component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Project Logo</Label>
        <div className="mt-2 flex items-center gap-4">
          {logoPreview ? (
            <img 
              src={logoPreview} 
              alt="Logo preview" 
              className="w-16 h-16 rounded-lg object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-secondary/20 flex items-center justify-center">
              <Upload className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
          <Input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="flex-1"
          />
        </div>
      </div>
      <div>
        <Label>Reward Token Name</Label>
        <Input
          value={formData.tokenName}
          onChange={(e) => setFormData({ ...formData, tokenName: e.target.value })}
          placeholder="Enter reward token name"
        />
      </div>
      <div>
        <Label>Reward Token Contract Address</Label>
        <Input
          value={formData.tokenContractAddress}
          onChange={(e) => setFormData({ ...formData, tokenContractAddress: e.target.value })}
          placeholder="Enter reward token contract address"
        />
      </div>
      <div>
        <Label>Token For Users To Stake</Label>
        <Input
          value={formData.stakeTokenName}
          onChange={(e) => setFormData({ ...formData, stakeTokenName: e.target.value })}
          placeholder="Enter token name that users will stake"
        />
      </div>
      <div>
        <Label>Stake Token Contract Address</Label>
        <Input
          value={formData.stakeTokenAddress}
          onChange={(e) => setFormData({ ...formData, stakeTokenAddress: e.target.value })}
          placeholder="Enter contract address for the token users will stake"
        />
      </div>
    </div>
  );
};
