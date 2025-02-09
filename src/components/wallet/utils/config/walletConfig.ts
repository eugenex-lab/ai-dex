
import { CardanoWalletName, WalletInfo } from '../types/cardanoTypes';

const WALLET_INFO: Record<CardanoWalletName, WalletInfo> = {
  eternl: {
    displayName: 'Eternl',
    downloadUrl: 'https://eternl.io/app/download',
  },
  nami: {
    displayName: 'Nami',
    downloadUrl: 'https://namiwallet.io',
  },
  lace: {
    displayName: 'Lace',
    downloadUrl: 'https://www.lace.io',
  },
  yoroi: {
    displayName: 'Yoroi',
    downloadUrl: 'https://yoroi-wallet.com',
  },
  vespr: {
    displayName: 'Vespr',
    downloadUrl: 'https://vespr.xyz',
  },
  begin: {
    displayName: 'Begin',
    downloadUrl: 'https://begin.is',
  },
  tokeo: {
    displayName: 'Tokeo',
    downloadUrl: 'https://tokeo.io',
  },
};

export { WALLET_INFO };
