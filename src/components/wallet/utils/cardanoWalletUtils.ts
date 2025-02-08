
import { toast } from "@/hooks/use-toast";

export const CARDANO_WALLETS = {
  yoroi: 'yoroi',
  eternl: 'eternl', 
  lace: 'lace',
  begin: 'begin',
  tokeo: 'tokeo',
  vespr: 'vespr',
} as const;

export type CardanoWalletName = typeof CARDANO_WALLETS[keyof typeof CARDANO_WALLETS];

export const isCardanoWalletAvailable = (walletName: string): boolean => {
  if (typeof window === 'undefined') return false;
  return !!(window as any)[walletName]?.cardano;
};

export const getWalletInfo = (walletName: CardanoWalletName) => {
  const displayNames: Record<CardanoWalletName, string> = {
    yoroi: 'Yoroi',
    eternl: 'Eternl',
    lace: 'Lace', 
    begin: 'Begin',
    tokeo: 'Tokeo',
    vespr: 'Vespr'
  };

  const downloadUrls: Record<CardanoWalletName, string> = {
    yoroi: 'https://yoroi-wallet.com',
    eternl: 'https://eternl.io/app/mainnet/welcome',
    lace: 'https://www.lace.io',
    begin: 'https://begin.is',
    tokeo: 'https://tokeo.io',
    vespr: 'https://vespr.xyz'
  };

  return {
    displayName: displayNames[walletName],
    downloadUrl: downloadUrls[walletName]
  };
};
