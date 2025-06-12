import { useState, useEffect } from 'react';
import {
  Calendar,
  BarChart3,
  BookOpen,
  Home,
  Menu,
  X,
  ChevronLeft,
  ChevronDown,
  LogOut,
  User,
  Users,
  Building2,
  Settings,
  HelpCircle,
  FileText,
  UserCheck,
  CreditCard,
  Gift,
  Stethoscope,
  DollarSign,
  Bell,
  Search
} from 'lucide-react';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  collapsed: boolean;
  active?: boolean;
  badge?: string | number;
  badgeColor?: 'blue' | 'red' | 'green' | 'yellow';
  onClick?: () => void;
}

interface NestedSidebarItemProps {
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  active?: boolean;
  badge?: string | number;
  badgeColor?: 'blue' | 'red' | 'green' | 'yellow';
  children: Array<{
    label: string;
    href: string;
    badge?: string | number;
    badgeColor?: 'blue' | 'red' | 'green' | 'yellow';
  }>;
  onItemClick: (href: string) => void;
}

// Framer motion variants
const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const Badge = ({ children, color = 'blue' }: { children: React.ReactNode; color?: 'blue' | 'red' | 'green' | 'yellow' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    red: 'bg-red-100 text-red-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600'
  };

  return (
    <span className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full ${colorClasses[color]}`}>
      {children}
    </span>
  );
};

const SidebarItem = ({ icon, label, href, collapsed, active = false, badge, badgeColor = 'blue', onClick }: SidebarItemProps) => (
  <motion.a 
    href={href}
    onClick={onClick}
    className={`flex items-center ${collapsed ? 'justify-center' : ''} w-full px-3 py-3 my-1 rounded-lg transition-all duration-200 group ${
      active 
        ? 'bg-blue-50 text-blue-600' 
        : 'text-gray-600 hover:bg-gray-50'
    }`}
    whileTap={{ scale: 0.97 }}
    initial={false}
    animate={{ 
      backgroundColor: active ? 'rgb(239, 246, 255)' : 'transparent', 
      transition: { type: 'tween', duration: 0.15 }
    }}
  >
    <motion.div 
      className={`flex items-center justify-center ${collapsed ? 'w-8 h-8' : 'w-8 h-8 mr-3'} ${active ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-500'}`}
      animate={{ 
        color: active ? 'rgb(37, 99, 235)' : '', 
        transition: { type: 'tween', duration: 0.15 }
      }}
    >
      {icon}
    </motion.div>
    {!collapsed && (
      <div className="flex items-center justify-between flex-1">
        <span className={`text-sm font-medium transition-colors duration-200 ${active ? 'text-blue-600' : 'text-gray-700 group-hover:text-blue-600'}`}>
          {label}
        </span>
        {badge && <Badge color={badgeColor}>{badge}</Badge>}
      </div>
    )}
  </motion.a>
);

const NestedSidebarItem = ({ icon, label, collapsed, active = false, badge, badgeColor = 'blue', children, onItemClick }: NestedSidebarItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      <motion.button
        onClick={() => !collapsed && setIsOpen(!isOpen)}
        className={`flex items-center ${collapsed ? 'justify-center' : ''} w-full px-3 py-3 my-1 rounded-lg transition-all duration-200 group ${
          active 
            ? 'bg-blue-50 text-blue-600' 
            : 'text-gray-600 hover:bg-gray-50'
        }`}
        whileTap={{ scale: 0.97 }}
      >
        <motion.div 
          className={`flex items-center justify-center ${collapsed ? 'w-8 h-8' : 'w-8 h-8 mr-3'} ${active ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-500'}`}
        >
          {icon}
        </motion.div>
        {!collapsed && (
          <>
            <div className="flex items-center justify-between flex-1">
              <span className={`text-sm font-medium transition-colors duration-200 ${active ? 'text-blue-600' : 'text-gray-700 group-hover:text-blue-600'}`}>
                {label}
              </span>
              <div className="flex items-center gap-2">
                {badge && <Badge color={badgeColor}>{badge}</Badge>}
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={16} className="text-gray-400" />
                </motion.div>
              </div>
            </div>
          </>
        )}
      </motion.button>
      
      {!collapsed && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="ml-11 space-y-1">
                {children.map((child, index) => (
                  <motion.a
                    key={index}
                    href={child.href}
                    onClick={() => onItemClick(child.href)}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-all duration-200"
                    whileTap={{ scale: 0.97 }}
                  >
                    <span>{child.label}</span>
                    {child.badge && <Badge color={child.badgeColor || 'blue'}>{child.badge}</Badge>}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

// User profile type
interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('/admin/dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Example user data - in a real app, this would come from your authentication system
  const [user] = useState<UserProfile>({
    name: 'Admin User',
    email: 'admin@hospital.com',
    role: 'System Administrator',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=64&h=64&q=80'
  });
  
  // Handle resize to switch between mobile and desktop views
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(false);
        setMobileOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set active item based on current path
  useEffect(() => {
    const path = window.location.pathname;
    if (path) {
      setActiveItem(path);
    }
  }, []);

  // Menu items configuration
  const menuItems = [
    { icon: <BarChart3 size={20} strokeWidth={1.5} />, label: 'Dashboard', href: '/admin/dashboard' },
  ];

  const nestedMenuItems = [
    {
      icon: <Users size={20} strokeWidth={1.5} />,
      label: 'User Management',
      badge: '245',
      badgeColor: 'blue' as const,
      children: [
        { label: 'All Users', href: '/admin/users/all' },
        { label: 'Blocked Users', href: '/admin/blocked', badge: '12', badgeColor: 'red' as const },
        { label: 'User Analytics', href: '/admin/analytics' }
      ]
    },
    {
      icon: <Building2 size={20} strokeWidth={1.5} />,
      label: 'Clinic Management',
      badge: '48',
      badgeColor: 'green' as const,
      children: [
        { label: 'All Clinics', href: '/admin/clinics/all' },
        { label: 'Pending Approvals', href: '/admin/clinics/pending', badge: '7', badgeColor: 'yellow' as const },
        { label: 'Clinic Analytics', href: '/admin/clinics/analytics' }
      ]
    },
    {
      icon: <UserCheck size={20} strokeWidth={1.5} />,
      label: 'Expert Management',
      badge: '89',
      badgeColor: 'blue' as const,
      children: [
        { label: 'All Experts', href: '/admin/experts/all' },
        { label: 'Pending Verification', href: '/admin/experts/pending', badge: '5', badgeColor: 'yellow' as const },
        { label: 'Expert Performance', href: '/admin/experts/performance' }
      ]
    },
    {
      icon: <Calendar size={20} strokeWidth={1.5} />,
      label: 'Bookings Management',
      badge: '156',
      badgeColor: 'green' as const,
      children: [
        { label: 'All Bookings', href: '/admin/bookings/all' },
        { label: 'Cancelled Bookings', href: '/admin/bookings/cancelled' },
        { label: 'Booking Analytics', href: '/admin/bookings/analytics' }
      ]
    },
    {
      icon: <Stethoscope size={20} strokeWidth={1.5} />,
      label: 'Service Management',
      children: [
        { label: 'All Services', href: '/admin/services/all' },
        { label: 'Service Categories', href: '/admin/services/categories' },
        { label: 'Pricing Management', href: '/admin/services/pricing' }
      ]
    },
    {
      icon: <DollarSign size={20} strokeWidth={1.5} />,
      label: 'Dues Management',
      badge: 'New',
      badgeColor: 'green' as const,
      children: [
        { label: 'Settlement Tracker', href: '/admin/dues/settlements' },
        { label: 'Pending Amounts', href: '/admin/dues/pending', badge: '₹45K', badgeColor: 'red' as const },
        { label: 'Payment History', href: '/admin/dues/history' },
        { label: 'Financial Reports', href: '/admin/dues/reports' }
      ]
    },
    {
      icon: <Gift size={20} strokeWidth={1.5} />,
      label: 'Offers & Promotions',
      badge: '8',
      badgeColor: 'yellow' as const,
      children: [
        { label: 'Active Offers', href: '/admin/offers/active' },
        { label: 'Create Offer', href: '/admin/offers/create' },
        { label: 'Offer Analytics', href: '/admin/offers/analytics' }
      ]
    }
  ];

  const bottomMenuItems = [
    { icon: <HelpCircle size={20} strokeWidth={1.5} />, label: 'FAQ Management', href: '/admin/faq' },
    { icon: <FileText size={20} strokeWidth={1.5} />, label: 'Blog Management', href: '/admin/blog', badge: '3', badgeColor: 'blue' as const },
  ];

  const handleItemClick = (href: string) => {
    setActiveItem(href);
    if (window.innerWidth < 768) {
      setMobileOpen(false);
    }
  };
  
  const handleLogout = () => {
    console.log('Logging out...');
  };

  // Render sidebar content - used in both mobile and desktop views
  const renderSidebarContent = () => (
    <>
      <motion.div 
        className={`flex items-center ${collapsed ? 'justify-center py-8' : ''} px-5 py-8`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {collapsed ? (
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Settings size={20} strokeWidth={1.5} />
          </div>
        ) : (
          <div className="flex items-center">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm">
              <Settings size={20} strokeWidth={1.5} />
            </div>
            <div className="ml-3">
              <h1 className="font-semibold text-gray-800">Admin Portal</h1>
              <p className="text-xs text-purple-600">System Management</p>
            </div>
          </div>
        )}
      </motion.div>
      
      {/* Search Bar */}
      {!collapsed && (
        <motion.div 
          className="px-5 mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </motion.div>
      )}
      
      <div className="mt-2 px-3 flex-grow overflow-y-auto">
        <motion.nav 
          className="space-y-0.5"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { 
              transition: { 
                staggerChildren: 0.05 
              } 
            }
          }}  
        >
          {/* Regular menu items */}
          {menuItems.map((item) => (
            <motion.div key={item.href} variants={itemVariants}>
              <SidebarItem
                icon={item.icon}
                label={item.label}
                href={item.href}
                collapsed={collapsed}
                active={activeItem === item.href}
                onClick={() => handleItemClick(item.href)}
              />
            </motion.div>
          ))}
          
          {/* Nested menu items */}
          {nestedMenuItems.map((item, index) => (
            <motion.div key={index} variants={itemVariants}>
              <NestedSidebarItem
                icon={item.icon}
                label={item.label}
                collapsed={collapsed}
                badge={item.badge}
                badgeColor={item.badgeColor}
                children={item.children}
                onItemClick={handleItemClick}
              />
            </motion.div>
          ))}
          
          {/* Bottom menu items */}
          <div className="pt-4 border-t border-gray-100 mt-4">
            {bottomMenuItems.map((item) => (
              <motion.div key={item.href} variants={itemVariants}>
                <SidebarItem
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  collapsed={collapsed}
                  active={activeItem === item.href}
                  badge={item.badge}
                  badgeColor={item.badgeColor}
                  onClick={() => handleItemClick(item.href)}
                />
              </motion.div>
            ))}
          </div>
        </motion.nav>
      </div>
      
      {!collapsed && (
        <motion.div 
          className="px-5 pt-2 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-purple-100">
            <div className="flex items-center mb-2">
              <Bell size={16} className="text-purple-600 mr-2" />
              <p className="text-xs text-gray-600 font-medium">System Health: Good</p>
            </div>
            <p className="text-xs text-gray-600 mb-3">All services running normally</p>
            <a 
              href="/admin/system-status"
              className="block w-full py-2 text-center text-xs font-medium text-purple-600 bg-white rounded-lg border border-purple-100 hover:border-purple-200 hover:shadow-sm transition-all duration-200"
            >
              View Details
            </a>
          </div>
        </motion.div>
      )}
      
      {/* User Profile Section */}
      <div className={`px-3 py-3 border-t border-gray-100 ${collapsed ? 'flex justify-center' : ''}`}>
        <AnimatePresence>
          {collapsed ? (
            <motion.button
              onClick={() => setCollapsed(false)}
              className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-full h-full object-cover" 
              />
            </motion.button>
          ) : (
            <motion.div 
              className="flex items-center justify-between w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.role}</p>
                </div>
              </div>
              <motion.button
                onClick={handleLogout}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-purple-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut size={18} strokeWidth={1.5} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );

  // Main component return
  return (
    <>
      {/* Mobile toggle button - always visible on mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <motion.button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 bg-white rounded-lg text-purple-600 shadow-md border border-gray-100"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
        </motion.button>
      </div>
      
      {/* Mobile sidebar - slides in from left */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            <motion.div 
              className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div 
              className="relative w-80 h-full bg-white shadow-xl flex flex-col"
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              {renderSidebarContent()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Desktop sidebar - collapsible */}
      <div className="hidden md:block relative h-screen">
        <motion.div 
          className={`h-full bg-white border-r border-gray-100 shadow-sm flex flex-col`}
          initial={false}
          animate={{ 
            width: collapsed ? "5rem" : "20rem"
          }}
          transition={{ type: "spring", damping: 25, stiffness: 320 }}
        >
          {renderSidebarContent()}
        </motion.div>
        
        {/* Collapse toggle button */}
        <motion.button 
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-16 p-1.5 bg-white rounded-full border border-gray-100 text-gray-400 shadow-sm hover:text-purple-500 hover:border-purple-100 transition-colors duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            initial={false}
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft size={14} />
          </motion.div>
        </motion.button>
      </div>
    </>
  );
}