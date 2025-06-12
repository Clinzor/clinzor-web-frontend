import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Filter, Download, RefreshCw, Calendar, CheckCircle, XCircle, 
  AlertCircle, User, Video, Phone, MessageSquare, Eye, Edit, Trash2, 
  ChevronLeft, ChevronRight, Clock, DollarSign, AlertTriangle, Save, Plus
} from 'lucide-react';

// Types
interface Booking {
  uuid: string;
  is_rescheduled: boolean;
  created_by: string;
  booking_type: string;
  doctor_gender_preference: string | null;
  payment_mode: string;
  booking_status: string;
  start_time: string;
  end_time: string;
  offers_applied: any | null;
  room_id: string | null;
  customer_meeting_link: string | null;
  expert_meeting_link: string | null;
  payment_status: string;
  session_type: string | null;
  patient_name: string | null;
  patient_address: string | null;
  patient_mobile: string | null;
  patient_email: string | null;
  booking_charge: string;
  slot: string;
  clinic_service: string | null;
  customer: string;
  doctor: string | null;
  expert: string;
  slot_details: {
    start_time: string;
    end_time: string;
    is_available: boolean;
    slot_type: string;
    price: string;
  } | null;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

interface Notification {
  message: string;
  type: 'success' | 'error' | 'warning';
}

// Add new interface for Slot
interface Slot {
  uuid: string;
  expert: string;
  created_by: string | null;
  start_time: string;
  end_time: string;
  status: string;
  is_booked: boolean;
  reason_for_rejection: string | null;
}

// Add new interface for SlotResponse
interface SlotResponse {
  status: number;
  message: string;
  data: {
    current_page: number;
    total_pages: number;
    total_items: number;
    next: string | null;
    previous: string | null;
    data: Slot[];
  }
}

// Add new interface for BookingResponse
interface BookingResponse {
  status: number;
  message: string;
  data: Booking;
}

// Add new interface for CreateBookingPayload
interface CreateBookingPayload {
  uuid: string;
  created_by: string;
  payment_mode: string;
  start_time: string;
  end_time: string;
  payment_status: string;
  booking_status: string;
  room_id: string | null;
  customer_meeting_link: string | null;
  expert_meeting_link: string | null;
  booking_charge: string;
  booking_type: string;
  customer: string;
  slot: string;
  expert: string;
  doctor_gender_preference: string | null;
  session_type: string | null;
  patient_name: string | null;
  patient_address: string | null;
  patient_mobile: string | null;
  patient_email: string | null;
  clinic_service: string | null;
}

// Sample data structure based on your JSON
const sampleBookings: Booking[] = [
  {
    uuid: 'b1',
    is_rescheduled: false,
    created_by: 'expert@example.com',
    booking_type: 'VIDEO_CALL',
    payment_mode: 'ONLINE',
    booking_status: 'PENDING',
    start_time: '2024-03-20T10:00:00Z',
    end_time: '2024-03-20T11:00:00Z',
    customer_meeting_link: 'https://meet.google.com/abc-defg-hij',
    expert_meeting_link: 'https://meet.google.com/xyz-uvw-123',
    payment_status: 'PENDING',
    session_type: 'CONSULTATION',
    booking_charge: '100.00',
    slot_details: {
      start_time: '2024-03-20T10:00:00Z',
      end_time: '2024-03-20T11:00:00Z',
      is_available: false,
      slot_type: 'REGULAR',
      price: '100.00'
    },
    doctor_gender_preference: null,
    patient_name: null,
    patient_address: null,
    patient_mobile: null,
    patient_email: null,
    clinic_service: null,
    offers_applied: null,
    room_id: 'room_123',
    slot: 'slot_123',
    customer: 'customer_123',
    doctor: null,
    expert: 'expert_123'
  },
  {
    uuid: 'b2',
    is_rescheduled: false,
    created_by: 'expert@example.com',
    booking_type: 'PHYSICAL_VISIT',
    payment_mode: 'CASH',
    booking_status: 'COMPLETED',
    start_time: '2024-03-19T14:00:00Z',
    end_time: '2024-03-19T15:00:00Z',
    customer_meeting_link: null,
    expert_meeting_link: null,
    payment_status: 'COMPLETED',
    session_type: 'FOLLOW_UP',
    booking_charge: '150.00',
    slot_details: {
      start_time: '2024-03-19T14:00:00Z',
      end_time: '2024-03-19T15:00:00Z',
      is_available: false,
      slot_type: 'REGULAR',
      price: '150.00'
    },
    doctor_gender_preference: 'MALE',
    patient_name: 'John Doe',
    patient_address: '123 Main St, City',
    patient_mobile: '+1234567890',
    patient_email: 'john@example.com',
    clinic_service: 'CLINIC_1',
    offers_applied: null,
    room_id: null,
    slot: 'slot_456',
    customer: 'customer_456',
    doctor: null,
    expert: 'expert_456'
  }
];

// Modal Component
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-xl shadow-xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XCircle size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const ExpertBookingManager: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>(sampleBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [modalType, setModalType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [editData, setEditData] = useState<Partial<Booking>>({});
  const [createBookingData, setCreateBookingData] = useState<CreateBookingPayload>({
    uuid: '',
    created_by: 'fake@exampl.com',
    payment_mode: 'ONLINE',
    start_time: '',
    end_time: '',
    payment_status: 'PENDING',
    booking_status: 'PENDING',
    room_id: null,
    customer_meeting_link: null,
    expert_meeting_link: null,
    booking_charge: '0.00',
    booking_type: 'VIDEO_CALL',
    customer: 'e10a9c6f-0166-4c54-a468-e25cc17b07f8',
    slot: '',
    expert: '',
    doctor_gender_preference: null,
    session_type: null,
    patient_name: null,
    patient_address: null,
    patient_mobile: null,
    patient_email: null,
    clinic_service: null
  });

  // Filter states
  const [filters, setFilters] = useState({
    booking_status: 'ALL',
    payment_status: 'ALL',
    booking_type: 'ALL',
    from_date: '',
    to_date: '',
    payment_mode: 'ALL'
  });

  const bookingStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED'];
  const paymentStatuses = ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'];
  const bookingTypes = ['VIDEO_CALL', 'PHONE_CALL', 'PHYSICAL_VISIT'];
  const paymentModes = ['ONLINE', 'CASH', 'CARD'];

  // Add new state for slots
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Filter bookings based on criteria
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      // Search filter
      const searchMatch = !searchTerm || 
        booking.uuid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.created_by.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.expert.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filters
      const statusMatch = filters.booking_status === 'ALL' || booking.booking_status === filters.booking_status;
      const paymentMatch = filters.payment_status === 'ALL' || booking.payment_status === filters.payment_status;
      const typeMatch = filters.booking_type === 'ALL' || booking.booking_type === filters.booking_type;
      const modeMatch = filters.payment_mode === 'ALL' || booking.payment_mode === filters.payment_mode;

      // Date range filter
      let dateMatch = true;
      if (filters.from_date || filters.to_date) {
        const bookingDate = new Date(booking.start_time);
        const fromDate = filters.from_date ? new Date(filters.from_date) : null;
        const toDate = filters.to_date ? new Date(filters.to_date) : null;

        if (fromDate && toDate) {
          dateMatch = bookingDate >= fromDate && bookingDate <= toDate;
        } else if (fromDate) {
          dateMatch = bookingDate >= fromDate;
        } else if (toDate) {
          dateMatch = bookingDate <= toDate;
        }
      }

      return searchMatch && statusMatch && paymentMatch && typeMatch && modeMatch && dateMatch;
    });
  }, [bookings, searchTerm, filters]);

  // Pagination
  const totalItems = filteredBookings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Statistics
  const stats = useMemo(() => {
    const total = filteredBookings.length;
    const pending = filteredBookings.filter(b => b.booking_status === 'PENDING').length;
    const confirmed = filteredBookings.filter(b => b.booking_status === 'CONFIRMED').length;
    const completed = filteredBookings.filter(b => b.booking_status === 'COMPLETED').length;
    const canceled = filteredBookings.filter(b => b.booking_status === 'CANCELED').length;
    const totalRevenue = filteredBookings
      .filter(b => b.payment_status === 'COMPLETED')
      .reduce((sum, b) => sum + (parseFloat(b.booking_charge.toString()) || 0), 0);

    return { total, pending, confirmed, completed, canceled, totalRevenue };
  }, [filteredBookings]);

  // Utility functions
  const formatDateTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    const date = start.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
    
    const time = `${start.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })} - ${end.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`;
    
    return { date, time };
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; icon: string }> = {
      'PENDING': { color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
      'CONFIRMED': { color: 'bg-blue-100 text-blue-800', icon: '✅' },
      'COMPLETED': { color: 'bg-green-100 text-green-800', icon: '✅' },
      'CANCELED': { color: 'bg-red-100 text-red-800', icon: '❌' }
    };
    return configs[status] || { color: 'bg-gray-100 text-gray-800', icon: '❓' };
  };

  const getPaymentStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; icon: string }> = {
      'PENDING': { color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
      'COMPLETED': { color: 'bg-green-100 text-green-800', icon: '✅' },
      'FAILED': { color: 'bg-red-100 text-red-800', icon: '❌' },
      'REFUNDED': { color: 'bg-orange-100 text-orange-800', icon: '↩️' }
    };
    return configs[status] || { color: 'bg-gray-100 text-gray-800', icon: '❓' };
  };

  const getBookingTypeIcon = (type: string) => {
    const icons: Record<string, JSX.Element> = {
      'VIDEO_CALL': <Video size={16} className="text-blue-500" />,
      'PHONE_CALL': <Phone size={16} className="text-green-500" />,
      'PHYSICAL_VISIT': <User size={16} className="text-purple-500" />
    };
    return icons[type] || <MessageSquare size={16} className="text-gray-500" />;
  };

  // Event handlers
  const showNotification = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const clearFilters = () => {
    setFilters({
      booking_status: 'ALL',
      payment_status: 'ALL',
      booking_type: 'ALL',
      from_date: '',
      to_date: '',
      payment_mode: 'ALL'
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const exportFilteredBookings = () => {
    const exportData = filteredBookings.map(booking => ({
      uuid: booking.uuid,
      start_time: booking.start_time,
      end_time: booking.end_time,
      booking_status: booking.booking_status,
      booking_type: booking.booking_type,
      payment_status: booking.payment_status,
      payment_mode: booking.payment_mode,
      booking_charge: booking.booking_charge.toString(),
      created_by: booking.created_by
    }));

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `expert-bookings-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Bookings exported successfully!');
  };

  const handleView = (booking: Booking) => {
    setSelectedBooking(booking);
    setModalType('view');
  };

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditData(booking);
    setModalType('edit');
  };

  const handleDelete = (booking: Booking) => {
    setSelectedBooking(booking);
    setModalType('delete');
  };

  const handleComplete = (booking: Booking) => {
    setSelectedBooking(booking);
    setModalType('complete');
  };

  const handleCancel = (booking: Booking) => {
    setSelectedBooking(booking);
    setModalType('cancel');
  };

  const closeModal = () => {
    setModalType('');
    setSelectedBooking(null);
    setEditData({});
  };

  const handleCancelConfirm = () => {
    if (!selectedBooking) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setBookings(prev => prev.map(b => 
        b.uuid === selectedBooking.uuid 
          ? { ...b, booking_status: 'CANCELED' }
          : b
      ));
      setIsLoading(false);
      closeModal();
      showNotification('Booking canceled successfully!');
    }, 1000);
  };

  // Add function to fetch slots
  const fetchSlots = async () => {
    setIsLoadingSlots(true);
    try {
      // Simulate API call
      const response: SlotResponse = {
        status: 200,
        message: "Expert slot's found",
        data: {
          current_page: 1,
          total_pages: 1,
          total_items: 6,
          next: null,
          previous: null,
          data: [
            {
              uuid: "3b125d50-309e-4870-a8fd-29c121ac1d43",
              expert: "7a6143b6-fca5-477f-82e0-ec11aa223b13",
              created_by: "expert2@gmail.com",
              start_time: "2025-05-24T21:00:00Z",
              end_time: "2025-05-24T21:15:00Z",
              status: "DRAFT",
              is_booked: false,
              reason_for_rejection: null
            },
            // ... other slots from your data
          ]
        }
      };
      setSlots(response.data.data);
    } catch (error) {
      console.error('Error fetching slots:', error);
      showNotification('Failed to fetch slots', 'error');
    } finally {
      setIsLoadingSlots(false);
    }
  };

  // Update handleCreateBooking
  const handleCreateBooking = async () => {
    if (!selectedSlot) {
      showNotification('Please select a slot first', 'error');
      return;
    }

    setIsLoading(true);
    try {
      // Create the payload exactly matching the API structure
      const payload: CreateBookingPayload = {
        uuid: crypto.randomUUID(),
        created_by: 'fake@exampl.com',
        payment_mode: createBookingData.payment_mode,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
        payment_status: 'PENDING',
        booking_status: 'PENDING',
        room_id: createBookingData.room_id,
        customer_meeting_link: createBookingData.customer_meeting_link,
        expert_meeting_link: createBookingData.expert_meeting_link,
        booking_charge: createBookingData.booking_charge,
        booking_type: createBookingData.booking_type,
        customer: createBookingData.customer,
        slot: selectedSlot.uuid,
        expert: selectedSlot.expert,
        doctor_gender_preference: null,
        session_type: null,
        patient_name: null,
        patient_address: null,
        patient_mobile: null,
        patient_email: null,
        clinic_service: null
      };

      // Simulate API call
      const response: BookingResponse = {
        status: 200,
        message: "Expert booking Created",
        data: {
          ...payload,
          is_rescheduled: false,
          doctor_gender_preference: null,
          offers_applied: null,
          session_type: null,
          patient_name: null,
          patient_address: null,
          patient_mobile: null,
          patient_email: null,
          clinic_service: null,
          doctor: null,
          slot_details: {
            start_time: selectedSlot.start_time,
            end_time: selectedSlot.end_time,
            is_available: false,
            slot_type: 'REGULAR',
            price: '0.00'
          }
        }
      };

      setBookings(prev => [response.data, ...prev]);
      showNotification('Booking created successfully!');
      closeModal();
    } catch (error) {
      console.error('Error creating booking:', error);
      showNotification('Failed to create booking', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReschedule = (booking: Booking) => {
    setSelectedBooking(booking);
    setModalType('reschedule');
  };

  const handleRescheduleConfirm = () => {
    if (!selectedBooking) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setBookings(prev => prev.map(b => 
        b.uuid === selectedBooking.uuid 
          ? { ...b, is_rescheduled: true }
          : b
      ));
      setIsLoading(false);
      closeModal();
      showNotification('Booking rescheduled successfully!');
    }, 1000);
  };

  // Add a utility function to format the booking ID
  const formatBookingId = (uuid: string) => {
    // Take first 6 characters and last 4 characters
    return `${uuid.slice(0, 6)}...${uuid.slice(-4)}`;
  };

  // Update the create modal content
  const renderCreateModalContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Slot Selection */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Select Slot</label>
          <select
            value={selectedSlot?.uuid || ''}
            onChange={(e) => {
              const slot = slots.find(s => s.uuid === e.target.value);
              setSelectedSlot(slot || null);
            }}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Select a slot</option>
            {slots.map(slot => (
              <option key={slot.uuid} value={slot.uuid}>
                {new Date(slot.start_time).toLocaleString()} - {new Date(slot.end_time).toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        {/* Booking Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Booking Type</label>
          <select
            value={createBookingData.booking_type}
            onChange={(e) => setCreateBookingData({...createBookingData, booking_type: e.target.value})}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            {bookingTypes.map(type => (
              <option key={type} value={type}>{type.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        {/* Session Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Session Type</label>
          <select
            value={createBookingData.session_type || ''}
            onChange={(e) => setCreateBookingData({...createBookingData, session_type: e.target.value})}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Select session type</option>
            <option value="CONSULTATION">Consultation</option>
            <option value="FOLLOW_UP">Follow Up</option>
            <option value="EMERGENCY">Emergency</option>
          </select>
        </div>

        {/* Doctor Gender Preference */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Doctor Gender Preference</label>
          <select
            value={createBookingData.doctor_gender_preference || ''}
            onChange={(e) => setCreateBookingData({...createBookingData, doctor_gender_preference: e.target.value})}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">No Preference</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>

        {/* Payment Mode */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Mode</label>
          <select
            value={createBookingData.payment_mode}
            onChange={(e) => setCreateBookingData({...createBookingData, payment_mode: e.target.value})}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            {paymentModes.map(mode => (
              <option key={mode} value={mode}>{mode}</option>
            ))}
          </select>
        </div>

        {/* Booking Charge */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Booking Charge</label>
          <input
            type="text"
            value={createBookingData.booking_charge}
            onChange={(e) => setCreateBookingData({...createBookingData, booking_charge: e.target.value})}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            placeholder="0.00"
          />
        </div>

        {/* Customer ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Customer ID</label>
          <input
            type="text"
            value={createBookingData.customer}
            onChange={(e) => setCreateBookingData({...createBookingData, customer: e.target.value})}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            placeholder="Enter customer ID"
          />
        </div>

        {/* Clinic Service */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Clinic Service</label>
          <input
            type="text"
            value={createBookingData.clinic_service || ''}
            onChange={(e) => setCreateBookingData({...createBookingData, clinic_service: e.target.value})}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            placeholder="Enter clinic service ID"
          />
        </div>

        {/* Video Call Specific Fields */}
        {createBookingData.booking_type === 'VIDEO_CALL' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Room ID</label>
              <input
                type="text"
                value={createBookingData.room_id || ''}
                onChange={(e) => setCreateBookingData({...createBookingData, room_id: e.target.value})}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                placeholder="Enter room ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Customer Meeting Link</label>
              <input
                type="text"
                value={createBookingData.customer_meeting_link || ''}
                onChange={(e) => setCreateBookingData({...createBookingData, customer_meeting_link: e.target.value})}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                placeholder="Enter customer meeting link"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Expert Meeting Link</label>
              <input
                type="text"
                value={createBookingData.expert_meeting_link || ''}
                onChange={(e) => setCreateBookingData({...createBookingData, expert_meeting_link: e.target.value})}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                placeholder="Enter expert meeting link"
              />
            </div>
          </>
        )}

        {/* Physical Visit Specific Fields */}
        {createBookingData.booking_type === 'PHYSICAL_VISIT' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Patient Name</label>
              <input
                type="text"
                value={createBookingData.patient_name || ''}
                onChange={(e) => setCreateBookingData({...createBookingData, patient_name: e.target.value})}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                placeholder="Enter patient name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Patient Email</label>
              <input
                type="email"
                value={createBookingData.patient_email || ''}
                onChange={(e) => setCreateBookingData({...createBookingData, patient_email: e.target.value})}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                placeholder="Enter patient email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Patient Mobile</label>
              <input
                type="tel"
                value={createBookingData.patient_mobile || ''}
                onChange={(e) => setCreateBookingData({...createBookingData, patient_mobile: e.target.value})}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                placeholder="Enter patient mobile"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Patient Address</label>
              <input
                type="text"
                value={createBookingData.patient_address || ''}
                onChange={(e) => setCreateBookingData({...createBookingData, patient_address: e.target.value})}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                placeholder="Enter patient address"
              />
            </div>
          </>
        )}
      </div>

      {/* Selected Slot Details */}
      {selectedSlot && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Slot Details</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Start Time</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(selectedSlot.start_time).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">End Time</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(selectedSlot.end_time).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="text-sm font-medium text-gray-900">{selectedSlot.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Booked</p>
              <p className="text-sm font-medium text-gray-900">
                {selectedSlot.is_booked ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={closeModal}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          onClick={handleCreateBooking}
          disabled={isLoading || !selectedSlot}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          {isLoading ? 'Creating...' : 'Create Booking'}
        </button>
      </div>
    </div>
  );

  // Add useEffect to fetch slots when create modal opens
  useEffect(() => {
    if (modalType === 'create') {
      fetchSlots();
    }
  }, [modalType]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
          notification.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
          'bg-amber-50 text-amber-800 border border-amber-200'
        }`}>
          <div className="flex items-center space-x-2">
            {notification.type === 'success' ? <CheckCircle size={20} /> :
             notification.type === 'error' ? <XCircle size={20} /> :
             <AlertCircle size={20} />}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Header Section */}
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Expert Booking Management</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage and track all expert bookings with advanced filtering</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setModalType('create')}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            >
              <Plus size={20} />
              <span className="text-sm sm:text-base font-medium">Create New Booking</span>
            </button>
            <button
              onClick={exportFilteredBookings}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download size={18} />
              <span className="text-sm sm:text-base">Export Filtered</span>
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw size={18} />
              <span className="text-sm sm:text-base">Refresh</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
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
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <CheckCircle className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg">
                <CheckCircle className="text-emerald-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Canceled</p>
                <p className="text-2xl font-bold text-red-600">{stats.canceled}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <XCircle className="text-red-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-green-600">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <DollarSign className="text-green-600" size={24} />
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
                  placeholder="Search by booking ID, customer, expert, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm sm:text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-colors ${
                  showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter size={18} />
                <span className="text-sm sm:text-base">Advanced Filters</span>
              </button>
              
              {(Object.values(filters).some(f => f !== 'ALL' && f !== '') || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm sm:text-base"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Booking Status</label>
                  <select
                    value={filters.booking_status}
                    onChange={(e) => setFilters({...filters, booking_status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ALL">All Status</option>
                    {bookingStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                  <select
                    value={filters.payment_status}
                    onChange={(e) => setFilters({...filters, payment_status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ALL">All Payments</option>
                    {paymentStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Booking Type</label>
                  <select
                    value={filters.booking_type}
                    onChange={(e) => setFilters({...filters, booking_type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ALL">All Types</option>
                    {bookingTypes.map(type => (
                      <option key={type} value={type}>{type.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Mode</label>
                  <select
                    value={filters.payment_mode}
                    onChange={(e) => setFilters({...filters, payment_mode: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ALL">All Modes</option>
                    {paymentModes.map(mode => (
                      <option key={mode} value={mode}>{mode}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                  <input
                    type="date"
                    value={filters.from_date}
                    onChange={(e) => setFilters({...filters, from_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                  <input
                    type="date"
                    value={filters.to_date}
                    onChange={(e) => setFilters({...filters, to_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium text-gray-900">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-medium text-gray-900">{Math.min(currentPage * itemsPerPage, filteredBookings.length)}</span> of <span className="font-medium text-gray-900">{filteredBookings.length}</span> bookings
              {(Object.values(filters).some(f => f !== 'ALL' && f !== '') || searchTerm) && (
                <span className="ml-2">
                  (filtered)
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meeting Link</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedBookings.map((booking) => {
                  const { date, time } = formatDateTime(booking.start_time, booking.end_time);
                  const statusConfig = getStatusConfig(booking.booking_status);
                  const paymentConfig = getPaymentStatusConfig(booking.payment_status);
                  
                  return (
                    <tr key={booking.uuid} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">{formatBookingId(booking.uuid)}</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(booking.uuid);
                                showNotification('Booking ID copied to clipboard!', 'success');
                              }}
                              className="text-gray-400 hover:text-gray-600"
                              title="Copy full booking ID"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                              </svg>
                            </button>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {booking.created_by}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{date}</div>
                        <div className="text-sm text-gray-500">{time}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getBookingTypeIcon(booking.booking_type)}
                          <span className="text-sm text-gray-900">{booking.booking_type.replace('_', ' ')}</span>
                        </div>
                        {booking.session_type && (
                          <div className="text-sm text-gray-500 mt-1">{booking.session_type}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          {statusConfig.icon} {booking.booking_status}
                        </span>
                        {booking.is_rescheduled && (
                          <div className="text-xs text-amber-600 mt-1">Rescheduled</div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${paymentConfig.color}`}>
                          {paymentConfig.icon} {booking.payment_status}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">{booking.payment_mode}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        ${(parseFloat(booking.booking_charge.toString()) || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {booking.customer_meeting_link ? (
                          <a 
                            href={booking.customer_meeting_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                          >
                            <Video size={14} />
                            <span>Join</span>
                          </a>
                        ) : (
                          <span className="text-gray-500 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleView(booking)}
                            className="flex items-center space-x-1 px-2 py-1 text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                            title="View Booking Details"
                          >
                            <Eye size={16} />
                            <span className="text-xs">View</span>
                          </button>
                          {booking.booking_status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleEdit(booking)}
                                className="flex items-center space-x-1 px-2 py-1 text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                                title="Edit Booking Details"
                              >
                                <Edit size={16} />
                                <span className="text-xs">Edit</span>
                              </button>
                              <button
                                onClick={() => handleComplete(booking)}
                                className="flex items-center space-x-1 px-2 py-1 text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 rounded-md transition-colors"
                                title="Mark Booking as Complete"
                              >
                                <CheckCircle size={16} />
                                <span className="text-xs">Complete</span>
                              </button>
                              <button
                                onClick={() => handleCancel(booking)}
                                className="flex items-center space-x-1 px-2 py-1 text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                                title="Cancel Booking"
                              >
                                <XCircle size={16} />
                                <span className="text-xs">Cancel</span>
                              </button>
                            </>
                          )}
                          {booking.booking_status === 'CONFIRMED' && (
                            <>
                              <button
                                onClick={() => handleComplete(booking)}
                                className="flex items-center space-x-1 px-2 py-1 text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 rounded-md transition-colors"
                                title="Mark Booking as Complete"
                              >
                                <CheckCircle size={16} />
                                <span className="text-xs">Complete</span>
                              </button>
                              <button
                                onClick={() => handleCancel(booking)}
                                className="flex items-center space-x-1 px-2 py-1 text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                                title="Cancel Booking"
                              >
                                <XCircle size={16} />
                                <span className="text-xs">Cancel</span>
                              </button>
                            </>
                          )}
                          {!booking.is_rescheduled && (
                            <button
                              onClick={() => handleReschedule(booking)}
                              className="flex items-center space-x-1 px-2 py-1 text-amber-600 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-md transition-colors"
                              title="Reschedule Booking"
                            >
                              <RefreshCw size={16} />
                              <span className="text-xs">Reschedule</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={modalType === 'view'}
        onClose={closeModal}
        title="Booking Details"
        size="lg"
      >
        {selectedBooking && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Booking ID</h3>
                <div className="mt-1 flex items-center space-x-2">
                  <p className="text-sm text-gray-900">{selectedBooking.uuid}</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedBooking.uuid);
                      showNotification('Booking ID copied to clipboard!', 'success');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                    title="Copy booking ID"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date & Time</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDateTime(selectedBooking.start_time, selectedBooking.end_time).date}
                  <br />
                  {formatDateTime(selectedBooking.start_time, selectedBooking.end_time).time}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Booking Type</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedBooking.booking_type.replace('_', ' ')}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Session Type</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedBooking.session_type || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedBooking.booking_status}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Payment Status</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedBooking.payment_status}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Payment Mode</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedBooking.payment_mode}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Amount</h3>
                <p className="mt-1 text-sm text-gray-900">₹{(parseFloat(selectedBooking.booking_charge.toString()) || 0).toFixed(2)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Rescheduled</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedBooking.is_rescheduled ? 'Yes' : 'No'}</p>
              </div>
              {selectedBooking.booking_type === 'PHYSICAL_VISIT' && (
                <>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Patient Name</h3>
                    <p className="mt-1 text-sm text-gray-900">{selectedBooking.patient_name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Patient Email</h3>
                    <p className="mt-1 text-sm text-gray-900">{selectedBooking.patient_email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Patient Mobile</h3>
                    <p className="mt-1 text-sm text-gray-900">{selectedBooking.patient_mobile}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Patient Address</h3>
                    <p className="mt-1 text-sm text-gray-900">{selectedBooking.patient_address}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Doctor Gender Preference</h3>
                    <p className="mt-1 text-sm text-gray-900">{selectedBooking.doctor_gender_preference || 'N/A'}</p>
                  </div>
                </>
              )}
              <div>
                <h3 className="text-sm font-medium text-gray-500">Clinic Service</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedBooking.clinic_service || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Doctor</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedBooking.doctor || 'Not Assigned'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Customer Meeting Link</h3>
                {selectedBooking.customer_meeting_link ? (
                  <a 
                    href={selectedBooking.customer_meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                  >
                    <Video size={14} />
                    <span>Join</span>
                  </a>
                ) : (
                  <p className="mt-1 text-sm text-gray-500">-</p>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Expert Meeting Link</h3>
                {selectedBooking.expert_meeting_link ? (
                  <a 
                    href={selectedBooking.expert_meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                  >
                    <Video size={14} />
                    <span>Join</span>
                  </a>
                ) : (
                  <p className="mt-1 text-sm text-gray-500">-</p>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Slot Details</h3>
                {selectedBooking.slot_details ? (
                  <div className="mt-1 space-y-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">Type:</span> {selectedBooking.slot_details.slot_type}
                    </p>
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">Price:</span> ${selectedBooking.slot_details.price}
                    </p>
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">Available:</span> {selectedBooking.slot_details.is_available ? 'Yes' : 'No'}
                    </p>
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">Time:</span> {formatDateTime(selectedBooking.slot_details.start_time, selectedBooking.slot_details.end_time).time}
                    </p>
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-gray-500">No slot details available</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={modalType === 'edit'}
        onClose={closeModal}
        title="Edit Booking"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Booking Status</label>
              <select
                value={editData.booking_status || selectedBooking.booking_status}
                onChange={(e) => setEditData({...editData, booking_status: e.target.value})}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {bookingStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Status</label>
              <select
                value={editData.payment_status || selectedBooking.payment_status}
                onChange={(e) => setEditData({...editData, payment_status: e.target.value})}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {paymentStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => {
                    setBookings(prev => prev.map(b => 
                      b.uuid === selectedBooking.uuid ? { ...b, ...editData } : b
                    ));
                    setIsLoading(false);
                    closeModal();
                    showNotification('Booking updated successfully!');
                  }, 1000);
                }}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={modalType === 'delete'}
        onClose={closeModal}
        title="Delete Booking"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this booking? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => {
                    setBookings(prev => prev.filter(b => b.uuid !== selectedBooking.uuid));
                    setIsLoading(false);
                    closeModal();
                    showNotification('Booking deleted successfully!');
                  }, 1000);
                }}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={modalType === 'complete'}
        onClose={closeModal}
        title="Complete Booking"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Are you sure you want to mark this booking as complete? This will also mark the payment as completed.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => {
                    setBookings(prev => prev.map(b => 
                      b.uuid === selectedBooking.uuid ? { ...b, booking_status: 'COMPLETED', payment_status: 'COMPLETED' } : b
                    ));
                    setIsLoading(false);
                    closeModal();
                    showNotification('Booking marked as completed!');
                  }, 1000);
                }}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {isLoading ? 'Completing...' : 'Mark as Complete'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={modalType === 'cancel'}
        onClose={closeModal}
        title="Cancel Booking"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                No, Keep Booking
              </button>
              <button
                onClick={handleCancelConfirm}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isLoading ? 'Canceling...' : 'Yes, Cancel Booking'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={modalType === 'create'}
        onClose={closeModal}
        title="Create New Booking"
        size="lg"
      >
        {renderCreateModalContent()}
      </Modal>

      <Modal
        isOpen={modalType === 'reschedule'}
        onClose={closeModal}
        title="Reschedule Booking"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Are you sure you want to reschedule this booking? This will mark the booking as rescheduled.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleRescheduleConfirm}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? 'Rescheduling...' : 'Reschedule'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ExpertBookingManager;