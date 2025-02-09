
import { CardanoApi } from '../types/cardanoTypes';

export function createWalletAPI(api: any): CardanoApi {
  if (!api) throw new Error('Invalid wallet API');

  return {
    getNetworkId: () => api.getNetworkId(),
    getUtxos: () => api.getUtxos(),
    getBalance: () => api.getBalance(),
    getUsedAddresses: () => api.getUsedAddresses(),
    getUnusedAddresses: () => api.getUnusedAddresses(),
    getChangeAddress: () => api.getChangeAddress(),
    getRewardAddresses: () => api.getRewardAddresses(),
    signTx: (tx: string, partialSign?: boolean) => api.signTx(tx, partialSign),
    signData: (addr: string, payload: string) => api.signData(addr, payload),
    submitTx: (tx: string) => api.submitTx(tx),
    experimental: api.experimental
  };
}
