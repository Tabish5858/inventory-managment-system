"use client";

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { notificationService } from '../services/notificationService';

export default function NotificationsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load notifications from storage
    loadNotifications();

    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadNotifications = () => {
    const storedNotifications = notificationService.getAll();
    setNotifications(storedNotifications);
    setUnreadCount(notificationService.getUnreadCount());
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Mark notifications as read when opening menu
      notificationService.markAllAsRead();
      loadNotifications(); // Reload to update read status
    }
  };

  const handleDeleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    notificationService.delete(id);
    loadNotifications();
  };

  const handleClearAll = () => {
    notificationService.clearAll();
    loadNotifications();
  };

  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.toLocaleString();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'error':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'success':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors relative"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs text-gray-400 hover:text-white"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                <p>No notifications</p>
              </div>
            ) : (
              <ul>
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={`p-4 border-b border-gray-700 hover:bg-gray-700 ${!notification.read ? 'bg-gray-700' : ''}`}
                  >
                    <div className="flex items-start">
                      <div className="mr-2 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium text-white">{notification.title}</p>
                          <button
                            onClick={(e) => handleDeleteNotification(notification.id, e)}
                            className="text-gray-400 hover:text-gray-200"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-sm text-gray-300">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatTime(notification.time)}</p>

                        {notification.type === 'warning' && notification.message.includes('low') && (
                          <Link
                            href="/products"
                            className="inline-block mt-2 text-xs text-blue-400 hover:text-blue-300"
                          >
                            View Low Stock Products
                          </Link>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
