import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDataStore } from '../store/dataStore';
import { useAuthStore } from '../store/authStore';
import { 
  Calendar, 
  MapPin, 
  Tag, 
  DollarSign, 
  Phone, 
  Mail, 
  ArrowLeft,
  CheckCircle,
  XCircle,
  MessageSquare,
  User,
  Clock,
  Shield
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { items, contactOwner, updateItemStatus } = useDataStore();
  const { user } = useAuthStore();
  const [message, setMessage] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);

  const item = items.find(i => i.id === id);

  if (!item) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Item not found</h3>
        <p className="text-gray-600 mb-4">The item you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/')}
          className="text-primary-600 hover:text-primary-800"
        >
          ← Back to Browse
        </button>
      </div>
    );
  }

  const isOwner = item.userId === user?.id;
  const isLost = item.type === 'lost';

  const handleContact = () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    contactOwner(item.id, message);
    toast.success('Message sent successfully!');
    setMessage('');
    setShowContactForm(false);
  };

  const handleStatusUpdate = (newStatus: 'resolved' | 'active') => {
    updateItemStatus(item.id, newStatus);
    toast.success(`Item marked as ${newStatus}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Status Bar */}
        <div className={`h-3 ${isLost ? 'bg-error-500' : 'bg-success-500'}`} />

        <div className="p-8">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  isLost 
                    ? 'bg-error-100 text-error-800' 
                    : 'bg-success-100 text-success-800'
                }`}>
                  {isLost ? 'LOST ITEM' : 'FOUND ITEM'}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                  {item.category}
                </span>
                <span className={`px-3 py-1 text-sm rounded-full ${
                  item.status === 'active' 
                    ? 'bg-primary-100 text-primary-800'
                    : item.status === 'matched'
                    ? 'bg-warning-100 text-warning-800'
                    : 'bg-success-100 text-success-800'
                }`}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
                {item.isVerified && (
                  <span className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    <Shield className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
              
              {item.reward && (
                <div className="flex items-center space-x-2 text-success-600 mb-4">
                  <DollarSign className="w-5 h-5" />
                  <span className="text-xl font-semibold">{item.reward.toLocaleString()} RWF Reward</span>
                </div>
              )}
            </div>

            {/* Owner Actions */}
            {isOwner && item.status === 'active' && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleStatusUpdate('resolved')}
                  className="flex items-center space-x-2 px-4 py-2 bg-success-600 text-white rounded-md hover:bg-success-700"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Mark as Resolved</span>
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed">{item.description}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Location & Time */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Location & Time</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{item.location}</p>
                    <p className="text-sm text-gray-600">
                      {isLost ? 'Last seen location' : 'Found at this location'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {formatDistanceToNow(item.dateOccurred, { addSuffix: true })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {isLost ? 'When it was lost' : 'When it was found'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {formatDistanceToNow(item.dateReported, { addSuffix: true })}
                    </p>
                    <p className="text-sm text-gray-600">Reported to system</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Item Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Item Details</h3>
              <div className="space-y-3">
                {item.color && (
                  <div className="flex items-center space-x-3">
                    <Tag className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{item.color}</p>
                      <p className="text-sm text-gray-600">Color</p>
                    </div>
                  </div>
                )}
                
                {item.brand && (
                  <div className="flex items-center space-x-3">
                    <Tag className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{item.brand}</p>
                      <p className="text-sm text-gray-600">Brand</p>
                    </div>
                  </div>
                )}
                
                {item.size && (
                  <div className="flex items-center space-x-3">
                    <Tag className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{item.size}</p>
                      <p className="text-sm text-gray-600">Size</p>
                    </div>
                  </div>
                )}

                {!item.color && !item.brand && !item.size && (
                  <p className="text-gray-500 italic">No additional details provided</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Section */}
          {!isOwner && item.status === 'active' && (
            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Owner</h3>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.contactName}</p>
                    <p className="text-sm text-gray-600">Item owner</p>
                  </div>
                </div>

                {!showContactForm ? (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowContactForm(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Send Message</span>
                    </button>
                    
                    <a
                      href={`mailto:${item.contactEmail}`}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                    </a>
                    
                    {item.contactPhone && (
                      <a
                        href={`tel:${item.contactPhone}`}
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Call</span>
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={`Hi! I think I ${isLost ? 'found' : 'lost'} your ${item.title}. Let me know how we can connect!`}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={4}
                    />
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={handleContact}
                        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                      >
                        Send Message
                      </button>
                      <button
                        onClick={() => setShowContactForm(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Owner Info for Own Items */}
          {isOwner && (
            <div className="border-t pt-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">This is your item</h3>
                <p className="text-blue-700">
                  You will receive notifications when someone contacts you about this item.
                  You can mark it as resolved when you've found/returned it.
                </p>
              </div>
            </div>
          )}

          {/* Admin Notes */}
          {item.adminNotes && (
            <div className="border-t pt-8">
              <div className="bg-yellow-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">Admin Notes</h3>
                <p className="text-yellow-800">{item.adminNotes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}