"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const react_hot_toast_1 = require("react-hot-toast");
const authStore_1 = require("./store/authStore");
const AuthPage_1 = require("./components/auth/AuthPage");
const Layout_1 = require("./components/Layout");
const HomePage_1 = require("./pages/HomePage");
const ReportPage_1 = require("./pages/ReportPage");
const MyItemsPage_1 = require("./pages/MyItemsPage");
const MatchesPage_1 = require("./pages/MatchesPage");
const StatsPage_1 = require("./pages/StatsPage");
const AdminDashboard_1 = require("./components/admin/AdminDashboard");
function App() {
    const { isAuthenticated, user } = (0, authStore_1.useAuthStore)();
    if (!isAuthenticated) {
        return (<>
        <AuthPage_1.AuthPage />
        <react_hot_toast_1.Toaster position="top-right"/>
      </>);
    }
    return (<react_router_dom_1.BrowserRouter>
      <Layout_1.Layout>
        <react_router_dom_1.Routes>
          <react_router_dom_1.Route path="/" element={<HomePage_1.HomePage />}/>
          <react_router_dom_1.Route path="/report" element={<ReportPage_1.ReportPage />}/>
          <react_router_dom_1.Route path="/my-items" element={<MyItemsPage_1.MyItemsPage />}/>
          <react_router_dom_1.Route path="/matches" element={<MatchesPage_1.MatchesPage />}/>
          <react_router_dom_1.Route path="/stats" element={<StatsPage_1.StatsPage />}/>
          {user?.role === 'admin' && (<react_router_dom_1.Route path="/admin" element={<AdminDashboard_1.AdminDashboard />}/>)}
          <react_router_dom_1.Route path="*" element={<react_router_dom_1.Navigate to="/" replace/>}/>
        </react_router_dom_1.Routes>
      </Layout_1.Layout>
      <react_hot_toast_1.Toaster position="top-right"/>
    </react_router_dom_1.BrowserRouter>);
}
exports.default = App;
