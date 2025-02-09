
import { CardanoWalletName, CardanoApi, WalletState } from './types/cardanoTypes';
import { 
  WalletBridgeEvent, 
  WalletBridgeConfig, 
  WalletBridgeState,
  WalletCapabilities,
  WalletBridgeMessage,
  WalletEventType 
} from './types/cip95Types';
import { EventManager } from './walletBridge/events';
import { WalletDiscovery } from './walletBridge/discovery';
import { createWalletAPI } from './walletBridge/api';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_TIMEOUT = 5000;
const DEFAULT_CAPABILITIES: WalletCapabilities = {
  supportsMultipleWallets: true,
  supportsCIP30: true,
  supportsCIP95: true,
  supportsNetworkSwitch: true
};

export class WalletBridge {
  private state: WalletBridgeState;
  private config: WalletBridgeConfig;
  private discovery: WalletDiscovery;
  private eventManager: EventManager;

  constructor(config?: WalletBridgeConfig) {
    this.config = {
      timeout: config?.timeout || DEFAULT_TIMEOUT,
      requiredCapabilities: { ...DEFAULT_CAPABILITIES, ...config?.requiredCapabilities },
      preferredWallets: config?.preferredWallets || []
    };

    this.state = {
      isInitialized: false,
      isConnecting: false,
      error: null,
      connectedWallet: null,
      capabilities: DEFAULT_CAPABILITIES
    };

    this.discovery = new WalletDiscovery(this.config.timeout);
    this.eventManager = new EventManager();
    
    this.initialize();
  }

  private async initialize() {
    try {
      window.addEventListener('message', this.handleIncomingMessage);
      await this.discoverWallets();
      this.state.isInitialized = true;
      this.eventManager.emit('DISCOVERY', { initialized: true });
    } catch (error) {
      this.handleError('Initialization failed', error);
    }
  }

  private async discoverWallets(): Promise<void> {
    const cip95Wallets = await this.discovery.discoverCIP95Wallets();
    const cip30Wallets = await this.discovery.discoverCIP30Wallets();
    const availableWallets = [...new Set([...cip95Wallets, ...cip30Wallets])];
    this.eventManager.emit('DISCOVERY', { wallets: availableWallets });
  }

  private handleIncomingMessage = (event: MessageEvent) => {
    const message = event.data as WalletBridgeMessage;
    if (!message || !message.type || !message.id) return;
    
    if (message.type.startsWith('CARDANO_WALLET_')) {
      const handler = this.discovery.getMessageHandlers().get(message.id);
      if (handler) {
        handler(message);
      }
    }
  };

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
        this.discovery.getMessageHandlers().delete(messageId);
        resolve(null);
      }, this.config.timeout);

      this.discovery.getMessageHandlers().set(messageId, (message) => {
        clearTimeout(timeoutId);
        this.discovery.getMessageHandlers().delete(messageId);
        
        if (message.error) {
          resolve(null);
          return;
        }

        const api = createWalletAPI(message.data);
        resolve(api);
      });

      window.postMessage({
        type: 'CARDANO_WALLET_CONNECT',
        id: messageId,
        data: { wallet: walletName }
      }, '*');
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

  public on(eventType: WalletEventType, callback: (event: WalletBridgeEvent) => void): void {
    this.eventManager.on(eventType, callback);
  }

  public off(eventType: WalletEventType, callback: (event: WalletBridgeEvent) => void): void {
    this.eventManager.off(eventType, callback);
  }

  private handleError(message: string, error: any): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    this.state.error = `${message}: ${errorMessage}`;
    this.eventManager.emit('ERROR', { message: this.state.error });
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

  public disconnect(): void {
    this.state.connectedWallet = null;
    this.eventManager.emit('DISCONNECT', null);
  }

  public cleanup(): void {
    window.removeEventListener('message', this.handleIncomingMessage);
    this.discovery.getMessageHandlers().clear();
    this.eventManager = new EventManager();
  }
}
