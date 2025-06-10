import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  PlusCircle, 
  X, 
  Save, 
  AlertTriangle,
  Info,
  ChevronLeft,
  ChevronRight,
  Check,
  Edit3,
  Trash2,
  Eye,
  Filter,
  Search,
  User,
  Mail,
  UserCheck,
  BookOpen,
  Copy,
  Settings,
  CalendarPlus,
  Layers,
  TrendingUp,
  Activity
} from 'lucide-react';

// Sample expert slots data based on your payload structure
const initialSlotsData: ExpertSlot[] = [
  {
    uuid: "3b125d50-309e-4870-a8fd-29c121ac1d43",
    expert: "7a6143b6-fca5-477f-82e0-ec11aa223b13",
    created_by: "expert2@gmail.com",
    start_time: "2025-05-24T21:00:00Z",
    end_time: "2025-05-24T21:15:00Z",
    status: "DRAFT" as const,
    is_booked: false,
    reason_for_rejection: null
  },
  {
    uuid: "fd941a07-a226-4f81-8d6b-169ac80168c0",
    expert: "7a6143b6-fca5-477f-82e0-ec11aa223b13",
    created_by: null,
    start_time: "2025-05-24T20:00:00Z",
    end_time: "2025-05-24T20:15:00Z",
    status: "DRAFT" as const,
    is_booked: false,
    reason_for_rejection: null
  },
  {
    uuid: "4680f6da-c2a5-469a-9874-4c670a579736",
    expert: "7a6143b6-fca5-477f-82e0-ec11aa223b13",
    created_by: "expert2@gmail.com",
    start_time: "2025-05-23T21:00:00Z",
    end_time: "2025-05-23T21:15:00Z",
    status: "ACTIVE" as const,
    is_booked: true,
    reason_for_rejection: null
  },
  {
    uuid: "d0e2696f-fc8e-47a3-8bf7-5648b2891c81",
    expert: "7a6143b6-fca5-477f-82e0-ec11aa223b13",
    created_by: "expert2@gmail.com",
    start_time: "2025-05-22T21:00:00Z",
    end_time: "2025-05-22T21:15:00Z",
    status: "ACTIVE" as const,
    is_booked: false,
    reason_for_rejection: null
  },
  {
    uuid: "adaacfc3-b28d-45df-b6a2-d44ddae798b2",
    expert: "7a6143b6-fca5-477f-82e0-ec11aa223b13",
    created_by: null,
    start_time: "2025-05-22T20:00:00Z",
    end_time: "2025-05-22T20:15:00Z",
    status: "CANCELLED" as const,
    is_booked: false,
    reason_for_rejection: "Expert unavailable"
  },
  {
    uuid: "edf30416-dcf0-4ded-971d-f489d8e929de",
    expert: "7a6143b6-fca5-477f-82e0-ec11aa223b13",
    created_by: null,
    start_time: "2025-05-21T20:00:00Z",
    end_time: "2025-05-21T20:15:00Z",
    status: "COMPLETED" as const,
    is_booked: true,
    reason_for_rejection: null
  },
  {
    uuid: "7a8b9c0d-1e2f-3g4h-5i6j-7k8l9m0n1o2p",
    expert: "7a6143b6-fca5-477f-82e0-ec11aa223b13",
    created_by: "expert2@gmail.com",
    start_time: "2025-05-25T10:00:00Z",
    end_time: "2025-05-25T10:15:00Z",
    status: "ACTIVE" as const,
    is_booked: true,
    reason_for_rejection: null
  },
  {
    uuid: "9o8i7u6y-5t4r-3e2w-1q2w-3e4r5t6y7u8i",
    expert: "7a6143b6-fca5-477f-82e0-ec11aa223b13",
    created_by: "expert2@gmail.com",
    start_time: "2025-05-25T11:00:00Z",
    end_time: "2025-05-25T11:15:00Z",
    status: "DRAFT" as const,
    is_booked: false,
    reason_for_rejection: null
  }
];

