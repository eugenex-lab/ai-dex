import { useEffect, useState } from "react";
import styles from "./DexHunterMobile.module.css";

const UniswapSwap = () => {
  const [containerWidth, setContainerWidth] = useState(380);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      const parentElement =
        document.getElementById("uniswap-root")?.parentElement;
      if (parentElement) {
        const parentWidth = parentElement.clientWidth;
        const parentPadding = 48;
        const desktopWidth = Math.min(parentWidth - parentPadding, 480);
        const mobileWidth = 420;
        setContainerWidth(mobile ? mobileWidth : desktopWidth);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      id="uniswap-root"
      className={styles.container}
      style={{
        width: `100%`,
        height: "550px",
        margin: "0 auto",
        backgroundColor: "#0E0F12",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <iframe
        src="https://app.uniswap.org/swap?"
        width="100%"
        height="100%"
        style={{
          border: "none",
          borderRadius: "12px",
        }}
        title="Uniswap Interface"
      />
    </div>
  );
};

export default UniswapSwap;
