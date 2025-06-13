import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, CreditCard, Smartphone, Building, Loader } from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';
import type { Item } from '../../types';
import toast from 'react-hot-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item;
  receiverId: string;
}

interface PaymentFormData {
  amount: number;
  method: 'momo' | 'airtel_money' | 'bank_transfer';
  phoneNumber?: string;
  accountNumber?: string;
  description: string;
}

export function PaymentModal({ isOpen, onClose, item, receiverId }: PaymentModalProps) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<PaymentFormData>();
  const { createPayment, updatePaymentStatus } = useDataStore();
  const { user } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const watchMethod = watch('method');

  if (!isOpen || !user) return null;

  const onSubmit = async (data: PaymentFormData) => {
    setIsProcessing(true);
    
    try {
      // Create payment record
      const payment = createPayment({
        itemId: item.id,
        payerId: user.id,
        receiverId,
        amount: data.amount,
        currency: 'RWF',
        method: data.method,
        description: data.description,
      });

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate 90% success rate
      const success = Math.random() > 0.1;
      
      if (success) {
        updatePaymentStatus(payment.id, 'completed');
        toast.success('Payment completed successfully!');
        onClose();
      } else {
        updatePaymentStatus(payment.id, 'failed');
        toast.error('Payment failed. Please try again.');
      }
    } catch (error) {
      toast.error('Payment processing error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Send Reward Payment</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Item Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-2">{item.title}</h4>
            <p className="text-sm text-gray-600">{item.description}</p>
            {item.reward && (
              <p className="text-sm text-success-600 font-medium mt-2">
                Suggested reward: {item.reward.toLocaleString()} RWF
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (RWF)
              </label>
              <input
                type="number"
                min="100"
                step="100"
                {...register('amount', { 
                  required: 'Amount is required',
                  min: { value: 100, message: 'Minimum amount is 100 RWF' }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter amount"
                defaultValue={item.reward || 1000}
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-error-600">{errors.amount.message}</p>
              )}
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Payment Method
              </label>
              <div className="space-y-3">
                <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="momo"
                    {...register('method', { required: 'Please select a payment method' })}
                    className="mr-3 text-primary-600"
                  />
                  <Smartphone className="w-5 h-5 mr-3 text-orange-600" />
                  <div>
                    <div className="font-medium">MTN Mobile Money</div>
                    <div className="text-sm text-gray-600">Pay with MTN MoMo</div>
                  </div>
                </label>

                <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="airtel_money"
                    {...register('method', { required: 'Please select a payment method' })}
                    className="mr-3 text-primary-600"
                  />
                  <Smartphone className="w-5 h-5 mr-3 text-red-600" />
                  <div>
                    <div className="font-medium">Airtel Money</div>
                    <div className="text-sm text-gray-600">Pay with Airtel Money</div>
                  </div>
                </label>

                <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="bank_transfer"
                    {...register('method', { required: 'Please select a payment method' })}
                    className="mr-3 text-primary-600"
                  />
                  <Building className="w-5 h-5 mr-3 text-blue-600" />
                  <div>
                    <div className="font-medium">Bank Transfer</div>
                    <div className="text-sm text-gray-600">Direct bank transfer</div>
                  </div>
                </label>
              </div>
              {errors.method && (
                <p className="mt-1 text-sm text-error-600">{errors.method.message}</p>
              )}
            </div>

            {/* Phone Number for Mobile Money */}
            {(watchMethod === 'momo' || watchMethod === 'airtel_money') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  {...register('phoneNumber', { 
                    required: 'Phone number is required for mobile money',
                    pattern: {
                      value: /^(\+250|250)?[0-9]{9}$/,
                      message: 'Please enter a valid Rwandan phone number'
                    }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="+250788123456"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-error-600">{errors.phoneNumber.message}</p>
                )}
              </div>
            )}

            {/* Account Number for Bank Transfer */}
            {watchMethod === 'bank_transfer' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  {...register('accountNumber', { 
                    required: 'Account number is required for bank transfer'
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter account number"
                />
                {errors.accountNumber && (
                  <p className="mt-1 text-sm text-error-600">{errors.accountNumber.message}</p>
                )}
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Description
              </label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Reward for finding my lost phone"
                defaultValue={`Reward for finding: ${item.title}`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-error-600">{errors.description.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="flex-1 bg-primary-600 text-white px-4 py-3 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  'Send Payment'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}