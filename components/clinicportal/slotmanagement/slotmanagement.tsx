"use client";
import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  PlusCircle, 
  X, 
  Video, 
  Home, 
  Building, 
  Save, 
  AlertTriangle,
  Info,
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2,
  Edit3,
  Trash2,
  Eye,
  Filter,
  Search,
  MoreHorizontal,
  Menu
} from 'lucide-react';
import ClinicSchedulerModal from './ClinicSchedulerModal';

// Sample slots data - in a real app, this would come from an API
const initialSlotsData = [
  {
    id: 'SLOT-1001',
    day: 'Monday',
    date: '2025-05-26',
    startTime: '09:00',
    endTime: '10:00',
    maxBookings: 5,
    currentBookings: 3,
    isVideoAvailable: true,
    isHomeServiceAvailable: false,
    isClinicVisitAvailable: true,
    status: 'Active',
    approved: true,
    createdAt: '2025-05-20',
    lastModified: '2025-05-22'
  },
  {
    id: 'SLOT-1002',
    day: 'Monday',
    date: '2025-05-26',
    startTime: '10:00',
    endTime: '11:00',
    maxBookings: 3,
    currentBookings: 2,
    isVideoAvailable: true,
    isHomeServiceAvailable: false,
    isClinicVisitAvailable: true,
    status: 'Active',
    approved: true,
    createdAt: '2025-05-20',
    lastModified: '2025-05-21'
  },
  {
    id: 'SLOT-1003',
    day: 'Monday',
    date: '2025-05-26',
    startTime: '14:00',
    endTime: '15:00',
    maxBookings: 4,
    currentBookings: 1,
    isVideoAvailable: true,
    isHomeServiceAvailable: true,
    isClinicVisitAvailable: true,
    status: 'Active',
    approved: true,
    createdAt: '2025-05-19',
    lastModified: '2025-05-22'
  },
  {
    id: 'SLOT-1004',
    day: 'Tuesday',
    date: '2025-05-27',
    startTime: '09:00',
    endTime: '10:00',
    maxBookings: 5,
    currentBookings: 0,
    isVideoAvailable: true,
    isHomeServiceAvailable: false,
    isClinicVisitAvailable: true,
    status: 'Active',
    approved: true,
    createdAt: '2025-05-20',
    lastModified: '2025-05-20'
  },
  {
    id: 'SLOT-1005',
    day: 'Tuesday',
    date: '2025-05-27',
    startTime: '10:00',
    endTime: '11:00',
    maxBookings: 3,
    currentBookings: 3,
    isVideoAvailable: true,
    isHomeServiceAvailable: false,
    isClinicVisitAvailable: true,
    status: 'Fully Booked',
    approved: true,
    createdAt: '2025-05-20',
    lastModified: '2025-05-22'
  },
  {
    id: 'SLOT-1006',
    day: 'Wednesday',
    date: '2025-05-28',
    startTime: '14:00',
    endTime: '15:00',
    maxBookings: 4,
    currentBookings: 0,
    isVideoAvailable: false,
    isHomeServiceAvailable: true,
    isClinicVisitAvailable: true,
    status: 'Active',
    approved: true,
    createdAt: '2025-05-21',
    lastModified: '2025-05-21'
  },
  {
    id: 'SLOT-1007',
    day: 'Wednesday',
    date: '2025-05-28',
    startTime: '15:00',
    endTime: '16:00',
    maxBookings: 4,
    currentBookings: 2,
    isVideoAvailable: true,
    isHomeServiceAvailable: false,
    isClinicVisitAvailable: true,
    status: 'Active',
    approved: true,
    createdAt: '2025-05-21',
    lastModified: '2025-05-22'
  },
  {
    id: 'SLOT-1008',
    day: 'Thursday',
    date: '2025-05-29',
    startTime: '09:00',
    endTime: '10:00',
    maxBookings: 3,
    currentBookings: 1,
    isVideoAvailable: true,
    isHomeServiceAvailable: false,
    isClinicVisitAvailable: true,
    status: 'Active',
    approved: true,
    createdAt: '2025-05-20',
    lastModified: '2025-05-22'
  },
  {
    id: 'SLOT-1009',
    day: 'Friday',
    date: '2025-05-30',
    startTime: '11:00',
    endTime: '12:00',
    maxBookings: 5,
    currentBookings: 0,
    isVideoAvailable: true,
    isHomeServiceAvailable: true,
    isClinicVisitAvailable: true,
    status: 'Active',
    approved: true,
    createdAt: '2025-05-19',
    lastModified: '2025-05-21'
  },
  {
    id: 'SLOT-1010',
    day: 'Friday',
    date: '2025-05-30',
    startTime: '16:00',
    endTime: '17:00',
    maxBookings: 3,
    currentBookings: 0,
    isVideoAvailable: true,
    isHomeServiceAvailable: false,
    isClinicVisitAvailable: true,
    status: 'Pending Approval',
    approved: false,
    createdAt: '2025-05-22',
    lastModified: '2025-05-22'
  },
  // Add more sample data for better pagination testing
  {
    id: 'SLOT-1011',
    day: 'Saturday',
    date: '2025-05-31',
    startTime: '10:00',
    endTime: '11:00',
    maxBookings: 4,
    currentBookings: 2,
    isVideoAvailable: true,
    isHomeServiceAvailable: true,
    isClinicVisitAvailable: true,
    status: 'Active',
    approved: true,
    createdAt: '2025-05-20',
    lastModified: '2025-05-22'
  },
  {
    id: 'SLOT-1012',
    day: 'Saturday',
    date: '2025-05-31',
    startTime: '14:00',
    endTime: '15:00',
    maxBookings: 3,
    currentBookings: 1,
    isVideoAvailable: false,
    isHomeServiceAvailable: true,
    isClinicVisitAvailable: true,
    status: 'Active',
    approved: true,
    createdAt: '2025-05-21',
    lastModified: '2025-05-23'
  }
];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

