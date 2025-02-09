
import { CardanoApi, CardanoWalletName, WalletState } from '../types/cardanoTypes';
import { WalletBridgeState, WalletCapabilities } from '../types/cip95Types';
import { createWalletAPI } from './api';
import { EventManager } from './events';
import { v4 as uuidv4 } from 'uuid';

type ConnectionState = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'ERROR';

export class ConnectionManager {
  private state: WalletBridgeState;
  private eventManager: EventManager;
  private connectionTimeout: number = 10000; // 10 seconds timeout
  private retryAttempts: number = 3;
  private currentRetry: number = 0;
  private connectionState: ConnectionState = 'DISCONNECTED';
  private messageHandlers: Map<string, (event: MessageEvent) => void>;
  private cleanupFunctions: Array<() => void>;

  constructor(eventManager: EventManager) {
    this.eventManager = eventManager;
    this.messageHandlers = new Map();
    this.cleanupFunctions = [];
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
    
    console.log('ConnectionManager initialized');
    this.setupNetworkDetection();
  }

  private setupNetworkDetection() {
    const networkHandler = () => {
      if (this.connectionState === 'CONNECTED') {
        this.handleNetworkChange();
      }
    };
    
    window.addEventListener('online', networkHandler);
    window.addEventListener('offline', networkHandler);
    
    this.cleanupFunctions.push(() => {
      window.removeEventListener('online', networkHandler);
      window.removeEventListener('offline', networkHandler);
    });
  }

  private async handleNetworkChange() {
    if (!navigator.onLine) {
      console.log('Network offline detected');
      this.eventManager.emit('ERROR', { message: 'Network connection lost' });
      return;
    }

    if (this.state.connectedWallet) {
      console.log('Reinitializing wallet connection after network change');
      try {
        await this.connect(this.state.connectedWallet as CardanoWalletName);
      } catch (error) {
        console.error('Failed to reconnect after network change:', error);
        this.handleError('Network reconnection failed', error);
      }
    }
  }

  private async waitForTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
    let timeoutId: NodeJS.Timeout;
    
    const timeoutPromise = new Promise<T>((_, reject) => {
      timeoutId = setTimeout(() => {
        console.log('Connection timeout reached');
        reject(new Error('Connection timeout'));
      }, timeout);
    });

    try {
      const result = await Promise.race([promise, timeoutPromise]);
      clearTimeout(timeoutId!);
      return result;
    } catch (error) {
      clearTimeout(timeoutId!);
      throw error;
    }
  }

  public async connect(walletName: CardanoWalletName): Promise<CardanoApi> {
    console.log(`Attempting to connect to ${walletName}...`);
    
    if (this.connectionState === 'CONNECTING') {
      console.log('Connection already in progress');
      throw new Error('Connection already in progress');
    }

    try {
      this.connectionState = 'CONNECTING';
      this.state.isConnecting = true;
      this.currentRetry = 0;

      while (this.currentRetry < this.retryAttempts) {
        try {
          console.log(`Connection attempt ${this.currentRetry + 1}/${this.retryAttempts}`);
          
          // Try CIP-95 first
          const cip95Connection = await this.waitForTimeout(
            this.connectWithCIP95(walletName),
            this.connectionTimeout
          );

          if (cip95Connection) {
            console.log('Connected using CIP-95');
            this.connectionState = 'CONNECTED';
            this.state.connectedWallet = walletName;
            return cip95Connection;
          }

          // Fallback to CIP-30
          console.log('Falling back to CIP-30 connection');
          const cip30Connection = await this.connectWithCIP30(walletName);
          this.connectionState = 'CONNECTED';
          this.state.connectedWallet = walletName;
          return cip30Connection;
        } catch (error) {
          this.currentRetry++;
          if (this.currentRetry >= this.retryAttempts) {
            throw error;
          }
          console.log(`Retrying connection... (${this.currentRetry}/${this.retryAttempts})`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s between retries
        }
      }

      throw new Error('Max retry attempts reached');
    } catch (error) {
      this.connectionState = 'ERROR';
      this.handleError('Connection failed', error);
      throw error;
    } finally {
      this.state.isConnecting = false;
    }
  }

  private async connectWithCIP95(walletName: CardanoWalletName): Promise<CardanoApi | null> {
    console.log(`Attempting CIP-95 connection for ${walletName}`);
    
    return new Promise((resolve) => {
      const messageId = uuidv4();
      const timeoutDuration = 10000; // 10 second timeout
      
      const timeoutId = setTimeout(() => {
        console.log('CIP-95 connection timed out');
        this.messageHandlers.delete(messageId);
        resolve(null);
      }, timeoutDuration);

      const handler = (event: MessageEvent) => {
        if (!event.data?.type?.startsWith('CARDANO_WALLET_')) return;
        if (event.data.id !== messageId) return;
        
        this.messageHandlers.delete(messageId);
        clearTimeout(timeoutId);
        
        if (event.data.error) {
          console.log('CIP-95 connection error:', event.data.error);
          resolve(null);
          return;
        }

        console.log('CIP-95 connection successful');
        const api = createWalletAPI(event.data.data);
        resolve(api);
      };

      this.messageHandlers.set(messageId, handler);
      window.addEventListener('message', handler);
      
      window.postMessage({
        type: 'CARDANO_WALLET_CONNECT',
        id: messageId,
        data: { wallet: walletName }
      }, '*');

      console.log('CIP-95 connect message sent');
    });
  }

  private async connectWithCIP30(walletName: CardanoWalletName): Promise<CardanoApi> {
    console.log(`Attempting CIP-30 connection for ${walletName}`);
    
    const wallet = window.cardano?.[walletName];
    if (!wallet) {
      console.error(`${walletName} wallet not found`);
      throw new Error(`${walletName} wallet not found`);
    }

    try {
      console.log('Checking wallet API version compatibility');
      if (wallet.apiVersion) {
        console.log(`Wallet API version: ${wallet.apiVersion}`);
      }

      const api = await wallet.enable();
      console.log('CIP-30 connection successful');
      return createWalletAPI(api);
    } catch (error) {
      console.error('CIP-30 connection error:', error);
      throw error;
    }
  }

  public disconnect(): void {
    console.log('Disconnecting wallet');
    this.connectionState = 'DISCONNECTED';
    this.state.connectedWallet = null;
    this.cleanup();
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
    console.error(`${message}: ${errorMessage}`);
    this.state.error = `${message}: ${errorMessage}`;
    this.eventManager.emit('ERROR', { message: this.state.error });
  }

  private cleanup(): void {
    console.log('Cleaning up ConnectionManager');
    this.messageHandlers.forEach((handler, id) => {
      window.removeEventListener('message', handler);
      this.messageHandlers.delete(id);
    });
    
    this.cleanupFunctions.forEach(cleanup => cleanup());
    this.cleanupFunctions = [];
  }
}
