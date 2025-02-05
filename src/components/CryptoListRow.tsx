import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface CryptoListRowProps {
  crypto: {
    symbol: string;
    name: string;
    current_price: number;
    price_change_percentage_24h: number;
    total_volume: number;
    image: string;
  };
}

const CryptoListRow = ({ crypto }: CryptoListRowProps) => {
  return (
    <tr className="border-t border-secondary">
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
  );
};

export default CryptoListRow;