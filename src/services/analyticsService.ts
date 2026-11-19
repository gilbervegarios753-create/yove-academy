/**
 * Telemetry and Analytics Service for YOVE Academy LMS
 */

export interface AnalyticsEvent {
  eventType: 'page_view' | 'lesson_watch' | 'lab_run' | 'case_solved' | 'quiz_completed';
  userId?: string;
  metadata: Record<string, any>;
  timestamp: string;
}

export class AnalyticsService {
  private static eventsLog: AnalyticsEvent[] = [];

  public static track(eventType: AnalyticsEvent['eventType'], metadata: Record<string, any> = {}, userId?: string) {
    const event: AnalyticsEvent = {
      eventType,
      userId: userId || 'anonymous',
      metadata,
      timestamp: new Date().toISOString()
    };
    this.eventsLog.push(event);
    if (import.meta.env.DEV) {
      console.log(`[YOVE Telemetry Logged]`, event);
    }
  }

  public static getRecentEvents(): AnalyticsEvent[] {
    return [...this.eventsLog].reverse();
  }
}
