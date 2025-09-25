@@ .. @@
   getUserNotifications: (userId: string) => Notification[];
   addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
   markNotificationAsRead: (notificationId: string) => void;
+  deleteNotification: (notificationId: string) => void;
+  markAllNotificationsAsRead: (userId: string) => void;
   contactOwner: (itemId: string, message: string) => void;
   updateItemStatus: (itemId: string, status: 'active' | 'matched' | 'resolved') => void;
   verifyItem: (itemId: string, notes?: string) => void;
   getAdminStats: () => AdminStats;
+  getUserStats: (userId: string) => UserStats;
 }
@@ .. @@
+interface UserStats {
+  totalItems: number;
+  lostItems: number;
+  foundItems: number;
+  matches: number;
+  resolvedItems: number;
+}
+
 // Initialize with mock data
@@ .. @@
       markNotificationAsRead: (notificationId: string) => {
         set(state => ({
           notifications: state.notifications.map(n =>
             n.id === notificationId ? { ...n, isRead: true } : n
           )
         }));
       },

+      deleteNotification: (notificationId: string) => {
+        set(state => ({
+          notifications: state.notifications.filter(n => n.id !== notificationId)
+        }));
+      },
+
+      markAllNotificationsAsRead: (userId: string) => {
+        set(state => ({
+          notifications: state.notifications.map(n =>
+            n.userId === userId ? { ...n, isRead: true } : n
+          )
+        }));
+      },
+
       contactOwner: (itemId: string, message: string) => {
@@ .. @@
           resolvedItems: items.filter(item => item.status === 'resolved').length,
         };
       },
+
+      getUserStats: (userId: string) => {
+        const { items, matches } = get();
+        const userItems = items.filter(item => item.userId === userId);
+        const userMatches = matches.filter(match => {
+          const lostItem = items.find(item => item.id === match.lostItemId);
+          const foundItem = items.find(item => item.id === match.foundItemId);
+          return lostItem?.userId === userId || foundItem?.userId === userId;
+        });
+
+        return {
+          totalItems: userItems.length,
+          lostItems: userItems.filter(item => item.type === 'lost').length,
+          foundItems: userItems.filter(item => item.type === 'found').length,
+          matches: userMatches.length,
+          resolvedItems: userItems.filter(item => item.status === 'resolved').length,
+        };
+      },
     }),