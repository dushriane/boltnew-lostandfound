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
  Clock,
  UserCheck,
  UserX
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export function AdminDashboard() {
  const { items, matches, getAdminStats, verifyItem } = useDataStore();
  const { user, getAllUsers, toggleUserStatus } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'items' | 'matches' | 'users'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified'>('all');
  const [userFilter, setUserFilter] = useState<'all' | 'active' | 'inactive'>('all');

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
    toast.success('Item verified successfully');
  };

  const handleToggleUserStatus = (userId: string, currentStatus: boolean) => {
    toggleUserStatus(userId);
    toast.success(`User ${currentStatus ? 'deactivated' : 'activated'} successfully`);
  };

  const allUsers = getAllUsers();
  const filteredUsers = allUsers.filter(u => {
    const matchesFilter = userFilter === 'all' || 
                         (userFilter === 'active' && u.isActive) ||
                         (userFilter === 'inactive' && !u.isActive);
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
              {/* User Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Users</option>
                  <option value="active">Active Users</option>
                  <option value="inactive">Inactive Users</option>
                </select>
              </div>

              {/* User Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">{allUsers.length}</div>
                  <div className="text-sm text-gray-600">Total Users</div>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <div className="text-2xl font-bold text-success-600">
                    {allUsers.filter(u => u.isActive).length}
                  </div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <div className="text-2xl font-bold text-error-600">
                    {allUsers.filter(u => !u.isActive).length}
                  </div>
                  <div className="text-sm text-gray-600">Inactive Users</div>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <div className="text-2xl font-bold text-primary-600">
                    {allUsers.filter(u => u.role === 'student').length}
                  </div>
                  <div className="text-sm text-gray-600">Students</div>
                </div>
              </div>

              {/* Users List */}
              <div className="space-y-4">
                {filteredUsers.map(userData => (
                  <div key={userData.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{userData.name}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            userData.isActive 
                              ? 'bg-success-100 text-success-800' 
                              : 'bg-error-100 text-error-800'
                          }`}>
                            {userData.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                            userData.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800'
                              : userData.role === 'faculty'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {userData.role}
                          </span>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <p><strong>Email:</strong> {userData.email}</p>
                          {userData.phone && <p><strong>Phone:</strong> {userData.phone}</p>}
                          {userData.department && <p><strong>Department:</strong> {userData.department}</p>}
                          {userData.studentId && <p><strong>Student ID:</strong> {userData.studentId}</p>}
                          <p><strong>Joined:</strong> {formatDistanceToNow(userData.createdAt, { addSuffix: true })}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {userData.role !== 'admin' && (
                          <button
                            onClick={() => handleToggleUserStatus(userData.id, userData.isActive)}
                            className={`flex items-center space-x-1 px-3 py-1 text-sm rounded ${
                              userData.isActive
                                ? 'bg-error-600 text-white hover:bg-error-700'
                                : 'bg-success-600 text-white hover:bg-success-700'
                            }`}
                          >
                            {userData.isActive ? (
                              <>
                                <UserX className="w-4 h-4" />
                                <span>Deactivate</span>
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-4 h-4" />
                                <span>Activate</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                  <p className="text-gray-600">
                    {searchTerm ? 'Try adjusting your search criteria' : 'No users match the selected filter'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}