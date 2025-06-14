import React, { useState } from 'react';
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
  Layers
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

export default function ExpertSlotManagement() {
  const [slots, setSlots] = useState<ExpertSlot[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [notification, setNotification] = useState<Notification>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<ExpertSlot | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [formData, setFormData] = useState<Partial<ExpertSlot>>({});
  const [bulkFormData, setBulkFormData] = useState<BulkSlotData>({
    slot_list: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());

  // Filter slots
  const filteredSlots = slots.filter(slot => {
    const matchesSearch = slot.start_time.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || slot.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: slots.length,
    active: slots.filter(s => s.status === 'ACTIVE').length,
    draft: slots.filter(s => s.status === 'DRAFT').length,
    cancelled: slots.filter(s => s.status === 'CANCELLED').length
  };

  // Pagination
  const paginatedSlots = filteredSlots.slice((currentPage - 1) * 5, currentPage * 5);

  const getStatusConfig = (status: string) => {
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
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC'
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
    setBulkFormData({ slot_list: [] });
  };

  const handleAdd = () => {
    const now = new Date();
    const utcTime = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes()
    ));
    setFormData({
      start_time: utcTime.toISOString().slice(0, 16),
      status: 'DRAFT'
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

  const handleSave = async () => {
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
      if (modalType === 'add') {
        const newSlot: ExpertSlot = {
          ...formData as ExpertSlot,
          uuid: `slot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };
        setSlots([...slots, newSlot]);
        showNotification('success', 'Slot created successfully');
      } else if (modalType === 'edit' && selectedSlot) {
        setSlots(slots.map(slot => 
          slot.uuid === selectedSlot.uuid ? { ...formData as ExpertSlot } : slot
        ));
        showNotification('success', 'Slot updated successfully');
      } else if (modalType === 'bulk') {
        const newSlots = bulkFormData.slot_list.map(slot => ({
          ...slot,
          uuid: `slot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          status: 'DRAFT' as const
        }));
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
      setSlots(prevSlots => prevSlots.filter(slot => slot.uuid !== selectedSlot.uuid));
      showNotification('success', 'Slot deleted successfully');
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
      setSlots(prevSlots => prevSlots.filter(slot => !selectedSlots.has(slot.uuid || '')));
      showNotification('success', `Successfully deleted ${selectedSlots.size} slot${selectedSlots.size > 1 ? 's' : ''}`);
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
      setSelectedSlots(new Set(paginatedSlots.map(slot => slot.uuid || '')));
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
      size="md"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Start Time (UTC)
          </label>
          <input
            type="datetime-local"
            value={formData.start_time || ''}
            onChange={(e) => {
              const localDate = new Date(e.target.value);
              const utcDate = new Date(Date.UTC(
                localDate.getFullYear(),
                localDate.getMonth(),
                localDate.getDate(),
                localDate.getHours(),
                localDate.getMinutes()
              ));
              setFormData({ ...formData, start_time: utcDate.toISOString().slice(0, 16) });
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <p className="text-sm text-gray-500">Times are stored in UTC format</p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            value={formData.status || 'DRAFT'}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as ExpertSlot['status'] })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETED">Completed</option>
          </select>
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
      size="lg"
    >
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <Info size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              Add multiple slots by entering their start times (UTC)
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {bulkFormData.slot_list.map((slot, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="datetime-local"
                value={slot.start_time}
                onChange={(e) => {
                  const localDate = new Date(e.target.value);
                  const utcDate = new Date(Date.UTC(
                    localDate.getFullYear(),
                    localDate.getMonth(),
                    localDate.getDate(),
                    localDate.getHours(),
                    localDate.getMinutes()
                  ));
                  const newList = [...bulkFormData.slot_list];
                  newList[index] = { start_time: utcDate.toISOString().slice(0, 16) };
                  setBulkFormData({ ...bulkFormData, slot_list: newList });
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                onClick={() => {
                  const newList = bulkFormData.slot_list.filter((_, i) => i !== index);
                  setBulkFormData({ ...bulkFormData, slot_list: newList });
                }}
                className="p-2 text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            const now = new Date();
            const utcTime = new Date(Date.UTC(
              now.getUTCFullYear(),
              now.getUTCMonth(),
              now.getUTCDate(),
              now.getUTCHours(),
              now.getUTCMinutes()
            ));
            setBulkFormData({
              ...bulkFormData,
              slot_list: [...bulkFormData.slot_list, { start_time: utcTime.toISOString().slice(0, 16) }]
            });
          }}
          className="w-full px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
        >
          <PlusCircle size={16} />
          Add Another Slot
        </button>

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
                <Layers size={16} />
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
      size="sm"
    >
      {selectedSlot && (
        <div className="space-y-6">
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
            <p className="text-sm font-medium text-gray-500">Status</p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusConfig(selectedSlot.status || '').color}`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusConfig(selectedSlot.status || '').dot}`}></span>
              {selectedSlot.status}
            </span>
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
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusConfig(selectedSlot.status || '').color}`}>
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusConfig(selectedSlot.status || '').dot}`}></span>
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
              <Clock className="w-6 h-6 text-emerald-600" />
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
              <Calendar className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Draft Slots</p>
              <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-50 rounded-lg">
              <Calendar className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Cancelled Slots</p>
              <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
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
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
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
              <span className="text-sm text-gray-600">Showing {slots.length} of {slots.length} entries</span>
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