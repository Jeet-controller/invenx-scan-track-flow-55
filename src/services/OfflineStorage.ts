
import { Product, HistoryEntry } from "../contexts/InventoryContext";

// Interface for storing pending changes that need to be synced
interface PendingSync {
  type: 'product' | 'history';
  action: 'add' | 'update' | 'delete';
  data: any;
  timestamp: string;
}

export class OfflineStorage {
  private static readonly PRODUCTS_KEY = 'invenx_products';
  private static readonly HISTORY_KEY = 'invenx_history';
  private static readonly PENDING_SYNC_KEY = 'invenx_pending_sync';

  // Load products from local storage
  static loadProducts(): Product[] {
    try {
      const productsJson = localStorage.getItem(this.PRODUCTS_KEY);
      return productsJson ? JSON.parse(productsJson) : [];
    } catch (error) {
      console.error("Failed to load products from storage:", error);
      return [];
    }
  }

  // Save products to local storage
  static saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
    } catch (error) {
      console.error("Failed to save products to storage:", error);
    }
  }

  // Load history from local storage
  static loadHistory(): HistoryEntry[] {
    try {
      const historyJson = localStorage.getItem(this.HISTORY_KEY);
      return historyJson ? JSON.parse(historyJson) : [];
    } catch (error) {
      console.error("Failed to load history from storage:", error);
      return [];
    }
  }

  // Save history to local storage
  static saveHistory(history: HistoryEntry[]): void {
    try {
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save history to storage:", error);
    }
  }

  // Add pending sync item
  static addPendingSync(pendingSync: Omit<PendingSync, 'timestamp'>): void {
    try {
      const pendingSyncItems = this.getPendingSyncItems();
      pendingSyncItems.push({
        ...pendingSync,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem(this.PENDING_SYNC_KEY, JSON.stringify(pendingSyncItems));
    } catch (error) {
      console.error("Failed to add pending sync item:", error);
    }
  }

  // Get pending sync items
  static getPendingSyncItems(): PendingSync[] {
    try {
      const pendingSyncJson = localStorage.getItem(this.PENDING_SYNC_KEY);
      return pendingSyncJson ? JSON.parse(pendingSyncJson) : [];
    } catch (error) {
      console.error("Failed to get pending sync items:", error);
      return [];
    }
  }

  // Clear pending sync items
  static clearPendingSyncItems(): void {
    try {
      localStorage.setItem(this.PENDING_SYNC_KEY, JSON.stringify([]));
    } catch (error) {
      console.error("Failed to clear pending sync items:", error);
    }
  }

  // Check if the device is online
  static isOnline(): boolean {
    return navigator.onLine;
  }

  // Register online/offline event listeners
  static registerNetworkListeners(onOnline: () => void, onOffline: () => void): void {
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
  }

  // Unregister online/offline event listeners
  static unregisterNetworkListeners(onOnline: () => void, onOffline: () => void): void {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  }
}
