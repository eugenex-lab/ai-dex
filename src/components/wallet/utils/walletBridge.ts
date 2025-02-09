import { CardanoWalletName, CardanoApi, WalletState } from './types/cardanoTypes';
import { 
  WalletBridgeEvent, 
  WalletBridgeConfig, 
  WalletBridgeState,
  WalletCapabilities,
  WalletBridgeMessage, 
  WalletEventType 
} from './types/cip95Types';
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
  private messageHandlers: Map<string, (message: WalletBridgeMessage) => void>;
  private eventListeners: Map<string, Set<(event: WalletBridgeEvent) => void>>;

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

    this.messageHandlers = new Map();
    this.eventListeners = new Map();
    
    this.initialize();
  }

  private async initialize() {
    try {
      // Register CIP-95 message handler
      window.addEventListener('message', this.handleIncomingMessage);
      
      // Initialize wallet discovery
      await this.discoverWallets();
      
      this.state.isInitialized = true;
      this.emit('DISCOVERY', { initialized: true });
    } catch (error) {
      this.handleError('Initialization failed', error);
    }
  }

  private async discoverWallets(): Promise<void> {
    // Check for CIP-95 support
    const cip95Wallets = await this.discoverCIP95Wallets();
    
    // Fallback to CIP-30 if needed
    const cip30Wallets = await this.discoverCIP30Wallets();
    
    // Combine and deduplicate wallet list
    const availableWallets = [...new Set([...cip95Wallets, ...cip30Wallets])];
    
    this.emit('DISCOVERY', { wallets: availableWallets });
  }

  private async discoverCIP95Wallets(): Promise<string[]> {
    return new Promise((resolve) => {
      const messageId = uuidv4();
      
      const timeoutId = setTimeout(() => {
        this.messageHandlers.delete(messageId);
        resolve([]);
      }, this.config.timeout);

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

  private async discoverCIP30Wallets(): Promise<string[]> {
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

  private handleIncomingMessage = (event: MessageEvent) => {
    const message = event.data as WalletBridgeMessage;
    
    if (!message || !message.type || !message.id) return;
    
    if (message.type.startsWith('CARDANO_WALLET_')) {
      const handler = this.messageHandlers.get(message.id);
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
      
      // Try CIP-95 connection first
      const cip95Connection = await this.connectWithCIP95(walletName);
      if (cip95Connection) {
        return cip95Connection;
      }

      // Fallback to CIP-30
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
        this.messageHandlers.delete(messageId);
        resolve(null);
      }, this.config.timeout);

      this.messageHandlers.set(messageId, (message) => {
        clearTimeout(timeoutId);
        this.messageHandlers.delete(messageId);
        
        if (message.error) {
          resolve(null);
          return;
        }

        const api = this.createWalletAPI(message.data);
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
    return this.createWalletAPI(api);
  }

  private createWalletAPI(api: any): CardanoApi {
    // Validate and wrap the API
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

  public on(eventType: WalletEventType, callback: (event: WalletBridgeEvent) => void): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set());
    }
    this.eventListeners.get(eventType)?.add(callback);
  }

  public off(eventType: WalletEventType, callback: (event: WalletBridgeEvent) => void): void {
    this.eventListeners.get(eventType)?.delete(callback);
  }

  private emit(type: WalletEventType, data?: any): void {
    const event: WalletBridgeEvent = {
      id: uuidv4(),
      type,
      data
    };

    this.eventListeners.get(type)?.forEach(callback => callback(event));
  }

  private handleError(message: string, error: any): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    this.state.error = `${message}: ${errorMessage}`;
    this.emit('ERROR', { message: this.state.error });
  }

  public getState(): WalletState {
    return {
      name: this.state.connectedWallet as CardanoWalletName,
      networkId: undefined, // Will be set after connection
      apiVersion: '0.1.0',
      isAvailable: this.state.isInitialized,
      isConnected: !!this.state.connectedWallet
    };
  }

  public disconnect(): void {
    this.state.connectedWallet = null;
    this.emit('DISCONNECT', null);
  }

  public cleanup(): void {
    window.removeEventListener('message', this.handleIncomingMessage);
    this.messageHandlers.clear();
    this.eventListeners.clear();
  }
}
