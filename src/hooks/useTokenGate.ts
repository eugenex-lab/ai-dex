import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Botly policy ID for verification
const BOTLY_POLICY_ID =
  "a2de850cb8cdc28842de58b4812457b7f2b0ede94b2352dda75f5413";

// Minimum required tokens (10,000 BOTLY)
const MIN_REQUIRED_TOKENS = 10000000000n; // Reduced from 15,000 to 10,000 BOTLY

export function useTokenGate(address: string | null) {
  const [hasRequiredToken, setHasRequiredToken] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [tokenAmount, setTokenAmount] = useState<number>(0);
  const [tokensNeeded, setTokensNeeded] = useState<number>(
    Number(MIN_REQUIRED_TOKENS)
  );

  const checkTokenOwnership = async (
    address: string
  ): Promise<{
    hasRequiredTokens: boolean;
    tokenAmount: number;
    tokensNeeded: number;
  }> => {
    console.log("Checking Botly token ownership for address:", address);
    try {
      // Use the Supabase Edge Function to check token ownership
      const { data, error } = await supabase.functions.invoke(
        "verify-botly-tokens",
        {
          body: { address },
        }
      );

      if (error) {
        console.error("Error checking token ownership:", error);
        return {
          hasRequiredTokens: false,
          tokenAmount: 0,
          tokensNeeded: Number(MIN_REQUIRED_TOKENS),
        };
      }

      if (data?.hasRequiredTokens) {
        console.log(
          "Token verification PASSED: User has sufficient Botly tokens"
        );
        return {
          hasRequiredTokens: true,
          tokenAmount: data.tokenAmount || 0,
          tokensNeeded: 0,
        };
      } else {
        console.log("Token verification FAILED: Insufficient Botly tokens");
        return {
          hasRequiredTokens: false,
          tokenAmount: data?.tokenAmount || 0,
          tokensNeeded: data?.tokensNeeded || Number(MIN_REQUIRED_TOKENS),
        };
      }
    } catch (error) {
      console.error("Error checking token ownership:", error);
      return {
        hasRequiredTokens: false,
        tokenAmount: 0,
        tokensNeeded: Number(MIN_REQUIRED_TOKENS),
      };
    }
  };

  useEffect(() => {
    let isMounted = true;

    const verifyToken = async () => {
      if (!address || isChecking) return;

      setIsChecking(true);
      try {
        const result = await checkTokenOwnership(address);
        if (isMounted) {
          setHasRequiredToken(result.hasRequiredTokens);
          setTokenAmount(result.tokenAmount);
          setTokensNeeded(result.tokensNeeded);

          // Only show success toast notification - keep this for user feedback
          if (result.hasRequiredTokens) {
            toast.success("Botly token verification successful!");
          }
        }
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    };

    verifyToken();

    return () => {
      isMounted = false;
    };
  }, [address]);

  return {
    hasRequiredToken,
    isChecking,
    tokenAmount,
    tokensNeeded,
  };
}
