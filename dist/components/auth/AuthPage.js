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
exports.AuthPage = AuthPage;
const react_1 = __importStar(require("react"));
const LoginForm_1 = require("./LoginForm");
const RegisterForm_1 = require("./RegisterForm");
const lucide_react_1 = require("lucide-react");
function AuthPage() {
    const [isLogin, setIsLogin] = (0, react_1.useState)(true);
    return (<div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start space-x-3 mb-8">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
              <lucide_react_1.Search className="w-7 h-7 text-white"/>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">University</h1>
              <p className="text-lg text-primary-600 font-medium">Lost & Found</p>
            </div>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Reuniting the University Community
          </h2>
          
          <p className="text-xl text-gray-600 mb-8">
            Smart matching technology to help students and faculty find their lost belongings quickly and efficiently.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <lucide_react_1.Zap className="w-6 h-6 text-success-600"/>
              </div>
              <h3 className="font-semibold text-gray-900">AI-Powered</h3>
              <p className="text-sm text-gray-600">Smart matching algorithms</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <lucide_react_1.Users className="w-6 h-6 text-warning-600"/>
              </div>
              <h3 className="font-semibold text-gray-900">Community</h3>
              <p className="text-sm text-gray-600">University-wide network</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <lucide_react_1.Shield className="w-6 h-6 text-primary-600"/>
              </div>
              <h3 className="font-semibold text-gray-900">Secure</h3>
              <p className="text-sm text-gray-600">Protected information</p>
            </div>
          </div>
        </div>
        
        {/* Right side - Auth Form */}
        <div>
          {isLogin ? (<LoginForm_1.LoginForm onSwitchToRegister={() => setIsLogin(false)}/>) : (<RegisterForm_1.RegisterForm onSwitchToLogin={() => setIsLogin(true)}/>)}
        </div>
      </div>
    </div>);
}
