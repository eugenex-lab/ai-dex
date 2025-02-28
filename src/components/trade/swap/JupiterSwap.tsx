import { useEffect, useState, useCallback, useMemo, useRef } from "react";
// import styles from "./DexHunterMobile.module.css";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useWalletConnection } from "@/components/wallet/hooks/useWalletConnection";

const JupiterSwap = () => {
  const [containerWidth, setContainerWidth] = useState(480);
  const [isMobile, setIsMobile] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { connectedAddress } = useWalletConnection();
  const { toast } = useToast();

  // Check whether we're on a mobile device
  const isMobileDevice = useMemo(() => {
    return (
      typeof window !== "undefined" &&
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    );
  }, []);

  // Adjust container width based on viewport
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      const parentElement =
        document.getElementById("jupiter-root")?.parentElement;
      if (parentElement) {
        const parentWidth = parentElement.clientWidth;
        const parentPadding = 20;
        const desktopWidth = Math.min(parentWidth - parentPadding, 600);
        const mobileWidth = Math.min(parentWidth - parentPadding * 2, 400);
        setContainerWidth(mobile ? mobileWidth : desktopWidth);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Create the Jupiter widget URL with minimal necessary parameters
  const jupiterWidgetUrl = useMemo(() => {
    const url = new URL("https://jup.ag/swap");

    // Essential parameters
    url.searchParams.set("platform", "tradenly");
    url.searchParams.set("referralTarget", window.location.hostname);

    // Set connected address if available (as a convenience, not required)
    if (connectedAddress) {
      url.searchParams.set("userPublicKey", connectedAddress);
    }

    // Mobile optimizations
    if (isMobileDevice || isMobile) {
      url.searchParams.set("responsive", "true");
    }

    return url.toString();
  }, [connectedAddress, isMobileDevice, isMobile]);

  // Standard Jupiter iframe for all browsers
  return (
    <div
      id="jupiter-root"
      // className={styles.container}
      style={{
        width: `${containerWidth}px`,
        height: "480px",
        margin: "0 auto",
        backgroundColor: "#0E0F12",
        borderRadius: "12px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <iframe
        ref={iframeRef}
        src={jupiterWidgetUrl}
        width="100%"
        height="100%"
        style={{
          border: "none",
          borderRadius: "12px",
        }}
        title="Jupiter Swap"
        allow="clipboard-write; web-share; cross-origin-isolated; storage-access"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-downloads allow-storage-access-by-user-activation allow-forms allow-modals allow-top-navigation"
        referrerPolicy="origin"
      />

      {/* External link button for mobile devices */}
      {isMobileDevice && (
        <div className="absolute bottom-4 right-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open(jupiterWidgetUrl, "_blank")}
            className="shadow-lg bg-background/80"
          >
            <ExternalLink size={16} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default JupiterSwap;
