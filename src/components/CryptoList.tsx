import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface BinanceTickerData {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  volume: string;
  quoteVolume: string;
}

const fetchCryptoData = async () => {
  try {
    // Fix: Format symbols as a proper JSON array without string quotes
    const symbols = ["BTCUSDT","ETHUSDT","BNBUSDT","XRPUSDT","SOLUSDT"];
    const response = await fetch(
      `https://api.binance.com/api/v3/ticker/24hr?symbols=${JSON.stringify(symbols)}`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.msg || 'Failed to fetch crypto data');
    }
    
    const data: BinanceTickerData[] = await response.json();
    return data.map(ticker => ({
      symbol: ticker.symbol.replace('USDT', ''),
      name: getCryptoName(ticker.symbol.replace('USDT', '')),
      current_price: parseFloat(ticker.lastPrice),
      price_change_percentage_24h: parseFloat(ticker.priceChangePercent),
      total_volume: parseFloat(ticker.quoteVolume),
      image: getCryptoImage(ticker.symbol.replace('USDT', '')),
    }));
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    throw error;
  }
};

// Helper function to get crypto names
const getCryptoName = (symbol: string): string => {
  const names: Record<string, string> = {
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'BNB': 'Binance Coin',
    'XRP': 'Ripple',
    'SOL': 'Solana',
  };
  return names[symbol] || symbol;
};

// Helper function to get crypto images
const getCryptoImage = (symbol: string): string => {
  const images: Record<string, string> = {
    'BTC': 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    'ETH': 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    'BNB': 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
    'XRP': 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
    'SOL': 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
  };
  return images[symbol] || '';
};

const CryptoList = () => {
  const { toast } = useToast();
  
  const { data: cryptos, isLoading, isError, error } = useQuery({
    queryKey: ['cryptos'],
    queryFn: fetchCryptoData,
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 3, // Retry failed requests 3 times
  });

  // Move toast to useEffect to prevent infinite renders
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
    return (
      <div className="glass-card rounded-lg p-6 animate-pulse">
        <div className="h-6 w-48 bg-secondary rounded mb-6"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-8 w-8 bg-secondary rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 bg-secondary rounded"></div>
                <div className="h-3 w-16 bg-secondary rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="glass-card rounded-lg p-6">
        <div className="text-center text-warning">
          <p className="font-medium">Unable to load crypto data</p>
          <p className="text-sm text-muted-foreground">Please try again later</p>
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
              <tr key={crypto.symbol} className="border-t border-secondary">
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <img src={crypto.image} alt={crypto.name} className="w-8 h-8 rounded-full" />
                    <div>
                      <p className="font-medium">{crypto.name}</p>
                      <p className="text-sm text-muted-foreground">{crypto.symbol.toUpperCase()}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4">${crypto.current_price.toLocaleString()}</td>
                <td className="py-4">
                  <span
                    className={`flex items-center gap-1 ${
                      crypto.price_change_percentage_24h >= 0 ? "text-success" : "text-warning"
                    }`}
                  >
                    {crypto.price_change_percentage_24h >= 0 ? (
                      <ArrowUpIcon className="w-3 h-3" />
                    ) : (
                      <ArrowDownIcon className="w-3 h-3" />
                    )}
                    {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                  </span>
                </td>
                <td className="py-4">${(crypto.total_volume / 1e9).toFixed(1)}B</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CryptoList;