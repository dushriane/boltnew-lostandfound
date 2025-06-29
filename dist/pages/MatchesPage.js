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
exports.MatchesPage = MatchesPage;
const react_1 = __importStar(require("react"));
const dataStore_1 = require("../store/dataStore");
const MatchCard_1 = require("../components/MatchCard");
const lucide_react_1 = require("lucide-react");
function MatchesPage() {
    const { matches, items, confirmMatch, rejectMatch } = (0, dataStore_1.useDataStore)();
    const [filter, setFilter] = (0, react_1.useState)('all');
    const filteredMatches = matches.filter(match => {
        return filter === 'all' || match.status === filter;
    });
    const stats = {
        total: matches.length,
        pending: matches.filter(m => m.status === 'pending').length,
        confirmed: matches.filter(m => m.status === 'confirmed').length,
        rejected: matches.filter(m => m.status === 'rejected').length,
    };
    const getMatchData = (match) => {
        const lostItem = items.find(item => item.id === match.lostItemId);
        const foundItem = items.find(item => item.id === match.foundItemId);
        return { lostItem, foundItem };
    };
    return (<div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Potential Matches</h1>
        <p className="text-gray-600">
          Our system has found these potential matches between lost and found items
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Matches</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-2">
            <lucide_react_1.Clock className="w-5 h-5 text-warning-600"/>
            <div className="text-2xl font-bold text-warning-600">{stats.pending}</div>
          </div>
          <div className="text-sm text-gray-600">Pending Review</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-2">
            <lucide_react_1.CheckCircle className="w-5 h-5 text-success-600"/>
            <div className="text-2xl font-bold text-success-600">{stats.confirmed}</div>
          </div>
          <div className="text-sm text-gray-600">Confirmed</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-2">
            <lucide_react_1.XCircle className="w-5 h-5 text-error-600"/>
            <div className="text-2xl font-bold text-error-600">{stats.rejected}</div>
          </div>
          <div className="text-sm text-gray-600">Rejected</div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filter by status:</span>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="all">All Matches</option>
            <option value="pending">Pending Review</option>
            <option value="confirmed">Confirmed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Matches List */}
      <div>
        {filteredMatches.length === 0 ? (<div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <lucide_react_1.Mail className="w-12 h-12 text-gray-400"/>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No matches found</h3>
            <p className="text-gray-600">
              {matches.length === 0
                ? "No potential matches have been detected yet."
                : "No matches match your current filter."}
            </p>
          </div>) : (<div className="space-y-6">
            {filteredMatches.map(match => {
                const { lostItem, foundItem } = getMatchData(match);
                if (!lostItem || !foundItem)
                    return null;
                return (<MatchCard_1.MatchCard key={match.id} match={match} lostItem={lostItem} foundItem={foundItem} onConfirm={confirmMatch} onReject={rejectMatch}/>);
            })}
          </div>)}
      </div>

      {/* Info Box */}
      {matches.some(m => m.status === 'pending') && (<div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <lucide_react_1.Mail className="w-6 h-6 text-primary-600 mt-1"/>
            <div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">
                Automatic Notifications
              </h3>
              <p className="text-primary-800 mb-2">
                When potential matches are found, our system automatically sends email notifications to both parties with:
              </p>
              <ul className="list-disc list-inside text-primary-800 space-y-1">
                <li>Match confidence percentage</li>
                <li>Detailed item descriptions</li>
                <li>Contact information for direct communication</li>
                <li>Matched criteria breakdown</li>
              </ul>
            </div>
          </div>
        </div>)}
    </div>);
}
