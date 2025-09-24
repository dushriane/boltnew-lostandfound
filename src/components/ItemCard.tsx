import React from 'react';
import type { Item } from '../types';
import { Calendar, MapPin, Tag, DollarSign, Phone, Mail } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ItemCardProps {
  item: Item;
  showContact?: boolean;
  onContact?: (item: Item) => void;
}

export function ItemCard({ item, showContact = false, onContact }: ItemCardProps) {
  const isLost = item.type === 'lost';
  
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className={`h-2 ${isLost ? 'bg-error-500' : 'bg-success-500'}`} />
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                isLost 
                  ? 'bg-error-100 text-error-800' 
                  : 'bg-success-100 text-success-800'
              }`}>
                {isLost ? 'LOST' : 'FOUND'}
              </span>
              <span className="text-sm text-gray-500">{item.category}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
          </div>
          
          {item.reward && (
            <div className="flex items-center space-x-1 text-success-600">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm font-medium">{item.reward.toLocaleString()} RWF</span>
            </div>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{item.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>{item.location}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>
              {isLost ? 'Lost' : 'Found'} {formatDistanceToNow(item.dateOccurred, { addSuffix: true })}
            </span>
          </div>
        </div>

        {(item.color || item.brand || item.size) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {item.color && (
              <span className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                <Tag className="w-3 h-3" />
                <span>{item.color}</span>
              </span>
            )}
            {item.brand && (
              <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {item.brand}
              </span>
            )}
            {item.size && (
              <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                Size: {item.size}
              </span>
            )}
          </div>
        )}

        {showContact && (
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.contactName}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <a 
                    href={`mailto:${item.contactEmail}`}
                    className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-800"
                  >
                    <Mail className="w-3 h-3" />
                    <span>Email</span>
                  </a>
                  {item.contactPhone && (
                    <a 
                      href={`tel:${item.contactPhone}`}
                      className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-800"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call</span>
                    </a>
                  )}
                </div>
              </div>
              
              {onContact && (
                <button
                  onClick={() => onContact(item)}
                  className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
                >
                  Contact
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <span className={`px-2 py-1 text-xs rounded-full ${
            item.status === 'active' 
              ? 'bg-primary-100 text-primary-800'
              : item.status === 'matched'
              ? 'bg-warning-100 text-warning-800'
              : 'bg-success-100 text-success-800'
          }`}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </span>
          
          <span className="text-xs text-gray-400">
            Reported {formatDistanceToNow(item.dateReported, { addSuffix: true })}
          </span>
        </div>
      </div>
    </div>
  );
}