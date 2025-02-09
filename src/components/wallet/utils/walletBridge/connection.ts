
import { CardanoApi, CardanoWalletName } from '../types/cardanoTypes';
import { WalletBridgeState, WalletCapabilities } from '../types/cip95Types';
import { createWalletAPI } from './api';
import { EventManager } from './events';
import { v4 as uuidv4 } from 'uuid';

export class ConnectionManager {
  private state: WalletBridgeState;
  private eventManager: EventManager;

  constructor(eventManager: EventManager) {
    this.eventManager = eventManager;
    this.state = {
      isInitialized: false,
      isConnecting: false,
      error: null,
      connectedWallet: null,
      capabilities: {
        supportsMultipleWallets: true,
        supportsCIP30: true,
        supportsCIP95: true,
        supportsNetworkSwitch: true
      }
    };
  }

  public async connect(walletName: CardanoWalletName): Promise<CardanoApi> {
    if (this.state.isConnecting) {
      throw new Error('Connection already in progress');
    }

    try {
      this.state.isConnecting = true;
      const cip95Connection = await this.connectWithCIP95(walletName);
      if (cip95Connection) {
        return cip95Connection;
      }
      return await this.connectWithCIP30(walletName);
    } catch (error) {
      this.handleError('Connection failed', error);
      throw error;
    } finally {
      this.state.isConnecting = false;
    }
  }

  private async connectWithCIP95(walletName: CardanoWalletName): Promise<CardanoApi | null> {
    return new Promise((resolve) => {
      const messageId = uuidv4();
      
      const timeoutId = setTimeout(() => {
        resolve(null);
      }, 10000); // 10 second timeout

      window.postMessage({
        type: 'CARDANO_WALLET_CONNECT',
        id: messageId,
        data: { wallet: walletName }
      }, '*');

      const handler = (message: any) => {
        if (message.id !== messageId) return;
        
        clearTimeout(timeoutId);
        if (message.error) {
          resolve(null);
          return;
        }

        const api = createWalletAPI(message.data);
        resolve(api);
      };

      // Add handler cleanup logic here if needed
    });
  }

  private async connectWithCIP30(walletName: CardanoWalletName): Promise<CardanoApi> {
    const wallet = window.cardano?.[walletName];
    if (!wallet) {
      throw new Error(`${walletName} wallet not found`);
    }

    const api = await wallet.enable();
    return createWalletAPI(api);
  }

  public disconnect(): void {
    this.state.connectedWallet = null;
    this.eventManager.emit('DISCONNECT', null);
  }

  public getState(): WalletState {
    return {
      name: this.state.connectedWallet as CardanoWalletName,
      networkId: undefined,
      apiVersion: '0.1.0',
      isAvailable: this.state.isInitialized,
      isConnected: !!this.state.connectedWallet
    };
  }

  private handleError(message: string, error: any): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    this.state.error = `${message}: ${errorMessage}`;
    this.eventManager.emit('ERROR', { message: this.state.error });
  }
}
