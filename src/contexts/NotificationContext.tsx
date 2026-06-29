import React, { createContext, useContext, useState } from 'react';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  time: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  addNotification: (title: string, message: string, type?: NotificationItem['type']) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n-1',
      title: 'AI Signal Triggered',
      message: 'New BUY signal generated for NVDA with 94% confidence score.',
      type: 'success',
      time: '2 min ago',
      read: false,
    },
    {
      id: 'n-2',
      title: 'Options PCR Alert',
      message: 'AAPL Put/Call Ratio crossed 1.25 indicating bullish positioning.',
      type: 'info',
      time: '15 min ago',
      read: false,
    },
    {
      id: 'n-3',
      title: 'Portfolio Drawdown Alert',
      message: 'Portfolio Max Drawdown reached -4.8% after TSLA price action.',
      type: 'warning',
      time: '1 hr ago',
      read: true,
    },
  ]);

  const addNotification = (title: string, message: string, type: NotificationItem['type'] = 'info') => {
    const newNotif: NotificationItem = {
      id: `n-${Date.now()}`,
      title,
      message,
      type,
      time: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, markAsRead, markAllAsRead, clearAll }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
};
