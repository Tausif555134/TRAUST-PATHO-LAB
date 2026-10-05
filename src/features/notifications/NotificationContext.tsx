import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Notification } from '../../types';
import { dbService, subscribeToDbChanges } from '../../services/db';
import { useAuth } from '../auth/AuthContext';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const refreshNotifications = useCallback(async () => {
    try {
      const items = await dbService.getNotifications(currentUser?.id);
      setNotifications(items);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    refreshNotifications();
    const unsubscribe = subscribeToDbChanges(() => {
      refreshNotifications();
    });
    return unsubscribe;
  }, [refreshNotifications]);

  const markAsRead = async (id: string) => {
    await dbService.markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
