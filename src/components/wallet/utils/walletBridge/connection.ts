
import { CardanoApi, CardanoWalletName, WalletState } from '../types/cardanoTypes';
import { WalletBridgeState, WalletCapabilities } from '../types/cip95Types';
import { createWalletAPI } from './api';
import { EventManager } from './events';
import { v4 as uuidv4 } from 'uuid';

export class ConnectionManager {
  private state: WalletBridgeState;
  private eventManager: EventManager;
  private connectionTimeout: number = 10000; // 10 seconds timeout
  private retryAttempts: number = 3;
  private currentRetry: number = 0;

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
    console.log('ConnectionManager initialized');
  }

  private async waitForTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
    let timeoutId: NodeJS.Timeout;
    
    const timeoutPromise = new Promise<T>((_, reject) => {
      timeoutId = setTimeout(() => {
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
    
    if (this.state.isConnecting) {
      console.log('Connection already in progress');
      throw new Error('Connection already in progress');
    }

    try {
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
            return cip95Connection;
          }

          // Fallback to CIP-30
          console.log('Falling back to CIP-30 connection');
          return await this.connectWithCIP30(walletName);
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
      
      const timeoutId = setTimeout(() => {
        console.log('CIP-95 connection timed out');
        resolve(null);
      }, 10000); // 10 second timeout

      window.postMessage({
        type: 'CARDANO_WALLET_CONNECT',
        id: messageId,
        data: { wallet: walletName }
      }, '*');

      console.log('CIP-95 connect message sent');

      const handler = (message: any) => {
        if (message.id !== messageId) return;
        
        clearTimeout(timeoutId);
        if (message.error) {
          console.log('CIP-95 connection error:', message.error);
          resolve(null);
          return;
        }

        console.log('CIP-95 connection successful');
        const api = createWalletAPI(message.data);
        resolve(api);
      };

      // Add handler cleanup logic here if needed
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
    console.error(`${message}: ${errorMessage}`);
    this.state.error = `${message}: ${errorMessage}`;
    this.eventManager.emit('ERROR', { message: this.state.error });
  }
}
