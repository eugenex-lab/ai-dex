import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { fetchCryptoData } from "@/utils/cryptoUtils";
import CryptoListSkeleton from "./CryptoListSkeleton";
import CryptoListRow from "./CryptoListRow";

const CryptoList = () => {
  const { toast } = useToast();

  const {
    data: cryptos,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cryptos"],
    queryFn: fetchCryptoData,
    // refetchInterval: 30000, // Refetch every 30 seconds
    retry: 3, // Retry failed requests 3 times
  });

  useEffect(() => {
    if (isError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to load crypto data. Please try again later.",
      });
    }
  }, [isError, toast]);

  if (isLoading) {
    return <CryptoListSkeleton />;
  }

  if (isError) {
    return (
      <div className="glass-card rounded-lg p-6">
        <div className="text-center text-warning">
          <p className="font-medium">Unable to load crypto data</p>
          <p className="text-sm text-muted-foreground">
            Please try again later
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-lg p-6 animate-fade-in">
      <h2 className="text-xl font-semibold mb-6">Top Cryptocurrencies</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-muted-foreground">
              <th className="pb-4">Name</th>
              <th className="pb-4">Price</th>
              <th className="pb-4">24h Change</th>
              <th className="pb-4">Volume</th>
            </tr>
          </thead>
          <tbody>
            {cryptos?.map((crypto) => (
              <CryptoListRow key={crypto.symbol} crypto={crypto} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CryptoList;
