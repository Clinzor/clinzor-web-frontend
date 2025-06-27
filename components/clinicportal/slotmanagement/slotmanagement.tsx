import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Plus, Search, Filter, Edit, Trash2, Eye, Save, X, ChevronDown, CalendarDays, MapPin, Stethoscope, AlertCircle } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Slot type definition
interface Slot {
  uuid: string;
  clinic_service: string;
  start_time: string;
  end_time: string;
  created_by: string;
  max_bookings: number;
  available_slots: number;
  status: string;
  reason_for_rejection: string | null;
}

const SlotManagementSystem = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [filteredSlots, setFilteredSlots] = useState<Slot[]>([]);
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [showSingleForm, setShowSingleForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingSlot, setEditingSlot] = useState<Slot | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter states with advanced options
  const [filters, setFilters] = useState({
    fromDate: null as Date | null,
    toDate: null as Date | null,
    status: '',
    clinicService: '',
    timeRange: '',
    capacity: '',
    availability: ''
  });

  // Single slot form state
  const [singleForm, setSingleForm] = useState({
    clinic_service: '',
    start_time: null as Date | null,
    end_time: null as Date | null,
    max_bookings: 6
  });

  // Bulk creation form state
  const [bulkForm, setBulkForm] = useState({
    clinic_service: '',
    start_time: '',
    end_time: '',
    max_bookings: 6,
    slots_count: 1,
    interval_minutes: 60
  });

  // View modal state
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingSlot, setViewingSlot] = useState<Slot | null>(null);

  // Mock clinic services for dropdown
  const clinicServices = [
    { id: "159e3627-65eb-40b2-b535-37cbb6535ab8", name: "General Consultation" },
    { id: "259e3627-65eb-40b2-b535-37cbb6535ab9", name: "Cardiology" },
    { id: "359e3627-65eb-40b2-b535-37cbb6535ac0", name: "Dermatology" },
    { id: "459e3627-65eb-40b2-b535-37cbb6535ac1", name: "Pediatrics" }
  ];

  // Mock data initialization
  useEffect(() => {
    const mockSlots = [
      {
        uuid: "6562ab44-a657-4a30-a7ff-5583341b97ce",
        clinic_service: "159e3627-65eb-40b2-b535-37cbb6535ab8",
        start_time: "2025-06-27T09:00:00Z",
        end_time: "2025-06-27T09:30:00Z",
        created_by: "admin@gmail.com",
        max_bookings: 6,
        available_slots: 5,
        status: "APPROVED",
        reason_for_rejection: null
      },
      {
        uuid: "4cb6a934-e653-4c12-8734-ba099b73a2e3",
        clinic_service: "259e3627-65eb-40b2-b535-37cbb6535ab9",
        start_time: "2025-06-27T10:00:00Z",
        end_time: "2025-06-27T10:30:00Z",
        created_by: "admin@gmail.com",
        max_bookings: 4,
        available_slots: 4,
        status: "PENDING",
        reason_for_rejection: null
      },
      {
        uuid: "85b0bbb4-f963-43ad-a500-3ab30b4a563e",
        clinic_service: "359e3627-65eb-40b2-b535-37cbb6535ac0",
        start_time: "2025-06-27T14:00:00Z",
        end_time: "2025-06-27T14:30:00Z",
        created_by: "admin@gmail.com",
        max_bookings: 8,
        available_slots: 2,
        status: "REJECTED",
        reason_for_rejection: "Overlapping slots"
      },
      {
        uuid: "95b0bbb4-f963-43ad-a500-3ab30b4a563f",
        clinic_service: "459e3627-65eb-40b2-b535-37cbb6535ac1",
        start_time: "2025-06-28T11:00:00Z",
        end_time: "2025-06-28T11:30:00Z",
        created_by: "doctor@gmail.com",
        max_bookings: 6,
        available_slots: 6,
        status: "APPROVED",
        reason_for_rejection: null
      }
    ];
    setSlots(mockSlots);
    setFilteredSlots(mockSlots);
    setTotalPages(1);
  }, []);

  // Advanced filtering logic
  useEffect(() => {
    let filtered = slots;

    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter(slot => {
        const serviceName = getServiceName(slot.clinic_service);
        return serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               slot.created_by.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // Date range filters
    if (filters.fromDate) {
      filtered = filtered.filter(slot =>
        filters.fromDate && new Date(slot.start_time) >= filters.fromDate
      );
    }

    if (filters.toDate) {
      filtered = filtered.filter(slot =>
        filters.toDate && new Date(slot.start_time) <= filters.toDate
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(slot => slot.status === filters.status);
    }

    // Service filter
    if (filters.clinicService) {
      filtered = filtered.filter(slot => slot.clinic_service === filters.clinicService);
    }

    // Time range filter
    if (filters.timeRange) {
      filtered = filtered.filter(slot => {
        const hour = new Date(slot.start_time).getHours();
        switch (filters.timeRange) {
          case 'morning': return hour >= 6 && hour < 12;
          case 'afternoon': return hour >= 12 && hour < 17;
          case 'evening': return hour >= 17 && hour < 24;
          default: return true;
        }
      });
    }

    // Capacity filter
    if (filters.capacity) {
      filtered = filtered.filter(slot => {
        switch (filters.capacity) {
          case 'low': return slot.max_bookings <= 4;
          case 'medium': return slot.max_bookings > 4 && slot.max_bookings <= 8;
          case 'high': return slot.max_bookings > 8;
          default: return true;
        }
      });
    }

    // Availability filter
    if (filters.availability) {
      filtered = filtered.filter(slot => {
        const availabilityRatio = slot.available_slots / slot.max_bookings;
        switch (filters.availability) {
          case 'full': return availabilityRatio === 1;
          case 'available': return availabilityRatio > 0.5;
          case 'limited': return availabilityRatio > 0 && availabilityRatio <= 0.5;
          case 'booked': return availabilityRatio === 0;
          default: return true;
        }
      });
    }

    setFilteredSlots(filtered);
  }, [filters, slots, searchTerm]);

  const getServiceName = (serviceId: string) => {
    const service = clinicServices.find(s => s.id === serviceId);
    return service ? service.name : 'Unknown Service';
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      fromDate: null,
      toDate: null,
      status: '',
      clinicService: '',
      timeRange: '',
      capacity: '',
      availability: ''
    });
    setSearchTerm('');
  };

  const handleSingleFormChange = (key: string, value: any) => {
    setSingleForm(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const createSingleSlot = () => {
    const newSlot = {
      uuid: `single-${Date.now()}`,
      clinic_service: singleForm.clinic_service,
      start_time: singleForm.start_time?.toISOString() || '',
      end_time: singleForm.end_time?.toISOString() || '',
      created_by: "admin@gmail.com",
      max_bookings: singleForm.max_bookings,
      available_slots: singleForm.max_bookings,
      status: "APPROVED",
      reason_for_rejection: null
    };

    setSlots(prev => [...prev, newSlot]);
    setShowSingleForm(false);
    setSingleForm({
      clinic_service: '',
      start_time: null,
      end_time: null,
      max_bookings: 6
    });
  };

  const handleBulkFormChange = (key: string, value: any) => {
    setBulkForm(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const generateBulkSlots = () => {
    const newSlots: Slot[] = [];
    const startTime = new Date(bulkForm.start_time);
    const endTime = new Date(bulkForm.end_time);
    const duration = endTime.getTime() - startTime.getTime();
    
    for (let i = 0; i < bulkForm.slots_count; i++) {
      const slotStart = new Date(startTime.getTime() + (i * bulkForm.interval_minutes * 60000));
      const slotEnd = new Date(slotStart.getTime() + duration);
      
      newSlots.push({
        uuid: `bulk-${Date.now()}-${i}`,
        clinic_service: bulkForm.clinic_service,
        start_time: slotStart.toISOString(),
        end_time: slotEnd.toISOString(),
        created_by: "admin@gmail.com",
        max_bookings: bulkForm.max_bookings,
        available_slots: bulkForm.max_bookings,
        status: "APPROVED",
        reason_for_rejection: null
      });
    }

    setSlots(prev => [...prev, ...newSlots]);
    setShowBulkForm(false);
    setBulkForm({
      clinic_service: '',
      start_time: '',
      end_time: '',
      max_bookings: 6,
      slots_count: 1,
      interval_minutes: 60
    });
  };

  const handleEdit = (slot: Slot) => {
    setEditingSlot({ ...slot });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingSlot) return;
    setSlots(prev => prev.map(slot =>
      slot.uuid === editingSlot.uuid ? editingSlot : slot
    ));
    setShowEditModal(false);
    setEditingSlot(null);
  };

  const handleDelete = (uuid: string) => {
    if (window.confirm('Are you sure you want to delete this slot?')) {
      setSlots(prev => prev.filter(slot => slot.uuid !== uuid));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-50 text-green-700 border-green-200';
      case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'REJECTED': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getAvailabilityColor = (available: number, max: number) => {
    const ratio = available / max;
    if (ratio === 1) return 'text-green-600';
    if (ratio > 0.5) return 'text-blue-600';
    if (ratio > 0) return 'text-amber-600';
    return 'text-red-600';
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleView = (slot: Slot) => {
    setViewingSlot(slot);
    setShowViewModal(true);
  };

  const SLOTS_PER_PAGE = 5;

  // Pagination logic
  useEffect(() => {
    setCurrentPage(1); // Reset to first page on filter/search change
  }, [filteredSlots.length]);

  const paginatedSlots = filteredSlots.slice(
    (currentPage - 1) * SLOTS_PER_PAGE,
    currentPage * SLOTS_PER_PAGE
  );

  useEffect(() => {
    setTotalPages(Math.max(1, Math.ceil(filteredSlots.length / SLOTS_PER_PAGE)));
  }, [filteredSlots.length]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Slots</h1>
                <p className="text-xs sm:text-sm text-gray-500">Manage your appointment slots</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 mt-2 sm:mt-0">
              <button
                onClick={() => setShowSingleForm(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-xl font-medium transition-colors duration-200 flex items-center space-x-2 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4" />
                <span>New Slot</span>
              </button>
              <button
                onClick={() => setShowBulkForm(true)}
                className="bg-gray-900 hover:bg-gray-800 text-white px-3 sm:px-4 py-2 rounded-xl font-medium transition-colors duration-200 flex items-center space-x-2 text-sm sm:text-base"
              >
                <CalendarDays className="w-4 h-4" />
                <span>Bulk Create</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-6 py-4 sm:py-6">
        {/* Advanced Filtering Section */}
        <div className="bg-gradient-to-br from-white via-slate-50 to-slate-100 border border-slate-200 rounded-2xl shadow-lg p-3 sm:p-6 mb-6 sm:mb-8 relative overflow-visible">
          <div className="flex flex-col gap-3">
            {/* Main filter row */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
              {/* Search Bar */}
              <div className="flex flex-col justify-center h-full">
                <label htmlFor="slot-search" className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Search</label>
                <div className="relative flex items-center">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="slot-search"
                    type="text"
                    placeholder="Search slots..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-2 sm:py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-slate-700 placeholder-slate-400 text-sm sm:text-base shadow-sm h-12 sm:h-14"
                  />
                </div>
              </div>
              {/* Service Dropdown */}
              <div className="flex flex-col justify-center h-full">
                <label htmlFor="service-filter" className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Service</label>
                <select
                  id="service-filter"
                  value={filters.clinicService}
                  onChange={e => handleFilterChange('clinicService', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-sm shadow-sm h-12 sm:h-14"
                >
                  <option value="">All Services</option>
                  {clinicServices.map(service => (
                    <option key={service.id} value={service.id}>{service.name}</option>
                  ))}
                </select>
              </div>
              {/* Status Dropdown */}
              <div className="flex flex-col justify-center h-full">
                <label htmlFor="status-filter" className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Status</label>
                <select
                  id="status-filter"
                  value={filters.status}
                  onChange={e => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-sm shadow-sm h-12 sm:h-14"
                >
                  <option value="">All Status</option>
                  <option value="APPROVED">Approved</option>
                  <option value="PENDING">Pending</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
              {/* Time Range Dropdown */}
              <div className="flex flex-col justify-center h-full">
                <label htmlFor="time-range-filter" className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Time Range</label>
                <select
                  id="time-range-filter"
                  value={filters.timeRange}
                  onChange={e => handleFilterChange('timeRange', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-sm shadow-sm h-12 sm:h-14"
                >
                  <option value="">All Times</option>
                  <option value="morning">Morning (6 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                  <option value="evening">Evening (5 PM - 12 AM)</option>
                </select>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full flex items-center my-2">
              <div className="flex-1 border-t border-slate-200"></div>
              <span className="mx-2 text-xs text-slate-400">Advanced</span>
              <div className="flex-1 border-t border-slate-200"></div>
            </div>

            {/* Advanced filter row */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
              {/* From Date */}
              <div className="flex flex-col justify-center h-full">
                <label className="text-xs font-semibold text-slate-600 mb-1 ml-1" htmlFor="fromDatePicker">From</label>
                <DatePicker
                  id="fromDatePicker"
                  selected={filters.fromDate}
                  onChange={(date: Date | null) => handleFilterChange('fromDate', date)}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="From"
                  className="px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 w-full text-sm sm:text-base shadow-sm h-12 sm:h-14"
                  isClearable
                />
              </div>
              {/* To Date */}
              <div className="flex flex-col justify-center h-full">
                <label className="text-xs font-semibold text-slate-600 mb-1 ml-1" htmlFor="toDatePicker">To</label>
                <DatePicker
                  id="toDatePicker"
                  selected={filters.toDate}
                  onChange={(date: Date | null) => handleFilterChange('toDate', date)}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="To"
                  className="px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 w-full text-sm sm:text-base shadow-sm h-12 sm:h-14"
                  isClearable
                />
              </div>
              {/* Capacity Dropdown */}
              <div className="flex flex-col justify-center h-full">
                <label htmlFor="capacity-filter" className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Capacity</label>
                <select
                  id="capacity-filter"
                  value={filters.capacity}
                  onChange={e => handleFilterChange('capacity', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-sm shadow-sm h-12 sm:h-14"
                >
                  <option value="">All Capacities</option>
                  <option value="low">Low (≤4)</option>
                  <option value="medium">Medium (5-8)</option>
                  <option value="high">High (&gt;8)</option>
                </select>
              </div>
              {/* Availability Dropdown */}
              <div className="flex flex-col justify-center h-full">
                <label htmlFor="availability-filter" className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Availability</label>
                <select
                  id="availability-filter"
                  value={filters.availability}
                  onChange={e => handleFilterChange('availability', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-sm shadow-sm h-12 sm:h-14"
                >
                  <option value="">All</option>
                  <option value="full">Fully Available</option>
                  <option value="available">Available (&gt;50%)</option>
                  <option value="limited">Limited (≤50%)</option>
                  <option value="booked">Fully Booked</option>
                </select>
              </div>
            </div>

            {/* Reset and info row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 mt-3">
              <div className="flex-1 flex items-center sm:justify-start justify-center">
                <button
                  onClick={clearFilters}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-100 to-blue-300 text-blue-800 font-semibold border border-blue-300 hover:from-blue-200 hover:to-blue-400 transition-all duration-200 shadow-sm text-sm sm:text-base w-full sm:w-auto"
                >
                  Reset Filters
                </button>
              </div>
              <div className="flex-1 flex items-center sm:justify-end justify-center">
                <div className="text-xs sm:text-sm text-slate-600 mt-2 sm:mt-0 text-center sm:text-right w-full">
                  {filteredSlots.length} slots found{' '}
                  {(Object.values(filters).some(f => f) || searchTerm) && (
                    <span className="text-blue-600">(Filters applied)</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slots Grid */}
        <div className="grid gap-3 sm:gap-4">
          {paginatedSlots.map((slot) => (
            <div key={slot.uuid} className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 w-full">
                  {/* Date & Time */}
                  <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">{formatDate(slot.start_time)}</div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                      </div>
                    </div>
                  </div>
                  {/* Service */}
                  <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                      <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm sm:text-base">{getServiceName(slot.clinic_service)}</div>
                    </div>
                  </div>
                  {/* Capacity */}
                  <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                    </div>
                    <div>
                      <div className={`font-semibold ${getAvailabilityColor(slot.available_slots, slot.max_bookings)} text-sm sm:text-base`}>
                        {slot.available_slots}/{slot.max_bookings}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">Available</div>
                    </div>
                  </div>
                  {/* Status */}
                  <div>
                    <span className={`inline-flex px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${getStatusColor(slot.status)}`}>
                      {slot.status}
                    </span>
                    {slot.reason_for_rejection && (
                      <div className="flex items-center space-x-1 mt-1">
                        <AlertCircle className="w-3 h-3 text-red-500" />
                        <span className="text-xs text-red-600">{slot.reason_for_rejection}</span>
                      </div>
                    )}
                  </div>
                </div>
                {/* Actions */}
                <div className="flex items-center space-x-1 sm:space-x-2 mt-2 md:mt-0">
                  <button
                    onClick={() => handleEdit(slot)}
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-xl transition-colors duration-200"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(slot.uuid)}
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleView(slot)}
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-xl transition-colors duration-200"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredSlots.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 text-center">
              <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No slots found</h3>
              <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => setShowSingleForm(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-xl font-medium transition-colors duration-200 text-sm sm:text-base"
              >
                Create Your First Slot
              </button>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {filteredSlots.length > SLOTS_PER_PAGE && (
          <div className="flex justify-center items-center mt-4 gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium disabled:opacity-50 text-sm"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-2 rounded-lg border font-medium text-sm ${currentPage === idx + 1 ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300'}`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium disabled:opacity-50 text-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Single Slot Modal */}
      {showSingleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[95vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Create New Slot</h2>
                <button
                  onClick={() => setShowSingleForm(false)}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Service</label>
                <select
                  value={singleForm.clinic_service}
                  onChange={(e) => handleSingleFormChange('clinic_service', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a service</option>
                  {clinicServices.map(service => (
                    <option key={service.id} value={service.id}>{service.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                <div className="relative">
                  <div
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer z-10"
                    onClick={() => document.getElementById('singleStartTimePicker')?.focus()}
                  >
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                  <DatePicker
                    id="singleStartTimePicker"
                    selected={singleForm.start_time}
                    onChange={(date: Date | null) => handleSingleFormChange('start_time', date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="yyyy-MM-dd HH:mm"
                    placeholderText="Select start time"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    wrapperClassName="w-full"
                    isClearable
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                <div className="relative">
                  <div
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer z-10"
                    onClick={() => document.getElementById('singleEndTimePicker')?.focus()}
                  >
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                  <DatePicker
                    id="singleEndTimePicker"
                    selected={singleForm.end_time}
                    onChange={(date: Date | null) => handleSingleFormChange('end_time', date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="yyyy-MM-dd HH:mm"
                    placeholderText="Select end time"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    wrapperClassName="w-full"
                    isClearable
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Bookings</label>
                <input
                  type="number"
                  value={singleForm.max_bookings}
                  onChange={(e) => handleSingleFormChange('max_bookings', parseInt(e.target.value))}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex space-x-3">
              <button
                onClick={() => setShowSingleForm(false)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={createSingleSlot}
                disabled={!singleForm.clinic_service || !singleForm.start_time || !singleForm.end_time}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-3 rounded-xl font-medium transition-colors duration-200"
              >
                Create Slot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Creation Modal */}
      {showBulkForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[95vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Create Bulk Slots</h2>
                <button
                  onClick={() => setShowBulkForm(false)}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Service</label>
                <select
                  value={bulkForm.clinic_service}
                  onChange={(e) => handleBulkFormChange('clinic_service', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a service</option>
                  {clinicServices.map(service => (
                    <option key={service.id} value={service.id}>{service.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                <div className="relative">
                  <div
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer z-10"
                    onClick={() => document.getElementById('bulkStartTimePicker')?.focus()}
                  >
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                  <DatePicker
                    id="bulkStartTimePicker"
                    selected={bulkForm.start_time ? new Date(bulkForm.start_time) : null}
                    onChange={(date: Date | null) => handleBulkFormChange('start_time', date ? date.toISOString() : '')}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="yyyy-MM-dd HH:mm"
                    placeholderText="Select start time"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    wrapperClassName="w-full"
                    isClearable
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                <div className="relative">
                  <div
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer z-10"
                    onClick={() => document.getElementById('bulkEndTimePicker')?.focus()}
                  >
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                  <DatePicker
                    id="bulkEndTimePicker"
                    selected={bulkForm.end_time ? new Date(bulkForm.end_time) : null}
                    onChange={(date: Date | null) => handleBulkFormChange('end_time', date ? date.toISOString() : '')}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="yyyy-MM-dd HH:mm"
                    placeholderText="Select end time"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    wrapperClassName="w-full"
                    isClearable
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Bookings</label>
                <input
                  type="number"
                  value={bulkForm.max_bookings}
                  onChange={(e) => handleBulkFormChange('max_bookings', parseInt(e.target.value))}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slots Count</label>
                <input
                  type="number"
                  value={bulkForm.slots_count}
                  onChange={(e) => handleBulkFormChange('slots_count', parseInt(e.target.value))}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interval (minutes)</label>
                <input
                  type="number"
                  value={bulkForm.interval_minutes}
                  onChange={(e) => handleBulkFormChange('interval_minutes', parseInt(e.target.value))}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex space-x-3">
              <button
                onClick={() => setShowBulkForm(false)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={generateBulkSlots}
                disabled={!bulkForm.clinic_service || !bulkForm.start_time || !bulkForm.end_time}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-3 rounded-xl font-medium transition-colors duration-200"
              >
                Create Slots
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[95vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Edit Slot</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Service</label>
                <select
                  value={editingSlot.clinic_service}
                  onChange={(e) => setEditingSlot(prev => prev ? {
                    uuid: prev.uuid,
                    clinic_service: e.target.value,
                    start_time: prev.start_time,
                    end_time: prev.end_time,
                    created_by: prev.created_by,
                    max_bookings: prev.max_bookings,
                    available_slots: prev.available_slots,
                    status: prev.status,
                    reason_for_rejection: prev.reason_for_rejection
                  } : prev)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {clinicServices.map(service => (
                    <option key={service.id} value={service.id}>{service.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                <div className="relative">
                  <div
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer z-10"
                    onClick={() => document.getElementById('editStartTimePicker')?.focus()}
                  >
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                  <DatePicker
                    id="editStartTimePicker"
                    selected={editingSlot.start_time ? new Date(editingSlot.start_time) : null}
                    onChange={(date: Date | null) => setEditingSlot(prev => prev ? {
                      uuid: prev.uuid,
                      clinic_service: prev.clinic_service,
                      start_time: date?.toISOString() || '',
                      end_time: prev.end_time,
                      created_by: prev.created_by,
                      max_bookings: prev.max_bookings,
                      available_slots: prev.available_slots,
                      status: prev.status,
                      reason_for_rejection: prev.reason_for_rejection
                    } : prev)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="yyyy-MM-dd HH:mm"
                    placeholderText="Select start time"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    wrapperClassName="w-full"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                <div className="relative">
                  <div
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer z-10"
                    onClick={() => document.getElementById('editEndTimePicker')?.focus()}
                  >
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                  <DatePicker
                    id="editEndTimePicker"
                    selected={editingSlot.end_time ? new Date(editingSlot.end_time) : null}
                    onChange={(date: Date | null) => setEditingSlot(prev => prev ? {
                      uuid: prev.uuid,
                      clinic_service: prev.clinic_service,
                      start_time: prev.start_time,
                      end_time: date?.toISOString() || '',
                      created_by: prev.created_by,
                      max_bookings: prev.max_bookings,
                      available_slots: prev.available_slots,
                      status: prev.status,
                      reason_for_rejection: prev.reason_for_rejection
                    } : prev)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="yyyy-MM-dd HH:mm"
                    placeholderText="Select end time"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    wrapperClassName="w-full"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Bookings</label>
                <input
                  type="number"
                  value={editingSlot.max_bookings}
                  onChange={(e) => setEditingSlot(prev => prev ? {
                    uuid: prev.uuid,
                    clinic_service: prev.clinic_service,
                    start_time: prev.start_time,
                    end_time: prev.end_time,
                    created_by: prev.created_by,
                    max_bookings: parseInt(e.target.value),
                    available_slots: prev.available_slots,
                    status: prev.status,
                    reason_for_rejection: prev.reason_for_rejection
                  } : prev)}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Slots</label>
                <input
                  type="number"
                  value={editingSlot.available_slots}
                  onChange={(e) => setEditingSlot(prev => prev ? {
                    uuid: prev.uuid,
                    clinic_service: prev.clinic_service,
                    start_time: prev.start_time,
                    end_time: prev.end_time,
                    created_by: prev.created_by,
                    max_bookings: prev.max_bookings,
                    available_slots: parseInt(e.target.value),
                    status: prev.status,
                    reason_for_rejection: prev.reason_for_rejection
                  } : prev)}
                  min="0"
                  max={editingSlot.max_bookings}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={editingSlot.status}
                  onChange={(e) => setEditingSlot(prev => prev ? {
                    uuid: prev.uuid,
                    clinic_service: prev.clinic_service,
                    start_time: prev.start_time,
                    end_time: prev.end_time,
                    created_by: prev.created_by,
                    max_bookings: prev.max_bookings,
                    available_slots: prev.available_slots,
                    status: e.target.value,
                    reason_for_rejection: prev.reason_for_rejection
                  } : prev)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="APPROVED">Approved</option>
                  <option value="PENDING">Pending</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              {editingSlot.status === 'REJECTED' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Rejection</label>
                  <textarea
                    value={editingSlot.reason_for_rejection || ''}
                    onChange={(e) => setEditingSlot(prev => prev ? {
                      uuid: prev.uuid,
                      clinic_service: prev.clinic_service,
                      start_time: prev.start_time,
                      end_time: prev.end_time,
                      created_by: prev.created_by,
                      max_bookings: prev.max_bookings,
                      available_slots: prev.available_slots,
                      status: prev.status,
                      reason_for_rejection: e.target.value
                    } : prev)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Enter reason for rejection..."
                  />
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewingSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[95vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Slot Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div><span className="font-bold">Service:</span> {getServiceName(viewingSlot.clinic_service)}</div>
              <div><span className="font-bold">Start Time:</span> {formatDateTime(viewingSlot.start_time)}</div>
              <div><span className="font-bold">End Time:</span> {formatDateTime(viewingSlot.end_time)}</div>
              <div><span className="font-bold">Max Bookings:</span> {viewingSlot.max_bookings}</div>
              <div><span className="font-bold">Available Slots:</span> {viewingSlot.available_slots}</div>
              <div><span className="font-bold">Status:</span> {viewingSlot.status}</div>
              {viewingSlot.reason_for_rejection && (
                <div><span className="font-bold">Reason for Rejection:</span> {viewingSlot.reason_for_rejection}</div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex space-x-3">
              <button
                onClick={() => setShowViewModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotManagementSystem;