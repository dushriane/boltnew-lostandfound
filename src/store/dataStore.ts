import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Item, Match, Notification, Payment, User } from '../types';
import { mockItems, mockUsers} from '../data/mockData';
import { findMatches } from '../utils/matching';
import { generateMatchNotification, sendEmailNotification } from '../utils/notifications';
import { ensureDate } from '../utils/date';


interface DataState {
  items: Item[];
  matches: Match[];
  users: User[]
  notifications: Notification[];
  payments: Payment[];
  loading: boolean;
  
  // Item operations
  addItem: (item: Omit<Item, 'id' | 'dateReported' | 'status' | 'isVerified'>) => Promise<Item>;
  updateItem: (id: string, updates: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  getItemsByUser: (userId: string) => Item[];
  getAllItems: (page?: number, limit?: number) => Item[];
  searchItems: (query: string) => Item[];
  
  // Match operations
  confirmMatch: (matchId: string) => void;
  rejectMatch: (matchId: string) => void;
  getMatchesForUser: (userId: string) => Match[];
  
  // Notification operations
  addNotification: (notificationId: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  deleteNotification: (notificationId: string) => void;
  markAllNotificationsAsRead: (userId: string) => void;
  getUserNotifications: (userId: string) => Notification[];
  
  // Payment operations
  createPayment: (payment: Omit<Payment, 'id' | 'createdAt' | 'status'>) => Payment;
  updatePaymentStatus: (id: string, status: Payment['status']) => void;
  
  // Admin operations
  verifyItem: (id: string, adminNotes?: string) => void;
  getAdminStats: () => any;

  getUserStats: (userId: string) => {
    totalItems: number;
    foundItems: number;
    lostItems: number;
    matches: number;
  };
}

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      items: mockItems,
      matches: [],
      users: mockUsers,
      notifications: [],
      payments: [],
      loading: false,

      addItem: async (itemData) => {
        set({ loading: true });
        
        const newItem: Item = {
          ...itemData,
          id: Date.now().toString(),
          dateReported: new Date(),
          status: 'active',
          isVerified: false,
        };
        
        set(state => ({ 
          items: [...state.items, newItem],
          loading: false 
        }));
        
        // Find matches and send notifications
        setTimeout(() => {
          const currentState = get();
          const newMatches = findMatches(currentState.items);
          const addedMatches = newMatches.filter(
            match => !currentState.matches.find(m => m.id === match.id)
          );
          
          if (addedMatches.length > 0) {
            set(state => ({ matches: [...state.matches, ...addedMatches] }));
            
            // Send notifications for new matches
            addedMatches.forEach(async (match) => {
              const lostItem = currentState.items.find(item => item.id === match.lostItemId);
              const foundItem = currentState.items.find(item => item.id === match.foundItemId);
              
              if (lostItem && foundItem) {
                const notifications = generateMatchNotification(match, lostItem, foundItem);
                
                for (const notification of notifications) {
                  await sendEmailNotification(notification);
                  
                  // Add in-app notification
                  get().addNotification({
                    userId: notification.to === lostItem.contactEmail ? lostItem.userId : foundItem.userId,
                    type: 'match_found',
                    title: 'Potential Match Found!',
                    message: `We found a ${Math.round(match.matchScore * 100)}% match for your ${lostItem.type === 'lost' ? 'lost' : 'found'} ${lostItem.category}`,
                    isRead: false,
                    relatedItemId: notification.to === lostItem.contactEmail ? lostItem.id : foundItem.id,
                    relatedMatchId: match.id,
                  });
                }
                
                // Mark match as notification sent
                set(state => ({
                  matches: state.matches.map(m => 
                    m.id === match.id ? { ...m, notificationSent: true } : m
                  )
                }));
              }
            });
          }
        }, 1000);
        
        return newItem;
      },

      updateItem: (id, updates) => {
        set(state => ({
          items: state.items.map(item => 
            item.id === id ? { ...item, ...updates } : item
          )
        }));
      },

      deleteItem: (id) => {
        set(state => ({
          items: state.items.filter(item => item.id !== id),
          matches: state.matches.filter(match => 
            match.lostItemId !== id && match.foundItemId !== id
          )
        }));
      },

      getItemsByUser: (userId) => {
        return get().items.filter(item => item.userId === userId);
      },

      getAllItems: (page = 1, limit = 20) => {
        const items = get().items.filter(item => item.status === 'active');
        const startIndex = (page - 1) * limit;
        return items.slice(startIndex, startIndex + limit);
      },

      searchItems: (query) => {
        const items = get().items;
        const lowercaseQuery = query.toLowerCase();
        
        return items.filter((item) =>
          item.title.toLowerCase().includes(lowercaseQuery) ||
          item.description.toLowerCase().includes(lowercaseQuery) ||
          item.location.toLowerCase().includes(lowercaseQuery) ||
          item.category.toLowerCase().includes(lowercaseQuery) ||
          item.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
        );
      },

      confirmMatch: (matchId) => {
        const match = get().matches.find(m => m.id === matchId);
        if (match) {
          set(state => ({
            matches: state.matches.map(m => 
              m.id === matchId ? { ...m, status: 'confirmed' } : m
            ),
            items: state.items.map(item => {
              if (item.id === match.lostItemId || item.id === match.foundItemId) {
                return { ...item, status: 'matched', matchedWith: 
                  item.id === match.lostItemId ? match.foundItemId : match.lostItemId 
                };
              }
              return item;
            })
          }));
        }
      },

      rejectMatch: (matchId) => {
        set(state => ({
          matches: state.matches.map(m => 
            m.id === matchId ? { ...m, status: 'rejected' } : m
          )
        }));
      },

      getMatchesForUser: (userId) => {
        const userItems = get().items.filter(item => item.userId === userId);
        const userItemIds = userItems.map(item => item.id);
        
        return get().matches.filter(match => 
          userItemIds.includes(match.lostItemId) || userItemIds.includes(match.foundItemId)
        );
      },

      addNotification: (notificationData) => {
        const notification: Notification = {
          ...notificationData,
          id: Date.now().toString(),
          createdAt: new Date(),
        };
        
        set(state => ({
          notifications: [notification, ...state.notifications]
        }));
      },

      markNotificationAsRead: (notificationId: string) => {
        set(state => ({
          notifications: state.notifications.map(n => 
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        }));
      },

      getUserNotifications: (userId) => {
        const { notifications } = get();
        return notifications.filter(n => n.userId === userId);
      },

      deleteNotification: (notificationId: string) => {
        set((state) => ({
          notifications: state.notifications.filter(notification => 
            notification.id !== notificationId
          )
        }));
      },

      markAllNotificationsAsRead: (userId: string) => {
        set((state) => ({
          notifications: state.notifications.map(notification =>
            notification.userId === userId 
              ? { ...notification, isRead: true }
              : notification
          )
        }));
      },

      createPayment: (paymentData) => {
        const payment: Payment = {
          ...paymentData,
          id: Date.now().toString(),
          createdAt: new Date(),
          status: 'pending',
        };
        
        set(state => ({
          payments: [...state.payments, payment]
        }));
        
        return payment;
      },

      updatePaymentStatus: (id, status) => {
        set(state => ({
          payments: state.payments.map(p => 
            p.id === id ? { 
              ...p, 
              status, 
              completedAt: status === 'completed' ? new Date() : p.completedAt 
            } : p
          )
        }));
      },

      verifyItem: (id, adminNotes) => {
        set(state => ({
          items: state.items.map(item => 
            item.id === id ? { ...item, isVerified: true, adminNotes } : item
          )
        }));
      },

      getUserStats: (userId: string) => {
        const { items, matches } = get();
        
        // Filter items for the specific user
        const userItems = items.filter(item => item.userId === userId);
        
        // Calculate user matches (where user is involved in either lost or found item)
        const userMatches = matches.filter(match => {
          const lostItem = items.find(item => item.id === match.lostItemId);
          const foundItem = items.find(item => item.id === match.foundItemId);
          return lostItem?.userId === userId || foundItem?.userId === userId;
        });
        
        return {
          totalItems: userItems.length,
          foundItems: userItems.filter(item => item.type === 'found').length,
          lostItems: userItems.filter(item => item.type === 'lost').length,
          matches: userMatches.length,
        };
      },

      getAdminStats: () => {
        const state = get();
        return {
          totalItems: state.items.length,
          activeItems: state.items.filter(item => item.status === 'active').length,
          resolvedItems: state.items.filter(item => item.status === 'resolved').length,
          totalMatches: state.matches.length,
          pendingReviews: state.items.filter(item => !item.isVerified).length,
          recentActivity: {
            newItems: state.items.filter(item => 
              new Date().getTime() - item.dateReported.getTime() < 24 * 60 * 60 * 1000
            ).length,
            newMatches: state.matches.filter(match => 
              new Date().getTime() - match.dateMatched.getTime() < 24 * 60 * 60 * 1000
            ).length,
          }
        };
      },
    }),
    {
      name: 'lost-found-data',
      partialize: (state) => ({ 
        items: state.items,
        matches: state.matches,
        notifications: state.notifications,
        payments: state.payments,
      }),
      serialize: (state) => {
        return JSON.stringify(state, (key, value) => {
          // Convert Date objects to ISO strings for storage
          if (value instanceof Date) {
            return { __type: 'Date', value: value.toISOString() };
          }
          return value;
        });
      },
      deserialize: (str) => {
        return JSON.parse(str, (key, value) => {
          // Convert ISO strings back to Date objects
          if (value && typeof value === 'object' && value.__type === 'Date') {
            return new Date(value.value);
          }
          return value;
        });
      }
    }
  )
);


