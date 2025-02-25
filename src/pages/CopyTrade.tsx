import CopyTradeHeader from "../components/copy-trade/CopyTradeHeader";
import CopyTradeForm from "../components/copy-trade/CopyTradeForm";
import CopyTradeInstructions from "../components/copy-trade/CopyTradeInstructions";

const CopyTrade = () => {
  return (
    // <ChainProvider>
    //   <CardanoWalletProvider>
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <CopyTradeHeader />
      <CopyTradeInstructions />
      <CopyTradeForm />
    </div>
    //   </CardanoWalletProvider>
    // </ChainProvider>
  );
};

export default CopyTrade;
