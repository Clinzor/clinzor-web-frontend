import React, { useState, useRef } from 'react';
import { Clock, Users, Calendar, Check, X, Filter, Search, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, XCircle, Eye, EyeOff, Plus } from 'lucide-react';

// Slot type definition
interface Slot {
  id: string;
  clinic_service: string;
  start_time: string;
  end_time: string;
  created_by: string;
  max_bookings: number;
  available_slots: number;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  reason_for_rejection: string | null;
}

const PAGE_SIZE = 6;

const SlotManager = () => {
  // Sample data based on the provided JSON
  const [slots, setSlots] = useState<Slot[]>([
    {
      id: "8178e6bc-d723-4df8-bc49-f03e72a5dbf0",
      clinic_service: "159e3627-65eb-40b2-b535-37cbb6535ab8",
      start_time: "2025-06-22T17:25:00Z",
      end_time: "2025-06-22T18:21:00Z",
      created_by: "admin@gmail.com",
      max_bookings: 6,
      available_slots: 6,
      status: "APPROVED",
      reason_for_rejection: null
    },
    {
      id: "6562ab44-a657-4a30-a7ff-5583341b97ce",
      clinic_service: "159e3627-65eb-40b2-b535-37cbb6535ab8",
      start_time: "2025-06-21T19:01:00Z",
      end_time: "2025-06-21T19:21:00Z",
      created_by: "admin@gmail.com",
      max_bookings: 6,
      available_slots: 5,
      status: "APPROVED",
      reason_for_rejection: null
    },
    {
      id: "4cb6a934-e653-4c12-8734-ba099b73a2e3",
      clinic_service: "159e3627-65eb-40b2-b535-37cbb6535ab8",
      start_time: "2025-06-21T19:00:00Z",
      end_time: "2025-06-21T19:21:00Z",
      created_by: "admin@gmail.com",
      max_bookings: 6,
      available_slots: 7,
      status: "PENDING",
      reason_for_rejection: null
    },
    {
      id: "85b0bbb4-f963-43ad-a500-3ab30b4a563e",
      clinic_service: "159e3627-65eb-40b2-b535-37cbb6535ab8",
      start_time: "2025-06-21T18:59:00Z",
      end_time: "2025-06-21T19:21:00Z",
      created_by: "admin@gmail.com",
      max_bookings: 6,
      available_slots: 6,
      status: "PENDING",
      reason_for_rejection: null
    },
    {
      id: "c319afcc-4348-444b-a8e6-187164baa3e2",
      clinic_service: "159e3627-65eb-40b2-b535-37cbb6535ab8",
      start_time: "2025-06-21T18:58:00Z",
      end_time: "2025-06-21T19:21:00Z",
      created_by: "admin@gmail.com",
      max_bookings: 6,
      available_slots: 6,
      status: "REJECTED",
      reason_for_rejection: "Double booking conflict"
    }
  ]);

  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [actionFeedback, setActionFeedback] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [newSlot, setNewSlot] = useState({
    clinic_service: '',
    start_time: '',
    end_time: '',
    max_bookings: 6
  });
  const [viewSlot, setViewSlot] = useState<Slot | null>(null);
  const [showBulkCreateForm, setShowBulkCreateForm] = useState<boolean>(false);
  const [bulkClinicService, setBulkClinicService] = useState<string>("");
  const [bulkSlots, setBulkSlots] = useState([
    { start_time: "", end_time: "", max_bookings: 6 }
  ]);

  // For focusing date/datetime-local inputs
  const singleStartRef = useRef<HTMLInputElement>(null);
  const singleEndRef = useRef<HTMLInputElement>(null);

  // For bulk create, keep refs in an array
  const bulkStartRefs = useRef<(HTMLInputElement | null)[]>([]);
  const bulkEndRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Sample clinic services for the dropdown
  const clinicServices = [
    { id: '159e3627-65eb-40b2-b535-37cbb6535ab8', name: 'General Consultation' },
    { id: '259e3627-65eb-40b2-b535-37cbb6535ab9', name: 'Dental Checkup' },
    { id: '359e3627-65eb-40b2-b535-37cbb6535ac0', name: 'Eye Examination' },
    { id: '459e3627-65eb-40b2-b535-37cbb6535ac1', name: 'Physical Therapy' },
    { id: '559e3627-65eb-40b2-b535-37cbb6535ac2', name: 'Blood Test' }
  ];

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    };
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return {
          color: 'bg-green-100 text-green-700 border-green-200',
          icon: CheckCircle2,
          label: 'Approved'
        };
      case 'PENDING':
        return {
          color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
          icon: AlertCircle,
          label: 'Pending Review'
        };
      case 'REJECTED':
        return {
          color: 'bg-red-100 text-red-700 border-red-200',
          icon: XCircle,
          label: 'Rejected'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: AlertCircle,
          label: 'Unknown'
        };
    }
  };

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setActionFeedback({ type, message });
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleApprove = (slotId: string) => {
    setSlots(slots.map(slot =>
      slot.id === slotId
        ? { ...slot, status: 'APPROVED', reason_for_rejection: null }
        : slot
    ));
    showFeedback('success', 'Slot approved successfully!');
  };

  const handleReject = (slotId: string, reason?: string) => {
    const rejectionReason = reason || prompt('Please provide a reason for rejection:');
    if (rejectionReason) {
      setSlots(slots.map(slot =>
        slot.id === slotId
          ? { ...slot, status: 'REJECTED', reason_for_rejection: rejectionReason }
          : slot
      ));
      showFeedback('success', 'Slot rejected successfully!');
    }
  };

  const handleBulkApprove = () => {
    const count = selectedSlots.length;
    setSlots(slots.map(slot =>
      selectedSlots.includes(slot.id)
        ? { ...slot, status: 'APPROVED', reason_for_rejection: null }
        : slot
    ));
    setSelectedSlots([]);
    showFeedback('success', `${count} slot${count > 1 ? 's' : ''} approved successfully!`);
  };

  const handleBulkReject = () => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      const count = selectedSlots.length;
      setSlots(slots.map(slot =>
        selectedSlots.includes(slot.id)
          ? { ...slot, status: 'REJECTED', reason_for_rejection: reason }
          : slot
      ));
      setSelectedSlots([]);
      showFeedback('success', `${count} slot${count > 1 ? 's' : ''} rejected successfully!`);
    }
  };

  const handleCreateSlot = () => {
    // Validate form
    if (!newSlot.clinic_service || !newSlot.start_time || !newSlot.end_time) {
      showFeedback('error', 'Please fill in all required fields');
      return;
    }

    // Validate end time is after start time
    if (new Date(newSlot.end_time) <= new Date(newSlot.start_time)) {
      showFeedback('error', 'End time must be after start time');
      return;
    }

    // Create new slot
    const newSlotData: Slot = {
      id: `slot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      clinic_service: newSlot.clinic_service,
      start_time: new Date(newSlot.start_time).toISOString(),
      end_time: new Date(newSlot.end_time).toISOString(),
      created_by: "current_user@gmail.com", // This would come from auth context
      max_bookings: newSlot.max_bookings,
      available_slots: newSlot.max_bookings,
      status: 'PENDING',
      reason_for_rejection: null
    };

    setSlots([newSlotData, ...slots]);
    setShowCreateForm(false);
    setNewSlot({
      clinic_service: '',
      start_time: '',
      end_time: '',
      max_bookings: 6
    });
    showFeedback('success', 'New slot created successfully!');
  };

  const resetCreateForm = () => {
    setNewSlot({
      clinic_service: '',
      start_time: '',
      end_time: '',
      max_bookings: 6
    });
    setShowCreateForm(false);
  };

  const toggleSlotSelection = (slotId: string) => {
    setSelectedSlots(prev =>
      prev.includes(slotId)
        ? prev.filter(id => id !== slotId)
        : [...prev, slotId]
    );
  };

  const selectAllVisible = () => {
    const visibleIds = paginatedSlots.map(slot => slot.id);
    setSelectedSlots(prev => {
      const newSelected = [...prev];
      visibleIds.forEach(id => {
        if (!newSelected.includes(id)) {
          newSelected.push(id);
        }
      });
      return newSelected;
    });
  };

  const clearSelection = () => {
    setSelectedSlots([]);
  };

  const clearAllFilters = () => {
    setStatusFilter('ALL');
    setSearchTerm('');
    setFromDate('');
    setToDate('');
    setCurrentPage(1);
  };

  // Filtering logic
  const filteredSlots = slots.filter(slot => {
    const matchesStatus = statusFilter === 'ALL' || slot.status === statusFilter;
    const matchesSearch = slot.created_by.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesFromDate = true;
    let matchesToDate = true;
    if (fromDate) {
      matchesFromDate = new Date(slot.start_time) >= new Date(fromDate);
    }
    if (toDate) {
      const toDateObj = new Date(toDate);
      toDateObj.setDate(toDateObj.getDate() + 1);
      matchesToDate = new Date(slot.start_time) < toDateObj;
    }
    return matchesStatus && matchesSearch && matchesFromDate && matchesToDate;
  });

  // Pagination logic
  const totalItems = filteredSlots.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const paginatedSlots = filteredSlots.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Reset page if filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm, fromDate, toDate]);

  // Get counts for quick stats
  const statusCounts = slots.reduce((acc, slot) => {
    acc[slot.status] = (acc[slot.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Simulate fetching slot by UUID (in real app, replace with API call)
  const handleViewSlot = (uuid: string) => {
    const slot = slots.find((s) => s.id === uuid);
    if (slot) setViewSlot(slot);
  };
  const closeViewSlot = () => setViewSlot(null);

  // Bulk create logic
  const handleBulkSlotChange = (idx: number, field: string, value: string | number) => {
    setBulkSlots((prev) =>
      prev.map((slot, i) =>
        i === idx ? { ...slot, [field]: value } : slot
      )
    );
  };
  const addBulkSlotRow = () => setBulkSlots((prev) => [...prev, { start_time: "", end_time: "", max_bookings: 6 }]);
  const removeBulkSlotRow = (idx: number) => setBulkSlots((prev) => prev.filter((_, i) => i !== idx));
  const resetBulkCreateForm = () => {
    setBulkClinicService("");
    setBulkSlots([{ start_time: "", end_time: "", max_bookings: 6 }]);
    setShowBulkCreateForm(false);
  };
  const handleBulkCreateSlots = () => {
    if (!bulkClinicService) {
      showFeedback("error", "Please select a clinic service");
      return;
    }
    for (const slot of bulkSlots) {
      if (!slot.start_time || !slot.end_time) {
        showFeedback("error", "Please fill all slot fields");
        return;
      }
      if (new Date(slot.end_time) <= new Date(slot.start_time)) {
        showFeedback("error", "End time must be after start time");
        return;
      }
    }
    const newSlots: Slot[] = bulkSlots.map((slot) => ({
      id: `slot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      clinic_service: bulkClinicService,
      start_time: new Date(slot.start_time).toISOString(),
      end_time: new Date(slot.end_time).toISOString(),
      created_by: "current_user@gmail.com",
      max_bookings: slot.max_bookings,
      available_slots: slot.max_bookings,
      status: "PENDING",
      reason_for_rejection: null
    }));
    setSlots((prev) => [...newSlots, ...prev]);
    resetBulkCreateForm();
    showFeedback("success", `${newSlots.length} slots created successfully!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-1 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto w-full">
        {/* Action Feedback */}
        {actionFeedback && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border-l-4 ${
            actionFeedback.type === 'success' 
              ? 'bg-green-50 border-green-400 text-green-700' 
              : 'bg-red-50 border-red-400 text-red-700'
          } transition-all duration-300`}>
            <div className="flex items-center gap-2">
              {actionFeedback.type === 'success' ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              <span className="font-medium">{actionFeedback.message}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Clinic Slot Management
                </h1>
                <p className="text-gray-600">
                  Review and manage appointment slots efficiently
                </p>
              </div>
              {/* Create New Slot & Bulk Create Buttons */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium shadow-lg shadow-blue-500/25"
                >
                  <Plus className="h-5 w-5" />
                  Create New Slot
                </button>
                <button
                  onClick={() => setShowBulkCreateForm(true)}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 font-medium shadow-lg shadow-purple-500/25"
                >
                  <Plus className="h-5 w-5" />
                  Bulk Create
                </button>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap gap-3 mt-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
                <div className="text-yellow-700 font-semibold text-lg">{statusCounts.PENDING || 0}</div>
                <div className="text-yellow-600 text-sm">Pending Review</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                <div className="text-green-700 font-semibold text-lg">{statusCounts.APPROVED || 0}</div>
                <div className="text-green-600 text-sm">Approved</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                <div className="text-red-700 font-semibold text-lg">{statusCounts.REJECTED || 0}</div>
                <div className="text-red-600 text-sm">Rejected</div>
              </div>
            </div>
          </div>
        </div>

        {/* Create New Slot Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-full sm:max-w-md max-h-[95vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Create New Slot</h2>
                  <button
                    onClick={resetCreateForm}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form className="space-y-4">
                  {/* Clinic Service Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clinic Service *
                    </label>
                    <select
                      value={newSlot.clinic_service}
                      onChange={(e) => setNewSlot({...newSlot, clinic_service: e.target.value})}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                      required
                    >
                      <option value="">Select a clinic service</option>
                      {clinicServices.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Start Time */}
                  <div className="relative flex items-center gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Time *
                      </label>
                      <input
                        ref={singleStartRef}
                        type="datetime-local"
                        value={newSlot.start_time}
                        onChange={(e) => setNewSlot({...newSlot, start_time: e.target.value})}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      className="absolute right-3 top-8 text-gray-400 hover:text-blue-600"
                      tabIndex={-1}
                      onClick={() => {
                        if (singleStartRef.current) {
                          singleStartRef.current.focus();
                          singleStartRef.current.click();
                        }
                      }}
                    >
                      <Calendar className="h-5 w-5" />
                    </button>
                  </div>

                  {/* End Time */}
                  <div className="relative flex items-center gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Time *
                      </label>
                      <input
                        ref={singleEndRef}
                        type="datetime-local"
                        value={newSlot.end_time}
                        onChange={(e) => setNewSlot({...newSlot, end_time: e.target.value})}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      className="absolute right-3 top-8 text-gray-400 hover:text-blue-600"
                      tabIndex={-1}
                      onClick={() => {
                        if (singleEndRef.current) {
                          singleEndRef.current.focus();
                          singleEndRef.current.click();
                        }
                      }}
                    >
                      <Calendar className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Max Bookings */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Bookings
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newSlot.max_bookings}
                      onChange={(e) => setNewSlot({...newSlot, max_bookings: parseInt(e.target.value) || 1})}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCreateSlot}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Create Slot
                    </button>
                    <button
                      type="button"
                      onClick={resetCreateForm}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Create Modal */}
        {showBulkCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-full sm:max-w-2xl max-h-[95vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Bulk Create Slots</h2>
                  <button
                    onClick={resetBulkCreateForm}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <form className="space-y-4">
                  {/* Clinic Service Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clinic Service *
                    </label>
                    <select
                      value={bulkClinicService}
                      onChange={(e) => setBulkClinicService(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white"
                      required
                    >
                      <option value="">Select a clinic service</option>
                      {clinicServices.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Slot List */}
                  <div className="space-y-4">
                    {bulkSlots.map((slot, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row gap-2 items-end border-b pb-2 w-full">
                        <div className="relative flex-1 flex items-center gap-2">
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Start Time *</label>
                            <input
                              ref={el => (bulkStartRefs.current[idx] = el)}
                              type="datetime-local"
                              value={slot.start_time}
                              onChange={e => handleBulkSlotChange(idx, 'start_time', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white"
                              required
                            />
                          </div>
                          <button
                            type="button"
                            className="absolute right-3 top-7 text-gray-400 hover:text-purple-600"
                            tabIndex={-1}
                            onClick={() => {
                              if (bulkStartRefs.current[idx]) {
                                bulkStartRefs.current[idx]?.focus();
                                bulkStartRefs.current[idx]?.click();
                              }
                            }}
                          >
                            <Calendar className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="relative flex-1 flex items-center gap-2">
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-700 mb-1">End Time *</label>
                            <input
                              ref={el => (bulkEndRefs.current[idx] = el)}
                              type="datetime-local"
                              value={slot.end_time}
                              onChange={e => handleBulkSlotChange(idx, 'end_time', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white"
                              required
                            />
                          </div>
                          <button
                            type="button"
                            className="absolute right-3 top-7 text-gray-400 hover:text-purple-600"
                            tabIndex={-1}
                            onClick={() => {
                              if (bulkEndRefs.current[idx]) {
                                bulkEndRefs.current[idx]?.focus();
                                bulkEndRefs.current[idx]?.click();
                              }
                            }}
                          >
                            <Calendar className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="w-32">
                          <label className="block text-xs font-medium text-gray-700 mb-1">Max Bookings</label>
                          <input
                            type="number"
                            min="1"
                            value={slot.max_bookings}
                            onChange={e => handleBulkSlotChange(idx, 'max_bookings', parseInt(e.target.value) || 1)}
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeBulkSlotRow(idx)}
                          className="ml-2 text-red-500 hover:text-red-700"
                          disabled={bulkSlots.length === 1}
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addBulkSlotRow}
                      className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      + Add Slot
                    </button>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleBulkCreateSlots}
                      className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                      Create Slots
                    </button>
                    <button
                      type="button"
                      onClick={resetBulkCreateForm}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Filters Section */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-2 sm:p-4 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-4">
                  <h3 className="font-semibold text-gray-900">Filters & Search</h3>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    {showFilters ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="text-sm">{showFilters ? 'Hide' : 'Show'} Advanced</span>
                  </button>
                </div>
                {(statusFilter !== 'ALL' || searchTerm || fromDate || toDate) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-gray-500 hover:text-gray-700 text-sm underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
            
            <div className="p-2 sm:p-4">
              {/* Basic Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by creator email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                />
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 p-2 sm:p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                    >
                      <option value="ALL">All Status</option>
                      <option value="PENDING">Pending Review</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={e => setFromDate(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                    <input
                      type="date"
                      value={toDate}
                      onChange={e => setToDate(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedSlots.length > 0 && (
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-2 sm:p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <div className="text-blue-700 font-semibold">
                    {selectedSlots.length} slot{selectedSlots.length > 1 ? 's' : ''} selected
                  </div>
                  <button
                    onClick={clearSelection}
                    className="text-blue-600 hover:text-blue-700 text-sm underline"
                  >
                    Clear selection
                  </button>
                  <button
                    onClick={selectAllVisible}
                    className="text-blue-600 hover:text-blue-700 text-sm underline"
                  >
                    Select all visible
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <button
                    onClick={handleBulkApprove}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Approve Selected
                  </button>
                  <button
                    onClick={handleBulkReject}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Reject Selected
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="text-gray-600">
            Showing {paginatedSlots.length} of {totalItems} slots
            {totalItems !== slots.length && (
              <span className="text-gray-500"> (filtered from {slots.length} total)</span>
            )}
          </div>
        </div>

        {/* Slots Grid */}
        <div className="space-y-4 mb-8">
          {paginatedSlots.length === 0 && (
            <div className="bg-white rounded-xl p-6 sm:p-12 text-center shadow-sm border">
              <div className="text-gray-400 mb-2">
                <Calendar className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No slots found</h3>
              <p className="text-gray-500">Try adjusting your filters to see more results.</p>
            </div>
          )}
          
          {paginatedSlots.map((slot) => {
            const startDateTime = formatDateTime(slot.start_time);
            const endDateTime = formatDateTime(slot.end_time);
            const isSelected = selectedSlots.includes(slot.id);
            const statusConfig = getStatusConfig(slot.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={slot.id}
                className={`bg-white rounded-xl border shadow-sm transition-all duration-200 hover:shadow-md ${
                  isSelected ? 'border-blue-300 bg-blue-50/30' : 'border-gray-200'
                }`}
              >
                <div className="p-3 sm:p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 flex-1 w-full">
                      <div className="pt-1">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSlotSelection(slot.id)}
                          className="w-5 h-5 text-blue-600 bg-white border border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                      </div>
                      <div className="flex-1 space-y-2 sm:space-y-4">
                        {/* Main Info Row */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <div className="flex items-center gap-2 bg-gray-50 px-2 sm:px-3 py-2 rounded-lg">
                            <Calendar className="h-4 w-4 text-gray-600" />
                            <span className="font-medium text-gray-900">{startDateTime.date}</span>
                          </div>
                          <div className="flex items-center gap-2 bg-purple-50 px-2 sm:px-3 py-2 rounded-lg">
                            <Clock className="h-4 w-4 text-purple-600" />
                            <span className="font-medium text-purple-700">
                              {startDateTime.time} - {endDateTime.time}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 bg-blue-50 px-2 sm:px-3 py-2 rounded-lg">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-blue-700">
                              {slot.available_slots} of {slot.max_bookings} available
                            </span>
                          </div>
                          <div className={`flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg border ${statusConfig.color}`}>
                            <StatusIcon className="h-4 w-4" />
                            <span className="font-medium">{statusConfig.label}</span>
                          </div>
                        </div>
                        {/* Details Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
                          <span>
                            Created by: <span className="font-medium text-gray-900">{slot.created_by}</span>
                          </span>
                          {slot.reason_for_rejection && (
                            <span className="text-red-600 bg-red-50 px-2 py-1 rounded">
                              Reason: <span className="font-medium">{slot.reason_for_rejection}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex flex-row gap-2 mt-2 md:mt-0 w-full md:w-auto">
                      {slot.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleApprove(slot.id)}
                            className="flex-1 md:flex-none px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm font-medium"
                          >
                            <Check className="h-4 w-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(slot.id)}
                            className="flex-1 md:flex-none px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm font-medium"
                          >
                            <X className="h-4 w-4" />
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleViewSlot(slot.id)}
                        className="flex-1 md:flex-none px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2 text-sm font-medium"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center">
            <div className="bg-white rounded-xl p-2 sm:p-4 shadow-sm border">
              <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                <button
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === 1 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) =>
                    (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) ? (
                      <button
                        key={page}
                        className={`px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                          page === currentPage
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                        }`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ) : (
                      (page === currentPage - 2 || page === currentPage + 2) && totalPages > 5 ? (
                        <span key={page} className="px-2 text-gray-400">...</span>
                      ) : null
                    )
                  )}
                </div>
                
                <button
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === totalPages || totalPages === 0
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Slot Modal */}
        {viewSlot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-full sm:max-w-md max-h-[95vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Slot Details</h2>
                  <button
                    onClick={closeViewSlot}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="block text-sm text-gray-500">UUID</span>
                    <span className="font-mono text-gray-900 break-all">{viewSlot.id}</span>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500">Clinic Service</span>
                    <span className="font-medium text-gray-900">{clinicServices.find(s => s.id === viewSlot.clinic_service)?.name || viewSlot.clinic_service}</span>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500">Start Time</span>
                    <span className="font-medium text-gray-900">{formatDateTime(viewSlot.start_time).date} {formatDateTime(viewSlot.start_time).time}</span>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500">End Time</span>
                    <span className="font-medium text-gray-900">{formatDateTime(viewSlot.end_time).date} {formatDateTime(viewSlot.end_time).time}</span>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500">Max Bookings</span>
                    <span className="font-medium text-gray-900">{viewSlot.max_bookings}</span>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500">Available Slots</span>
                    <span className="font-medium text-gray-900">{viewSlot.available_slots}</span>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500">Status</span>
                    <span className="font-medium text-gray-900">{getStatusConfig(viewSlot.status).label}</span>
                  </div>
                  {viewSlot.reason_for_rejection && (
                    <div>
                      <span className="block text-sm text-gray-500">Reason for Rejection</span>
                      <span className="font-medium text-red-600">{viewSlot.reason_for_rejection}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlotManager;