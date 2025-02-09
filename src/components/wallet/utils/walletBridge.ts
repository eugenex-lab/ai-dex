
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

    this.eventManager = new EventManager();
    this.discovery = new WalletDiscovery(this.config.timeout);
    this.connectionManager = new ConnectionManager(this.eventManager);
    
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
    if (!event.data?.type?.startsWith('CARDANO_WALLET_')) return;
    
    const handler = this.discovery.getMessageHandlers().get(event.data.id);
    if (handler) {
      handler(event.data);
    }
  };

  public async connect(walletName: CardanoWalletName): Promise<CardanoApi> {
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
    this.state.error = `${message}: ${errorMessage}`;
    this.eventManager.emit('ERROR', { message: this.state.error });
  }

  public getState(): WalletState {
    return this.connectionManager.getState();
  }

  public disconnect(): void {
    this.connectionManager.disconnect();
  }

  public cleanup(): void {
    window.removeEventListener('message', this.handleIncomingMessage);
    this.discovery.getMessageHandlers().clear();
  }
}
