"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchCard = MatchCard;
const react_1 = __importDefault(require("react"));
const lucide_react_1 = require("lucide-react");
const date_fns_1 = require("date-fns");
function MatchCard({ match, lostItem, foundItem, onConfirm, onReject, showActions = true }) {
    const matchPercentage = Math.round(match.matchScore * 100);
    const getMatchColor = (score) => {
        if (score >= 0.8)
            return 'text-success-600 bg-success-100';
        if (score >= 0.6)
            return 'text-warning-600 bg-warning-100';
        return 'text-error-600 bg-error-100';
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'text-success-600 bg-success-100';
            case 'rejected': return 'text-error-600 bg-error-100';
            default: return 'text-warning-600 bg-warning-100';
        }
    };
    const hasAIFeatures = match.aiConfidence !== undefined || match.imageMatchScore !== undefined;
    return (<div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        {/* Match Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchColor(match.matchScore)}`}>
              {matchPercentage}% Match
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(match.status)}`}>
              {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
            </div>
            {hasAIFeatures && (<div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium flex items-center space-x-1">
                <lucide_react_1.Sparkles className="w-3 h-3"/>
                <span>AI Enhanced</span>
              </div>)}
          </div>
          <span className="text-sm text-gray-500">
            {(0, date_fns_1.formatDistanceToNow)(match.dateMatched, { addSuffix: true })}
          </span>
        </div>

        {/* AI Confidence Scores */}
        {hasAIFeatures && (<div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-primary-50 rounded-lg">
            <h4 className="text-sm font-semibold text-purple-900 mb-3 flex items-center">
              <lucide_react_1.Eye className="w-4 h-4 mr-2"/>
              AI Analysis
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {match.aiConfidence !== undefined && (<div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-purple-700">Description Match</span>
                    <span className="text-xs font-medium text-purple-900">
                      {Math.round(match.aiConfidence * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full transition-all duration-300" style={{ width: `${match.aiConfidence * 100}%` }}/>
                  </div>
                </div>)}
              {match.imageMatchScore !== undefined && (<div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-purple-700">Image Similarity</span>
                    <span className="text-xs font-medium text-purple-900">
                      {Math.round(match.imageMatchScore * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full transition-all duration-300" style={{ width: `${match.imageMatchScore * 100}%` }}/>
                  </div>
                </div>)}
            </div>
          </div>)}

        {/* Matched Fields */}
        {match.matchedFields.length > 0 && (<div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Matched Criteria:</h4>
            <div className="flex flex-wrap gap-2">
              {match.matchedFields.map(field => {
                const getFieldIcon = (fieldName) => {
                    switch (fieldName) {
                        case 'imageMatch': return '📸';
                        case 'aiAnalysis': return '🤖';
                        case 'aiDescription': return '🧠';
                        default: return '✓';
                    }
                };
                const getFieldLabel = (fieldName) => {
                    switch (fieldName) {
                        case 'imageMatch': return 'Image Match';
                        case 'aiAnalysis': return 'AI Analysis';
                        case 'aiDescription': return 'AI Description';
                        case 'dateRange': return 'Date Range';
                        default: return fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
                    }
                };
                return (<span key={field} className={`px-2 py-1 text-xs rounded-full ${['imageMatch', 'aiAnalysis', 'aiDescription'].includes(field)
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-primary-100 text-primary-800'}`}>
                    {getFieldIcon(field)} {getFieldLabel(field)}
                  </span>);
            })}
            </div>
          </div>)}

        {/* Items Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lost Item */}
          <div className="border border-error-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <span className="px-2 py-1 bg-error-100 text-error-800 text-xs font-medium rounded-full">
                LOST
              </span>
              <span className="text-sm text-gray-600">{lostItem.category}</span>
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-2">{lostItem.title}</h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{lostItem.description}</p>
            
            {/* Show AI description if available */}
            {lostItem.aiDescription && (<div className="mb-3 p-2 bg-purple-50 rounded text-xs">
                <span className="font-medium text-purple-800">AI: </span>
                <span className="text-purple-700">{lostItem.aiDescription}</span>
              </div>)}
            
            <div className="space-y-1 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <lucide_react_1.MapPin className="w-3 h-3"/>
                <span>{lostItem.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <lucide_react_1.Calendar className="w-3 h-3"/>
                <span>Lost {(0, date_fns_1.formatDistanceToNow)(lostItem.dateOccurred, { addSuffix: true })}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t">
              <p className="text-sm font-medium text-gray-900">{lostItem.contactName}</p>
              <div className="flex items-center space-x-3 mt-1">
                <a href={`mailto:${lostItem.contactEmail}`} className="flex items-center space-x-1 text-xs text-primary-600 hover:text-primary-800">
                  <lucide_react_1.Mail className="w-3 h-3"/>
                  <span>Email</span>
                </a>
                {lostItem.contactPhone && (<a href={`tel:${lostItem.contactPhone}`} className="flex items-center space-x-1 text-xs text-primary-600 hover:text-primary-800">
                    <lucide_react_1.Phone className="w-3 h-3"/>
                    <span>Call</span>
                  </a>)}
              </div>
            </div>
          </div>

          {/* Found Item */}
          <div className="border border-success-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <span className="px-2 py-1 bg-success-100 text-success-800 text-xs font-medium rounded-full">
                FOUND
              </span>
              <span className="text-sm text-gray-600">{foundItem.category}</span>
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-2">{foundItem.title}</h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{foundItem.description}</p>
            
            {/* Show AI description if available */}
            {foundItem.aiDescription && (<div className="mb-3 p-2 bg-purple-50 rounded text-xs">
                <span className="font-medium text-purple-800">AI: </span>
                <span className="text-purple-700">{foundItem.aiDescription}</span>
              </div>)}
            
            <div className="space-y-1 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <lucide_react_1.MapPin className="w-3 h-3"/>
                <span>{foundItem.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <lucide_react_1.Calendar className="w-3 h-3"/>
                <span>Found {(0, date_fns_1.formatDistanceToNow)(foundItem.dateOccurred, { addSuffix: true })}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t">
              <p className="text-sm font-medium text-gray-900">{foundItem.contactName}</p>
              <div className="flex items-center space-x-3 mt-1">
                <a href={`mailto:${foundItem.contactEmail}`} className="flex items-center space-x-1 text-xs text-primary-600 hover:text-primary-800">
                  <lucide_react_1.Mail className="w-3 h-3"/>
                  <span>Email</span>
                </a>
                {foundItem.contactPhone && (<a href={`tel:${foundItem.contactPhone}`} className="flex items-center space-x-1 text-xs text-primary-600 hover:text-primary-800">
                    <lucide_react_1.Phone className="w-3 h-3"/>
                    <span>Call</span>
                  </a>)}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        {showActions && match.status === 'pending' && onConfirm && onReject && (<div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
            <button onClick={() => onReject(match.id)} className="flex items-center space-x-2 px-4 py-2 border border-error-300 text-error-700 rounded-md hover:bg-error-50 transition-colors">
              <lucide_react_1.XCircle className="w-4 h-4"/>
              <span>Not a Match</span>
            </button>
            <button onClick={() => onConfirm(match.id)} className="flex items-center space-x-2 px-4 py-2 bg-success-600 text-white rounded-md hover:bg-success-700 transition-colors">
              <lucide_react_1.CheckCircle className="w-4 h-4"/>
              <span>Confirm Match</span>
            </button>
          </div>)}

        {/* Notification Status */}
        {match.notificationSent && (<div className="mt-4 p-3 bg-primary-50 rounded-md">
            <p className="text-sm text-primary-800">
              📧 Email notifications have been sent to both parties
            </p>
          </div>)}
      </div>
    </div>);
}
