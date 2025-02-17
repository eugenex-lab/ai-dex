import { useEffect, useRef } from "react";

declare global {
  interface Window {
    React: any;
    ReactDOM: any;
    dexhunterSwap: any;
  }
}

const DexHunterSwap = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadScripts = async () => {
      console.log("[DexHunterSwap] Starting initialization");

      try {
        // First load React
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src =
            "https://unpkg.com/react@18.2/umd/react.production.min.js";
          script.crossOrigin = "anonymous";
          script.onload = resolve;
          document.head.appendChild(script);
        });

        // Then load ReactDOM after React is loaded
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src =
            "https://unpkg.com/react-dom@18.2/umd/react-dom.production.min.js";
          script.crossOrigin = "anonymous";
          script.onload = resolve;
          document.head.appendChild(script);
        });

        // Wait a bit for React and ReactDOM to be properly initialized
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Finally load DexHunter after React and ReactDOM are ready
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src =
            "https://unpkg.com/@dexhunterio/swaps@0.0.116/lib/umd/swaps.umd.js";
          script.onload = resolve;
          document.head.appendChild(script);
        });

        // Wait another moment for DexHunter to initialize
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Initialize widget only after all scripts are fully loaded and initialized
        if (window.dexhunterSwap && containerRef.current) {
          console.log("[DexHunterSwap] Rendering widget with dependencies:", {
            react: !!window.React,
            reactDOM: !!window.ReactDOM,
            dexhunter: !!window.dexhunterSwap,
          });

          window.ReactDOM.render(
            window.React.createElement(window.dexhunterSwap, {
              // orderTypes: ["SWAP", "LIMIT"],
              colors: {
                background: "#0E0F12",
                containers: "#191B23",
                subText: "#88919E",
                mainText: "#FFFFFF",
                buttonText: "#FFFFFF",
                accent: "#007DFF",
              },
              theme: "dark",
              width: 500,
              partnerCode:
                "tr61646472317178706b666364783839656b6d7466373374656d6734366c6d64753078706a647377767561377267617a34676a393674746634687738387678656a37646a786333636a79763977727a6c766364356574707a75336771726c78646d716d793439326ada39a3ee5e6b4b0d3255bfef95601890afd80709",
              partnerName: "tr",
            }),
            containerRef.current
          );
          console.log("[DexHunterSwap] Widget mounted successfully");
        } else {
          console.error(
            "[DexHunterSwap] Failed to initialize - dependencies missing:",
            {
              dexhunterExists: !!window.dexhunterSwap,
              containerExists: !!containerRef.current,
            }
          );
        }
      } catch (error) {
        console.error("[DexHunterSwap] Error during initialization:", error);
      }
    };

    loadScripts();

    return () => {
      if (containerRef.current && window.ReactDOM) {
        window.ReactDOM.unmountComponentAtNode(containerRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="dexhunter-root"
      style={{
        width: "100%",
        minHeight: "480px",
        margin: "0 auto",
        position: "relative",
        zIndex: 1,
      }}
    />
  );
};

export default DexHunterSwap;
