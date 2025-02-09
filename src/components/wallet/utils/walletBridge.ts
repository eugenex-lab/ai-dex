
import { CardanoWalletName, CardanoApi, WalletState } from './types/cardanoTypes';
import { 
  WalletBridgeConfig, 
  WalletBridgeState,
  WalletCapabilities,
  WalletEventType,
  WalletBridgeEvent
} from './types/cip95Types';
import { EventManager } from './walletBridge/events';
import { WalletDiscovery } from './walletBridge/discovery';
import { ConnectionManager } from './walletBridge/connection';

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
  private connectionManager: ConnectionManager;
  private initializationPromise: Promise<void>;

  constructor(config?: WalletBridgeConfig) {
    console.log('Initializing WalletBridge with config:', config);
    
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

    this.eventManager = new EventManager();
    this.discovery = new WalletDiscovery(this.config.timeout);
    this.connectionManager = new ConnectionManager(this.eventManager);
    
    this.initializationPromise = this.initialize();
  }

  private async initialize() {
    try {
      console.log('Starting wallet bridge initialization');
      
      // Setup event listeners
      window.addEventListener('message', this.handleIncomingMessage);
      
      // Setup error boundary
      window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
      
      // Discover available wallets
      await this.discoverWallets();
      
      this.state.isInitialized = true;
      console.log('Wallet bridge initialization complete');
      this.eventManager.emit('DISCOVERY', { initialized: true });
    } catch (error) {
      console.error('Initialization failed:', error);
      this.handleError('Initialization failed', error);
      throw error; // Re-throw to allow proper error handling upstream
    }
  }

  private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    console.error('Unhandled promise rejection in WalletBridge:', event.reason);
    this.handleError('Unhandled error', event.reason);
  };

  private async discoverWallets(): Promise<void> {
    console.log('Starting wallet discovery');
    
    try {
      const cip95Wallets = await this.discovery.discoverCIP95Wallets();
      console.log('CIP-95 wallets discovered:', cip95Wallets);
      
      const cip30Wallets = await this.discovery.discoverCIP30Wallets();
      console.log('CIP-30 wallets discovered:', cip30Wallets);
      
      const availableWallets = [...new Set([...cip95Wallets, ...cip30Wallets])];
      console.log('Total available wallets:', availableWallets);
      
      this.eventManager.emit('DISCOVERY', { wallets: availableWallets });
    } catch (error) {
      console.error('Wallet discovery error:', error);
      this.handleError('Wallet discovery failed', error);
    }
  }

  private handleIncomingMessage = (event: MessageEvent) => {
    if (!event.data?.type?.startsWith('CARDANO_WALLET_')) return;
    
    console.log('Received wallet message:', event.data.type);
    const handler = this.discovery.getMessageHandlers().get(event.data.id);
    if (handler) {
      try {
        handler(event.data);
      } catch (error) {
        console.error('Error handling wallet message:', error);
        this.handleError('Message handling failed', error);
      }
    }
  };

  public async connect(walletName: CardanoWalletName): Promise<CardanoApi> {
    // Ensure initialization is complete before attempting connection
    await this.initializationPromise;
    
    console.log(`Initiating connection to ${walletName}`);
    return this.connectionManager.connect(walletName);
  }

  public on(eventType: WalletEventType, callback: (event: WalletBridgeEvent) => void): void {
    this.eventManager.on(eventType, callback);
  }

  public off(eventType: WalletEventType, callback: (event: WalletBridgeEvent) => void): void {
    this.eventManager.off(eventType, callback);
  }

  private handleError(message: string, error: any): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`${message}: ${errorMessage}`);
    this.state.error = `${message}: ${errorMessage}`;
    this.eventManager.emit('ERROR', { message: this.state.error });
  }

  public getState(): WalletState {
    return this.connectionManager.getState();
  }

  public disconnect(): void {
    console.log('Disconnecting wallet bridge');
    this.connectionManager.disconnect();
  }

  public cleanup(): void {
    console.log('Cleaning up wallet bridge');
    window.removeEventListener('message', this.handleIncomingMessage);
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
    this.discovery.getMessageHandlers().clear();
    this.connectionManager.disconnect();
    this.eventManager.cleanup();
  }
}
