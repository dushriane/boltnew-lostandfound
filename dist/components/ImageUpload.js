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
exports.ImageUpload = ImageUpload;
const react_1 = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
const aiService_1 = require("../utils/aiService");
function ImageUpload({ onImagesChange, onAIAnalysis, maxImages = 3, existingImages = [] }) {
    const [images, setImages] = (0, react_1.useState)([]);
    const [previews, setPreviews] = (0, react_1.useState)(existingImages);
    const [analyzing, setAnalyzing] = (0, react_1.useState)(false);
    const [aiAnalysis, setAIAnalysis] = (0, react_1.useState)(null);
    const fileInputRef = (0, react_1.useRef)(null);
    const handleFileSelect = async (files) => {
        if (!files)
            return;
        const newFiles = Array.from(files).slice(0, maxImages - images.length);
        const newPreviews = [];
        // Create previews
        for (const file of newFiles) {
            const preview = URL.createObjectURL(file);
            newPreviews.push(preview);
        }
        const updatedImages = [...images, ...newFiles];
        const updatedPreviews = [...previews, ...newPreviews];
        setImages(updatedImages);
        setPreviews(updatedPreviews);
        onImagesChange(updatedImages);
        // Analyze the first image with AI
        if (newFiles.length > 0 && onAIAnalysis) {
            await analyzeWithAI(newFiles[0]);
        }
    };
    const analyzeWithAI = async (imageFile) => {
        setAnalyzing(true);
        try {
            const analysis = await aiService_1.aiService.analyzeImage(imageFile);
            setAIAnalysis(analysis);
            onAIAnalysis?.(analysis);
        }
        catch (error) {
            console.error('AI analysis failed:', error);
        }
        finally {
            setAnalyzing(false);
        }
    };
    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);
        // Revoke object URL to prevent memory leaks
        if (previews[index] && !existingImages.includes(previews[index])) {
            URL.revokeObjectURL(previews[index]);
        }
        setImages(newImages);
        setPreviews(newPreviews);
        onImagesChange(newImages);
    };
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };
    return (<div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Photos (Optional)
        </label>
        <span className="text-xs text-gray-500">
          {images.length}/{maxImages} images
        </span>
      </div>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={(e) => handleFileSelect(e.target.files)} className="hidden"/>
        
        {images.length < maxImages ? (<div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <lucide_react_1.Camera className="w-6 h-6 text-gray-400"/>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Upload photos to help with matching
              </p>
              <button type="button" onClick={triggerFileInput} className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors">
                <lucide_react_1.Upload className="w-4 h-4"/>
                <span>Choose Photos</span>
              </button>
            </div>
            
            <p className="text-xs text-gray-500">
              AI will analyze your photos to improve matching accuracy
            </p>
          </div>) : (<p className="text-sm text-gray-500">Maximum number of images reached</p>)}
      </div>

      {/* Image Previews */}
      {previews.length > 0 && (<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {previews.map((preview, index) => (<div key={index} className="relative group">
              <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-lg border border-gray-200"/>
              <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 w-6 h-6 bg-error-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <lucide_react_1.X className="w-4 h-4"/>
              </button>
              
              {index === 0 && analyzing && (<div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                  <div className="text-white text-center">
                    <lucide_react_1.Loader className="w-6 h-6 animate-spin mx-auto mb-2"/>
                    <p className="text-xs">Analyzing...</p>
                  </div>
                </div>)}
            </div>))}
        </div>)}

      {/* AI Analysis Results */}
      {aiAnalysis && (<div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <lucide_react_1.Eye className="w-4 h-4 text-primary-600"/>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-primary-900 mb-2">
                AI Analysis Results ({Math.round(aiAnalysis.confidence * 100)}% confidence)
              </h4>
              <p className="text-sm text-primary-800 mb-2">
                {aiAnalysis.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {aiAnalysis.tags.map((tag, index) => (<span key={index} className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                    {tag}
                  </span>))}
              </div>
              {(aiAnalysis.category || aiAnalysis.color || aiAnalysis.brand) && (<div className="mt-2 text-xs text-primary-700">
                  {aiAnalysis.category && <span>Category: {aiAnalysis.category} • </span>}
                  {aiAnalysis.color && <span>Color: {aiAnalysis.color} • </span>}
                  {aiAnalysis.brand && <span>Brand: {aiAnalysis.brand}</span>}
                </div>)}
            </div>
          </div>
        </div>)}
    </div>);
}
