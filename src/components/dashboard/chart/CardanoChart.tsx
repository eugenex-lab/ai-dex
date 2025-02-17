// CardanoChart.tsx
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import * as Select from "@radix-ui/react-select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";

interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface Pair {
  symbol: string;
  label: string;
}

// Define Cardano pairs (adjust symbols if needed by the Taptools API)
const cardanoPairs: Pair[] = [
  { symbol: "ADAUSDT", label: "ADA/USDT" },
  { symbol: "ADABTC", label: "ADA/BTC" },
  { symbol: "ADAETH", label: "ADA/ETH" },
];

const CardanoChart: React.FC = () => {
  // Default pair is ADA/USDT
  const [pair, setPair] = useState<string>("ADAUSDT");
  const [series, setSeries] = useState<
    { data: { x: number; y: number[] }[] }[]
  >([{ data: [] }]);

  // Dark-themed, TradingView-like chart configuration options
  const chartOptions = {
    chart: {
      type: "candlestick",
      height: 350,
      background: "#2C2C2C",
      animations: { enabled: false },
      toolbar: { show: false },
    },
    title: {
      text: `${
        cardanoPairs.find((p) => p.symbol === pair)?.label || pair
      } Candlestick Chart`,
      align: "left",
      style: { fontSize: "16px", fontWeight: "600", color: "#fff" },
    },
    grid: { borderColor: "#555", strokeDashArray: 3 },
    xaxis: {
      type: "datetime",
      labels: { style: { colors: "#fff", fontSize: "12px" } },
      tooltip: { enabled: false },
    },
    yaxis: {
      tooltip: { enabled: true },
      labels: { style: { colors: "#fff", fontSize: "12px" } },
    },
    plotOptions: {
      candlestick: {
        colors: { upward: "#26a69a", downward: "#ef5350" },
        wick: { useFillColor: true },
      },
    },
    tooltip: { theme: "dark", x: { format: "dd MMM yyyy" } },
  };

  useEffect(() => {
    const fetchData = async () => {
      // Calculate the date range for the last month
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);

      // Format dates as YYYY-MM-DD
      const formatDate = (date: Date) => date.toISOString().split("T")[0];
      const start = formatDate(startDate);
      const end = formatDate(endDate);

      // Build the API endpoint using the selected pair and date range
      const API_ENDPOINT = `https://api.taptools.io/v1/cryptocurrency/candles?symbol=${pair}&period=1d&start=${start}&end=${end}`;

      try {
        const response = await fetch(API_ENDPOINT, {
          headers: {
            "x-api-key": "4wXzAXLvuLIGL78kLJJjG4TUfPtdLX74",
          },
        });
        const data: CandleData[] = await response.json();
        console.log("Raw data:", data);

        // Transform API data to the format expected by ApexCharts
        const formattedData = data.map((item) => ({
          x: new Date(item.time).getTime(),
          y: [item.open, item.high, item.low, item.close],
        }));
        console.log("Formatted data:", formattedData);

        setSeries([{ data: formattedData }]);
      } catch (error) {
        console.error("Error fetching data from Taptools API:", error);
      }
    };

    fetchData();
  }, [pair]);

  return (
    <div
      className="text-center p-6 border border-gray-300 rounded-lg"
      style={{ background: "#2C2C2C" }}
    >
      <h3 className="text-xl font-semibold mb-4" style={{ color: "#fff" }}>
        {cardanoPairs.find((p) => p.symbol === pair)?.label || pair} Chart
      </h3>

      {/* Radix UI Select for Cardano Pairs */}
      <div className="mb-4 flex justify-center">
        <Select.Root value={pair} onValueChange={setPair}>
          <Select.Trigger
            className="inline-flex items-center justify-between rounded px-4 py-2"
            style={{
              backgroundColor: "#444",
              color: "#fff",
              border: "1px solid #666",
            }}
            aria-label="Select Cardano Pair"
          >
            <Select.Value>
              {cardanoPairs.find((p) => p.symbol === pair)?.label || pair}
            </Select.Value>
            <Select.Icon>
              <ChevronDownIcon />
            </Select.Icon>
          </Select.Trigger>
          <Select.Content
            className="mt-1 rounded shadow-lg"
            style={{
              backgroundColor: "#444",
              color: "#fff",
              border: "1px solid #666",
            }}
          >
            <Select.ScrollUpButton className="flex justify-center">
              <ChevronUpIcon />
            </Select.ScrollUpButton>
            <Select.Viewport className="p-2">
              {cardanoPairs.map((p) => (
                <Select.Item
                  key={p.symbol}
                  value={p.symbol}
                  className="cursor-pointer rounded px-4 py-2 hover:bg-gray-600"
                >
                  <Select.ItemText>{p.label}</Select.ItemText>
                  <Select.ItemIndicator className="absolute left-2 inline-flex">
                    <CheckIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
            <Select.ScrollDownButton className="flex justify-center">
              <ChevronDownIcon />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Root>
      </div>

      <Chart
        options={chartOptions}
        series={series}
        type="candlestick"
        height={350}
      />
    </div>
  );
};

export default CardanoChart;
