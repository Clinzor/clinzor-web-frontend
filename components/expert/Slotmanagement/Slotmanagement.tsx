import React, { useState, useCallback, useMemo } from 'react';
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
  Search,
  Layers,
  CalendarDays,
  Timer,
  Copy,
  RotateCcw,
  Zap
} from 'lucide-react';

type ExpertSlot = {
  uuid?: string;
  start_time: string;
  status?: 'DRAFT' | 'ACTIVE' | 'CANCELLED' | 'COMPLETED';
};

type BulkSlotData = {
  slot_list: { start_time: string }[];
};

type Notification = {
  type: 'success' | 'error' | 'warning';
  message: string;
} | null;

type ModalType = 'add' | 'edit' | 'view' | 'delete' | 'bulk' | null;

// Quick preset options for slot creation
const QUICK_PRESETS = [
  { label: 'Next Hour', getValue: () => {
    const date = new Date();
    date.setHours(date.getHours() + 1, 0, 0, 0);
    return date;
  }},
  { label: 'Tomorrow 9 AM', getValue: () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(9, 0, 0, 0);
    return date;
  }},
  { label: 'Next Monday 9 AM', getValue: () => {
    const date = new Date();
    const daysUntilMonday = (8 - date.getDay()) % 7 || 7;
    date.setDate(date.getDate() + daysUntilMonday);
    date.setHours(9, 0, 0, 0);
    return date;
  }},
  { label: 'End of Week', getValue: () => {
    const date = new Date();
    const daysUntilFriday = (5 - date.getDay() + 7) % 7;
    date.setDate(date.getDate() + daysUntilFriday);
    date.setHours(17, 0, 0, 0);
    return date;
  }}
];

