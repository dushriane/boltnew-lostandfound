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
exports.HomePage = HomePage;
const react_1 = __importStar(require("react"));
const dataStore_1 = require("../store/dataStore");
const authStore_1 = require("../store/authStore");
const ItemCard_1 = require("../components/ItemCard");
const PaymentModal_1 = require("../components/payments/PaymentModal");
const lucide_react_1 = require("lucide-react");
const mockData_1 = require("../data/mockData");
const react_infinite_scroll_component_1 = __importDefault(require("react-infinite-scroll-component"));
function HomePage() {
    const { items: allItems } = (0, dataStore_1.useDataStore)();
    const { user } = (0, authStore_1.useAuthStore)();
    const [items, setItems] = (0, react_1.useState)([]);
    const [hasMore, setHasMore] = (0, react_1.useState)(true);
    const [page, setPage] = (0, react_1.useState)(1);
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [selectedCategory, setSelectedCategory] = (0, react_1.useState)('');
    const [selectedType, setSelectedType] = (0, react_1.useState)('all');
    const [sortBy, setSortBy] = (0, react_1.useState)('date');
    const [paymentModal, setPaymentModal] = (0, react_1.useState)({ isOpen: false });
    const ITEMS_PER_PAGE = 12;
    (0, react_1.useEffect)(() => {
        loadInitialItems();
    }, [searchTerm, selectedCategory, selectedType, sortBy, allItems]);
    const loadInitialItems = () => {
        const filteredItems = filterItems(allItems);
        const paginatedItems = filteredItems.slice(0, ITEMS_PER_PAGE);
        setItems(paginatedItems);
        setPage(1);
        setHasMore(filteredItems.length > ITEMS_PER_PAGE);
    };
    const loadMoreItems = () => {
        const filteredItems = filterItems(allItems);
        const nextPage = page + 1;
        const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
        const newItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
        setItems(prev => [...prev, ...newItems]);
        setPage(nextPage);
        setHasMore(startIndex + newItems.length < filteredItems.length);
    };
    const filterItems = (itemsToFilter) => {
        return itemsToFilter
            .filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.location.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = !selectedCategory || item.category === selectedCategory;
            const matchesType = selectedType === 'all' || item.type === selectedType;
            return matchesSearch && matchesCategory && matchesType && item.status === 'active';
        })
            .sort((a, b) => {
            if (sortBy === 'date') {
                return new Date(b.dateOccurred).getTime() - new Date(a.dateOccurred).getTime();
            }
            return a.location.localeCompare(b.location);
        });
    };
    const handleContactItem = (item) => {
        if (item.reward && item.type === 'lost' && user?.id !== item.userId) {
            setPaymentModal({
                isOpen: true,
                item,
                receiverId: item.userId,
            });
        }
    };
    const filteredItemsCount = filterItems(allItems).length;
    const stats = {
        total: filteredItemsCount,
        lost: allItems.filter(item => item.type === 'lost' && item.status === 'active').length,
        found: allItems.filter(item => item.type === 'found' && item.status === 'active').length,
    };
    return (<div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          University Lost & Found
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Helping reunite the campus community with their belongings through smart matching technology
        </p>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-primary-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Active Items</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-error-600">{stats.lost}</div>
            <div className="text-sm text-gray-600">Lost Items</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-success-600">{stats.found}</div>
            <div className="text-sm text-gray-600">Found Items</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <lucide_react_1.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
            <input type="text" placeholder="Search items, descriptions, or locations..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"/>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="all">All Items</option>
              <option value="lost">Lost Items</option>
              <option value="found">Found Items</option>
            </select>

            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="">All Categories</option>
              {mockData_1.categories.map(category => (<option key={category} value={category}>{category}</option>))}
            </select>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="date">Sort by Date</option>
              <option value="location">Sort by Location</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredItemsCount} {filteredItemsCount === 1 ? 'Item' : 'Items'} Found
          </h2>
          
          {(searchTerm || selectedCategory || selectedType !== 'all') && (<button onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSelectedType('all');
            }} className="text-primary-600 hover:text-primary-800 text-sm font-medium">
              Clear Filters
            </button>)}
        </div>

        {items.length === 0 ? (<div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <lucide_react_1.Search className="w-12 h-12 text-gray-400"/>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory || selectedType !== 'all'
                ? 'Try adjusting your search criteria or filters'
                : 'No items have been reported yet'}
            </p>
          </div>) : (<react_infinite_scroll_component_1.default dataLength={items.length} next={loadMoreItems} hasMore={hasMore} loader={<div className="text-center py-4">
                <lucide_react_1.Loader className="w-6 h-6 animate-spin mx-auto text-primary-600"/>
                <p className="text-sm text-gray-600 mt-2">Loading more items...</p>
              </div>} endMessage={<div className="text-center py-8">
                <p className="text-gray-600">You've seen all available items!</p>
              </div>}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map(item => (<ItemCard_1.ItemCard key={item.id} item={item} showContact={true} onContact={handleContactItem}/>))}
            </div>
          </react_infinite_scroll_component_1.default>)}
      </div>

      {/* Payment Modal */}
      {paymentModal.isOpen && paymentModal.item && paymentModal.receiverId && (<PaymentModal_1.PaymentModal isOpen={paymentModal.isOpen} onClose={() => setPaymentModal({ isOpen: false })} item={paymentModal.item} receiverId={paymentModal.receiverId}/>)}
    </div>);
}
