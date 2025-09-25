import React, { useState } from 'react';
import { useDataStore } from '../store/dataStore';
import { useAuthStore } from '../store/authStore';
import { 
  Bell, 
  BellOff, 
  Check, 
  Trash2, 
  Filter,
  Search,
  Mail,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export function NotificationsPage() {
  const { user } = useAuthStore();
  const { getUserNotifications, markNotificationAsRead, deleteNotification, markAllNotificationsAsRead } = useDataStore();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'match' | 'contact' | 'system'>('all');

  if (!user) return null;

  const allNotifications = getUserNotifications(user.id);
  
  const filteredNotifications = allNotifications.filter(notification => {
    const statusMatch = filter === 'all' || 
                       (filter === 'read' && notification.isRead) ||
                       (filter === 'unread' && !notification.isRead);
    
    const typeMatch = typeFilter === 'all' || notification.type === typeFilter;
    
    return statusMatch && typeMatch;
  });

  const unreadCount = allNotifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId);
    toast.success('Notification marked as read');
  };

  const handleDelete = (notificationId: string) => {
    deleteNotification(notificationId);
    toast.success('Notification deleted');
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead(user.id);
    toast.success('All notifications marked as read');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'match':
        return <CheckCircle className="w-5 h-5 text-success-600" />;
      case 'contact':
        return <MessageSquare className="w-5 h-5 text-primary-600" />;
      case 'system':
        return <AlertCircle className="w-5 h-5 text-warning-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string, isRead: boolean) => {
    const opacity = isRead ? 'bg-opacity-50' : 'bg-opacity-100';
    
    switch (type) {
      case 'match':
        return `bg-success-50 border-success-200 ${opacity}`;
      case 'contact':
        return `bg-primary-50 border-primary-200 ${opacity}`;
      case 'system':
        return `bg-warning-50 border-warning-200 ${opacity}`;
      default:
        return `bg-gray-50 border-gray-200 ${opacity}`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-2">
              Stay updated with your lost & found activities
              {unreadCount > 0 && (
                <span className="ml-2 px-2 py-1 bg-error-100 text-error-800 text-sm rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </p>
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              <Check className="w-4 h-4" />
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Types</option>
              <option value="match">Matches</option>
              <option value="contact">Messages</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-600">
              {filter === 'unread' 
                ? "You're all caught up! No unread notifications."
                : "You don't have any notifications yet."}
            </p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`border rounded-lg p-6 transition-all duration-200 ${
                getNotificationColor(notification.type, notification.isRead)
              } ${!notification.isRead ? 'shadow-md' : 'shadow-sm'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className={`text-lg font-semibold ${
                        notification.isRead ? 'text-gray-700' : 'text-gray-900'
                      }`}>
                        {notification.title}
                      </h3>
                      
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                      )}
                      
                      <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                        notification.type === 'match' 
                          ? 'bg-success-100 text-success-800'
                          : notification.type === 'contact'
                          ? 'bg-primary-100 text-primary-800'
                          : 'bg-warning-100 text-warning-800'
                      }`}>
                        {notification.type}
                      </span>
                    </div>
                    
                    <p className={`mb-3 ${
                      notification.isRead ? 'text-gray-600' : 'text-gray-800'
                    }`}>
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{formatDistanceToNow(notification.createdAt, { addSuffix: true })}</span>
                      {notification.isRead && (
                        <span className="flex items-center space-x-1">
                          <Check className="w-3 h-3" />
                          <span>Read</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-md"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="p-2 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded-md"
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More (if needed for pagination) */}
      {filteredNotifications.length > 0 && (
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Showing {filteredNotifications.length} of {allNotifications.length} notifications
          </p>
        </div>
      )}
    </div>
  );
}