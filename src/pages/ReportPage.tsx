import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../store/dataStore';
import { ItemForm } from '../components/ItemForm';
import { CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export function ReportPage() {
  const navigate = useNavigate();
  const { addItem } = useDataStore();
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    
    try {
      const newItem = await addItem(data);
      setSubmitted(true);
      toast.success('Item reported successfully!');
      
      // Redirect after showing success message
      setTimeout(() => {
        navigate('/my-items');
      }, 2000);
    } catch (error) {
      console.error('Error submitting item:', error);
      toast.error('Failed to submit item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-success-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Item Reported Successfully!</h2>
          <p className="text-gray-600 mb-4">
            Your item has been added to our database. Our system will automatically check for potential matches and notify you via email if any are found.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to your items...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Report an Item</h1>
        <p className="text-gray-600">
          Fill out the form below to report a lost or found item. Our system will automatically search for potential matches.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <ItemForm onSubmit={handleSubmit} isLoading={isLoading} />
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
    </div>
  );
}