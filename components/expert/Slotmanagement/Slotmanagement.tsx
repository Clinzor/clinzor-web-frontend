import React, { useState, useMemo, useCallback } from 'react';
import { 
  Calendar, 
  CalendarDays, 
  Clock, 
  Timer,
  Search, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Eye, 
  Save, 
  X, 
  Check, 
  AlertTriangle, 
  Info,
  ChevronLeft, 
  ChevronRight,
  Layers,
  Plus,
  RotateCcw,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

// Type definitions
interface ExpertSlot {
  uuid?: string;
  start_time: string;
  status?: string;
}

interface BulkSlotData {
  slot_list: { start_time: string }[];
}

interface Notification {
  type: 'success' | 'error' | 'warning';
  message: string;
}

type ModalType = 'add' | 'edit' | 'view' | 'delete' | 'bulk' | null;

export default function ExpertSlotManagement() {
  const [slots, setSlots] = useState<ExpertSlot[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [notification, setNotification] = useState<Notification | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<ExpertSlot | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [formData, setFormData] = useState<Partial<ExpertSlot>>({});
  const [bulkFormData, setBulkFormData] = useState<BulkSlotData>({
    slot_list: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [bulkTemplate, setBulkTemplate] = useState({
    startDate: '',
    endDate: '',
    timeSlots: [] as string[],
    weekdays: [1, 2, 3, 4, 5], // Mon-Fri
    interval: 'daily' as 'daily' | 'weekly'
  });

  // Add validation state
  const [validationErrors, setValidationErrors] = useState<{
    startDate?: string;
    endDate?: string;
    timeSlots?: string;
    weekdays?: string;
  }>({});

  const itemsPerPage = 10;

  // Combined DateTime Picker Component
  const CombinedDateTimePicker = ({ 
    value, 
    onChange, 
    label, 
    error,
    minDateTime,
    className = ""
  }: { 
    value: string;
    onChange: (value: string) => void;
    label: string;
    error?: string;
    minDateTime?: string;
    className?: string;
  }) => {
    const [dateValue, setDateValue] = useState(value ? value.split('T')[0] : '');
    const [timeValue, setTimeValue] = useState(value ? value.split('T')[1] || '09:00' : '09:00');
    
    const handleDateChange = (newDate: string) => {
      setDateValue(newDate);
      if (newDate && timeValue) {
        onChange(`${newDate}T${timeValue}`);
      }
    };

    const handleTimeChange = (newTime: string) => {
      setTimeValue(newTime);
      if (dateValue && newTime) {
        onChange(`${dateValue}T${newTime}`);
      }
    };

    return (
      <div className={`space-y-4 ${className}`}>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Calendar className="w-4 h-4" />
          {label}
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Date</label>
            <input
              type="date"
              value={dateValue}
              onChange={(e) => handleDateChange(e.target.value)}
              min={minDateTime ? minDateTime.split('T')[0] : new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Time</label>
            <input
              type="time"
              value={timeValue}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
            />
          </div>
        </div>

        {/* DateTime Preview */}
        {value && (
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Scheduled for:</p>
                <p className="text-lg font-bold text-blue-900 mt-1">
                  {new Date(value).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} at {new Date(value).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {error && <ErrorMessage message={error} />}
      </div>
    );
  };

  // Smart Date Picker Component
  const SmartDatePicker = ({ 
    value, 
    onChange, 
    label, 
    error,
    minDate,
    className = ""
  }: { 
    value: string;
    onChange: (value: string) => void;
    label: string;
    error?: string;
    minDate?: string;
    className?: string;
  }) => {
    return (
      <div className={`space-y-3 ${className}`}>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <CalendarDays className="w-4 h-4" />
          {label}
        </label>
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={minDate}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md ${
            error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
          }`}
        />
        {error && <ErrorMessage message={error} />}
      </div>
    );
  };

  // Smart Time Picker Component
  const SmartTimePicker = ({ 
    value, 
    onChange, 
    label,
    error,
    className = ""
  }: { 
    value: string;
    onChange: (value: string) => void;
    label: string;
    error?: string;
    className?: string;
  }) => {
    return (
      <div className={`space-y-3 ${className}`}>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Clock className="w-4 h-4" />
          {label}
        </label>
        <input
          type="time"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md ${
            error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
          }`}
        />
        {error && <ErrorMessage message={error} />}
      </div>
    );
  };

  // Memoized filtered slots for performance
  const filteredSlots = useMemo(() => {
    return slots.filter(slot => {
      const matchesSearch = slot.start_time.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || slot.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [slots, searchTerm, statusFilter]);

  // Memoized statistics
  const stats = useMemo(() => ({
    total: slots.length,
    active: slots.filter(s => s.status === 'ACTIVE').length,
    draft: slots.filter(s => s.status === 'DRAFT').length,
    cancelled: slots.filter(s => s.status === 'CANCELLED').length
  }), [slots]);

  // Memoized pagination
  const { paginatedSlots, totalPages } = useMemo(() => {
    const total = Math.ceil(filteredSlots.length / itemsPerPage);
    const paginated = filteredSlots.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    return { paginatedSlots: paginated, totalPages: total };
  }, [filteredSlots, currentPage, itemsPerPage]);

  const getStatusConfig = useCallback((status: string) => {
    switch (status) {
      case 'ACTIVE':
        return {
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500'
        };
      case 'DRAFT':
        return {
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500'
        };
      case 'CANCELLED':
        return {
          color: 'bg-red-50 text-red-700 border-red-200',
          dot: 'bg-red-500'
        };
      case 'COMPLETED':
        return {
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-500'
        };
      default:
        return {
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          dot: 'bg-gray-500'
        };
    }
  }, []);

  const formatDateTime = useCallback((dateTimeString: string) => {
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
  }, []);

  const showNotification = useCallback((type: 'success' | 'error' | 'warning', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  const closeModal = useCallback(() => {
    setModalType(null);
    setSelectedSlot(null);
    setFormData({});
    setBulkFormData({ slot_list: [] });
    setBulkTemplate({
      startDate: '',
      endDate: '',
      timeSlots: [],
      weekdays: [1, 2, 3, 4, 5],
      interval: 'daily'
    });
    setValidationErrors({});
  }, []);

  const handleAdd = useCallback(() => {
    const now = new Date();
    now.setMinutes(Math.ceil(now.getMinutes() / 15) * 15, 0, 0); // Round to next 15 minutes
    setFormData({
      start_time: now.toISOString().slice(0, 16),
      status: 'DRAFT'
    });
    setModalType('add');
  }, []);

  const handleBulkAdd = useCallback(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    setBulkTemplate({
      ...bulkTemplate,
      startDate: today.toISOString().slice(0, 10),
      endDate: tomorrow.toISOString().slice(0, 10)
    });
    setModalType('bulk');
  }, [bulkTemplate]);

  const handleEdit = useCallback((slot: ExpertSlot) => {
    setSelectedSlot(slot);
    setFormData({ ...slot });
    setModalType('edit');
  }, []);

  const handleView = useCallback((slot: ExpertSlot) => {
    setSelectedSlot(slot);
    setModalType('view');
  }, []);

  const handleDelete = useCallback((slot: ExpertSlot) => {
    setSelectedSlot(slot);
    setModalType('delete');
  }, []);

  // Enhanced validation function
  const validateBulkTemplate = useCallback(() => {
    const errors: typeof validationErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validate start date
    if (!bulkTemplate.startDate) {
      errors.startDate = 'Start date is required';
    } else {
      const startDate = new Date(bulkTemplate.startDate);
      startDate.setHours(0, 0, 0, 0);
      if (startDate < today) {
        errors.startDate = 'Start date cannot be in the past';
      }
    }

    // Validate end date
    if (!bulkTemplate.endDate) {
      errors.endDate = 'End date is required';
    } else {
      const endDate = new Date(bulkTemplate.endDate);
      endDate.setHours(0, 0, 0, 0);
      const startDate = new Date(bulkTemplate.startDate);
      startDate.setHours(0, 0, 0, 0);
      
      if (endDate < startDate) {
        errors.endDate = 'End date must be after start date';
      }
      
      // Limit to 30 days
      const maxDate = new Date(startDate);
      maxDate.setDate(maxDate.getDate() + 30);
      if (endDate > maxDate) {
        errors.endDate = 'Cannot create slots for more than 30 days';
      }
    }

    // Validate time slots
    if (bulkTemplate.timeSlots.length === 0) {
      errors.timeSlots = 'At least one time slot is required';
    }

    // Validate weekdays
    if (bulkTemplate.weekdays.length === 0) {
      errors.weekdays = 'At least one weekday must be selected';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [bulkTemplate]);

  // Update generateBulkSlots to match exact payload format
  const generateBulkSlots = useCallback(() => {
    if (!validateBulkTemplate()) {
      showNotification('error', 'Please fix the validation errors before generating slots');
      return;
    }

    const slots: { start_time: string }[] = [];
    const startDate = new Date(bulkTemplate.startDate);
    const endDate = new Date(bulkTemplate.endDate);
    
    // Sort time slots to ensure consistent order
    const sortedTimeSlots = [...bulkTemplate.timeSlots].sort();
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay();
      const adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek; // Convert Sunday from 0 to 7
      
      if (bulkTemplate.weekdays.includes(adjustedDay)) {
        sortedTimeSlots.forEach(timeSlot => {
          const [hours, minutes] = timeSlot.split(':').map(Number);
          const slotDate = new Date(date);
          slotDate.setHours(hours, minutes, 0, 0);
          
          // Format the date exactly as required: "YYYY-MM-DDTHH:mm"
          const formattedDate = slotDate.toISOString().slice(0, 16);
          slots.push({ start_time: formattedDate });
        });
      }
    }

    // Validate the generated slots
    if (slots.length === 0) {
      showNotification('error', 'No slots generated. Please check your date and time selections.');
      return;
    }

    // Check for slots in the past
    const now = new Date();
    const pastSlots = slots.filter(slot => new Date(slot.start_time) < now);
    if (pastSlots.length > 0) {
      showNotification('error', 'Cannot create slots in the past');
      return;
    }

    // Set the bulk form data with the generated slots
    setBulkFormData({ slot_list: slots });
    showNotification('success', `Generated ${slots.length} slots successfully`);
  }, [bulkTemplate, showNotification, validateBulkTemplate]);

  // Complete the handleSave function
  const handleSave = useCallback(async () => {
    if (modalType === 'add' || modalType === 'edit') {
      if (!formData.start_time) {
        showNotification('error', 'Start time is required');
        return;
      }

      // Check for duplicate slot
      if (modalType === 'add' && slots.some(slot => slot.start_time === formData.start_time)) {
        showNotification('error', 'A slot already exists at this time');
        return;
      }
    } else if (modalType === 'bulk') {
      if (bulkFormData.slot_list.length === 0) {
        showNotification('error', 'Please generate slots before saving');
        return;
      }
    }

    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (modalType === 'add' && formData.start_time) {
        const newSlot: ExpertSlot = {
          uuid: Date.now().toString(),
          start_time: formData.start_time,
          status: 'DRAFT'
        };
        setSlots(prev => [...prev, newSlot]);
        showNotification('success', 'Slot created successfully');
        closeModal();
      } else if (modalType === 'edit' && selectedSlot && formData.start_time) {
        const updatedSlot: ExpertSlot = {
          ...selectedSlot,
          start_time: formData.start_time,
          status: formData.status || 'DRAFT'
        };
        setSlots(prev => prev.map(slot => 
          slot.uuid === selectedSlot.uuid ? updatedSlot : slot
        ));
        showNotification('success', 'Slot updated successfully');
        closeModal();
      } else if (modalType === 'bulk') {
        const newSlots: ExpertSlot[] = bulkFormData.slot_list.map(slot => ({
          uuid: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          start_time: slot.start_time,
          status: 'DRAFT'
        }));
        setSlots(prev => [...prev, ...newSlots]);
        showNotification('success', `Created ${newSlots.length} slots successfully`);
        closeModal();
      }
    } catch (error) {
      showNotification('error', 'Failed to save slots. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [modalType, formData, selectedSlot, bulkFormData, slots, showNotification, closeModal]);

  // Toggle slot selection
  const toggleSlotSelection = (uuid: string) => {
    setSelectedSlots(prev => {
      const newSet = new Set(prev);
      if (newSet.has(uuid)) {
        newSet.delete(uuid);
      } else {
        newSet.add(uuid);
      }
      return newSet;
    });
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedSlots.size === paginatedSlots.length) {
      setSelectedSlots(new Set());
    } else {
      setSelectedSlots(new Set(paginatedSlots.map(slot => slot.uuid || '')));
    }
  };

  // Add ErrorMessage component
  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 shadow-sm">
      <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-red-700 font-medium">{message}</p>
    </div>
  );

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
        <div className={`bg-white rounded-2xl shadow-2xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto`}>
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-xl hover:bg-gray-100"
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
        <div className="grid grid-cols-1 gap-6">
          <CombinedDateTimePicker
            value={formData.start_time || ''}
            onChange={(value) => setFormData({ ...formData, start_time: value })}
            label="Date & Time"
            minDateTime={new Date().toISOString()}
            error={!formData.start_time ? 'Date and time are required' : undefined}
          />
        </div>

        {/* Date & Time Preview */}
        {formData.start_time && (
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-700">Scheduled for:</p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {formatDateTime(formData.start_time).date} at {formatDateTime(formData.start_time).time}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
          <button
            onClick={closeModal}
            className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || !formData.start_time}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 font-semibold shadow-lg hover:shadow-xl"
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
        {/* Template Generator */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-2xl border border-emerald-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-100 rounded-xl">
              <Layers className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-lg font-bold text-emerald-800">Bulk Slot Generator</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <SmartDatePicker
              value={bulkTemplate.startDate}
              onChange={(value) => {
                setBulkTemplate({ ...bulkTemplate, startDate: value });
                setValidationErrors(prev => ({ ...prev, startDate: undefined }));
              }}
              label="Start Date"
              minDate={new Date().toISOString().split('T')[0]}
              error={validationErrors.startDate}
            />
            <SmartDatePicker
              value={bulkTemplate.endDate}
              onChange={(value) => {
                setBulkTemplate({ ...bulkTemplate, endDate: value });
                setValidationErrors(prev => ({ ...prev, endDate: undefined }));
              }}
              label="End Date"
              minDate={bulkTemplate.startDate || new Date().toISOString().split('T')[0]}
              error={validationErrors.endDate}
            />
          </div>

          <div className="space-y-4 mb-6">
            <label className="text-sm font-semibold text-gray-700">Days of Week</label>
            <div className="flex flex-wrap gap-3">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                const dayNum = index + 1;
                const isSelected = bulkTemplate.weekdays.includes(dayNum);
                return (
                  <button
                    key={day}
                    onClick={() => {
                      const newWeekdays = isSelected 
                        ? bulkTemplate.weekdays.filter(d => d !== dayNum)
                        : [...bulkTemplate.weekdays, dayNum];
                      setBulkTemplate({ ...bulkTemplate, weekdays: newWeekdays });
                      setValidationErrors(prev => ({ ...prev, weekdays: undefined }));
                    }}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isSelected 
                        ? 'bg-emerald-500 text-white shadow-lg transform scale-105' 
                        : 'bg-white text-gray-600 border border-gray-300 hover:border-emerald-300 hover:shadow-md'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
            {validationErrors.weekdays && <ErrorMessage message={validationErrors.weekdays} />}
          </div>

          <div className="space-y-4">
            <label className="text-sm font-semibold text-gray-700">Time Slots</label>
            <div className="space-y-3">
              {bulkTemplate.timeSlots.map((time, index) => (
                <div key={index} className="flex items-center gap-3">
                  <SmartTimePicker
                    value={time}
                    onChange={(value) => {
                      const newTimeSlots = [...bulkTemplate.timeSlots];
                      newTimeSlots[index] = value;
                      setBulkTemplate({ ...bulkTemplate, timeSlots: newTimeSlots });
                      setValidationErrors(prev => ({ ...prev, timeSlots: undefined }));
                    }}
                    label={`Time Slot ${index + 1}`}
                  />
                  <button
                    onClick={() => {
                      const newTimeSlots = bulkTemplate.timeSlots.filter((_, i) => i !== index);
                      setBulkTemplate({ ...bulkTemplate, timeSlots: newTimeSlots });
                      setValidationErrors(prev => ({ ...prev, timeSlots: undefined }));
                    }}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  setBulkTemplate({ 
                    ...bulkTemplate, 
                    timeSlots: [...bulkTemplate.timeSlots, '09:00'] 
                  });
                  setValidationErrors(prev => ({ ...prev, timeSlots: undefined }));
                }}
                className="w-full px-4 py-3 border-2 border-dashed border-emerald-300 rounded-xl text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
              >
                <PlusCircle size={16} />
                Add Time Slot
              </button>
              {validationErrors.timeSlots && <ErrorMessage message={validationErrors.timeSlots} />}
            </div>
          </div>

          <button
            onClick={generateBulkSlots}
            className="w-full mt-6 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={16} />
            Generate Slots
          </button>
        </div>

        {/* Generated Slots Preview */}
        {bulkFormData.slot_list.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-gray-900">
                Generated Slots ({bulkFormData.slot_list.length})
              </h4>
              <button
                onClick={() => setBulkFormData({ slot_list: [] })}
                className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
              >
                <X size={14} />
                Clear All
              </button>
            </div>
            
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
                {bulkFormData.slot_list.slice(0, 20).map((slot, index) => {
                  const { date, time } = formatDateTime(slot.start_time);
                  return (
                    <div key={index} className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{date}</p>
                      <p className="text-sm text-gray-600">{time}</p>
                    </div>
                  );
                })}
              </div>
              {bulkFormData.slot_list.length > 20 && (
                <div className="p-3 bg-gray-100 text-center text-sm text-gray-600 border-t">
                  ... and {bulkFormData.slot_list.length - 20} more slots
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
          <button
            onClick={closeModal}
            className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || bulkFormData.slot_list.length === 0}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 font-semibold shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Slots...
              </>
            ) : (
              <>
                <Save size={16} />
                Create {bulkFormData.slot_list.length} Slots
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification?.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
          notification?.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
          'bg-amber-50 text-amber-800 border border-amber-200'
        }`}>
          <div className="flex items-center space-x-2">
            {notification?.type === 'success' ? <CheckCircle size={20} /> :
             notification?.type === 'error' ? <XCircle size={20} /> :
             <AlertCircle size={20} />}
            <span className="font-medium">{notification?.message}</span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Header Section */}
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Slot Management</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage and track all your availability slots</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleBulkAdd}
              className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Layers size={18} />
              <span className="text-sm sm:text-base">Bulk Create</span>
            </button>
            <button
              onClick={handleAdd}
              className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusCircle size={18} />
              <span className="text-sm sm:text-base">New Slot</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Slots</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Calendar className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg">
                <CheckCircle className="text-emerald-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Draft</p>
                <p className="text-2xl font-bold text-amber-600">{stats.draft}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <Edit3 className="text-amber-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <XCircle className="text-red-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-8">
          <div className="flex flex-col space-y-4">
            <div className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search slots..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm sm:text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="DRAFT">Draft</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Slots Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedSlots.size === paginatedSlots.length && paginatedSlots.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-500">Select</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <span className="text-sm font-medium text-gray-500">Date & Time</span>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <span className="text-sm font-medium text-gray-500">Status</span>
                  </th>
                  <th className="px-6 py-3 text-right">
                    <span className="text-sm font-medium text-gray-500">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedSlots.map((slot) => {
                  const { date, time } = formatDateTime(slot.start_time);
                  const statusConfig = getStatusConfig(slot.status || '');
                  return (
                    <tr key={slot.uuid} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedSlots.has(slot.uuid || '')}
                          onChange={() => toggleSlotSelection(slot.uuid || '')}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{date}</p>
                          <p className="text-sm text-gray-500">{time}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot} mr-1.5`}></span>
                          {slot.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleView(slot)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(slot)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(slot)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredSlots.length)} of {filteredSlots.length} slots
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddEditModal />
      <BulkCreateModal />
    </div>
  );
}