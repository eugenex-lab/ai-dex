
import { WalletBridgeEvent, WalletEventType } from '../types/cip95Types';
import { v4 as uuidv4 } from 'uuid';

export class EventManager {
  private eventListeners: Map<string, Set<(event: WalletBridgeEvent) => void>>;

  constructor() {
    this.eventListeners = new Map();
  }

  on(eventType: WalletEventType, callback: (event: WalletBridgeEvent) => void): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set());
    }
    this.eventListeners.get(eventType)?.add(callback);
  }

  off(eventType: WalletEventType, callback: (event: WalletBridgeEvent) => void): void {
    this.eventListeners.get(eventType)?.delete(callback);
  }

  emit(type: WalletEventType, data?: any): void {
    const event: WalletBridgeEvent = {
      id: uuidv4(),
      type,
      data
    };
    this.eventListeners.get(type)?.forEach(callback => callback(event));
  }
}
