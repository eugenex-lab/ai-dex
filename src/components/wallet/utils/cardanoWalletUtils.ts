
export const isCardanoWalletAvailable = (walletName: string): boolean => {
  if (typeof window === 'undefined') return false;
  return !!(window as any)[walletName]?.cardano;
};

export const CARDANO_WALLETS = {
  yoroi: 'yoroi',
  eternl: 'eternl',
  lace: 'lace',
  begin: 'begin',
  tokeo: 'tokeo',
  vespr: 'vespr',
} as const;

export type CardanoWalletName = typeof CARDANO_WALLETS[keyof typeof CARDANO_WALLETS];
