import React from "react";
import { darkTheme, lightTheme, Theme, SwapWidget } from "@uniswap/widgets";
import "@uniswap/widgets/fonts.css";

const myDarkTheme: Theme = {
  ...darkTheme, // Extend the darkTheme
  accent: "#2172E5",
  primary: "#FFFFFF",
  secondary: "#FFFFFF",
  interactive: "#0089EC",
  outline: "#343D3A",
};

const jsonRpcUrlMap = {
  // Ethereum
  // 1: [""],
  // Polygon
  1: [
    `https://mainnet.infura.io/v3/037820aaa89442339bfea9dffe9c5368`,
    "https://eth.llamarpc.com", // Fallback RPC
  ],
  137: ["https://polygon-rpc.com"],
  // BSC
  56: ["https://bsc-dataseed.binance.org/"],
};

const UniswapSwap: React.FC = () => {
  return (
    <div className="Uniswap">
      <SwapWidget
        theme={myDarkTheme}
        tokenList="https://ipfs.io/ipns/tokens.uniswap.org"
        width={"100%"}
        convenienceFee={100} // 100 basis points = 1%
        jsonRpcUrlMap={jsonRpcUrlMap}
        convenienceFeeRecipient={{
          1: "0xfa9be27E330Bb53051c2ebf3C56F091Bd582cE23",
        }} // Replace with your wallet address
      />{" "}
    </div>
  );
};

export default UniswapSwap;
