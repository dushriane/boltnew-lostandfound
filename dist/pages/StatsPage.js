"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsPage = StatsPage;
const react_1 = __importDefault(require("react"));
const dataStore_1 = require("../store/dataStore");
const lucide_react_1 = require("lucide-react");
const date_fns_1 = require("date-fns");
function StatsPage() {
    const { items, matches } = (0, dataStore_1.useDataStore)();
    // Calculate statistics
    const stats = {
        totalItems: items.length,
        lostItems: items.filter(item => item.type === 'lost').length,
        foundItems: items.filter(item => item.type === 'found').length,
        resolvedItems: items.filter(item => item.status === 'resolved').length,
        activeItems: items.filter(item => item.status === 'active').length,
        totalMatches: matches.length,
        confirmedMatches: matches.filter(match => match.status === 'confirmed').length,
        successRate: items.filter(item => item.status === 'resolved').length / Math.max(items.length, 1) * 100,
    };
    // Category breakdown
    const categoryStats = items.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
    }, {});
    const topCategories = Object.entries(categoryStats)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);
    // Location breakdown
    const locationStats = items.reduce((acc, item) => {
        const location = item.location.split(',')[0].trim(); // Get first part of location
        acc[location] = (acc[location] || 0) + 1;
        return acc;
    }, {});
    const topLocations = Object.entries(locationStats)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);
    // Recent activity
    const recentItems = items
        .sort((a, b) => new Date(b.dateReported).getTime() - new Date(a.dateReported).getTime())
        .slice(0, 5);
    const recentMatches = matches
        .sort((a, b) => new Date(b.dateMatched).getTime() - new Date(a.dateMatched).getTime())
        .slice(0, 3);
    return (<div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Statistics & Analytics</h1>
        <p className="text-gray-600">
          Insights into lost and found item trends and system performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalItems}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <lucide_react_1.BarChart3 className="w-6 h-6 text-primary-600"/>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600">{stats.activeItems} currently active</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-3xl font-bold text-success-600">{stats.successRate.toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <lucide_react_1.TrendingUp className="w-6 h-6 text-success-600"/>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600">{stats.resolvedItems} items reunited</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Matches</p>
              <p className="text-3xl font-bold text-warning-600">{stats.totalMatches}</p>
            </div>
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <lucide_react_1.Award className="w-6 h-6 text-warning-600"/>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600">{stats.confirmedMatches} confirmed</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lost vs Found</p>
              <p className="text-lg font-bold text-gray-900">
                {stats.lostItems} : {stats.foundItems}
              </p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <lucide_react_1.BarChart3 className="w-6 h-6 text-gray-600"/>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-error-600">{stats.lostItems} lost</span>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-success-600">{stats.foundItems} found</span>
          </div>
        </div>
      </div>

      {/* Charts and Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Categories */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
          <div className="space-y-4">
            {topCategories.map(([category, count], index) => (<div key={category} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-sm font-medium text-primary-600">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-900">{category}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${(count / stats.totalItems) * 100}%` }}/>
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-8 text-right">{count}</span>
                </div>
              </div>))}
          </div>
        </div>

        {/* Top Locations */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <lucide_react_1.MapPin className="w-5 h-5 mr-2"/>
            Top Locations
          </h3>
          <div className="space-y-4">
            {topLocations.map(([location, count], index) => (<div key={location} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center text-sm font-medium text-success-600">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-900">{location}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-success-600 h-2 rounded-full" style={{ width: `${(count / stats.totalItems) * 100}%` }}/>
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-8 text-right">{count}</span>
                </div>
              </div>))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Items */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <lucide_react_1.Calendar className="w-5 h-5 mr-2"/>
            Recent Items
          </h3>
          <div className="space-y-4">
            {recentItems.map(item => (<div key={item.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full mt-2 ${item.type === 'lost' ? 'bg-error-500' : 'bg-success-500'}`}/>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                  <p className="text-xs text-gray-600">{item.category} • {item.location}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(0, date_fns_1.formatDistanceToNow)(item.dateReported, { addSuffix: true })}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${item.type === 'lost'
                ? 'bg-error-100 text-error-800'
                : 'bg-success-100 text-success-800'}`}>
                  {item.type.toUpperCase()}
                </span>
              </div>))}
          </div>
        </div>

        {/* Recent Matches */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <lucide_react_1.Award className="w-5 h-5 mr-2"/>
            Recent Matches
          </h3>
          <div className="space-y-4">
            {recentMatches.length === 0 ? (<p className="text-gray-500 text-sm">No matches found yet</p>) : (recentMatches.map(match => {
            const lostItem = items.find(item => item.id === match.lostItemId);
            const foundItem = items.find(item => item.id === match.foundItemId);
            if (!lostItem || !foundItem)
                return null;
            return (<div key={match.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${match.status === 'confirmed'
                    ? 'bg-success-100 text-success-800'
                    : match.status === 'rejected'
                        ? 'bg-error-100 text-error-800'
                        : 'bg-warning-100 text-warning-800'}`}>
                        {Math.round(match.matchScore * 100)}% Match
                      </span>
                      <span className="text-xs text-gray-500">
                        {(0, date_fns_1.formatDistanceToNow)(match.dateMatched, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{lostItem.title}</p>
                    <p className="text-xs text-gray-600">
                      Lost: {lostItem.location} • Found: {foundItem.location}
                    </p>
                  </div>);
        }))}
          </div>
        </div>
      </div>
    </div>);
}
