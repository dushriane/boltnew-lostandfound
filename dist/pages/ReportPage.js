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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportPage = ReportPage;
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const dataStore_1 = require("../store/dataStore");
const ItemForm_1 = require("../components/ItemForm");
const lucide_react_1 = require("lucide-react");
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
function ReportPage() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { addItem } = (0, dataStore_1.useDataStore)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [submitted, setSubmitted] = (0, react_1.useState)(false);
    const handleSubmit = async (data) => {
        setIsLoading(true);
        try {
            const newItem = await addItem(data);
            setSubmitted(true);
            react_hot_toast_1.default.success('Item reported successfully!');
            // Redirect after showing success message
            setTimeout(() => {
                navigate('/my-items');
            }, 2000);
        }
        catch (error) {
            console.error('Error submitting item:', error);
            react_hot_toast_1.default.error('Failed to submit item. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
    };
    if (submitted) {
        return (<div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <lucide_react_1.CheckCircle className="w-8 h-8 text-success-600"/>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Item Reported Successfully!</h2>
          <p className="text-gray-600 mb-4">
            Your item has been added to our database. Our system will automatically check for potential matches and notify you via email if any are found.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to your items...
          </p>
        </div>
      </div>);
    }
    return (<div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Report an Item</h1>
        <p className="text-gray-600">
          Fill out the form below to report a lost or found item. Our system will automatically search for potential matches.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <ItemForm_1.ItemForm onSubmit={handleSubmit} isLoading={isLoading}/>
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-primary-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-primary-900 mb-4">Tips for Better Matches</h3>
        <ul className="space-y-2 text-primary-800">
          <li className="flex items-start space-x-2">
            <span className="text-primary-600 mt-1">•</span>
            <span>Be as detailed as possible in your description</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-primary-600 mt-1">•</span>
            <span>Include specific location details (building names, landmarks)</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-primary-600 mt-1">•</span>
            <span>Mention distinctive features, colors, brands, or damage</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-primary-600 mt-1">•</span>
            <span>Upload clear photos for AI-powered matching</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-primary-600 mt-1">•</span>
            <span>Consider offering a reward for lost items to increase return chances</span>
          </li>
        </ul>
      </div>
    </div>);
}
