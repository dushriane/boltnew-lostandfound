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
exports.PaymentModal = PaymentModal;
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const lucide_react_1 = require("lucide-react");
const dataStore_1 = require("../../store/dataStore");
const authStore_1 = require("../../store/authStore");
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
function PaymentModal({ isOpen, onClose, item, receiverId }) {
    const { register, handleSubmit, watch, formState: { errors } } = (0, react_hook_form_1.useForm)();
    const { createPayment, updatePaymentStatus } = (0, dataStore_1.useDataStore)();
    const { user } = (0, authStore_1.useAuthStore)();
    const [isProcessing, setIsProcessing] = (0, react_1.useState)(false);
    const watchMethod = watch('method');
    if (!isOpen || !user)
        return null;
    const onSubmit = async (data) => {
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
                react_hot_toast_1.default.success('Payment completed successfully!');
                onClose();
            }
            else {
                updatePaymentStatus(payment.id, 'failed');
                react_hot_toast_1.default.error('Payment failed. Please try again.');
            }
        }
        catch (error) {
            react_hot_toast_1.default.error('Payment processing error');
        }
        finally {
            setIsProcessing(false);
        }
    };
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Send Reward Payment</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <lucide_react_1.X className="w-6 h-6"/>
          </button>
        </div>

        <div className="p-6">
          {/* Item Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-2">{item.title}</h4>
            <p className="text-sm text-gray-600">{item.description}</p>
            {item.reward && (<p className="text-sm text-success-600 font-medium mt-2">
                Suggested reward: {item.reward.toLocaleString()} RWF
              </p>)}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (RWF)
              </label>
              <input type="number" min="100" step="100" {...register('amount', {
        required: 'Amount is required',
        min: { value: 100, message: 'Minimum amount is 100 RWF' }
    })} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Enter amount" defaultValue={item.reward || 1000}/>
              {errors.amount && (<p className="mt-1 text-sm text-error-600">{errors.amount.message}</p>)}
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Payment Method
              </label>
              <div className="space-y-3">
                <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                  <input type="radio" value="momo" {...register('method', { required: 'Please select a payment method' })} className="mr-3 text-primary-600"/>
                  <lucide_react_1.Smartphone className="w-5 h-5 mr-3 text-orange-600"/>
                  <div>
                    <div className="font-medium">MTN Mobile Money</div>
                    <div className="text-sm text-gray-600">Pay with MTN MoMo</div>
                  </div>
                </label>

                <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                  <input type="radio" value="airtel_money" {...register('method', { required: 'Please select a payment method' })} className="mr-3 text-primary-600"/>
                  <lucide_react_1.Smartphone className="w-5 h-5 mr-3 text-red-600"/>
                  <div>
                    <div className="font-medium">Airtel Money</div>
                    <div className="text-sm text-gray-600">Pay with Airtel Money</div>
                  </div>
                </label>

                <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                  <input type="radio" value="bank_transfer" {...register('method', { required: 'Please select a payment method' })} className="mr-3 text-primary-600"/>
                  <lucide_react_1.Building className="w-5 h-5 mr-3 text-blue-600"/>
                  <div>
                    <div className="font-medium">Bank Transfer</div>
                    <div className="text-sm text-gray-600">Direct bank transfer</div>
                  </div>
                </label>
              </div>
              {errors.method && (<p className="mt-1 text-sm text-error-600">{errors.method.message}</p>)}
            </div>

            {/* Phone Number for Mobile Money */}
            {(watchMethod === 'momo' || watchMethod === 'airtel_money') && (<div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input type="tel" {...register('phoneNumber', {
            required: 'Phone number is required for mobile money',
            pattern: {
                value: /^(\+250|250)?[0-9]{9}$/,
                message: 'Please enter a valid Rwandan phone number'
            }
        })} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="+250788123456"/>
                {errors.phoneNumber && (<p className="mt-1 text-sm text-error-600">{errors.phoneNumber.message}</p>)}
              </div>)}

            {/* Account Number for Bank Transfer */}
            {watchMethod === 'bank_transfer' && (<div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number
                </label>
                <input type="text" {...register('accountNumber', {
            required: 'Account number is required for bank transfer'
        })} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Enter account number"/>
                {errors.accountNumber && (<p className="mt-1 text-sm text-error-600">{errors.accountNumber.message}</p>)}
              </div>)}

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Description
              </label>
              <textarea {...register('description', { required: 'Description is required' })} rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g., Reward for finding my lost phone" defaultValue={`Reward for finding: ${item.title}`}/>
              {errors.description && (<p className="mt-1 text-sm text-error-600">{errors.description.message}</p>)}
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={isProcessing} className="flex-1 bg-primary-600 text-white px-4 py-3 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
                {isProcessing ? (<>
                    <lucide_react_1.Loader className="w-4 h-4 animate-spin mr-2"/>
                    Processing...
                  </>) : ('Send Payment')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>);
}