export default function ExpertSlotManagement() {
  const [slots, setSlots] = useState<ExpertSlot[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [notification, setNotification] = useState<Notification>(null);
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
    timeSlots: ['09:00', '14:00'],
    weekdays: [1, 2, 3, 4, 5], // Mon-Fri
    interval: 'daily' as 'daily' | 'weekly'
  });

  const itemsPerPage = 10;

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
      timeSlots: ['09:00', '14:00'],
      weekdays: [1, 2, 3, 4, 5],
      interval: 'daily'
    });
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

  // Generate bulk slots from template
  const generateBulkSlots = useCallback(() => {
    const slots: { start_time: string }[] = [];
    const startDate = new Date(bulkTemplate.startDate);
    const endDate = new Date(bulkTemplate.endDate);
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay();
      const adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek; // Convert Sunday from 0 to 7
      
      if (bulkTemplate.weekdays.includes(adjustedDay)) {
        bulkTemplate.timeSlots.forEach(timeSlot => {
          const [hours, minutes] = timeSlot.split(':').map(Number);
          const slotDate = new Date(date);
          slotDate.setHours(hours, minutes, 0, 0);
          slots.push({ start_time: slotDate.toISOString().slice(0, 16) });
        });
      }
    }
    
    setBulkFormData({ slot_list: slots });
  }, [bulkTemplate]);

  const handleSave = useCallback(async () => {
    if (modalType === 'add' || modalType === 'edit') {
      if (!formData.start_time) {
        showNotification('error', 'Start time is required');
        return;
      }
    } else if (modalType === 'bulk') {
      if (bulkFormData.slot_list.length === 0) {
        showNotification('error', 'Please add at least one slot');
        return;
      }
    }

    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (modalType === 'add') {
        const newSlot: ExpertSlot = {
          ...formData as ExpertSlot,
          uuid: `slot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };
        setSlots(prev => [...prev, newSlot]);
        showNotification('success', 'Slot created successfully');
      } else if (modalType === 'edit' && selectedSlot) {
        setSlots(prev => prev.map(slot => 
          slot.uuid === selectedSlot.uuid ? { ...formData as ExpertSlot } : slot
        ));
        showNotification('success', 'Slot updated successfully');
      } else if (modalType === 'bulk') {
        const newSlots = bulkFormData.slot_list.map(slot => ({
          ...slot,
          uuid: `slot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          status: 'DRAFT' as const
        }));
        setSlots(prev => [...prev, ...newSlots]);
        showNotification('success', `${newSlots.length} slots created successfully`);
      }
      
      closeModal();
    } catch (error) {
      showNotification('error', 'Operation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [modalType, formData, selectedSlot, bulkFormData, showNotification, closeModal]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedSlot) return;
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setSlots(prev => prev.filter(slot => slot.uuid !== selectedSlot.uuid));
      showNotification('success', 'Slot deleted successfully');
      closeModal();
    } catch (error) {
      showNotification('error', 'Failed to delete slot. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedSlot, showNotification, closeModal]);

  const handleBulkDelete = useCallback(async () => {
    if (selectedSlots.size === 0) return;
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setSlots(prev => prev.filter(slot => !selectedSlots.has(slot.uuid || '')));
      showNotification('success', `Successfully deleted ${selectedSlots.size} slot${selectedSlots.size > 1 ? 's' : ''}`);
      setSelectedSlots(new Set());
    } catch (error) {
      showNotification('error', 'Failed to delete slots. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedSlots, showNotification]);

  const toggleSlotSelection = useCallback((slotUuid: string) => {
    setSelectedSlots(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(slotUuid)) {
        newSelection.delete(slotUuid);
      } else {
        newSelection.add(slotUuid);
      }
      return newSelection;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedSlots.size === paginatedSlots.length) {
      setSelectedSlots(new Set());
    } else {
      setSelectedSlots(new Set(paginatedSlots.map(slot => slot.uuid || '')));
    }
  }, [selectedSlots.size, paginatedSlots]);

  const applyQuickPreset = useCallback((preset: typeof QUICK_PRESETS[0]) => {
    const date = preset.getValue();
    setFormData(prev => ({
      ...prev,
      start_time: date.toISOString().slice(0, 16)
    }));
  }, []);

  const duplicateSlot = useCallback((slot: ExpertSlot) => {
    const originalDate = new Date(slot.start_time);
    originalDate.setDate(originalDate.getDate() + 7); // Next week
    
    setFormData({
      start_time: originalDate.toISOString().slice(0, 16),
      status: 'DRAFT'
    });
    setModalType('add');
  }, []);

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
        {/* Quick Presets for Add mode */}
        {modalType === 'add' && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Quick Time Presets</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_PRESETS.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => applyQuickPreset(preset)}
                  className="px-3 py-2 text-sm bg-white/70 hover:bg-white text-blue-700 rounded-lg transition-all hover:shadow-sm border border-transparent hover:border-blue-200"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date Selection */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <CalendarDays className="w-4 h-4" />
              Date
            </label>
            <input
              type="date"
              value={formData.start_time ? formData.start_time.slice(0, 10) : ''}
              onChange={(e) => {
                const currentTime = formData.start_time ? formData.start_time.slice(11, 16) : '09:00';
                setFormData({ ...formData, start_time: `${e.target.value}T${currentTime}` });
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Timer className="w-4 h-4" />
              Time
            </label>
            <input
              type="time"
              value={formData.start_time ? formData.start_time.slice(11, 16) : ''}
              onChange={(e) => {
                const currentDate = formData.start_time ? formData.start_time.slice(0, 10) : new Date().toISOString().slice(0, 10);
                setFormData({ ...formData, start_time: `${currentDate}T${e.target.value}` });
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Date & Time Preview */}
        {formData.start_time && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Scheduled for:</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDateTime(formData.start_time).date} at {formatDateTime(formData.start_time).time}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Local Time</p>
                <p className="text-sm text-gray-600">
                  {new Date(formData.start_time).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Status Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {(['DRAFT', 'ACTIVE', 'CANCELLED', 'COMPLETED'] as const).map(status => {
              const config = getStatusConfig(status);
              const isSelected = formData.status === status;
              return (
                <button
                  key={status}
                  onClick={() => setFormData({ ...formData, status })}
                  className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                    isSelected 
                      ? `${config.color} border-current shadow-sm` 
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isSelected ? config.dot : 'bg-gray-400'}`}></span>
                    {status}
                  </div>
                </button>
              );
            })}
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
            disabled={isLoading || !formData.start_time}
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
        {/* Template Generator */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-xl border border-emerald-100">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-emerald-600" />
            <span className="text-lg font-medium text-emerald-800">Smart Bulk Generator</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={bulkTemplate.startDate}
                onChange={(e) => setBulkTemplate({ ...bulkTemplate, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                value={bulkTemplate.endDate}
                onChange={(e) => setBulkTemplate({ ...bulkTemplate, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Days of Week</label>
            <div className="flex flex-wrap gap-2">
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
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isSelected 
                        ? 'bg-emerald-500 text-white shadow-sm' 
                        : 'bg-white text-gray-600 border border-gray-300 hover:border-emerald-300'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Time Slots</label>
            <div className="space-y-2">
              {bulkTemplate.timeSlots.map((time, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => {
                      const newTimeSlots = [...bulkTemplate.timeSlots];
                      newTimeSlots[index] = e.target.value;
                      setBulkTemplate({ ...bulkTemplate, timeSlots: newTimeSlots });
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    onClick={() => {
                      const newTimeSlots = bulkTemplate.timeSlots.filter((_, i) => i !== index);
                      setBulkTemplate({ ...bulkTemplate, timeSlots: newTimeSlots });
                    }}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setBulkTemplate({ 
                  ...bulkTemplate, 
                  timeSlots: [...bulkTemplate.timeSlots, '09:00'] 
                })}
                className="w-full px-3 py-2 border-2 border-dashed border-emerald-300 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
              >
                <PlusCircle size={16} />
                Add Time Slot
              </button>
            </div>
          </div>

          <button
            onClick={generateBulkSlots}
            className="w-full mt-4 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={16} />
            Generate Slots ({
              Math.ceil((new Date(bulkTemplate.endDate || new Date()).getTime() - new Date(bulkTemplate.startDate || new Date()).getTime()) / (1000 * 60 * 60 * 24) + 1) *
              bulkTemplate.weekdays.length * 
              bulkTemplate.timeSlots.length
            } slots)
          </button>
        </div>

        {/* Generated Slots Preview */}
        {bulkFormData.slot_list.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-gray-900">
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
            
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-4">
                {bulkFormData.slot_list.slice(0, 20).map((slot, index) => {
                  const { date, time } = formatDateTime(slot.start_time);
                  return (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
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
            className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || bulkFormData.slot_list.length === 0}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 font-medium shadow-lg"
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Slot Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your availability slots for consultations
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleBulkAdd}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Layers size={16} />
                Bulk Create
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <PlusCircle size={16} />
                New Slot
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Slots</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-2xl font-semibold text-emerald-600">{stats.active}</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg">
                <Check className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Draft</p>
                <p className="text-2xl font-semibold text-amber-600">{stats.draft}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <Edit3 className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Cancelled</p>
                <p className="text-2xl font-semibold text-red-600">{stats.cancelled}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <X className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search slots..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
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
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(slot)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => duplicateSlot(slot)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <Copy size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(slot)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
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
                    className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Notification */}
      {notification && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
          notification.type === 'success' ? 'bg-emerald-500' :
          notification.type === 'error' ? 'bg-red-500' :
          'bg-amber-500'
        } text-white`}>
          {notification.type === 'success' ? <Check size={20} /> :
           notification.type === 'error' ? <AlertTriangle size={20} /> :
           <Info size={20} />}
          <p>{notification.message}</p>
        </div>
      )}
    </div>
  );
}