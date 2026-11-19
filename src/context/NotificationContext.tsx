import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { NotificationModel } from '../types/database';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: NotificationModel[];
  unreadCount: number;
  filterType: string;
  setFilterType: (type: string) => void;
  filterRead: string;
  setFilterRead: (read: string) => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  addNotification: (notif: { type: string; title: string; message: string; metadata?: any }) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationModel[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterRead, setFilterRead] = useState<string>('all');
  const { token } = useAuth();

  const refreshNotifications = useCallback(async () => {
    if (!token) return;
    try {
      let url = '/api/v1/notifications';
      const params = new URLSearchParams();
      if (filterType && filterType !== 'all') {
        params.append('type', filterType);
      }
      if (filterRead === 'unread') {
        params.append('read', 'false');
      } else if (filterRead === 'read') {
        params.append('read', 'true');
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.success) {
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      // Gracefully handle network error or offline mode
    }
  }, [token, filterType, filterRead]);

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  // Setup SSE for real-time notifications if available
  useEffect(() => {
    if (!token) return;
    try {
      const eventSource = new EventSource(`/api/v1/notifications/stream?token=${token}`);
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'new_notification' || data.type === 'connected') {
            refreshNotifications();
          }
        } catch (e) {
          // ignore ping
        }
      };
      eventSource.onerror = () => {
        eventSource.close();
      };
      return () => {
        eventSource.close();
      };
    } catch (e) {
      // fallback if SSE fails
    }
  }, [token, refreshNotifications]);

  const unreadCount = (notifications || []).filter(n => !n.isRead).length;

  const markAsRead = async (id: string) => {
    if (!token) return;
    try {
      await fetch(`/api/v1/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error("Error marking notification read:", err);
    }
  };

  const markAllAsRead = async () => {
    if (!token) return;
    try {
      await fetch('/api/v1/notifications/read-all', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Error marking all read:", err);
    }
  };

  const deleteNotification = async (id: string) => {
    if (!token) return;
    try {
      await fetch(`/api/v1/notifications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const addNotification = async (notif: { type: string; title: string; message: string; metadata?: any }) => {
    if (!token) return;
    try {
      const res = await fetch('/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(notif)
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(prev => [data.notification, ...prev]);
      }
    } catch (err) {
      console.error("Error adding notification:", err);
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      filterType,
      setFilterType,
      filterRead,
      setFilterRead,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      addNotification,
      refreshNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications debe ser utilizado dentro de NotificationProvider');
  }
  return context;
};
