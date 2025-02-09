
import { WalletBridgeEvent, WalletEventType } from '../types/cip95Types';
import { v4 as uuidv4 } from 'uuid';

export class EventManager {
  private eventListeners: Map<string, Set<(event: WalletBridgeEvent) => void>>;
  private eventHistory: WalletBridgeEvent[];
  private readonly MAX_HISTORY = 50;

  constructor() {
    this.eventListeners = new Map();
    this.eventHistory = [];
    this.setupWindowCleanup();
  }

  private setupWindowCleanup() {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.cleanup());
    }
  }

  public on(eventType: WalletEventType, callback: (event: WalletBridgeEvent) => void): void {
    console.log(`Adding listener for event type: ${eventType}`);
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set());
    }
    this.eventListeners.get(eventType)?.add(callback);
  }

  public off(eventType: WalletEventType, callback: (event: WalletBridgeEvent) => void): void {
    console.log(`Removing listener for event type: ${eventType}`);
    this.eventListeners.get(eventType)?.delete(callback);
  }

  public emit(type: WalletEventType, data?: any): void {
    const event: WalletBridgeEvent = {
      id: uuidv4(),
      type,
      data
    };
    
    console.log(`Emitting event: ${type}`, data);
    this.eventHistory.push(event);
    
    // Maintain history size
    if (this.eventHistory.length > this.MAX_HISTORY) {
      this.eventHistory.shift();
    }

    this.eventListeners.get(type)?.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error(`Error in event listener for ${type}:`, error);
        // Emit error event
        this.emit('ERROR', { 
          originalEvent: type,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });
  }

  public getEventHistory(): WalletBridgeEvent[] {
    return [...this.eventHistory];
  }

  public cleanup(): void {
    console.log('Cleaning up EventManager');
    this.eventListeners.clear();
    this.eventHistory = [];
  }
}
