
import { DiscoveredWallet } from '../types/cardanoTypes';
import { WalletBridgeMessage } from '../types/cip95Types';
import { v4 as uuidv4 } from 'uuid';

export class WalletDiscovery {
  private messageHandlers: Map<string, (message: WalletBridgeMessage) => void>;
  private timeout: number;

  constructor(timeout: number) {
    this.messageHandlers = new Map();
    this.timeout = timeout;
  }

  async discoverCIP95Wallets(): Promise<string[]> {
    return new Promise((resolve) => {
      const messageId = uuidv4();
      
      const timeoutId = setTimeout(() => {
        this.messageHandlers.delete(messageId);
        resolve([]);
      }, this.timeout);

      this.messageHandlers.set(messageId, (message) => {
        clearTimeout(timeoutId);
        this.messageHandlers.delete(messageId);
        resolve(message.data?.wallets || []);
      });

      window.postMessage({
        type: 'CARDANO_WALLET_DISCOVERY',
        id: messageId
      }, '*');
    });
  }

  async discoverCIP30Wallets(): Promise<string[]> {
    const cardanoWallets: string[] = [];
    if (typeof window.cardano !== 'undefined') {
      Object.keys(window.cardano).forEach(walletName => {
        if (this.isCIP30Wallet(window.cardano[walletName])) {
          cardanoWallets.push(walletName);
        }
      });
    }
    return cardanoWallets;
  }

  private isCIP30Wallet(wallet: any): boolean {
    return wallet && 
           typeof wallet.enable === 'function' && 
           typeof wallet.isEnabled === 'function';
  }

  getMessageHandlers(): Map<string, (message: WalletBridgeMessage) => void> {
    return this.messageHandlers;
  }
}
