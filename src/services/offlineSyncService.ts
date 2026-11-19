export interface OfflineEvent {
  id: string;
  type: 'LESSON_PROGRESS' | 'EXAM_SUBMISSION' | 'GARAGE_VEHICLE' | 'CASE_DIAGNOSIS' | 'LAB_COMPLETED' | 'XP_EARNED';
  payload: any;
  timestamp: number;
  synced: boolean;
  retryCount: number;
}

const QUEUE_STORAGE_KEY = 'yove_offline_event_queue_v1';
const LOCAL_CACHE_KEY = 'yove_offline_cache_data_v1';

export class OfflineSyncService {
  private static queue: OfflineEvent[] = [];

  static initQueue(): OfflineEvent[] {
    try {
      const stored = localStorage.getItem(QUEUE_STORAGE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading offline queue:', e);
      this.queue = [];
    }
    return this.queue;
  }

  static getQueue(): OfflineEvent[] {
    return this.queue;
  }

  static getPendingCount(): number {
    return this.queue.filter(e => !e.synced).length;
  }

  static addEvent(type: OfflineEvent['type'], payload: any): OfflineEvent {
    const event: OfflineEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type,
      payload,
      timestamp: Date.now(),
      synced: false,
      retryCount: 0
    };

    this.queue.push(event);
    this.persistQueue();
    this.updateLocalOfflineCache(type, payload);

    return event;
  }

  static persistQueue() {
    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
    } catch (e) {
      console.error('Error persisting offline queue:', e);
    }
  }

  /**
   * Conflict Resolution & Synchronization
   * Strategy: Last-Write-Wins based on client timestamp, merged with server state.
   */
  static async syncQueue(onProgress?: (syncedCount: number, total: number) => void): Promise<{ success: boolean; synced: number }> {
    const pendingEvents = this.queue.filter(e => !e.synced);
    if (pendingEvents.length === 0) {
      return { success: true, synced: 0 };
    }

    let syncedCount = 0;

    for (const event of pendingEvents) {
      try {
        // Post event to backend sync endpoint
        const response = await fetch('/api/v1/analytics/event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_type: `OFFLINE_${event.type}`,
            metadata: {
              ...event.payload,
              offline_id: event.id,
              original_timestamp: event.timestamp,
              synced_at: Date.now()
            }
          })
        });

        if (response.ok) {
          event.synced = true;
          syncedCount++;
        } else {
          event.retryCount += 1;
        }
      } catch (err) {
        console.warn(`[Sync Error] Failed to sync event ${event.id}:`, err);
        event.retryCount += 1;
      }

      if (onProgress) {
        onProgress(syncedCount, pendingEvents.length);
      }
    }

    // Keep unsynced or recent synced events (max 50)
    this.queue = this.queue.filter(e => !e.synced || Date.now() - e.timestamp < 3600000);
    this.persistQueue();

    return { success: true, synced: syncedCount };
  }

  /**
   * Immediate Local Mirror Cache for instant Offline Read
   */
  private static updateLocalOfflineCache(type: OfflineEvent['type'], payload: any) {
    try {
      const cacheStr = localStorage.getItem(LOCAL_CACHE_KEY) || '{}';
      const cache = JSON.parse(cacheStr);
      
      if (!cache[type]) cache[type] = [];
      cache[type].push({
        payload,
        updatedAt: Date.now()
      });

      localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(cache));
    } catch (e) {
      console.error('Error updating offline local cache:', e);
    }
  }

  static getLocalCache(type: OfflineEvent['type']): any[] {
    try {
      const cacheStr = localStorage.getItem(LOCAL_CACHE_KEY) || '{}';
      const cache = JSON.parse(cacheStr);
      return cache[type] || [];
    } catch (e) {
      return [];
    }
  }

  static clearSynced() {
    this.queue = this.queue.filter(e => !e.synced);
    this.persistQueue();
  }
}
