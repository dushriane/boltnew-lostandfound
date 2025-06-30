"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyItemsPage = MyItemsPage;
const react_1 = __importStar(require("react"));
const dataStore_1 = require("../store/dataStore");
const authStore_1 = require("../store/authStore");
const ItemCard_1 = require("../components/ItemCard");
const lucide_react_1 = require("lucide-react");
const react_router_dom_1 = require("react-router-dom");
function MyItemsPage() {
    const { getItemsByUser, getMatchesForUser } = (0, dataStore_1.useDataStore)();
    const { user } = (0, authStore_1.useAuthStore)();
    const [filter, setFilter] = (0, react_1.useState)('all');
    const [statusFilter, setStatusFilter] = (0, react_1.useState)('all');
    if (!user)
        return null;
    const userItems = getItemsByUser(user.id);
    const filteredItems = userItems.filter(item => {
        const matchesType = filter === 'all' || item.type === filter;
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        return matchesType && matchesStatus;
    });
    const stats = {
        total: userItems.length,
        active: userItems.filter(item => item.status === 'active').length,
        matched: userItems.filter(item => item.status === 'matched').length,
        resolved: userItems.filter(item => item.status === 'resolved').length,
    };
    return (<div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Items</h1>
          <p className="text-gray-600 mt-1">Manage your lost and found item reports</p>
        </div>
        
        <react_router_dom_1.Link to="/report" className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
          <lucide_react_1.Plus className="w-4 h-4"/>
          <span>Report New Item</span>
        </react_router_dom_1.Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Items</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-primary-600">{stats.active}</div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-warning-600">{stats.matched}</div>
          <div className="text-sm text-gray-600">Matched</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-success-600">{stats.resolved}</div>
          <div className="text-sm text-gray-600">Resolved</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <lucide_react_1.Filter className="w-4 h-4 text-gray-500"/>
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
          </div>
          
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="all">All Types</option>
            <option value="lost">Lost Items</option>
            <option value="found">Found Items</option>
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="matched">Matched</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Items List */}
      <div>
        {filteredItems.length === 0 ? (<div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <lucide_react_1.Plus className="w-12 h-12 text-gray-400"/>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600 mb-4">
              {userItems.length === 0
                ? "You haven't reported any items yet."
                : "No items match your current filters."}
            </p>
            <react_router_dom_1.Link to="/report" className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
              <lucide_react_1.Plus className="w-4 h-4"/>
              <span>Report Your First Item</span>
            </react_router_dom_1.Link>
          </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => {
                const matches = getMatchesForUser(user.id).filter(match => match.lostItemId === item.id || match.foundItemId === item.id);
                return (<div key={item.id} className="relative">
                  <ItemCard_1.ItemCard item={item}/>
                  {matches.length > 0 && (<div className="absolute -top-2 -right-2 bg-warning-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {matches.length}
                    </div>)}
                </div>);
            })}
          </div>)}
      </div>
    </div>);
}
