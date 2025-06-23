import React, { useState } from 'react';
import { Search, MapPin, Clock, Calendar, Phone, Mail, Filter, MoreHorizontal, Eye, Edit2, Trash2, Plus, Download, X, Check, AlertCircle, ExternalLink, Menu, ChevronDown } from 'lucide-react';

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
}

interface NewClinic {
  name: string;
  address: string;
  city: string;
  map_link: string;
  coordinates: string;
  opening_time: string;
  closing_time: string;
  days: string[];
}

interface Notification {
  message: string;
  type: 'success' | 'error';
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
    status: 'Approved',
    paymentStatus: 'No Dues',
    dueAmount: '₹0',
    hours: '10:00 AM - 5:00 PM',
    workingDays: ['Mon', 'Wed', 'Fri'],
    phone: '+91 98765 43210',
    email: 'contact@greaterkailash.com',
    isActive: false,
    mapLink: 'https://www.google.com/maps/place/Greater+Kailash+Hospital'
  },
  {
    id: 2,
    name: 'Getwell Medical Center',
    address: 'Post Office Rd, Dr. Ambedkar Nagar, Indore',
    city: 'Indore',
    pincode: '453331',
    status: 'Draft',
    paymentStatus: 'No Dues',
    dueAmount: '₹0',
    hours: '10:00 AM - 6:30 PM',
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Sun'],
    phone: '+91 98765 43211',
    email: 'contact@getwell.com',
    isActive: false
  },
  {
    id: 3,
    name: 'Sunshine Healthcare',
    address: 'MG Road, Vijay Nagar, Indore',
    city: 'Indore',
    pincode: '452010',
    status: 'Approved',
    paymentStatus: 'Paid',
    dueAmount: '₹0',
    hours: '9:00 AM - 8:00 PM',
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    phone: '+91 98765 43212',
    email: 'info@sunshine.com',
    isActive: true
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
    isActive: false
  }
];

const statusColors = {
  'Approved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Draft': 'bg-slate-50 text-slate-700 border-slate-200',
  'Pending': 'bg-amber-50 text-amber-700 border-amber-200',
  'Rejected': 'bg-rose-50 text-rose-700 border-rose-200'
};

const paymentStatusColors = {
  'Paid': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'No Dues': 'bg-blue-50 text-blue-700 border-blue-200',
  'Pending': 'bg-amber-50 text-amber-700 border-amber-200',
  'Overdue': 'bg-rose-50 text-rose-700 border-rose-200'
};