type ExpertSlot = {
  uuid: string;
  expert: string;
  created_by: string | null;
  start_time: string;
  end_time: string;
  status: 'DRAFT' | 'ACTIVE' | 'CANCELLED' | 'COMPLETED';
  is_booked: boolean;
  reason_for_rejection: string | null;
};

type Notification = {
  type: 'success' | 'error' | 'warning';
  message: string;
} | null;

type ModalType = 'add' | 'edit' | 'view' | 'delete' | 'bulk' | null;

type BulkSlotData = {
  expert: string;
  created_by: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  slot_duration: number;
  break_duration: number;
  days_of_week: string[];
  status: ExpertSlot['status'];
};

type ApiResponse = {
  status: number;
  message: string;
  data: {
    current_page: number;
    total_pages: number;
    total_items: number;
    next: string | null;
    previous: string | null;
    data: ExpertSlot[];
  };
};

type FormErrors = {
  expert?: string;
  created_by?: string;
  start_time?: string;
  end_time?: string;
  status?: string;
};

type BulkFormErrors = {
  expert?: string;
  created_by?: string;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  slot_duration?: string;
  break_duration?: string;
  days_of_week?: string;
};

export default function ExpertSlotManagement() {
  const [slots, setSlots] = useState<ExpertSlot[]>(initialSlotsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [bookedFilter, setBookedFilter] = useState('ALL');
  const [notification, setNotification] = useState<Notification>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(Math.ceil(initialSlotsData.length / 5));
  const [totalItems, setTotalItems] = useState(initialSlotsData.length);
  const [selectedSlot, setSelectedSlot] = useState<ExpertSlot | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [formData, setFormData] = useState<Partial<ExpertSlot>>({});
  const [bulkFormData, setBulkFormData] = useState<BulkSlotData>({
    expert: "7a6143b6-fca5-477f-82e0-ec11aa223b13",
    created_by: "expert2@gmail.com",
    start_date: "",
    end_date: "",
    start_time: "09:00",
    end_time: "17:00",
    slot_duration: 15,
    break_duration: 5,
    days_of_week: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    status: 'DRAFT'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [bulkFormErrors, setBulkFormErrors] = useState<BulkFormErrors>({});

  // Filter slots
  const filteredSlots = slots.filter(slot => {
    const matchesSearch = 
      slot.uuid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (slot.created_by?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      slot.expert.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || slot.status === statusFilter;
    const matchesBooked = bookedFilter === 'ALL' || 
      (bookedFilter === 'BOOKED' && slot.is_booked) ||
      (bookedFilter === 'AVAILABLE' && !slot.is_booked);
    
    return matchesSearch && matchesStatus && matchesBooked;
  });

  // Calculate statistics
  const stats = {
    total: slots.length,
    active: slots.filter(s => s.status === 'ACTIVE').length,
    booked: slots.filter(s => s.is_booked).length,
    available: slots.filter(s => s.status === 'ACTIVE' && !s.is_booked).length
  };

  // Pagination
  const paginatedSlots = filteredSlots.slice((currentPage - 1) * 5, currentPage * 5);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return {
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          icon: '●'
        };
      case 'DRAFT':
        return {
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
          icon: '○'
        };
      case 'CANCELLED':
        return {
          color: 'bg-red-50 text-red-700 border-red-200',
          dot: 'bg-red-500',
          icon: '✕'
        };
      case 'COMPLETED':
        return {
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-500',
          icon: '✓'
        };
      default:
        return {
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          dot: 'bg-gray-500',
          icon: '○'
        };
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const showNotification = (type: 'success' | 'error' | 'warning', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedSlot(null);
    setFormData({});
    setBulkFormData({
      expert: "7a6143b6-fca5-477f-82e0-ec11aa223b13",
      created_by: "expert2@gmail.com",
      start_date: "",
      end_date: "",
      start_time: "09:00",
      end_time: "17:00",
      slot_duration: 15,
      break_duration: 5,
      days_of_week: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      status: 'DRAFT'
    });
  };

  const handleAdd = () => {
    setFormData({
      expert: "7a6143b6-fca5-477f-82e0-ec11aa223b13",
      created_by: "expert2@gmail.com",
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      status: 'DRAFT',
      is_booked: false
    });
    setModalType('add');
  };

  const handleBulkAdd = () => {
    setModalType('bulk');
  };

  const handleEdit = (slot: ExpertSlot) => {
    setSelectedSlot(slot);
    setFormData({ ...slot });
    setModalType('edit');
  };

  const handleView = (slot: ExpertSlot) => {
    setSelectedSlot(slot);
    setModalType('view');
  };

  const handleDelete = (slot: ExpertSlot) => {
    setSelectedSlot(slot);
    setModalType('delete');
  };

  const generateBulkSlots = (bulkData: BulkSlotData): ExpertSlot[] => {
    const slots: ExpertSlot[] = [];
    const startDate = new Date(bulkData.start_date);
    const endDate = new Date(bulkData.end_date);
    
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayName = dayNames[d.getDay()];
      
      if (bulkData.days_of_week.includes(dayName)) {
        const [startHour, startMinute] = bulkData.start_time.split(':').map(Number);
        const [endHour, endMinute] = bulkData.end_time.split(':').map(Number);
        
        const dayStart = new Date(d);
        dayStart.setHours(startHour, startMinute, 0, 0);
        
        const dayEnd = new Date(d);
        dayEnd.setHours(endHour, endMinute, 0, 0);
        
        let currentTime = new Date(dayStart);
        
        while (currentTime < dayEnd) {
          const slotEnd = new Date(currentTime.getTime() + bulkData.slot_duration * 60000);
          
          if (slotEnd <= dayEnd) {
            slots.push({
              uuid: `slot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              expert: bulkData.expert,
              created_by: bulkData.created_by,
              start_time: currentTime.toISOString(),
              end_time: slotEnd.toISOString(),
              status: bulkData.status,
              is_booked: false,
              reason_for_rejection: null
            });
          }
          
          currentTime = new Date(slotEnd.getTime() + bulkData.break_duration * 60000);
        }
      }
    }
    
    return slots;
  };

  const validateSingleSlotForm = (): boolean => {
    const errors: FormErrors = {};
    const now = new Date();

    if (!formData.expert?.trim()) {
      errors.expert = 'Expert ID is required';
    }

    if (!formData.created_by?.trim()) {
      errors.created_by = 'Created by email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.created_by)) {
      errors.created_by = 'Please enter a valid email address';
    }

    if (!formData.start_time) {
      errors.start_time = 'Start time is required';
    } else {
      const startTime = new Date(formData.start_time);
      if (startTime < now) {
        errors.start_time = 'Start time cannot be in the past';
      }
    }

    if (!formData.end_time) {
      errors.end_time = 'End time is required';
    } else {
      const endTime = new Date(formData.end_time);
      const startTime = new Date(formData.start_time || '');
      
      if (endTime <= startTime) {
        errors.end_time = 'End time must be after start time';
      }
      
      const duration = endTime.getTime() - startTime.getTime();
      const minDuration = 15 * 60 * 1000; // 15 minutes in milliseconds
      const maxDuration = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
      
      if (duration < minDuration) {
        errors.end_time = 'Slot duration must be at least 15 minutes';
      } else if (duration > maxDuration) {
        errors.end_time = 'Slot duration cannot exceed 4 hours';
      }
    }

    if (!formData.status) {
      errors.status = 'Status is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateBulkSlotForm = (): boolean => {
    const errors: BulkFormErrors = {};
    const now = new Date();

    if (!bulkFormData.expert?.trim()) {
      errors.expert = 'Expert ID is required';
    }

    if (!bulkFormData.created_by?.trim()) {
      errors.created_by = 'Created by email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bulkFormData.created_by)) {
      errors.created_by = 'Please enter a valid email address';
    }

    if (!bulkFormData.start_date) {
      errors.start_date = 'Start date is required';
    } else {
      const startDate = new Date(bulkFormData.start_date);
      if (startDate < now) {
        errors.start_date = 'Start date cannot be in the past';
      }
    }

    if (!bulkFormData.end_date) {
      errors.end_date = 'End date is required';
    } else {
      const endDate = new Date(bulkFormData.end_date);
      const startDate = new Date(bulkFormData.start_date || '');
      
      if (endDate < startDate) {
        errors.end_date = 'End date must be after start date';
      }
      
      const maxDateRange = 30; // Maximum 30 days
      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff > maxDateRange) {
        errors.end_date = `Cannot create slots for more than ${maxDateRange} days`;
      }
    }

    if (!bulkFormData.start_time) {
      errors.start_time = 'Start time is required';
    }

    if (!bulkFormData.end_time) {
      errors.end_time = 'End time is required';
    } else {
      const [startHour, startMinute] = bulkFormData.start_time.split(':').map(Number);
      const [endHour, endMinute] = bulkFormData.end_time.split(':').map(Number);
      
      const startMinutes = startHour * 60 + startMinute;
      const endMinutes = endHour * 60 + endMinute;
      
      if (endMinutes <= startMinutes) {
        errors.end_time = 'End time must be after start time';
      }
      
      const duration = endMinutes - startMinutes;
      if (duration < 30) {
        errors.end_time = 'Time range must be at least 30 minutes';
      }
    }

    if (!bulkFormData.slot_duration) {
      errors.slot_duration = 'Slot duration is required';
    } else if (bulkFormData.slot_duration < 15 || bulkFormData.slot_duration > 120) {
      errors.slot_duration = 'Slot duration must be between 15 and 120 minutes';
    }

    if (bulkFormData.break_duration < 0 || bulkFormData.break_duration > 60) {
      errors.break_duration = 'Break duration must be between 0 and 60 minutes';
    }

    if (bulkFormData.days_of_week.length === 0) {
      errors.days_of_week = 'Please select at least one day of the week';
    }

    setBulkFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (modalType === 'add' || modalType === 'edit') {
      if (!validateSingleSlotForm()) {
        showNotification('error', 'Please fix the form errors before saving');
        return;
      }
    } else if (modalType === 'bulk') {
      if (!validateBulkSlotForm()) {
        showNotification('error', 'Please fix the form errors before creating slots');
        return;
      }
    }

    setIsLoading(true);
    
    try {
      if (modalType === 'add') {
        const newSlot: ExpertSlot = {
          ...formData as ExpertSlot,
          uuid: `slot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          reason_for_rejection: null
        };
        setSlots([...slots, newSlot]);
        showNotification('success', 'Slot created successfully');
      } else if (modalType === 'edit' && selectedSlot) {
        setSlots(slots.map(slot => 
          slot.uuid === selectedSlot.uuid ? { ...formData as ExpertSlot } : slot
        ));
        showNotification('success', 'Slot updated successfully');
      } else if (modalType === 'bulk') {
        const newSlots = generateBulkSlots(bulkFormData);
        setSlots([...slots, ...newSlots]);
        showNotification('success', `${newSlots.length} slots created successfully`);
      }
      
      closeModal();
    } catch (error) {
      showNotification('error', 'Operation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSlot) return;
    
    setIsLoading(true);
    
    try {
      // For demo purposes, we'll simulate the API call
      // In production, replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Remove the slot from the state
      setSlots(prevSlots => prevSlots.filter(slot => slot.uuid !== selectedSlot.uuid));
      
      // Show success notification with slot details
      const { date, time } = formatDateTime(selectedSlot.start_time);
      showNotification(
        'success',
        `Slot deleted successfully: ${date} at ${time}`
      );
      
      closeModal();
    } catch (error) {
      showNotification('error', 'Failed to delete slot. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedSlots.size === 0) return;
    
    setIsLoading(true);
    
    try {
      // For demo purposes, we'll simulate the API call
      // In production, replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Remove the selected slots from the state
      setSlots(prevSlots => prevSlots.filter(slot => !selectedSlots.has(slot.uuid)));
      
      // Show success notification with count
      showNotification(
        'success',
        `Successfully deleted ${selectedSlots.size} slot${selectedSlots.size > 1 ? 's' : ''}`
      );
      
      setSelectedSlots(new Set());
    } catch (error) {
      showNotification('error', 'Failed to delete slots. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSlotSelection = (slotUuid: string) => {
    const newSelection = new Set(selectedSlots);
    if (newSelection.has(slotUuid)) {
      newSelection.delete(slotUuid);
    } else {
      newSelection.add(slotUuid);
    }
    setSelectedSlots(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedSlots.size === paginatedSlots.length) {
      setSelectedSlots(new Set());
    } else {
      setSelectedSlots(new Set(paginatedSlots.map(slot => slot.uuid)));
    }
  };

  // Modal Components
  const Modal = ({ isOpen, onClose, title, children, size = 'md' }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
  }) => {
    if (!isOpen) return null;

    const sizeClasses = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl'
    };

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className={`bg-white rounded-xl shadow-2xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto`}>
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    );
  };

  const AddEditModal = () => (
    <Modal
      isOpen={modalType === 'add' || modalType === 'edit'}
      onClose={closeModal}
      title={modalType === 'add' ? 'Create New Slot' : 'Edit Slot'}
      size="lg"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Expert ID
            </label>
            <input
              type="text"
              value={formData.expert || ''}
              onChange={(e) => setFormData({ ...formData, expert: e.target.value })}
              className={`w-full px-4 py-3 border ${formErrors.expert ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              placeholder="Enter expert ID"
            />
            {formErrors.expert && (
              <p className="text-sm text-red-600">{formErrors.expert}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Created By
            </label>
            <input
              type="email"
              value={formData.created_by || ''}
              onChange={(e) => setFormData({ ...formData, created_by: e.target.value })}
              className={`w-full px-4 py-3 border ${formErrors.created_by ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              placeholder="Enter email"
            />
            {formErrors.created_by && (
              <p className="text-sm text-red-600">{formErrors.created_by}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Start Time
            </label>
            <input
              type="datetime-local"
              value={formData.start_time ? new Date(formData.start_time).toISOString().slice(0, 16) : ''}
              onChange={(e) => setFormData({ ...formData, start_time: new Date(e.target.value).toISOString() })}
              className={`w-full px-4 py-3 border ${formErrors.start_time ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
            />
            {formErrors.start_time && (
              <p className="text-sm text-red-600">{formErrors.start_time}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              End Time
            </label>
            <input
              type="datetime-local"
              value={formData.end_time ? new Date(formData.end_time).toISOString().slice(0, 16) : ''}
              onChange={(e) => setFormData({ ...formData, end_time: new Date(e.target.value).toISOString() })}
              className={`w-full px-4 py-3 border ${formErrors.end_time ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
            />
            {formErrors.end_time && (
              <p className="text-sm text-red-600">{formErrors.end_time}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={formData.status || 'DRAFT'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as ExpertSlot['status'] })}
              className={`w-full px-4 py-3 border ${formErrors.status ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
            >
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="COMPLETED">Completed</option>
            </select>
            {formErrors.status && (
              <p className="text-sm text-red-600">{formErrors.status}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Booking Status
            </label>
            <select
              value={formData.is_booked ? 'true' : 'false'}
              onChange={(e) => setFormData({ ...formData, is_booked: e.target.value === 'true' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="false">Available</option>
              <option value="true">Booked</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
          <button
            onClick={closeModal}
            className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 font-medium shadow-lg"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                {modalType === 'add' ? 'Create Slot' : 'Update Slot'}
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );

  const BulkCreateModal = () => (
    <Modal
      isOpen={modalType === 'bulk'}
      onClose={closeModal}
      title="Bulk Create Slots"
      size="xl"
    >
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <Info size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              Create multiple slots across selected date ranges and time periods
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Expert ID
            </label>
            <input
              type="text"
              value={bulkFormData.expert}
              onChange={(e) => setBulkFormData({ ...bulkFormData, expert: e.target.value })}
              className={`w-full px-4 py-3 border ${bulkFormErrors.expert ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              placeholder="Enter expert ID"
            />
            {bulkFormErrors.expert && (
              <p className="text-sm text-red-600">{bulkFormErrors.expert}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Created By
            </label>
            <input
              type="email"
              value={bulkFormData.created_by}
              onChange={(e) => setBulkFormData({ ...bulkFormData, created_by: e.target.value })}
              className={`w-full px-4 py-3 border ${bulkFormErrors.created_by ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              placeholder="Enter email"
            />
            {bulkFormErrors.created_by && (
              <p className="text-sm text-red-600">{bulkFormErrors.created_by}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              value={bulkFormData.start_date}
              onChange={(e) => setBulkFormData({ ...bulkFormData, start_date: e.target.value })}
              className={`w-full px-4 py-3 border ${bulkFormErrors.start_date ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
            />
            {bulkFormErrors.start_date && (
              <p className="text-sm text-red-600">{bulkFormErrors.start_date}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              value={bulkFormData.end_date}
              onChange={(e) => setBulkFormData({ ...bulkFormData, end_date: e.target.value })}
              className={`w-full px-4 py-3 border ${bulkFormErrors.end_date ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
            />
            {bulkFormErrors.end_date && (
              <p className="text-sm text-red-600">{bulkFormErrors.end_date}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Start Time
            </label>
            <input
              type="time"
              value={bulkFormData.start_time}
              onChange={(e) => setBulkFormData({ ...bulkFormData, start_time: e.target.value })}
              className={`w-full px-4 py-3 border ${bulkFormErrors.start_time ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
            />
            {bulkFormErrors.start_time && (
              <p className="text-sm text-red-600">{bulkFormErrors.start_time}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              End Time
            </label>
            <input
              type="time"
              value={bulkFormData.end_time}
              onChange={(e) => setBulkFormData({ ...bulkFormData, end_time: e.target.value })}
              className={`w-full px-4 py-3 border ${bulkFormErrors.end_time ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
            />
            {bulkFormErrors.end_time && (
              <p className="text-sm text-red-600">{bulkFormErrors.end_time}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Slot Duration (minutes)
            </label>
            <input
              type="number"
              min="15"
              max="120"
              value={bulkFormData.slot_duration}
              onChange={(e) => setBulkFormData({ ...bulkFormData, slot_duration: parseInt(e.target.value) })}
              className={`w-full px-4 py-3 border ${bulkFormErrors.slot_duration ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
            />
            {bulkFormErrors.slot_duration && (
              <p className="text-sm text-red-600">{bulkFormErrors.slot_duration}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Break Duration (minutes)
            </label>
            <input
              type="number"
              min="0"
              max="60"
              value={bulkFormData.break_duration}
              onChange={(e) => setBulkFormData({ ...bulkFormData, break_duration: parseInt(e.target.value) })}
              className={`w-full px-4 py-3 border ${bulkFormErrors.break_duration ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
            />
            {bulkFormErrors.break_duration && (
              <p className="text-sm text-red-600">{bulkFormErrors.break_duration}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={bulkFormData.status}
              onChange={(e) => setBulkFormData({ ...bulkFormData, status: e.target.value as ExpertSlot['status'] })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Days of Week
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
              <label key={day} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bulkFormData.days_of_week.includes(day)}
                  onChange={(e) => {
                    const newDays = e.target.checked
                      ? [...bulkFormData.days_of_week, day]
                      : bulkFormData.days_of_week.filter(d => d !== day);
                    setBulkFormData({ ...bulkFormData, days_of_week: newDays });
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">{day}</span>
              </label>
            ))}
          </div>
          {bulkFormErrors.days_of_week && (
            <p className="text-sm text-red-600">{bulkFormErrors.days_of_week}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
          <button
            onClick={closeModal}
            className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 font-medium shadow-lg"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Slots...
              </>
            ) : (
              <>
                <CalendarPlus size={16} />
                Create Slots
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );

  const ViewModal = () => (
    <Modal
      isOpen={modalType === 'view'}
      onClose={closeModal}
      title="View Slot Details"
      size="md"
    >
      {selectedSlot && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Slot ID</p>
              <p className="text-sm text-gray-900">{selectedSlot.uuid}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Expert ID</p>
              <p className="text-sm text-gray-900">{selectedSlot.expert}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Start Time</p>
              <p className="text-sm text-gray-900">
                {formatDateTime(selectedSlot.start_time).date}
              </p>
              <p className="text-sm text-gray-500">
                {formatDateTime(selectedSlot.start_time).time}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">End Time</p>
              <p className="text-sm text-gray-900">
                {formatDateTime(selectedSlot.end_time).date}
              </p>
              <p className="text-sm text-gray-500">
                {formatDateTime(selectedSlot.end_time).time}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusConfig(selectedSlot.status).color}`}>
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusConfig(selectedSlot.status).dot}`}></span>
                {selectedSlot.status}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Booking Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                selectedSlot.is_booked 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {selectedSlot.is_booked ? 'Booked' : 'Available'}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Created By</p>
            <p className="text-sm text-gray-900">{selectedSlot.created_by}</p>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            >
              Close
            </button>
            <button
              onClick={() => {
                closeModal();
                handleEdit(selectedSlot);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <Edit3 size={16} />
              Edit Slot
            </button>
          </div>
        </div>
      )}
    </Modal>
  );

  const DeleteModal = () => (
    <Modal
      isOpen={modalType === 'delete'}
      onClose={closeModal}
      title="Delete Slot"
      size="sm"
    >
      {selectedSlot && (
        <div className="space-y-6">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-600" />
              <span className="text-sm font-medium text-red-700">
                Are you sure you want to delete this slot?
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Slot ID</p>
              <p className="text-sm text-gray-900">{selectedSlot.uuid}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Date & Time</p>
              <p className="text-sm text-gray-900">
                {formatDateTime(selectedSlot.start_time).date}
              </p>
              <p className="text-sm text-gray-500">
                {formatDateTime(selectedSlot.start_time).time}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusConfig(selectedSlot.status).color}`}>
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusConfig(selectedSlot.status).dot}`}></span>
                {selectedSlot.status}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  Delete Slot
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Expert Slot Management</h1>
        <p className="text-gray-600">Manage and schedule expert consultation slots</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Slots</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 rounded-lg">
              <Activity className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Slots</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 rounded-lg">
              <UserCheck className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Booked Slots</p>
              <p className="text-2xl font-bold text-gray-900">{stats.booked}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Available Slots</p>
              <p className="text-2xl font-bold text-gray-900">{stats.available}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search slots..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">All Status</option>
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="COMPLETED">Completed</option>
              </select>
              <select
                value={bookedFilter}
                onChange={(e) => setBookedFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">All Booking Status</option>
                <option value="BOOKED">Booked</option>
                <option value="AVAILABLE">Available</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusCircle size={16} />
              Add Slot
            </button>
            <button
              onClick={handleBulkAdd}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Layers size={16} />
              Bulk Create
            </button>
            {selectedSlots.size > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 size={16} />
                Delete Selected
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedSlots.size === paginatedSlots.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedSlots.map((slot) => {
                const { date, time } = formatDateTime(slot.start_time);
                const statusConfig = getStatusConfig(slot.status);
                return (
                  <tr key={slot.uuid} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedSlots.has(slot.uuid)}
                        onChange={() => toggleSlotSelection(slot.uuid)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{slot.uuid}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{date}</div>
                      <div className="text-sm text-gray-500">{time}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusConfig.dot}`}></span>
                        {slot.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        slot.is_booked 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {slot.is_booked ? 'Booked' : 'Available'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{slot.created_by}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleView(slot)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(slot)}
                          className="p-1 text-blue-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(slot)}
                          className="p-1 text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Showing {slots.length} of {totalItems} entries</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <AddEditModal />
      <BulkCreateModal />
      <ViewModal />
      <DeleteModal />

      {notification && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
          notification.type === 'success' ? 'bg-emerald-50 text-emerald-700' :
          notification.type === 'error' ? 'bg-red-50 text-red-700' :
          'bg-amber-50 text-amber-700'
        }`}>
          {notification.type === 'success' ? <Check size={16} /> :
           notification.type === 'error' ? <AlertTriangle size={16} /> :
           <Info size={16} />}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}
    </div>
  );
}