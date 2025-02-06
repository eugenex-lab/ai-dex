
import { Card, CardContent } from "../ui/card";

interface PairDisplayProps {
  pair: string;
}

const PairDisplay = ({ pair }: PairDisplayProps) => {
  const formattedPair = pair.includes('USDT') 
    ? pair.replace('USDT', '/USDT')
    : `${pair}/USDT`;

  return (
    <Card className="bg-background">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Current Trading Pair</div>
          <div className="text-base font-semibold">{formattedPair}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PairDisplay;
