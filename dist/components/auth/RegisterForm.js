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
exports.RegisterForm = RegisterForm;
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const authStore_1 = require("../../store/authStore");
const lucide_react_1 = require("lucide-react");
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
const departments = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Engineering',
    'Business Administration',
    'Economics',
    'Psychology',
    'Literature',
    'History',
    'Art & Design',
    'Other'
];
function RegisterForm({ onSwitchToLogin }) {
    const { register, handleSubmit, watch, formState: { errors } } = (0, react_hook_form_1.useForm)();
    const { register: registerUser, isLoading } = (0, authStore_1.useAuthStore)();
    const [showPassword, setShowPassword] = (0, react_1.useState)(false);
    const [showConfirmPassword, setShowConfirmPassword] = (0, react_1.useState)(false);
    const watchRole = watch('role');
    const watchPassword = watch('password');
    const onSubmit = async (data) => {
        if (data.password !== data.confirmPassword) {
            react_hot_toast_1.default.error('Passwords do not match');
            return;
        }
        const { confirmPassword, ...registerData } = data;
        const success = await registerUser(registerData);
        if (success) {
            react_hot_toast_1.default.success('Account created successfully!');
        }
        else {
            react_hot_toast_1.default.error('Email already exists or registration failed');
        }
    };
    return (<div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-600 mt-2">Join the university lost & found system</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I am a:
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                <input type="radio" value="student" {...register('role', { required: 'Please select your role' })} className="mr-3 text-primary-600"/>
                <lucide_react_1.GraduationCap className="w-5 h-5 mr-2 text-gray-600"/>
                <span className="text-sm font-medium">Student</span>
              </label>
              <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                <input type="radio" value="faculty" {...register('role', { required: 'Please select your role' })} className="mr-3 text-primary-600"/>
                <lucide_react_1.Building className="w-5 h-5 mr-2 text-gray-600"/>
                <span className="text-sm font-medium">Faculty</span>
              </label>
            </div>
            {errors.role && (<p className="mt-1 text-sm text-error-600">{errors.role.message}</p>)}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <lucide_react_1.User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
              <input type="text" {...register('name', { required: 'Name is required' })} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Enter your full name"/>
            </div>
            {errors.name && (<p className="mt-1 text-sm text-error-600">{errors.name.message}</p>)}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              University Email
            </label>
            <div className="relative">
              <lucide_react_1.Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
              <input type="email" {...register('email', {
        required: 'Email is required',
        pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]*university\.edu$/i,
            message: 'Must be a valid university email address'
        }
    })} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="your.email@university.edu"/>
            </div>
            {errors.email && (<p className="mt-1 text-sm text-error-600">{errors.email.message}</p>)}
          </div>

          {/* Student ID (for students only) */}
          {watchRole === 'student' && (<div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student ID
              </label>
              <input type="text" {...register('studentId', {
            required: watchRole === 'student' ? 'Student ID is required' : false
        })} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="e.g., ST2024001"/>
              {errors.studentId && (<p className="mt-1 text-sm text-error-600">{errors.studentId.message}</p>)}
            </div>)}

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select {...register('department', { required: 'Department is required' })} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="">Select your department</option>
              {departments.map(dept => (<option key={dept} value={dept}>{dept}</option>))}
            </select>
            {errors.department && (<p className="mt-1 text-sm text-error-600">{errors.department.message}</p>)}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number (Optional)
            </label>
            <div className="relative">
              <lucide_react_1.Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
              <input type="tel" {...register('phone')} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="+250788123456"/>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <lucide_react_1.Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
              <input type={showPassword ? 'text' : 'password'} {...register('password', {
        required: 'Password is required',
        minLength: {
            value: 6,
            message: 'Password must be at least 6 characters'
        }
    })} className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Create a password"/>
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <lucide_react_1.EyeOff className="w-5 h-5"/> : <lucide_react_1.Eye className="w-5 h-5"/>}
              </button>
            </div>
            {errors.password && (<p className="mt-1 text-sm text-error-600">{errors.password.message}</p>)}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <lucide_react_1.Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
              <input type={showConfirmPassword ? 'text' : 'password'} {...register('confirmPassword', {
        required: 'Please confirm your password',
        validate: value => value === watchPassword || 'Passwords do not match'
    })} className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Confirm your password"/>
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConfirmPassword ? <lucide_react_1.EyeOff className="w-5 h-5"/> : <lucide_react_1.Eye className="w-5 h-5"/>}
              </button>
            </div>
            {errors.confirmPassword && (<p className="mt-1 text-sm text-error-600">{errors.confirmPassword.message}</p>)}
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button onClick={onSwitchToLogin} className="text-primary-600 hover:text-primary-800 font-medium">
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>);
}
