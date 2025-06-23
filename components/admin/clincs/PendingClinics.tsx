import React, { useState, useMemo } from 'react';
import { Search, MapPin, Clock, Calendar, Phone, Mail, Filter, MoreHorizontal, Eye, Edit2, Trash2, Plus, Download, X, Check, AlertCircle, ExternalLink, Menu, ChevronDown, Star, Users, Activity, Heart, Shield, Zap, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface Clinic {
  id: number;
  name: string;
  address: string;
  city: string;
  pincode: string;
  status: 'Approved' | 'Draft' | 'Pending' | 'Rejected';
  paymentStatus: 'Paid' | 'No Dues' | 'Pending' | 'Overdue';
  dueAmount: string;
  hours: string;
  workingDays: string[];
  phone: string;
  email: string;
  isActive: boolean;
  mapLink?: string;
  rating?: number;
  totalPatients?: number;
}

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const clinicData: Clinic[] = [
  {
    id: 1,
    name: 'Greater Kailash Hospital',
    address: 'Old Palasia, AB Road, Indore, Madhya Pradesh 452001',
    city: 'Indore',
    pincode: '452001',
    status: 'Pending',
    paymentStatus: 'No Dues',
    dueAmount: '₹0',
    hours: '10:00 AM - 5:00 PM',
    workingDays: ['Mon', 'Wed', 'Fri'],
    phone: '+91 98765 43210',
    email: 'contact@greaterkailash.com',
    isActive: true,
    mapLink: 'https://www.google.com/maps/place/Greater+Kailash+Hospital',
    rating: 4.5,
    totalPatients: 1250
  },
  {
    id: 2,
    name: 'Getwell Medical Center',
    address: 'Post Office Rd, Dr. Ambedkar Nagar, Indore',
    city: 'Indore',
    pincode: '453331',
    status: 'Pending',
    paymentStatus: 'No Dues',
    dueAmount: '₹0',
    hours: '10:00 AM - 6:30 PM',
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Sun'],
    phone: '+91 98765 43211',
    email: 'contact@getwell.com',
    isActive: false,
    rating: 4.2,
    totalPatients: 890
  },
  {
    id: 3,
    name: 'Sunshine Healthcare',
    address: 'MG Road, Vijay Nagar, Indore',
    city: 'Indore',
    pincode: '452010',
    status: 'Pending',
    paymentStatus: 'Paid',
    dueAmount: '₹0',
    hours: '9:00 AM - 8:00 PM',
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    phone: '+91 98765 43212',
    email: 'info@sunshine.com',
    isActive: true,
    rating: 4.8,
    totalPatients: 2100
  },
  {
    id: 4,
    name: 'City Care Clinic',
    address: 'Palasia Square, Indore',
    city: 'Indore',
    pincode: '452001',
    status: 'Pending',
    paymentStatus: 'Pending',
    dueAmount: '₹2,500',
    hours: '10:00 AM - 7:00 PM',
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    phone: '+91 98765 43213',
    email: 'admin@citycare.com',
    isActive: false,
    rating: 4.0,
    totalPatients: 650
  },
  {
    id: 5,
    name: 'Metro Medical Hub',
    address: 'Scheme 78, Vijay Nagar, Indore',
    city: 'Indore',
    pincode: '452010',
    status: 'Pending',
    paymentStatus: 'Overdue',
    dueAmount: '₹5,000',
    hours: '8:00 AM - 10:00 PM',
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    phone: '+91 98765 43214',
    email: 'info@metromed.com',
    isActive: true,
    rating: 4.3,
    totalPatients: 1800
  },
  {
    id: 6,
    name: 'Prime Healthcare Center',
    address: 'Sapna Sangeeta Road, Indore',
    city: 'Indore',
    pincode: '452001',
    status: 'Pending',
    paymentStatus: 'Pending',
    dueAmount: '₹1,200',
    hours: '9:00 AM - 7:00 PM',
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    phone: '+91 98765 43215',
    email: 'contact@primehc.com',
    isActive: false,
    rating: 4.1,
    totalPatients: 980
  },
  {
    id: 7,
    name: 'Unity Medical Complex',
    address: 'Ring Road, Indore',
    city: 'Indore',
    pincode: '452016',
    status: 'Pending',
    paymentStatus: 'No Dues',
    dueAmount: '₹0',
    hours: '6:00 AM - 12:00 AM',
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    phone: '+91 98765 43216',
    email: 'admin@unitymed.com',
    isActive: true,
    rating: 4.6,
    totalPatients: 2500
  },
  {
    id: 8,
    name: 'Wellness Point Clinic',
    address: 'Bhawarkua Square, Indore',
    city: 'Indore',
    pincode: '452014',
    status: 'Pending',
    paymentStatus: 'Paid',
    dueAmount: '₹0',
    hours: '10:00 AM - 8:00 PM',
    workingDays: ['Mon', 'Wed', 'Fri', 'Sat'],
    phone: '+91 98765 43217',
    email: 'info@wellnesspoint.com',
    isActive: true,
    rating: 4.4,
    totalPatients: 1100
  }
];

const Modal = ({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}></div>
        <div className={`inline-block w-full ${sizeClasses[size]} p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-3xl`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
              aria-label="Close modal"
            >
              <X className="w-6 h-6 text-gray-400 group-hover:text-gray-600" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

// Enhanced Pagination Component
const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalItems, 
  itemsPerPage 
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200">
      <div className="text-sm text-gray-700">
        Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of{' '}
        <span className="font-medium">{totalItems}</span> results
                  </div>
      
      <div className="flex items-center gap-2">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="First page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        
        {/* Previous Page */}
          <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
          </button>
        
        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 rounded-lg border transition-colors ${
                currentPage === page
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        
        {/* Next Page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        
        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Last page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
        </div>
    </div>
  );
};

function PendingClinics() {
  const [searchTerm, setSearchTerm] = useState('');
  const [clinics, setClinics] = useState<Clinic[]>(clinicData.filter(c => c.status === 'Pending'));
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Memoized filtered clinics for better performance
  const filteredClinics = useMemo(() => {
    return clinics.filter(clinic =>
      clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.phone.includes(searchTerm) ||
      clinic.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clinics, searchTerm]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredClinics.length / itemsPerPage);
  const paginatedClinics = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredClinics.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredClinics, currentPage, itemsPerPage]);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleApprove = async (clinicId: number) => {
    setClinics(prev => prev.filter(c => c.id !== clinicId));
    showNotification('✅ Clinic approved successfully!', 'success');
    
    // Adjust current page if necessary
    const newFilteredCount = filteredClinics.length - 1;
    const newTotalPages = Math.ceil(newFilteredCount / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  const handleReject = async (clinicId: number) => {
    setClinics(prev => prev.map(c => 
      c.id === clinicId ? { ...c, status: 'Rejected' as const } : c
    ).filter(c => c.status === 'Pending'));
    showNotification('❌ Clinic rejected', 'error');
  };

  const handleViewClinic = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    setShowViewModal(true);
  };

  const handleEditClinic = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    setShowEditModal(true);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-2xl shadow-2xl border-2 transform transition-all duration-500 max-w-sm ${
          notification.type === 'success' 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
            : notification.type === 'error'
            ? 'bg-rose-50 border-rose-300 text-rose-900'
            : 'bg-blue-50 border-blue-300 text-blue-900'
        }`}>
          <div className="flex items-start gap-3">
            {notification.type === 'success' && <Check className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />}
            {notification.type === 'error' && <AlertCircle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />}
            {notification.type === 'info' && <Activity className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />}
            <div className="flex-1">
              <p className="font-semibold text-sm leading-relaxed">{notification.message}</p>
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mb-2">Pending Clinics</h1>
          <p className="text-gray-600 text-sm sm:text-base">Review and manage clinic applications waiting for approval</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Pending</p>
              <p className="text-xl sm:text-2xl font-bold text-amber-600">{clinics.length}</p>
            </div>
            <div className="p-2 sm:p-3 rounded-xl bg-amber-100 flex items-center justify-center">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">With Dues</p>
              <p className="text-xl sm:text-2xl font-bold text-rose-600">{clinics.filter(c => c.dueAmount !== '₹0').length}</p>
            </div>
            <div className="p-2 sm:p-3 rounded-xl bg-rose-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-rose-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Active Status</p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-600">{clinics.filter(c => c.isActive).length}</p>
            </div>
            <div className="p-2 sm:p-3 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200/50 p-3 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-4">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search clinics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white/70 backdrop-blur transition-all text-gray-900 placeholder-gray-500 text-sm sm:text-base"
              />
            </div>
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={15}>15 per page</option>
                <option value={20}>20 per page</option>
              </select>
            </div>
          </div>

          {/* Table - Responsive for mobile */}
          <div>
            {/* Mobile Card View */}
            <div className="sm:hidden space-y-4">
              {paginatedClinics.length > 0 ? (
                paginatedClinics.map((clinic) => (
                  <div key={clinic.id} className="bg-white rounded-xl shadow border border-gray-100 p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900 text-base">{clinic.name}</p>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium mt-1">
                          <Clock className="w-4 h-4" /> Pending
                        </span>
                      </div>
                      {clinic.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-600">{clinic.rating}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-700 mb-1">
                      <MapPin className="inline w-4 h-4 mr-1 text-gray-400 align-text-bottom" />
                      {clinic.city}, {clinic.pincode}
                    </div>
                    <div className="text-xs text-gray-500 mb-1 truncate">{clinic.address}</div>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-1">
                      <span className="flex items-center gap-1"><Phone className="w-4 h-4" />{clinic.phone}</span>
                      <span className="flex items-center gap-1"><Mail className="w-4 h-4" />{clinic.email}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-1">
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{clinic.hours}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{clinic.workingDays.slice(0, 3).join(', ')}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center mb-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        clinic.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                        clinic.paymentStatus === 'No Dues' ? 'bg-blue-100 text-blue-800' :
                        clinic.paymentStatus === 'Pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {clinic.paymentStatus}
                      </span>
                      {clinic.dueAmount !== '₹0' && (
                        <span className="text-xs text-rose-600 font-medium">{clinic.dueAmount}</span>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 mt-2">
                      <button
                        onClick={() => handleApprove(clinic.id)}
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-medium transition-colors w-full"
                        aria-label={`Approve ${clinic.name}`}
                      >
                        <Check className="w-4 h-4" /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(clinic.id)}
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 text-xs font-medium transition-colors w-full"
                        aria-label={`Reject ${clinic.name}`}
                      >
                        <X className="w-4 h-4" /> Reject
                      </button>
                      <button
                        onClick={() => handleViewClinic(clinic)}
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-medium transition-colors w-full"
                        aria-label={`View details for ${clinic.name}`}
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 font-medium">No pending clinics found</p>
                  <p className="text-gray-400 text-xs">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto rounded-xl">
              <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Clinic Details</th>
                    <th className="px-2 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Location</th>
                    <th className="px-2 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Contact & Hours</th>
                    <th className="px-2 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Payment Status</th>
                    <th className="px-2 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {paginatedClinics.length > 0 ? (
                    paginatedClinics.map((clinic) => (
                      <tr key={clinic.id} className="hover:bg-blue-50/50 transition-colors">
                        {/* Clinic Details */}
                        <td className="px-2 sm:px-6 py-4 align-top min-w-[180px] max-w-xs">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 truncate text-sm sm:text-base">{clinic.name}</p>
                              <div className="flex items-center gap-1 sm:gap-2 mt-1 flex-wrap">
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
                                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                  Pending
                                </span>
                                {clinic.rating && (
                                  <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs text-gray-600">{clinic.rating}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        {/* Location */}
                        <td className="px-2 sm:px-6 py-4 align-top min-w-[120px] max-w-xs">
                          <div className="text-xs sm:text-sm">
                            <p className="font-medium text-gray-900">{clinic.city}</p>
                            <p className="text-gray-500 text-xs max-w-xs truncate">{clinic.address}</p>
                            <p className="text-gray-400 text-xs">{clinic.pincode}</p>
                          </div>
                        </td>
                        {/* Contact & Hours */}
                        <td className="px-2 sm:px-6 py-4 align-top min-w-[120px] max-w-xs">
                          <div className="text-xs sm:text-sm space-y-1">
                            <div className="flex items-center gap-1 text-gray-600">
                              <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>{clinic.phone}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>{clinic.hours}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>{clinic.workingDays.slice(0, 3).join(', ')}</span>
                            </div>
                          </div>
                        </td>
                        {/* Payment Status */}
                        <td className="px-2 sm:px-6 py-4 align-top min-w-[120px] max-w-xs">
                          <div className="space-y-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              clinic.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                              clinic.paymentStatus === 'No Dues' ? 'bg-blue-100 text-blue-800' :
                              clinic.paymentStatus === 'Pending' ? 'bg-amber-100 text-amber-800' :
                              'bg-rose-100 text-rose-800'
                            }`}>
                              {clinic.paymentStatus}
                            </span>
                            {clinic.dueAmount !== '₹0' && (
                              <p className="text-xs text-rose-600 font-medium">{clinic.dueAmount}</p>
                            )}
                          </div>
                        </td>
                        {/* Actions */}
                        <td className="px-2 sm:px-6 py-4 align-top min-w-[120px] max-w-xs">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-2">
                            <button
                              onClick={() => handleApprove(clinic.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-medium transition-colors w-full sm:w-auto justify-center"
                              aria-label={`Approve ${clinic.name}`}
                            >
                              <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(clinic.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 text-xs font-medium transition-colors w-full sm:w-auto justify-center"
                              aria-label={`Reject ${clinic.name}`}
                            >
                              <X className="w-3 h-3 sm:w-4 sm:h-4" />
                              Reject
                            </button>
                            <button
                              onClick={() => handleViewClinic(clinic)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-medium transition-colors w-full sm:w-auto justify-center"
                              aria-label={`View details for ${clinic.name}`}
                            >
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-12">
                        <div className="flex flex-col items-center gap-2">
                          <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                          <p className="text-gray-500 font-medium">No pending clinics found</p>
                          <p className="text-gray-400 text-xs sm:text-sm">Try adjusting your search criteria</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={filteredClinics.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>

      {/* View Modal */}
      {showViewModal && selectedClinic && (
        <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Clinic Details" size="lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Clinic Name</label>
                <p className="text-gray-900 font-semibold text-sm sm:text-base">{selectedClinic.name}</p>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Address</label>
                <p className="text-gray-900 text-xs sm:text-base">{selectedClinic.address}</p>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">City & Pincode</label>
                <p className="text-gray-900 text-xs sm:text-base">{selectedClinic.city}, {selectedClinic.pincode}</p>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Phone</label>
                <p className="text-gray-900 text-xs sm:text-base">{selectedClinic.phone}</p>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900 text-xs sm:text-base">{selectedClinic.email}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Operating Hours</label>
                <p className="text-gray-900 text-xs sm:text-base">{selectedClinic.hours}</p>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Working Days</label>
                <p className="text-gray-900 text-xs sm:text-base">{selectedClinic.workingDays.join(', ')}</p>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs sm:text-sm font-medium">
                  <Clock className="w-4 h-4" />
                  {selectedClinic.status}
                </span>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                  selectedClinic.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                  selectedClinic.paymentStatus === 'No Dues' ? 'bg-blue-100 text-blue-800' :
                  selectedClinic.paymentStatus === 'Pending' ? 'bg-amber-100 text-amber-800' :
                  'bg-rose-100 text-rose-800'
                }`}>
                  {selectedClinic.paymentStatus}
                </span>
                {selectedClinic.dueAmount !== '₹0' && (
                  <p className="text-rose-600 font-medium mt-1 text-xs sm:text-sm">Due: {selectedClinic.dueAmount}</p>
                )}
              </div>
              {selectedClinic.rating && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-900 text-xs sm:text-base">{selectedClinic.rating}</span>
                    </div>
                    {selectedClinic.totalPatients && (
                      <span className="text-gray-600 text-xs sm:text-base">({selectedClinic.totalPatients.toLocaleString()} patients)</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setShowViewModal(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-xs sm:text-sm"
              aria-label="Close details modal"
            >
              Close
            </button>
            <button
              onClick={() => {
                handleApprove(selectedClinic.id);
                setShowViewModal(false);
              }}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-2 text-xs sm:text-sm"
              aria-label="Approve clinic from modal"
            >
              <Check className="w-4 h-4" />
              Approve Clinic
            </button>
            <button 
              onClick={() => {
                handleReject(selectedClinic.id);
                setShowViewModal(false);
              }}
              className="px-4 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors flex items-center gap-2 text-xs sm:text-sm"
              aria-label="Reject clinic from modal"
            >
              <X className="w-4 h-4" />
              Reject
            </button>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedClinic && (
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Clinic" size="lg">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Clinic Name</label>
                <input
                  type="text"
                  defaultValue={selectedClinic.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-base"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  defaultValue={selectedClinic.city}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-base"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  defaultValue={selectedClinic.address}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-base"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="text"
                  defaultValue={selectedClinic.phone}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-base"
                />
        </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={selectedClinic.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-base"
                />
      </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Operating Hours</label>
                <input
                  type="text"
                  defaultValue={selectedClinic.hours}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-base"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Pincode</label>
                <input
                  type="text"
                  defaultValue={selectedClinic.pincode}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-base"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-xs sm:text-sm"
                aria-label="Cancel edit"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  showNotification('Clinic details updated successfully!', 'success');
                  setShowEditModal(false);
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2 text-xs sm:text-sm"
                aria-label="Save clinic changes"
              >
                <Edit2 className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default PendingClinics;