const Modal = ({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-2 sm:px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75 backdrop-blur-sm" onClick={onClose}></div>
        <div className={`inline-block w-full ${sizeClasses[size]} p-4 sm:p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl mx-2 sm:mx-4`}>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 truncate pr-4">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
              <X className="w-5 h-5" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

// Mobile Card Component for Clinic Display
const ClinicCard = ({ clinic, onView, onDelete, onApprove, onReject, onSelect, isSelected, onToggleActive }: {
  clinic: Clinic;
  onView: (clinic: Clinic) => void;
  onDelete: (clinic: Clinic) => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onSelect: (id: number) => void;
  isSelected: boolean;
  onToggleActive: (id: number, value: boolean) => void;
}) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-4 mb-4 hover:shadow-xl transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(clinic.id)}
            className="w-5 h-5 text-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 border-2 border-gray-300 flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-gray-900 truncate text-lg">{clinic.name}</h3>
            <p className="text-sm text-gray-600 truncate">{clinic.city}</p>
          </div>
        </div>
        <button
          onClick={() => setShowActions(!showActions)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
          aria-label="Show actions"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex gap-2 flex-wrap">
          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[clinic.status]}`}>
            {clinic.status}
          </span>
          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border ${paymentStatusColors[clinic.paymentStatus]}`}>
            {clinic.paymentStatus}
          </span>
        </div>
        
        <div className="text-sm text-gray-600 space-y-1">
          <p className="truncate"><MapPin className="w-4 h-4 inline mr-1" />{clinic.address}</p>
          <p><Clock className="w-4 h-4 inline mr-1" />{clinic.hours}</p>
          <p><Calendar className="w-4 h-4 inline mr-1" />{clinic.workingDays.join(', ')}</p>
        </div>

        {clinic.dueAmount !== '₹0' && (
          <div className="flex items-center gap-1 text-red-600 font-semibold text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Due: {clinic.dueAmount}</span>
          </div>
        )}
      </div>

      {showActions && (
        <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={() => onView(clinic)}
            className="flex items-center justify-center gap-1 p-2 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all"
            aria-label="View Clinic"
            title="View Clinic"
          >
            <Eye className="w-5 h-5" />
          </button>
          {clinic.status !== 'Approved' && clinic.status !== 'Rejected' && (
            <>
              <button
                onClick={() => onApprove(clinic.id)}
                className="flex items-center justify-center gap-1 p-2 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all"
                aria-label="Approve Clinic"
                title="Approve Clinic"
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                onClick={() => onReject(clinic.id)}
                className="flex items-center justify-center gap-1 p-2 rounded-full bg-rose-50 text-rose-700 hover:bg-rose-100 transition-all"
                aria-label="Reject Clinic"
                title="Reject Clinic"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          )}
          <button
            onClick={() => onDelete(clinic)}
            className="flex items-center justify-center gap-1 p-2 rounded-full bg-red-50 text-red-700 hover:bg-red-100 transition-all"
            aria-label="Delete Clinic"
            title="Delete Clinic"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          {clinic.mapLink && (
            <button
              onClick={() => window.open(clinic.mapLink, '_blank')}
              className="flex items-center justify-center gap-1 p-2 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100 transition-all"
              aria-label="View on Map"
              title="View on Map"
            >
              <ExternalLink className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => onToggleActive(clinic.id, !clinic.isActive)}
            className={`flex items-center justify-center gap-1 p-2 rounded-full ${clinic.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'} hover:bg-emerald-200 transition-all`}
            aria-label="Toggle Active"
            title={clinic.isActive ? 'Set Inactive' : 'Set Active'}
          >
            <Check className="w-5 h-5" />
            <span className="text-xs font-medium">{clinic.isActive ? 'Active' : 'Inactive'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default function AppleClinicTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedClinics, setSelectedClinics] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [clinics, setClinics] = useState<Clinic[]>(clinicData);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [newClinic, setNewClinic] = useState<NewClinic>({
    name: '',
    address: '',
    city: '',
    map_link: '',
    coordinates: '',
    opening_time: '',
    closing_time: '',
    days: []
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const clinicsPerPage = isMobile ? 10 : 5;
  
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredClinics = clinics.filter(clinic => {
    const matchesSearch = clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         clinic.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         clinic.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || 
                         clinic.status.toLowerCase() === selectedStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredClinics.length / clinicsPerPage);
  const paginatedClinics = filteredClinics.slice((currentPage - 1) * clinicsPerPage, currentPage * clinicsPerPage);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSelectClinic = (id: number) => {
    setSelectedClinics(prev => 
      prev.includes(id) 
        ? prev.filter(clinicId => clinicId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedClinics(
      selectedClinics.length === filteredClinics.length 
        ? [] 
        : filteredClinics.map(clinic => clinic.id)
    );
  };

  const handleAddClinic = () => {
    const clinic: Clinic = {
      id: Date.now(),
      name: newClinic.name,
      address: newClinic.address,
      city: newClinic.city,
      pincode: '',
      status: 'Draft' as const,
      paymentStatus: 'No Dues' as const,
      dueAmount: '₹0',
      hours: `${newClinic.opening_time} - ${newClinic.closing_time}`,
      workingDays: newClinic.days.map(day => day.charAt(0).toUpperCase() + day.slice(1, 3)),
      phone: '',
      email: '',
      isActive: false,
      mapLink: newClinic.map_link
    };
    setClinics(prev => [...prev, clinic]);
    setNewClinic({
      name: '',
      address: '',
      city: '',
      map_link: '',
      coordinates: '',
      opening_time: '',
      closing_time: '',
      days: []
    });
    setShowAddModal(false);
    showNotification('Clinic added successfully!');
  };

  const handleViewClinic = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    setShowViewModal(true);
  };

  const handleDeleteClinic = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setClinics(prev => prev.filter(c => c.id !== selectedClinic?.id));
    setShowDeleteModal(false);
    setSelectedClinic(null);
    showNotification('Clinic deleted successfully!', 'success');
  };

  const handleBulkDelete = () => {
    setClinics(prev => prev.filter(c => !selectedClinics.includes(c.id)));
    setSelectedClinics([]);
    showNotification(`${selectedClinics.length} clinics deleted successfully!`);
  };

  const handleExport = () => {
    const data = selectedClinics.length > 0 
      ? clinics.filter(c => selectedClinics.includes(c.id))
      : filteredClinics;
    
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,Address,City,Status,Payment Status,Phone,Email\n" +
      data.map(c => `${c.name},"${c.address}",${c.city},${c.status},${c.paymentStatus},${c.phone},${c.email}`).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "clinics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Data exported successfully!');
  };

  const handleAddClinicSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newClinic.name || !newClinic.address || !newClinic.city) {
      showNotification('Please fill all required fields', 'error');
      return;
    }
    handleAddClinic();
  };

  const approveOrRejectClinic = async (clinicId: number, status: 'APPROVED' | 'REJECTED') => {
    try {
      setClinics(prev => prev.map(c => c.id === clinicId ? { ...c, status: status === 'APPROVED' ? 'Approved' : 'Rejected' } : c));
      showNotification(`Clinic ${status === 'APPROVED' ? 'approved' : 'rejected'} successfully!`);
    } catch (err) {
      showNotification('Failed to update clinic status', 'error');
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // PATCH Clinic Active Toggle
  const handleToggleActive = (id: number, value: boolean) => {
    setClinics(prev => prev.map(c => c.id === id ? { ...c, isActive: value } : c));
    showNotification(`Clinic set to ${value ? 'Active' : 'Inactive'}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-3 sm:p-4 rounded-xl shadow-lg border transform transition-all duration-300 max-w-sm ${
          notification.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? <Check className="w-4 sm:w-5 h-4 sm:h-5" /> : <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5" />}
            <span className="font-medium text-sm sm:text-base">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent truncate">
                Clinic Management
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">{filteredClinics.length} clinics found</p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center gap-2 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Clinic</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-4 sm:p-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search clinics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur transition-all text-sm sm:text-base"
                />
              </div>

              <div className="flex gap-2 sm:gap-4">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="flex-1 sm:w-48 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur text-sm sm:text-base"
                >
                  <option value="all">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>

                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-white/80 transition-all backdrop-blur text-sm sm:text-base"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Selection Actions */}
        {selectedClinics.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-4 mt-4 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-sm font-semibold text-blue-900">
                {selectedClinics.length} clinic{selectedClinics.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                <button 
                  onClick={handleExport}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-white border border-blue-200 text-blue-700 rounded-lg text-sm hover:bg-blue-50 transition-all font-medium"
                >
                  Export Selected
                </button>
                <button 
                  onClick={handleBulkDelete}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm hover:from-red-600 hover:to-red-700 transition-all font-medium"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Clinic Display - Mobile Cards or Desktop Table */}
        {isMobile ? (
          <div className="mt-6 space-y-4">
            {paginatedClinics.length > 0 ? (
              paginatedClinics.map((clinic) => (
                <ClinicCard
                  key={clinic.id}
                  clinic={clinic}
                  onView={handleViewClinic}
                  onDelete={handleDeleteClinic}
                  onApprove={(id) => approveOrRejectClinic(id, 'APPROVED')}
                  onReject={(id) => approveOrRejectClinic(id, 'REJECTED')}
                  onSelect={handleSelectClinic}
                  isSelected={selectedClinics.includes(clinic.id)}
                  onToggleActive={handleToggleActive}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50">
                <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No clinics found</h3>
                <p className="text-gray-500 mb-6 px-4">Try adjusting your search or filters to find what you're looking for.</p>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 w-full max-w-xs mx-auto"
                >
                  Add Your First Clinic
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Desktop Table */
          <div className="mt-6 overflow-x-auto rounded-2xl shadow-lg border border-gray-200/50 bg-white/70 backdrop-blur-xl">
            <div className="min-w-[700px]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white/90">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                      <input
                        type="checkbox"
                        checked={selectedClinics.length === filteredClinics.length && filteredClinics.length > 0}
                        onChange={handleSelectAll}
                        className="w-5 h-5 text-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 border-2 border-gray-300"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Payment</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Address</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Hours</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Days</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Active</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedClinics.map((clinic) => (
                    <tr key={clinic.id} className="hover:bg-blue-50/40 transition-all">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedClinics.includes(clinic.id)}
                          onChange={() => handleSelectClinic(clinic.id)}
                          className="w-5 h-5 text-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 border-2 border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{clinic.name}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[clinic.status]}`}>{clinic.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${paymentStatusColors[clinic.paymentStatus]}`}>{clinic.paymentStatus}</span>
                        {clinic.dueAmount !== '₹0' && (
                          <span className="text-xs text-red-600 font-semibold">
                            (Due: {clinic.dueAmount})
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">{clinic.address}</td>
                      <td className="px-4 py-3">{clinic.hours}</td>
                      <td className="px-4 py-3">{clinic.workingDays.join(', ')}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleActive(clinic.id, !clinic.isActive)}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full border ${clinic.isActive ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'} hover:bg-emerald-200 transition-all`}
                          aria-label="Toggle Active"
                          title={clinic.isActive ? 'Set Inactive' : 'Set Active'}
                        >
                          <Check className="w-4 h-4" />
                          <span className="text-xs font-medium">{clinic.isActive ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleViewClinic(clinic)}
                            className="flex items-center justify-center p-2 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all min-w-[40px] min-h-[40px]"
                            aria-label="View Clinic"
                            title="View Clinic"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          {clinic.status !== 'Approved' && clinic.status !== 'Rejected' && (
                            <>
                              <button
                                onClick={() => approveOrRejectClinic(clinic.id, 'APPROVED')}
                                className="flex items-center justify-center p-2 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all min-w-[40px] min-h-[40px]"
                                aria-label="Approve Clinic"
                                title="Approve Clinic"
                              >
                                <Check className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => approveOrRejectClinic(clinic.id, 'REJECTED')}
                                className="flex items-center justify-center p-2 rounded-full bg-rose-50 text-rose-700 hover:bg-rose-100 transition-all min-w-[40px] min-h-[40px]"
                                aria-label="Reject Clinic"
                                title="Reject Clinic"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDeleteClinic(clinic)}
                            className="flex items-center justify-center p-2 rounded-full bg-red-50 text-red-700 hover:bg-red-100 transition-all min-w-[40px] min-h-[40px]"
                            aria-label="Delete Clinic"
                            title="Delete Clinic"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          {clinic.mapLink && (
                            <button
                              onClick={() => window.open(clinic.mapLink, '_blank')}
                              className="flex items-center justify-center p-2 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100 transition-all min-w-[40px] min-h-[40px]"
                              aria-label="View on Map"
                              title="View on Map"
                            >
                              <ExternalLink className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg border border-gray-200 bg-white text-gray-700 disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-lg border ${currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'} font-medium`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg border border-gray-200 bg-white text-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Add Clinic Modal */}
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Clinic" size="lg">
          <form className="space-y-6" onSubmit={handleAddClinicSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Clinic Name</label>
                <input
                  type="text"
                  value={newClinic.name}
                  onChange={(e) => setNewClinic({...newClinic, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter clinic name"
                  autoFocus={showAddModal}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={newClinic.city}
                  onChange={(e) => setNewClinic({...newClinic, city: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter city"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
              <textarea
                value={newClinic.address}
                onChange={(e) => setNewClinic({...newClinic, address: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Enter full address"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Map Link</label>
                <input
                  type="url"
                  value={newClinic.map_link}
                  onChange={(e) => setNewClinic({...newClinic, map_link: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://maps.google.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Coordinates</label>
                <input
                  type="text"
                  value={newClinic.coordinates}
                  onChange={(e) => setNewClinic({...newClinic, coordinates: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="POINT(longitude latitude)"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Opening Time</label>
                <input
                  type="time"
                  value={newClinic.opening_time}
                  onChange={(e) => setNewClinic({...newClinic, opening_time: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Closing Time</label>
                <input
                  type="time"
                  value={newClinic.closing_time}
                  onChange={(e) => setNewClinic({...newClinic, closing_time: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Working Days</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                  <label key={day} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newClinic.days.includes(day)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewClinic({...newClinic, days: [...newClinic.days, day]});
                        } else {
                          setNewClinic({...newClinic, days: newClinic.days.filter(d => d !== day)});
                        }
                      }}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">{day}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold"
              >
                Add Clinic
              </button>
            </div>
          </form>
        </Modal>
        {/* View Clinic Modal */}
        <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Clinic Details" size="lg">
          {selectedClinic && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedClinic.name}</h3>
                <div className="flex gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${statusColors[selectedClinic.status]}`}>{selectedClinic.status}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${paymentStatusColors[selectedClinic.paymentStatus]}`}>{selectedClinic.paymentStatus}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                    <p className="text-gray-600">{selectedClinic.address}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Working Hours</label>
                    <p className="text-gray-600">{selectedClinic.hours}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Working Days</label>
                    <p className="text-gray-600">{selectedClinic.workingDays.join(', ')}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                    <p className="text-gray-600">{selectedClinic.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    <p className="text-gray-600">{selectedClinic.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Due Amount</label>
                    <p className="text-gray-600 font-semibold">{selectedClinic.dueAmount}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
                >
                  Close
                </button>
                {selectedClinic.mapLink && (
                  <button
                    onClick={() => window.open(selectedClinic.mapLink, '_blank')}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all font-semibold flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on Map
                  </button>
                )}
              </div>
            </div>
          )}
        </Modal>
        {/* Delete Confirmation Modal */}
        <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Clinic" size="sm">
          {selectedClinic && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete {selectedClinic.name}?</h3>
                <p className="text-gray-500">This action cannot be undone. All data associated with this clinic will be permanently deleted.</p>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-semibold"
                >
                  Delete Clinic
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}