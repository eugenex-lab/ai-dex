import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const KOIOS_API = "https://api.koios.rest/api/v1";
const BOTLY_POLICY_ID =
  "a2de850cb8cdc28842de58b4812457b7f2b0ede94b2352dda75f5413";
const MIN_REQUIRED_TOKENS = 10000000000n; // Changed from 15,000 to 10,000 BOTLY

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { address } = await req.json();
    console.log("Checking Botly token ownership for address:", address);

    if (!address) {
      return new Response(JSON.stringify({ error: "Address is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const payload = {
      _addresses: [address],
    };

    // Make request to Koios API
    const response = await fetch(`${KOIOS_API}/address_info`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(
        `Koios API error: ${response.status} ${response.statusText}`
      );
    }

    const addressInfo = await response.json();
    console.log("Koios API Response:", JSON.stringify(addressInfo, null, 2));

    if (!addressInfo || !addressInfo[0] || !addressInfo[0].utxo_set) {
      return new Response(
        JSON.stringify({
          hasRequiredTokens: false,
          tokenAmount: 0,
          requiredAmount: Number(MIN_REQUIRED_TOKENS),
          tokensNeeded: Number(MIN_REQUIRED_TOKENS),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check each UTXO for the Botly token
    let tokenAmount = 0n;
    for (const utxo of addressInfo[0].utxo_set) {
      if (utxo.asset_list && utxo.asset_list.length > 0) {
        for (const asset of utxo.asset_list) {
          if (asset.policy_id === BOTLY_POLICY_ID) {
            console.log("Found Botly token in UTXO:", asset);
            tokenAmount += BigInt(asset.quantity);
          }
        }
      }
    }

    const hasRequiredTokens = tokenAmount >= MIN_REQUIRED_TOKENS;
    const tokensNeeded = hasRequiredTokens
      ? 0
      : Number(MIN_REQUIRED_TOKENS - tokenAmount);

    return new Response(
      JSON.stringify({
        hasRequiredTokens,
        tokenAmount: Number(tokenAmount),
        requiredAmount: Number(MIN_REQUIRED_TOKENS),
        tokensNeeded,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
