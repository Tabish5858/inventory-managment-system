// Notification service to handle alert notifications

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "warning" | "error" | "info";
  time: Date;
  read: boolean;
}

// Local storage key for notifications
const NOTIFICATIONS_STORAGE_KEY = "inventory_notifications";

// Get notifications from storage
const getStoredNotifications = (): Notification[] => {
  if (typeof window === "undefined") return [];

  const storedNotifications = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
  return storedNotifications ? JSON.parse(storedNotifications) : [];
};

// Save notifications to storage
const saveNotifications = (notifications: Notification[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    NOTIFICATIONS_STORAGE_KEY,
    JSON.stringify(notifications)
  );
};

// Add a new notification
const addNotification = (
  title: string,
  message: string,
  type: "success" | "warning" | "error" | "info" = "info"
): Notification => {
  const newNotification: Notification = {
    id: Date.now().toString(),
    title,
    message,
    type,
    time: new Date(),
    read: false,
  };

  const notifications = getStoredNotifications();
  notifications.unshift(newNotification); // Add to beginning of array

  // Keep only the most recent 50 notifications
  const trimmedNotifications = notifications.slice(0, 50);
  saveNotifications(trimmedNotifications);

  // Show browser notification if supported
  if (typeof window !== "undefined" && "Notification" in window) {
    // Check if permission is already granted
    if (Notification.permission === "granted") {
      new Notification(title, { body: message });
    }
    // Otherwise, request permission
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, { body: message });
        }
      });
    }
  }

  return newNotification;
};

// Mark notification as read
const markAsRead = (id: string): void => {
  const notifications = getStoredNotifications();
  const updatedNotifications = notifications.map((notification) =>
    notification.id === id ? { ...notification, read: true } : notification
  );
  saveNotifications(updatedNotifications);
};

// Mark all notifications as read
const markAllAsRead = (): void => {
  const notifications = getStoredNotifications();
  const updatedNotifications = notifications.map((notification) => ({
    ...notification,
    read: true,
  }));
  saveNotifications(updatedNotifications);
};

// Delete a notification
const deleteNotification = (id: string): void => {
  const notifications = getStoredNotifications();
  const filteredNotifications = notifications.filter(
    (notification) => notification.id !== id
  );
  saveNotifications(filteredNotifications);
};

// Delete all notifications
const clearAllNotifications = (): void => {
  saveNotifications([]);
};

// Get unread notification count
const getUnreadCount = (): number => {
  const notifications = getStoredNotifications();
  return notifications.filter((notification) => !notification.read).length;
};

// Check for low stock products and create notifications
const checkLowStockAndNotify = async (products: any[]): Promise<void> => {
  const lowStockProducts = products.filter((product) => product.is_low_stock);

  if (lowStockProducts.length > 0) {
    // Group notification for multiple low stock products
    if (lowStockProducts.length > 1) {
      addNotification(
        "Low Stock Alert",
        `${lowStockProducts.length} products are running low on stock and need to be restocked.`,
        "warning"
      );
    } else {
      // Individual notification for a single low stock product
      const product = lowStockProducts[0];
      addNotification(
        "Low Stock Alert",
        `${product.name} is running low (${product.quantity}/${product.low_stock_threshold}). Consider restocking.`,
        "warning"
      );
    }
  }
};

export const notificationService = {
  getAll: getStoredNotifications,
  add: addNotification,
  markAsRead,
  markAllAsRead,
  delete: deleteNotification,
  clearAll: clearAllNotifications,
  getUnreadCount,
  checkLowStockAndNotify,
};
