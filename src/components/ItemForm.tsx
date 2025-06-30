import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/authStore';
import type { Item } from '../types';
import { categories, colors } from '../data/mockData';
import { Calendar, MapPin, User, Mail, Phone, DollarSign, Sparkles } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { aiService } from '../utils/aiService';

interface ItemFormData {
  type: 'lost' | 'found';
  title: string;
  description: string;
  category: string;
  location: string;
  dateOccurred: string;
  color?: string;
  brand?: string;
  size?: string;
  reward?: number;
}

interface ItemFormProps {
  onSubmit: (data: Omit<Item, 'id' | 'dateReported' | 'status' | 'isVerified'>) => void;
  initialData?: Partial<ItemFormData>;
  isLoading?: boolean;
}

export function ItemForm({ onSubmit, initialData, isLoading }: ItemFormProps) {
  const { user } = useAuthStore();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ItemFormData>({
    defaultValues: {
      type: 'lost',
      ...initialData
    }
  });

  const [images, setImages] = useState<File[]>([]);
  const [aiAnalysis, setAIAnalysis] = useState<any>(null);
  const [processingAI, setProcessingAI] = useState(false);

  const itemType = watch('type');

  if (!user) return null;

  const handleAIAnalysis = (analysis: any) => {
    setAIAnalysis(analysis);
    
    // Auto-fill form fields based on AI analysis
    if (analysis.category && categories.includes(analysis.category)) {
      setValue('category', analysis.category);
    }
    if (analysis.color && colors.includes(analysis.color)) {
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

  const onFormSubmit = async (data: ItemFormData) => {
    setProcessingAI(true);
    
    try {
      const { dateOccurred, reward, ...rest } = data;
      
      // Generate image embeddings if images are provided
      let imageEmbeddings: number[] = [];
      if (images.length > 0) {
        imageEmbeddings = await aiService.generateImageEmbedding(images[0]);
      }
      
      // Enhance description with AI if available
      let enhancedDescription = data.description;
      if (aiAnalysis) {
        enhancedDescription = await aiService.enhanceDescription(data.description, aiAnalysis);
      }
      
      // Create the item data with all required fields
      const itemData: Omit<Item, 'id' | 'dateReported' | 'status' | 'isVerified'> = {
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
      };
      
      onSubmit(itemData);
    } catch (error) {
      console.error('Error processing form:', error);
    } finally {
      setProcessingAI(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Item Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Report Type
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="lost"
              {...register('type', { required: true })}
              className="mr-2 text-primary-600"
            />
            <span className="text-sm">Lost Item</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="found"
              {...register('type', { required: true })}
              className="mr-2 text-primary-600"
            />
            <span className="text-sm">Found Item</span>
          </label>
        </div>
      </div>

      {/* Image Upload */}
      <ImageUpload
        onImagesChange={setImages}
        onAIAnalysis={handleAIAnalysis}
        maxImages={3}
      />

      {/* AI Enhancement Notice */}
      {aiAnalysis && (
        <div className="bg-gradient-to-r from-purple-50 to-primary-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-semibold text-purple-900">AI Enhanced</span>
          </div>
          <p className="text-sm text-purple-800">
            Form fields have been automatically filled based on AI image analysis. 
            You can modify any details as needed.
          </p>
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Item Title *
        </label>
        <input
          type="text"
          {...register('title', { required: 'Title is required' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="e.g., Black iPhone 14 Pro"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-error-600">{errors.title.message}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category *
        </label>
        <select
          {...register('category', { required: 'Category is required' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">Select a category</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-error-600">{errors.category.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          {...register('description', { required: 'Description is required' })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Provide detailed description including distinctive features, condition, etc."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-error-600">{errors.description.message}</p>
        )}
      </div>

      {/* Location and Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Location *
          </label>
          <input
            type="text"
            {...register('location', { required: 'Location is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Where was it lost/found?"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-error-600">{errors.location.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Date {itemType === 'lost' ? 'Lost' : 'Found'} *
          </label>
          <input
            type="date"
            {...register('dateOccurred', { required: 'Date is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            max={new Date().toISOString().split('T')[0]}
          />
          {errors.dateOccurred && (
            <p className="mt-1 text-sm text-error-600">{errors.dateOccurred.message}</p>
          )}
        </div>
      </div>

      {/* Item Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color
          </label>
          <select
            {...register('color')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select color</option>
            {colors.map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand
          </label>
          <input
            type="text"
            {...register('brand')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., Apple, Nike"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Size
          </label>
          <input
            type="text"
            {...register('size')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., Large, 10, 15 inch"
          />
        </div>
      </div>

      {/* Reward (only for lost items) */}
      {itemType === 'lost' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 inline mr-1" />
            Reward (Optional) - RWF
          </label>
          <input
            type="number"
            min="0"
            step="100"
            {...register('reward', { min: 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter reward amount in RWF"
          />
          <p className="mt-1 text-xs text-gray-500">
            Offering a reward can increase the chances of your item being returned
          </p>
        </div>
      )}

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
            {user.phone && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <p className="text-sm text-gray-900">{user.phone}</p>
              </div>
            )}
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
        <button
          type="submit"
          disabled={isLoading || processingAI}
          className="px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading || processingAI ? 'Processing...' : `Report ${itemType === 'lost' ? 'Lost' : 'Found'} Item`}
        </button>
      </div>
    </form>
  );
}