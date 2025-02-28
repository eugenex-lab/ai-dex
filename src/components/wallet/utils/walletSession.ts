export const SESSION_STORAGE_KEYS = {
  WALLET_ADDRESS: "walletAddress",
  BECH32_ADDRESS: "bech32Address",
  CONNECTED_WALLET: "connectedWallet",
  IS_CONNECTED: "isConnected",
};

export const saveWalletSession = (
  walletAddress: string | null,
  bech32Address: string | null,
  connectedWallet: string | null,
  isConnected: boolean
) => {
  try {
    sessionStorage.setItem(
      SESSION_STORAGE_KEYS.WALLET_ADDRESS,
      walletAddress || ""
    );
    sessionStorage.setItem(
      SESSION_STORAGE_KEYS.BECH32_ADDRESS,
      bech32Address || ""
    );
    sessionStorage.setItem(
      SESSION_STORAGE_KEYS.CONNECTED_WALLET,
      connectedWallet || ""
    );
    sessionStorage.setItem(
      SESSION_STORAGE_KEYS.IS_CONNECTED,
      String(isConnected)
    );
  } catch (error) {
    console.error("Error saving wallet session:", error);
  }
};

export const clearWalletSession = () => {
  try {
    Object.values(SESSION_STORAGE_KEYS).forEach((key) => {
      sessionStorage.removeItem(key);
    });
  } catch (error) {
    console.error("Error clearing wallet session:", error);
  }
};

export const loadWalletSession = () => {
  try {
    const savedWalletAddress = sessionStorage.getItem(
      SESSION_STORAGE_KEYS.WALLET_ADDRESS
    );
    const savedBech32Address = sessionStorage.getItem(
      SESSION_STORAGE_KEYS.BECH32_ADDRESS
    );
    const savedConnectedWallet = sessionStorage.getItem(
      SESSION_STORAGE_KEYS.CONNECTED_WALLET
    );
    const savedIsConnected =
      sessionStorage.getItem(SESSION_STORAGE_KEYS.IS_CONNECTED) === "true";

    return {
      walletAddress: savedWalletAddress,
      bech32Address: savedBech32Address,
      connectedWallet: savedConnectedWallet,
      isConnected: savedIsConnected,
    };
  } catch (error) {
    console.error("Error loading wallet session:", error);
    return {
      walletAddress: null,
      bech32Address: null,
      connectedWallet: null,
      isConnected: false,
    };
  }
};