type Slot = {
  id: string;
  day: string;
  date: string;
  startTime: string;
  endTime: string;
  maxBookings: number;
  currentBookings: number;
  isVideoAvailable: boolean;
  isHomeServiceAvailable: boolean;
  isClinicVisitAvailable: boolean;
  status: string;
  approved: boolean;
  createdAt: string;
  lastModified: string;
};

type Notification = {
  type: 'success' | 'warning';
  message: string;
} | null;

export default function SlotManagementTable() {
  const [slots, setSlots] = useState<Slot[]>(initialSlotsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dayFilter, setDayFilter] = useState('All');
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [editingSlot, setEditingSlot] = useState<Slot | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState<Notification>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isClinicSchedulerOpen, setIsClinicSchedulerOpen] = useState(false);


  // Check if we're in mobile view
  React.useEffect(() => {
    const checkViewport = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Filter slots based on search and filters
  const filteredSlots = slots.filter(slot => {
    const matchesSearch = slot.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         slot.day.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         slot.startTime.includes(searchTerm) ||
                         slot.endTime.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'All' || slot.status === statusFilter;
    const matchesDay = dayFilter === 'All' || slot.day === dayFilter;
    
    return matchesSearch && matchesStatus && matchesDay;
  });

  // Pagination
  const totalPages = Math.ceil(filteredSlots.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSlots = filteredSlots.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dayFilter, itemsPerPage]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Pending Approval':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Fully Booked':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Inactive':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5 inline-block"></span>;
      case 'Pending Approval':
        return <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5 inline-block"></span>;
      case 'Fully Booked':
        return <span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5 inline-block"></span>;
      case 'Inactive':
        return <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5 inline-block"></span>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleViewDetails = (slot: Slot) => {
    setSelectedSlot(slot);
    setViewMode('detail');
  };

  const handleEditSlot = (slot: Slot) => {
    setIsEditing(true);
    setEditingSlot({ ...slot });
  };

  const handleDeleteSlot = (slotId: string) => {
    setSlots(slots.filter(slot => slot.id !== slotId));
    setNotification({
      type: 'success',
      message: 'Slot deleted successfully.'
    });
    
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleAddSlot = () => {
    const newSlot: Slot = {
      id: `SLOT-${Date.now()}`,
      day: 'Monday',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      maxBookings: 5,
      currentBookings: 0,
      isVideoAvailable: true,
      isHomeServiceAvailable: false,
      isClinicVisitAvailable: true,
      status: 'Pending Approval',
      approved: false,
      createdAt: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0]
    };
    
    setIsAddingSlot(true);
    setEditingSlot(newSlot);
  };

  const handleSaveSlot = () => {
    let newSlots;
    if (isEditing && editingSlot) {
      newSlots = slots.map(slot => 
        slot.id === editingSlot.id 
          ? { ...editingSlot, lastModified: new Date().toISOString().split('T')[0] }
          : slot
      );
    } else if (!isEditing && editingSlot) {
      newSlots = [...slots, editingSlot];
    } else {
      newSlots = [...slots];
    }
    
    setSlots(newSlots);
    setNotification({
      type: 'success',
      message: isEditing 
        ? 'Slot updated successfully. Pending admin approval.' 
        : 'New slot added successfully. Pending admin approval.'
    });
    
    setIsAddingSlot(false);
    setIsEditing(false);
    setEditingSlot(null);

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleCancelEdit = () => {
    setIsAddingSlot(false);
    setIsEditing(false);
    setEditingSlot(null);
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = isMobileView ? 3 : 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(1, currentPage - halfVisible);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  // Mobile Card Component
  const MobileSlotCard = ({ slot }: { slot: Slot }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-gray-900 text-sm">{slot.id}</h3>
          <p className="text-xs text-gray-500">{slot.day}</p>
        </div>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(slot.status)}`}>
          {getStatusIcon(slot.status)}
          {slot.status}
        </span>
      </div>
      
      <div className="space-y-2 mb-3">
        <div className="flex items-center text-xs text-gray-600">
          <Calendar size={12} className="mr-1" />
          {formatDate(slot.date)}
        </div>
        <div className="flex items-center text-xs text-gray-600">
          <Clock size={12} className="mr-1" />
          {slot.startTime} - {slot.endTime}
        </div>
        <div className="text-xs text-gray-600">
          Bookings: {slot.currentBookings}/{slot.maxBookings}
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div 
              className={`h-1.5 rounded-full ${
                slot.currentBookings === slot.maxBookings 
                  ? 'bg-red-500' 
                  : slot.currentBookings > slot.maxBookings * 0.7 
                    ? 'bg-amber-500' 
                    : 'bg-green-500'
              }`}
              style={{ width: `${(slot.currentBookings / slot.maxBookings) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1 mb-3">
        {slot.isVideoAvailable && (
          <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-xs text-blue-700">
            <Video size={10} className="mr-1" />
            Video
          </span>
        )}
        {slot.isHomeServiceAvailable && (
          <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-100 text-xs text-green-700">
            <Home size={10} className="mr-1" />
            Home
          </span>
        )}
        {slot.isClinicVisitAvailable && (
          <span className="inline-flex items-center px-2 py-1 rounded-md bg-purple-100 text-xs text-purple-700">
            <Building size={10} className="mr-1" />
            Clinic
          </span>
        )}
      </div>
      
      <div className="flex justify-end gap-2">
        <button
          onClick={() => handleViewDetails(slot)}
          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="View Details"
        >
          <Eye size={14} />
        </button>
        <button
          onClick={() => handleEditSlot(slot)}
          className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          title="Edit Slot"
        >
          <Edit3 size={14} />
        </button>
        <button
          onClick={() => handleDeleteSlot(slot.id)}
          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete Slot"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Slot Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your clinic's availability slots and service options
            </p>
          </div>
          <button
            onClick={() => setIsClinicSchedulerOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <PlusCircle size={16} />
            <span>Add New Slot</span>
          </button>
                  </div>
                </div>
                <ClinicSchedulerModal
            isOpen={isClinicSchedulerOpen}
            onClose={() => setIsClinicSchedulerOpen(false)}
          />

      {/* Notification */}
      {notification && (
        <div className={`mx-4 sm:mx-6 mt-4 p-3 rounded-lg flex justify-between items-center ${
          notification.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
        }`}>
          <div className="flex items-center text-sm font-medium">
            {notification.type === 'success' ? (
              <Check size={16} className="text-green-500 mr-2" />
            ) : (
              <AlertTriangle size={16} className="text-amber-500 mr-2" />
            )}
            <span className={notification.type === 'success' ? 'text-green-700' : 'text-amber-700'}>
              {notification.message}
            </span>
          </div>
          <button 
            onClick={() => setNotification(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Admin Approval Info */}
      <div className="mx-4 sm:mx-6 mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start">
        <Info size={18} className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-700">
          <p className="font-medium">Important Notice</p>
          <p>All updates to slots will only reflect after Admin approval. New slots will be marked as "Pending Approval" until reviewed.</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white mx-4 sm:mx-6 mt-4 p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search slots by ID, day, or time..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Fully Booked">Fully Booked</option>
              <option value="Inactive">Inactive</option>
            </select>
            
            <select
              value={dayFilter}
              onChange={(e) => setDayFilter(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Days</option>
              {daysOfWeek.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>

            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="flex-1 sm:flex-none sm:w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mx-4 sm:mx-6 mt-4 px-4 py-3 bg-white rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredSlots.length)} of {filteredSlots.length} slots
          </p>
          <p className="text-xs text-gray-500">
            Page {currentPage} of {totalPages}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow mx-4 sm:mx-6 mt-4 mb-4">
        {isMobileView ? (
          /* Mobile Card View */
          <div className="space-y-3">
            {paginatedSlots.map((slot) => (
              <MobileSlotCard key={slot.id} slot={slot} />
            ))}
          </div>
        ) : (
          /* Desktop Table View */
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slot Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bookings
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Services
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Modified
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedSlots.map((slot) => (
                    <tr key={slot.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{slot.id}</div>
                          <div className="text-sm text-gray-500">{slot.day}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">{formatDate(slot.date)}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Clock size={14} className="mr-1" />
                            {slot.startTime} - {slot.endTime}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {slot.currentBookings}/{slot.maxBookings}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className={`h-2 rounded-full ${
                              slot.currentBookings === slot.maxBookings 
                                ? 'bg-red-500' 
                                : slot.currentBookings > slot.maxBookings * 0.7 
                                  ? 'bg-amber-500' 
                                  : 'bg-green-500'
                            }`}
                            style={{ width: `${(slot.currentBookings / slot.maxBookings) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {slot.isVideoAvailable && (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-xs text-blue-700">
                              <Video size={10} className="mr-1" />
                              Video
                            </span>
                          )}
                          {slot.isHomeServiceAvailable && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-100 text-xs text-green-700">
                              <Home size={10} className="mr-1" />
                              Home
                            </span>
                          )}
                          {slot.isClinicVisitAvailable && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-purple-100 text-xs text-purple-700">
                              <Building size={10} className="mr-1" />
                              Clinic
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(slot.status)}`}>
                          {getStatusIcon(slot.status)}
                          {slot.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(slot.lastModified)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleViewDetails(slot)}
                          className="text-gray-500 hover:text-blue-600 transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditSlot(slot)}
                          className="text-gray-500 hover:text-green-600 transition-colors"
                          title="Edit Slot"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteSlot(slot.id)}
                          className="text-gray-500 hover:text-red-600 transition-colors"
                          title="Delete Slot"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 mb-6 space-x-1">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-2 py-1 rounded-md text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
        >
          <ChevronLeft size={16} />
        </button>
        {generatePageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              page === currentPage
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-2 py-1 rounded-md text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}