import { useState, useEffect, createContext, useContext } from 'react';
import PropTypes from 'prop-types';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info',
      duration: 4000,
      ...notification
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto remove after duration
    setTimeout(() => {
      removeNotification(id);
    }, newNotification.duration);

    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const value = {
    notifications,
    addNotification,
    removeNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
}

function NotificationContainer() {
  const { notifications, removeNotification } = useContext(NotificationContext);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}

function NotificationItem({ notification, onRemove }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleRemove = () => {
    setIsVisible(false);
    setTimeout(onRemove, 300); // Wait for exit animation
  };

  const getNotificationStyles = () => {
    const baseStyles = "transform transition-all duration-300 ease-out";
    const visibilityStyles = isVisible 
      ? "translate-x-0 opacity-100 scale-100" 
      : "translate-x-full opacity-0 scale-95";

    const typeStyles = {
      success: "bg-green-500 text-white",
      error: "bg-red-500 text-white",
      warning: "bg-yellow-500 text-white",
      info: "bg-blue-500 text-white",
      recipe: "bg-gradient-to-r from-orange-500 to-rose-500 text-white"
    };

    return `${baseStyles} ${visibilityStyles} ${typeStyles[notification.type] || typeStyles.info}`;
  };

  const getIcon = () => {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
      recipe: '🍳'
    };
    return icons[notification.type] || icons.info;
  };

  return (
    <div className={`${getNotificationStyles()} rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-sm max-w-sm`}>
      <div className="flex items-start gap-3">
        <span className="text-lg flex-shrink-0 animate-bounce">
          {getIcon()}
        </span>
        <div className="flex-1 min-w-0">
          {notification.title && (
            <h4 className="font-semibold text-sm mb-1">{notification.title}</h4>
          )}
          <p className="text-sm opacity-90 leading-relaxed">{notification.message}</p>
        </div>
        <button
          onClick={handleRemove}
          className="flex-shrink-0 p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <span className="text-sm">×</span>
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-white/40 rounded-full animate-shrink"
          style={{ 
            animationDuration: `${notification.duration}ms`,
            animationTimingFunction: 'linear'
          }}
        />
      </div>
    </div>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}

// Convenience hooks
export function useNotify() {
  const { addNotification } = useNotifications();
  
  return {
    success: (message, title) => addNotification({ type: 'success', message, title }),
    error: (message, title) => addNotification({ type: 'error', message, title }),
    warning: (message, title) => addNotification({ type: 'warning', message, title }),
    info: (message, title) => addNotification({ type: 'info', message, title }),
    recipe: (message, title) => addNotification({ type: 'recipe', message, title, duration: 6000 })
  };
}

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired
};

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    title: PropTypes.string,
    duration: PropTypes.number
  }).isRequired,
  onRemove: PropTypes.func.isRequired
};
