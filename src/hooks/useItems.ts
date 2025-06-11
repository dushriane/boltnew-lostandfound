import { useState, useEffect } from 'react';
import type { Item, Match } from '../types';
import { mockItems } from '../data/mockData';
import { findMatches } from '../utils/matching';
import { generateMatchNotification, sendEmailNotification } from '../utils/notifications';

export function useItems() {
  const [items, setItems] = useState<Item[]>(mockItems);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Find matches whenever items change
    const newMatches = findMatches(items);
    setMatches(newMatches);
    
    // Send notifications for new matches
    newMatches
      .filter(match => !match.notificationSent)
      .forEach(async (match) => {
        const lostItem = items.find(item => item.id === match.lostItemId);
        const foundItem = items.find(item => item.id === match.foundItemId);
        
        if (lostItem && foundItem) {
          const notifications = generateMatchNotification(match, lostItem, foundItem);
          
          for (const notification of notifications) {
            const success = await sendEmailNotification(notification);
            if (success) {
              // Mark match as notification sent
              setMatches(prev => 
                prev.map(m => 
                  m.id === match.id 
                    ? { ...m, notificationSent: true }
                    : m
                )
              );
            }
          }
        }
      });
  }, [items]);

  const addItem = (item: Omit<Item, 'id' | 'dateReported' | 'status'>) => {
    const newItem: Item = {
      ...item,
      id: Date.now().toString(),
      dateReported: new Date(),
      status: 'active'
    };
    
    setItems(prev => [...prev, newItem]);
    return newItem;
  };

  const updateItem = (id: string, updates: Partial<Item>) => {
    setItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, ...updates }
          : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const getItemsByType = (type: 'lost' | 'found') => {
    return items.filter(item => item.type === type);
  };

  const getMatchesForItem = (itemId: string) => {
    return matches.filter(match => 
      match.lostItemId === itemId || match.foundItemId === itemId
    );
  };

  const confirmMatch = (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (match) {
      // Update match status
      setMatches(prev => 
        prev.map(m => 
          m.id === matchId 
            ? { ...m, status: 'confirmed' }
            : m
        )
      );
      
      // Update item statuses
      updateItem(match.lostItemId, { status: 'resolved', matchedWith: match.foundItemId });
      updateItem(match.foundItemId, { status: 'resolved', matchedWith: match.lostItemId });
    }
  };

  const rejectMatch = (matchId: string) => {
    setMatches(prev => 
      prev.map(m => 
        m.id === matchId 
          ? { ...m, status: 'rejected' }
          : m
      )
    );
  };

  return {
    items,
    matches,
    loading,
    addItem,
    updateItem,
    deleteItem,
    getItemsByType,
    getMatchesForItem,
    confirmMatch,
    rejectMatch
  };
}