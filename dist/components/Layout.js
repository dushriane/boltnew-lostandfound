"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Layout = Layout;
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const authStore_1 = require("../store/authStore");
const dataStore_1 = require("../store/dataStore");
const lucide_react_1 = require("lucide-react");
function Layout({ children }) {
    const location = (0, react_router_dom_1.useLocation)();
    const { user, logout } = (0, authStore_1.useAuthStore)();
    const { getUserNotifications } = (0, dataStore_1.useDataStore)();
    const notifications = user ? getUserNotifications(user.id) : [];
    const unreadCount = notifications.filter(n => !n.isRead).length;
    const navigation = [
        { name: 'Browse Items', href: '/', icon: lucide_react_1.Search },
        { name: 'Report Item', href: '/report', icon: lucide_react_1.Plus },
        { name: 'My Items', href: '/my-items', icon: lucide_react_1.List },
        { name: 'Matches', href: '/matches', icon: lucide_react_1.Mail },
        { name: 'Statistics', href: '/stats', icon: lucide_react_1.BarChart3 },
    ];
    // Add admin route for admin users
    if (user?.role === 'admin') {
        navigation.push({ name: 'Admin', href: '/admin', icon: lucide_react_1.Shield });
    }
    const handleLogout = () => {
        logout();
    };
    return (<div className="min-h-screen bg-gray-50">
      {/* Bolt.new Badge */}
      <style dangerouslySetInnerHTML={{
            __html: `
          .bolt-badge {
            transition: all 0.3s ease;
          }
          @keyframes badgeIntro {
            0% { transform: rotateY(-90deg); opacity: 0; }
            100% { transform: rotateY(0deg); opacity: 1; }
          }
          .bolt-badge-intro {
            animation: badgeIntro 0.8s ease-out 1s both;
          }
          .bolt-badge-intro.animated {
            animation: none;
          }
          @keyframes badgeHover {
            0% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.1) rotate(22deg); }
            100% { transform: scale(1) rotate(0deg); }
          }
          .bolt-badge:hover {
            animation: badgeHover 0.6s ease-in-out;
          }
        `
        }}/>
      
      <div className="fixed top-4 left-4 z-50">
        <a href="https://bolt.new/" target="_blank" rel="noopener noreferrer" className="block transition-all duration-300 hover:shadow-2xl" title="Built with Bolt.new">
          <img src="https://storage.bolt.army/black_circle_360x360.png" alt="Built with Bolt.new badge" className="w-16 h-16 md:w-20 md:h-20 rounded-full shadow-lg bolt-badge bolt-badge-intro" onAnimationEnd={(e) => e.currentTarget.classList.add('animated')}/>
        </a>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center ml-20 md:ml-24">
              <react_router_dom_1.Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <lucide_react_1.Search className="w-5 h-5 text-white"/>
                </div>
                <div>
                  <span className="text-xl font-bold text-gray-900">University</span>
                  <span className="text-sm text-primary-600 block leading-none">Lost & Found</span>
                </div>
              </react_router_dom_1.Link>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (<react_router_dom_1.Link key={item.name} to={item.href} className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
                    <Icon className="w-4 h-4"/>
                    <span>{item.name}</span>
                  </react_router_dom_1.Link>);
        })}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
                <lucide_react_1.Bell className="w-5 h-5"/>
                {unreadCount > 0 && (<span className="absolute -top-1 -right-1 w-5 h-5 bg-error-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>)}
              </button>

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-600 capitalize">
                    {user?.role}
                    {user?.role === 'student' && user?.studentId && ` • ${user.studentId}`}
                  </p>
                </div>
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <lucide_react_1.User className="w-5 h-5 text-primary-600"/>
                </div>
              </div>

              {/* Logout */}
              <button onClick={handleLogout} className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md" title="Logout">
                <lucide_react_1.LogOut className="w-5 h-5"/>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (<react_router_dom_1.Link key={item.name} to={item.href} className={`flex flex-col items-center space-y-1 px-4 py-3 text-xs font-medium whitespace-nowrap transition-colors ${isActive
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-gray-900'}`}>
                <Icon className="w-5 h-5"/>
                <span>{item.name}</span>
              </react_router_dom_1.Link>);
        })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 University Lost & Found System. Helping reunite the campus community with their belongings.</p>
            <p className="text-sm mt-2">
              Powered by AI • Secure • University-wide network • Built with Bolt.new
            </p>
          </div>
        </div>
      </footer>
    </div>);
}
