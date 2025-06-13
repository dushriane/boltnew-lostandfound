import React, { useState } from 'react';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';
import { 
  Users, 
  Package, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Search,
  Filter,
  Eye,
  Shield,
  Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function AdminDashboard() {
  const { items, matches, getAdminStats, verifyItem } = useDataStore();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'items' | 'matches' | 'users'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified'>('all');

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-600">You don't have permission to access this page.</p>
      </div>
    );
  }

  const stats = getAdminStats();
  
  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'verified' && item.isVerified) ||
                         (statusFilter === 'pending' && !item.isVerified);
    return matchesSearch && matchesStatus;
  });

  const handleVerifyItem = (itemId: string, notes?: string) => {
    verifyItem(itemId, notes);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'items', label: 'Items', icon: Package },
    { id: 'matches', label: 'Matches', icon: CheckCircle },
    { id: 'users', label: 'Users', icon: Users },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage the university lost & found system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalItems}</p>
            </div>
            <Package className="w-12 h-12 text-primary-600" />
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600">{stats.activeItems} active</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
              <p className="text-3xl font-bold text-warning-600">{stats.pendingReviews}</p>
            </div>
            <AlertCircle className="w-12 h-12 text-warning-600" />
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600">Need verification</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Matches</p>
              <p className="text-3xl font-bold text-success-600">{stats.totalMatches}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-success-600" />
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600">System generated</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved Items</p>
              <p className="text-3xl font-bold text-gray-900">{stats.resolvedItems}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-gray-600" />
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600">Successfully reunited</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Items */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Latest Items</h4>
                  <div className="space-y-3">
                    {items.slice(0, 5).map(item => (
                      <div key={item.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-3 h-3 rounded-full mt-2 ${
                          item.type === 'lost' ? 'bg-error-500' : 'bg-success-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                          <p className="text-xs text-gray-600">{item.category} • {item.location}</p>
                          <p className="text-xs text-gray-500">
                            {formatDistanceToNow(item.dateReported, { addSuffix: true })}
                          </p>
                        </div>
                        {!item.isVerified && (
                          <span className="px-2 py-1 bg-warning-100 text-warning-800 text-xs rounded-full">
                            Pending
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Matches */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Latest Matches</h4>
                  <div className="space-y-3">
                    {matches.slice(0, 5).map(match => {
                      const lostItem = items.find(item => item.id === match.lostItemId);
                      const foundItem = items.find(item => item.id === match.foundItemId);
                      
                      if (!lostItem || !foundItem) return null;
                      
                      return (
                        <div key={match.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              match.status === 'confirmed' 
                                ? 'bg-success-100 text-success-800'
                                : match.status === 'rejected'
                                ? 'bg-error-100 text-error-800'
                                : 'bg-warning-100 text-warning-800'
                            }`}>
                              {Math.round(match.matchScore * 100)}% Match
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(match.dateMatched, { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-900">{lostItem.title}</p>
                          <p className="text-xs text-gray-600">
                            Lost: {lostItem.location} • Found: {foundItem.location}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'items' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Items</option>
                  <option value="pending">Pending Verification</option>
                  <option value="verified">Verified</option>
                </select>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                {filteredItems.map(item => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            item.type === 'lost' 
                              ? 'bg-error-100 text-error-800' 
                              : 'bg-success-100 text-success-800'
                          }`}>
                            {item.type.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-600">{item.category}</span>
                          {item.isVerified ? (
                            <span className="px-2 py-1 bg-success-100 text-success-800 text-xs rounded-full">
                              Verified
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-warning-100 text-warning-800 text-xs rounded-full">
                              Pending
                            </span>
                          )}
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                        
                        <div className="text-sm text-gray-500">
                          <p>Location: {item.location}</p>
                          <p>Reported by: {item.contactName} ({item.contactEmail})</p>
                          <p>Date: {formatDistanceToNow(item.dateReported, { addSuffix: true })}</p>
                        </div>
                        
                        {item.adminNotes && (
                          <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                            <strong>Admin Notes:</strong> {item.adminNotes}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        {!item.isVerified && (
                          <button
                            onClick={() => handleVerifyItem(item.id, 'Verified by admin')}
                            className="px-3 py-1 bg-success-600 text-white text-sm rounded hover:bg-success-700"
                          >
                            Verify
                          </button>
                        )}
                        <button className="px-3 py-1 bg-primary-600 text-white text-sm rounded hover:bg-primary-700">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'matches' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">System Matches</h3>
              {matches.map(match => {
                const lostItem = items.find(item => item.id === match.lostItemId);
                const foundItem = items.find(item => item.id === match.foundItemId);
                
                if (!lostItem || !foundItem) return null;
                
                return (
                  <div key={match.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                          match.status === 'confirmed' 
                            ? 'bg-success-100 text-success-800'
                            : match.status === 'rejected'
                            ? 'bg-error-100 text-error-800'
                            : 'bg-warning-100 text-warning-800'
                        }`}>
                          {Math.round(match.matchScore * 100)}% Match
                        </span>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                          match.status === 'confirmed' 
                            ? 'bg-success-100 text-success-800'
                            : match.status === 'rejected'
                            ? 'bg-error-100 text-error-800'
                            : 'bg-warning-100 text-warning-800'
                        }`}>
                          {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(match.dateMatched, { addSuffix: true })}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-error-200 rounded p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="px-2 py-1 bg-error-100 text-error-800 text-xs rounded">LOST</span>
                          <span className="text-sm text-gray-600">{lostItem.category}</span>
                        </div>
                        <h4 className="font-medium text-gray-900">{lostItem.title}</h4>
                        <p className="text-sm text-gray-600">{lostItem.location}</p>
                        <p className="text-sm text-gray-500">{lostItem.contactName}</p>
                      </div>
                      
                      <div className="border border-success-200 rounded p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="px-2 py-1 bg-success-100 text-success-800 text-xs rounded">FOUND</span>
                          <span className="text-sm text-gray-600">{foundItem.category}</span>
                        </div>
                        <h4 className="font-medium text-gray-900">{foundItem.title}</h4>
                        <p className="text-sm text-gray-600">{foundItem.location}</p>
                        <p className="text-sm text-gray-500">{foundItem.contactName}</p>
                      </div>
                    </div>
                    
                    {match.matchedFields.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Matched criteria:</p>
                        <div className="flex flex-wrap gap-1">
                          {match.matchedFields.map(field => (
                            <span key={field} className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded">
                              {field}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
              <p className="text-gray-600">User management features would be implemented here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}