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
exports.LoginForm = LoginForm;
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const authStore_1 = require("../../store/authStore");
const lucide_react_1 = require("lucide-react");
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
function LoginForm({ onSwitchToRegister }) {
    const { register, handleSubmit, formState: { errors } } = (0, react_hook_form_1.useForm)();
    const { login, isLoading } = (0, authStore_1.useAuthStore)();
    const [showPassword, setShowPassword] = (0, react_1.useState)(false);
    const onSubmit = async (data) => {
        const success = await login(data.email, data.password);
        if (success) {
            react_hot_toast_1.default.success('Welcome back!');
        }
        else {
            react_hot_toast_1.default.error('Invalid email or password');
        }
    };
    return (<div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
          <p className="text-gray-600 mt-2">Access your university lost & found account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <lucide_react_1.Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
              <input type="email" {...register('email', {
        required: 'Email is required',
        pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address'
        }
    })} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="your.email@university.edu"/>
            </div>
            {errors.email && (<p className="mt-1 text-sm text-error-600">{errors.email.message}</p>)}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <lucide_react_1.Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
              <input type={showPassword ? 'text' : 'password'} {...register('password', { required: 'Password is required' })} className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Enter your password"/>
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <lucide_react_1.EyeOff className="w-5 h-5"/> : <lucide_react_1.Eye className="w-5 h-5"/>}
              </button>
            </div>
            {errors.password && (<p className="mt-1 text-sm text-error-600">{errors.password.message}</p>)}
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
            {isLoading ? (<>
                <lucide_react_1.Loader className="w-4 h-4 animate-spin mr-2"/>
                Signing in...
              </>) : ('Sign In')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button onClick={onSwitchToRegister} className="text-primary-600 hover:text-primary-800 font-medium">
              Register here
            </button>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Demo Accounts:</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <div><strong>Admin:</strong> admin@university.edu / admin123</div>
            <div><strong>Student:</strong> john.doe@student.university.edu / student123</div>
            <div><strong>Faculty:</strong> prof.smith@university.edu / faculty123</div>
          </div>
        </div>
      </div>
    </div>);
}
