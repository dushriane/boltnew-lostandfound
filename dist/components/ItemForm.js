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
exports.ItemForm = ItemForm;
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const authStore_1 = require("../store/authStore");
const mockData_1 = require("../data/mockData");
const lucide_react_1 = require("lucide-react");
const ImageUpload_1 = require("./ImageUpload");
const aiService_1 = require("../utils/aiService");
function ItemForm({ onSubmit, initialData, isLoading }) {
    const { user } = (0, authStore_1.useAuthStore)();
    const { register, handleSubmit, watch, setValue, formState: { errors } } = (0, react_hook_form_1.useForm)({
        defaultValues: {
            type: 'lost',
            ...initialData
        }
    });
    const [images, setImages] = (0, react_1.useState)([]);
    const [aiAnalysis, setAIAnalysis] = (0, react_1.useState)(null);
    const [processingAI, setProcessingAI] = (0, react_1.useState)(false);
    const itemType = watch('type');
    if (!user)
        return null;
    const handleAIAnalysis = (analysis) => {
        setAIAnalysis(analysis);
        // Auto-fill form fields based on AI analysis
        if (analysis.category && mockData_1.categories.includes(analysis.category)) {
            setValue('category', analysis.category);
        }
        if (analysis.color && mockData_1.colors.includes(analysis.color)) {
            setValue('color', analysis.color);
        }
        if (analysis.brand) {
            setValue('brand', analysis.brand);
        }
        // Enhance description with AI insights
        const currentDescription = watch('description') || '';
        if (!currentDescription && analysis.description) {
            setValue('description', analysis.description);
        }
    };
    const onFormSubmit = async (data) => {
        setProcessingAI(true);
        try {
            const { dateOccurred, reward, ...rest } = data;
            // Generate image embeddings if images are provided
            let imageEmbeddings = [];
            if (images.length > 0) {
                imageEmbeddings = await aiService_1.aiService.generateImageEmbedding(images[0]);
            }
            // Enhance description with AI if available
            let enhancedDescription = data.description;
            if (aiAnalysis) {
                enhancedDescription = await aiService_1.aiService.enhanceDescription(data.description, aiAnalysis);
            }
            onSubmit({
                ...rest,
                userId: user.id,
                contactName: user.name,
                contactEmail: user.email,
                contactPhone: user.phone,
                description: enhancedDescription,
                dateOccurred: new Date(dateOccurred),
                tags: aiAnalysis?.tags || [],
                reward: reward || undefined,
                aiDescription: aiAnalysis?.description,
                imageEmbeddings: imageEmbeddings.length > 0 ? imageEmbeddings : undefined,
                images: images.length > 0 ? images.map(img => URL.createObjectURL(img)) : undefined
            });
        }
        catch (error) {
            console.error('Error processing form:', error);
        }
        finally {
            setProcessingAI(false);
        }
    };
    return (<form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Item Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Report Type
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input type="radio" value="lost" {...register('type', { required: true })} className="mr-2 text-primary-600"/>
            <span className="text-sm">Lost Item</span>
          </label>
          <label className="flex items-center">
            <input type="radio" value="found" {...register('type', { required: true })} className="mr-2 text-primary-600"/>
            <span className="text-sm">Found Item</span>
          </label>
        </div>
      </div>

      {/* Image Upload */}
      <ImageUpload_1.ImageUpload onImagesChange={setImages} onAIAnalysis={handleAIAnalysis} maxImages={3}/>

      {/* AI Enhancement Notice */}
      {aiAnalysis && (<div className="bg-gradient-to-r from-purple-50 to-primary-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <lucide_react_1.Sparkles className="w-5 h-5 text-purple-600"/>
            <span className="text-sm font-semibold text-purple-900">AI Enhanced</span>
          </div>
          <p className="text-sm text-purple-800">
            Form fields have been automatically filled based on AI image analysis. 
            You can modify any details as needed.
          </p>
        </div>)}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Item Title *
        </label>
        <input type="text" {...register('title', { required: 'Title is required' })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="e.g., Black iPhone 14 Pro"/>
        {errors.title && (<p className="mt-1 text-sm text-error-600">{errors.title.message}</p>)}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category *
        </label>
        <select {...register('category', { required: 'Category is required' })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
          <option value="">Select a category</option>
          {mockData_1.categories.map(category => (<option key={category} value={category}>{category}</option>))}
        </select>
        {errors.category && (<p className="mt-1 text-sm text-error-600">{errors.category.message}</p>)}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea {...register('description', { required: 'Description is required' })} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Provide detailed description including distinctive features, condition, etc."/>
        {errors.description && (<p className="mt-1 text-sm text-error-600">{errors.description.message}</p>)}
      </div>

      {/* Location and Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <lucide_react_1.MapPin className="w-4 h-4 inline mr-1"/>
            Location *
          </label>
          <input type="text" {...register('location', { required: 'Location is required' })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Where was it lost/found?"/>
          {errors.location && (<p className="mt-1 text-sm text-error-600">{errors.location.message}</p>)}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <lucide_react_1.Calendar className="w-4 h-4 inline mr-1"/>
            Date {itemType === 'lost' ? 'Lost' : 'Found'} *
          </label>
          <input type="date" {...register('dateOccurred', { required: 'Date is required' })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" max={new Date().toISOString().split('T')[0]}/>
          {errors.dateOccurred && (<p className="mt-1 text-sm text-error-600">{errors.dateOccurred.message}</p>)}
        </div>
      </div>

      {/* Item Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color
          </label>
          <select {...register('color')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
            <option value="">Select color</option>
            {mockData_1.colors.map(color => (<option key={color} value={color}>{color}</option>))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand
          </label>
          <input type="text" {...register('brand')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="e.g., Apple, Nike"/>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Size
          </label>
          <input type="text" {...register('size')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="e.g., Large, 10, 15 inch"/>
        </div>
      </div>

      {/* Reward (only for lost items) */}
      {itemType === 'lost' && (<div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <lucide_react_1.DollarSign className="w-4 h-4 inline mr-1"/>
            Reward (Optional) - RWF
          </label>
          <input type="number" min="0" step="100" {...register('reward', { min: 0 })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Enter reward amount in RWF"/>
          <p className="mt-1 text-xs text-gray-500">
            Offering a reward can increase the chances of your item being returned
          </p>
        </div>)}

      {/* Contact Information Display */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <p className="text-sm text-gray-900">{user.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-sm text-gray-900">{user.email}</p>
            </div>
            {user.phone && (<div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <p className="text-sm text-gray-900">{user.phone}</p>
              </div>)}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <p className="text-sm text-gray-900 capitalize">
                {user.role}
                {user.studentId && ` (${user.studentId})`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button type="submit" disabled={isLoading || processingAI} className="px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {isLoading || processingAI ? 'Processing...' : `Report ${itemType === 'lost' ? 'Lost' : 'Found'} Item`}
        </button>
      </div>
    </form>);
}
