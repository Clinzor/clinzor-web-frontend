import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Calendar, Clock, User, DollarSign, Video, Phone, MessageSquare, Eye, Edit, Trash2, CheckCircle, XCircle, AlertCircle, MoreVertical, Download, RefreshCw, X, ChevronLeft, ChevronRight, AlertTriangle, Save } from 'lucide-react';

// Mock data for demonstration
const mockBookings: Booking[] = [
  {
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    booking_date: '2024-03-20',
    booking_time: '10:00',
    booking_status: 'SCHEDULED',
    payment_status: 'PENDING',
    is_rescheduled: false,
    last_modified: '2024-03-19T08:00:00Z',
    amount: 150,
    created_by: 'Admin',
    expert_name: 'Dr. Smith',
    expert_specialization: 'General Medicine',
    booking_charge: 150,
    booking_type: 'VIDEO_CALL',
    start_time: '2024-03-20T10:00:00',
    end_time: '2024-03-20T11:00:00',
    expert_meeting_link: 'https://meet.example.com/bk001'
  },
  {
    uuid: 'BK002',
    patient_name: 'Jane Smith',
    patient_email: 'jane@example.com',
    patient_mobile: '+1987654321',
    patient_address: '456 Oak Ave, Town',
    doctor: 'Dr. Johnson',
    booking_date: '2024-03-21',
    booking_time: '14:30',
    booking_status: 'CONFIRMED',
    payment_status: 'PAID',
    is_rescheduled: false,
    last_modified: '2024-03-20T09:15:00Z',
    amount: 200,
    created_by: 'System',
    expert_name: 'Dr. Johnson',
    expert_specialization: 'Cardiology',
    booking_charge: 200,
    booking_type: 'PHONE_CALL',
    start_time: '2024-03-21T14:30:00',
    end_time: '2024-03-21T15:30:00'
  },
  {
    uuid: 'BK003',
    patient_name: 'Robert Wilson',
    patient_email: 'robert@example.com',
    patient_mobile: '+1122334455',
    patient_address: '789 Pine Rd, Village',
    doctor: 'Dr. Brown',
    booking_date: '2024-03-22',
    booking_time: '09:00',
    booking_status: 'COMPLETED',
    payment_status: 'PAID',
    is_rescheduled: false,
    last_modified: '2024-03-22T10:00:00Z',
    amount: 175,
    created_by: 'Admin',
    expert_name: 'Dr. Brown',
    expert_specialization: 'Dermatology',
    booking_charge: 175,
    booking_type: 'VIDEO_CALL',
    start_time: '2024-03-22T09:00:00',
    end_time: '2024-03-22T10:00:00',
    expert_meeting_link: 'https://meet.example.com/bk003'
  },
  {
    uuid: 'BK004',
    patient_name: 'Sarah Davis',
    patient_email: 'sarah@example.com',
    patient_mobile: '+1555666777',
    patient_address: '321 Elm St, City',
    doctor: 'Dr. Wilson',
    booking_date: '2024-03-23',
    booking_time: '11:30',
    booking_status: 'CANCELLED',
    payment_status: 'REFUNDED',
    is_rescheduled: false,
    last_modified: '2024-03-22T15:45:00Z',
    amount: 180,
    created_by: 'System',
    expert_name: 'Dr. Wilson',
    expert_specialization: 'Pediatrics',
    booking_charge: 180,
    booking_type: 'CHAT',
    start_time: '2024-03-23T11:30:00',
    end_time: '2024-03-23T12:30:00'
  },
  {
    uuid: 'BK005',
    patient_name: 'Michael Brown',
    patient_email: 'michael@example.com',
    patient_mobile: '+1888999000',
    patient_address: '654 Maple Dr, Town',
    doctor: 'Dr. Smith',
    booking_date: '2024-03-24',
    booking_time: '15:00',
    booking_status: 'RESCHEDULED',
    payment_status: 'PAID',
    is_rescheduled: true,
    last_modified: '2024-03-23T10:30:00Z',
    amount: 150,
    created_by: 'Admin',
    expert_name: 'Dr. Smith',
    expert_specialization: 'General Medicine',
    booking_charge: 150,
    booking_type: 'VIDEO_CALL',
    start_time: '2024-03-24T15:00:00',
    end_time: '2024-03-24T16:00:00',
    expert_meeting_link: 'https://meet.example.com/bk005'
  },
  {
    uuid: 'BK006',
    patient_name: 'Emily Taylor',
    patient_email: 'emily@example.com',
    patient_mobile: '+1777888999',
    patient_address: '987 Cedar Ln, Village',
    doctor: 'Dr. Johnson',
    booking_date: '2024-03-25',
    booking_time: '13:00',
    booking_status: 'IN_PROGRESS',
    payment_status: 'PAID',
    is_rescheduled: false,
    last_modified: '2024-03-25T13:00:00Z',
    amount: 200,
    created_by: 'System',
    expert_name: 'Dr. Johnson',
    expert_specialization: 'Cardiology',
    booking_charge: 200,
    booking_type: 'PHONE_CALL',
    start_time: '2024-03-25T13:00:00',
    end_time: '2024-03-25T14:00:00'
  },
  {
    uuid: 'BK007',
    patient_name: 'David Miller',
    patient_email: 'david@example.com',
    patient_mobile: '+1666777888',
    patient_address: '147 Birch St, City',
    doctor: 'Dr. Brown',
    booking_date: '2024-03-26',
    booking_time: '16:30',
    booking_status: 'SCHEDULED',
    payment_status: 'PENDING',
    is_rescheduled: false,
    last_modified: '2024-03-25T14:20:00Z',
    amount: 175,
    created_by: 'Admin',
    expert_name: 'Dr. Brown',
    expert_specialization: 'Dermatology',
    booking_charge: 175,
    booking_type: 'VIDEO_CALL',
    start_time: '2024-03-26T16:30:00',
    end_time: '2024-03-26T17:30:00',
    expert_meeting_link: 'https://meet.example.com/bk007'
  },
  {
    uuid: 'BK008',
    patient_name: 'Lisa Anderson',
    patient_email: 'lisa@example.com',
    patient_mobile: '+1444555666',
    patient_address: '258 Spruce Ave, Town',
    doctor: 'Dr. Wilson',
    booking_date: '2024-03-27',
    booking_time: '10:30',
    booking_status: 'CONFIRMED',
    payment_status: 'FAILED',
    is_rescheduled: false,
    last_modified: '2024-03-26T11:45:00Z',
    amount: 180,
    created_by: 'System',
    expert_name: 'Dr. Wilson',
    expert_specialization: 'Pediatrics',
    booking_charge: 180,
    booking_type: 'CHAT',
    start_time: '2024-03-27T10:30:00',
    end_time: '2024-03-27T11:30:00'
  }
];

const bookingStatuses = ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'] as const;
const paymentStatuses = ['PENDING', 'PAID', 'REFUNDED', 'FAILED'] as const;

type Booking = {
  uuid: string;
  patient_name: string;
  patient_email: string;
  patient_mobile: string;
  patient_address: string;
  doctor: string;
  booking_date: string;
  booking_time: string;
  booking_status: typeof bookingStatuses[number];
  payment_status: typeof paymentStatuses[number];
  is_rescheduled: boolean;
  last_modified: string;
  amount: number;
  created_by: string;
  expert_name: string;
  expert_specialization: string;
  booking_charge: number;
  booking_type: 'VIDEO_CALL' | 'PHONE_CALL' | 'CHAT';
  start_time: string;
  end_time: string;
  expert_meeting_link?: string;
};

type Notification = {
  type: 'success' | 'error' | 'warning';
  message: string;
} | null;

type ModalType = 'view' | 'edit' | 'delete' | 'complete' | null;

type BookingFilters = {
  status: typeof bookingStatuses[number] | 'ALL';
  paymentStatus: typeof paymentStatuses[number] | 'ALL';
  bookingType: 'VIDEO_CALL' | 'PHONE_CALL' | 'CHAT' | 'ALL';
  dateRange: 'ALL' | 'TODAY' | 'YESTERDAY' | 'LAST_7_DAYS' | 'LAST_30_DAYS';
  expert: string;
};

export default function BookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editData, setEditData] = useState<Partial<Booking> | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'edit'>('list');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<typeof bookingStatuses[number] | 'All'>('All');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<typeof paymentStatuses[number] | 'All'>('All');
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [sortField, setSortField] = useState<keyof Booking>('booking_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isSorting, setIsSorting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isLoadingFilters, setIsLoadingFilters] = useState(false);
  const [isLoadingSort, setIsLoadingSort] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isLoadingExport, setIsLoadingExport] = useState(false);
  const [isLoadingImport, setIsLoadingImport] = useState(false);
  const [isLoadingRefresh, setIsLoadingRefresh] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  const [isLoadingReschedule, setIsLoadingReschedule] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [isLoadingView, setIsLoadingView] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isWarning, setIsWarning] = useState(false);
  const [isInfo, setIsInfo] = useState(false);

  const [notification, setNotification] = useState<Notification>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedBookings, setSelectedBookings] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<BookingFilters>({
    status: 'ALL',
    paymentStatus: 'ALL',
    bookingType: 'ALL',
    dateRange: 'ALL',
    expert: 'ALL'
  });

  const itemsPerPage = 10;

  // Simulate API call
  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Initialize with mock data
        setBookings(mockBookings);
        const totalCount = mockBookings.length;
        setTotalItems(totalCount);
        setTotalPages(Math.ceil(totalCount / itemsPerPage));
        
        showNotification('success', 'Bookings loaded successfully');
      } catch (error) {
        showNotification('error', 'Failed to load bookings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Advanced search and filter function
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        booking.uuid.toLowerCase().includes(searchLower) ||
        booking.patient_name.toLowerCase().includes(searchLower) ||
        booking.doctor.toLowerCase().includes(searchLower) ||
        booking.expert_name.toLowerCase().includes(searchLower) ||
        booking.expert_specialization.toLowerCase().includes(searchLower) ||
        booking.created_by.toLowerCase().includes(searchLower);

      const matchesStatus = filters.status === 'ALL' || booking.booking_status === filters.status;
      const matchesPaymentStatus = filters.paymentStatus === 'ALL' || booking.payment_status === filters.paymentStatus;
      const matchesBookingType = filters.bookingType === 'ALL' || booking.booking_type === filters.bookingType;
      
      // Date range filter
      let matchesDateRange = true;
      if (filters.dateRange !== 'ALL') {
        const bookingDate = new Date(booking.booking_date);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        const lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1);

        switch (filters.dateRange) {
          case 'TODAY':
            matchesDateRange = bookingDate.toDateString() === today.toDateString();
            break;
          case 'YESTERDAY':
            matchesDateRange = bookingDate.toDateString() === yesterday.toDateString();
            break;
          case 'LAST_7_DAYS':
            matchesDateRange = bookingDate >= lastWeek;
            break;
          case 'LAST_30_DAYS':
            matchesDateRange = bookingDate >= lastMonth;
            break;
          default:
            matchesDateRange = true;
        }
      }

      const matchesExpert = filters.expert === 'ALL' || booking.doctor === filters.expert;

      return matchesSearch && matchesStatus && matchesPaymentStatus && matchesBookingType && matchesDateRange && matchesExpert;
    });
  }, [bookings, searchTerm, filters]);

  // Pagination
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBookings, currentPage, itemsPerPage]);

  // Update total pages when filtered results change
  useEffect(() => {
    setTotalPages(Math.ceil(filteredBookings.length / itemsPerPage));
    setTotalItems(filteredBookings.length);
  }, [filteredBookings, itemsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchTerm]);

  // Calculate statistics
  const stats = useMemo(() => ({
    total: filteredBookings.length,
    confirmed: filteredBookings.filter(b => b.booking_status === 'CONFIRMED').length,
    completed: filteredBookings.filter(b => b.booking_status === 'COMPLETED').length,
    canceled: filteredBookings.filter(b => b.booking_status === 'CANCELLED').length,
    totalRevenue: filteredBookings
      .filter(b => b.payment_status === 'PAID')
      .reduce((sum, b) => sum + parseFloat(b.booking_charge.toString()), 0)
  }), [filteredBookings]);

  const getStatusConfig = (status: typeof bookingStatuses[number]) => {
    switch (status) {
      case 'COMPLETED':
        return {
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <CheckCircle size={14} />
        };
      case 'SCHEDULED':
      case 'CONFIRMED':
        return {
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: <Calendar size={14} />
        };
      case 'IN_PROGRESS':
        return {
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <Clock size={14} />
        };
      case 'CANCELLED':
        return {
          color: 'bg-red-50 text-red-700 border-red-200',
          icon: <XCircle size={14} />
        };
      case 'RESCHEDULED':
        return {
          color: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: <RefreshCw size={14} />
        };
      default:
        return {
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          icon: <AlertCircle size={14} />
        };
    }
  };

  const getPaymentStatusConfig = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return {
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <CheckCircle size={14} />
        };
      case 'PENDING':
        return {
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <AlertCircle size={14} />
        };
      case 'FAILED':
        return {
          color: 'bg-red-50 text-red-700 border-red-200',
          icon: <XCircle size={14} />
        };
      default:
        return {
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          icon: <AlertCircle size={14} />
        };
    }
  };

  const getBookingTypeIcon = (type: string) => {
    switch (type) {
      case 'VIDEO_CALL':
        return <Video size={16} className="text-blue-600" />;
      case 'PHONE_CALL':
        return <Phone size={16} className="text-green-600" />;
      case 'CHAT':
        return <MessageSquare size={16} className="text-purple-600" />;
      default:
        return <Calendar size={16} className="text-gray-600" />;
    }
  };

  const formatDateTime = (dateString: string, timeString: string) => {
    const date = new Date(`${dateString}T${timeString}`);
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

  const [modalType, setModalType] = useState<'edit' | 'delete' | 'complete' | 'reschedule' | 'view' | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalSize, setModalSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [modalIsLoading, setModalIsLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalSuccess, setModalSuccess] = useState<string | null>(null);
  const [modalWarning, setModalWarning] = useState<string | null>(null);
  const [modalInfo, setModalInfo] = useState<string | null>(null);
  const [modalIsError, setModalIsError] = useState(false);
  const [modalIsSuccess, setModalIsSuccess] = useState(false);
  const [modalIsWarning, setModalIsWarning] = useState(false);
  const [modalIsInfo, setModalIsInfo] = useState(false);

  const handleView = (booking: Booking) => {
    setSelectedBooking(booking);
    setModalType('view');
    setModalTitle('Booking Details');
    setModalSize('lg');
  };

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditData(booking);
    setModalType('edit');
    setModalTitle('Edit Booking');
    setModalSize('lg');
  };

  const handleDelete = (booking: Booking) => {
    setSelectedBooking(booking);
    setModalType('delete');
    setModalTitle('Delete Booking');
    setModalSize('sm');
  };

  const handleComplete = (booking: Booking) => {
    setSelectedBooking(booking);
    setModalType('complete');
    setModalTitle('Complete Booking');
    setModalSize('sm');
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedBooking(null);
    setEditData(null);
  };

  const handleMarkComplete = async () => {
    if (!selectedBooking) return;

    setIsLoading(true);
    try {
      // Simulate API call to update booking status
      const response = await fetch(`/api/bookings/${selectedBooking.uuid}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking_status: 'COMPLETED'
        }),
      });

      // For demo purposes, update the local state
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.uuid === selectedBooking.uuid
            ? { ...booking, booking_status: 'COMPLETED' }
            : booking
        )
      );

      showNotification('success', 'Booking marked as completed successfully');
      closeModal();
    } catch (error) {
      showNotification('error', 'Failed to mark booking as completed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBooking) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBookings(prevBookings =>
        prevBookings.filter(booking => booking.uuid !== selectedBooking.uuid)
      );

      showNotification('success', 'Booking deleted successfully');
      closeModal();
    } catch (error) {
      showNotification('error', 'Failed to delete booking');
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      status: 'ALL',
      paymentStatus: 'ALL',
      bookingType: 'ALL',
      dateRange: 'ALL',
      expert: 'ALL'
    });
    setSearchTerm('');
  };

  const exportBookings = () => {
    const csvContent = [
      ['UUID', 'Customer', 'Expert', 'Date', 'Time', 'Type', 'Status', 'Payment Status', 'Amount'],
      ...filteredBookings.map(booking => {
        const { date, time } = formatDateTime(booking.booking_date, booking.booking_time);
        return [
          booking.uuid,
          booking.patient_name,
          booking.doctor,
          date,
          time,
          booking.booking_type,
          booking.booking_status,
          booking.payment_status,
          `$${booking.booking_charge}`
        ];
      })
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleStatusChange = async (bookingId: string, newStatus: typeof bookingStatuses[number]) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ booking_status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking status');
      }

      const updatedBooking = await response.json();
      setBookings(bookings.map(booking => 
        booking.uuid === bookingId ? { ...booking, booking_status: newStatus } : booking
      ));
      setSuccess('Booking status updated successfully');
    } catch (error) {
      setError('Failed to update booking status');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentStatusChange = async (bookingId: string, newPaymentStatus: typeof paymentStatuses[number]) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payment_status: newPaymentStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update payment status');
      }

      const updatedBooking = await response.json();
      setBookings(bookings.map(booking => 
        booking.uuid === bookingId ? { ...booking, payment_status: newPaymentStatus } : booking
      ));
      setSuccess('Payment status updated successfully');
    } catch (error) {
      setError('Failed to update payment status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedBooking || !editData) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/bookings/${selectedBooking.uuid}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking');
      }

      setBookings(bookings.map(booking => 
        booking.uuid === selectedBooking.uuid 
          ? { 
              ...booking, 
              ...editData,
              last_modified: new Date().toISOString() 
            }
          : booking
      ));
      
      showNotification('success', 'Booking updated successfully.');
      setViewMode('list');
      setSelectedBooking(null);
    } catch (error) {
      showNotification('error', 'Failed to update booking');
    } finally {
      setIsLoading(false);
    }
  };

  // Modal Component
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

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Management</h1>
            <p className="text-gray-600">Manage and track all expert bookings</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <button
              onClick={exportBookings}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download size={18} />
              <span>Export</span>
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw size={18} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by booking ID, patient, doctor, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter size={18} />
                <span>Filters</span>
              </button>
              
              {(Object.values(filters).some(f => f !== 'ALL') || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value as typeof bookingStatuses[number] | 'ALL'})}
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
                    value={filters.paymentStatus}
                    onChange={(e) => setFilters({...filters, paymentStatus: e.target.value as typeof paymentStatuses[number] | 'ALL'})}
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
                    value={filters.bookingType}
                    onChange={(e) => setFilters({...filters, bookingType: e.target.value as 'VIDEO_CALL' | 'PHONE_CALL' | 'CHAT'})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ALL">All Types</option>
                    <option value="VIDEO_CALL">Video Call</option>
                    <option value="PHONE_CALL">Phone Call</option>
                    <option value="CHAT">Chat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => setFilters({...filters, dateRange: e.target.value as 'ALL' | 'TODAY' | 'YESTERDAY' | 'LAST_7_DAYS' | 'LAST_30_DAYS'})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ALL">All Time</option>
                    <option value="TODAY">Today</option>
                    <option value="YESTERDAY">Yesterday</option>
                    <option value="LAST_7_DAYS">Last 7 Days</option>
                    <option value="LAST_30_DAYS">Last 30 Days</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expert</label>
                  <select
                    value={filters.expert}
                    onChange={(e) => setFilters({...filters, expert: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ALL">All Experts</option>
                    {Array.from(new Set(bookings.map(b => b.doctor))).map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedBookings.map((booking) => {
                  const { date, time } = formatDateTime(booking.booking_date, booking.booking_time);
                  const statusConfig = getStatusConfig(booking.booking_status);
                  const paymentStatusConfig = getPaymentStatusConfig(booking.payment_status);
                  
                  return (
                    <tr key={booking.uuid} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{booking.uuid}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{booking.patient_name}</div>
                        <div className="text-sm text-gray-500">{booking.patient_email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{booking.doctor}</div>
                        <div className="text-sm text-gray-500">{booking.expert_specialization}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{date}</div>
                        <div className="text-sm text-gray-500">{time}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getBookingTypeIcon(booking.booking_type)}
                          <span className="text-sm text-gray-900">{booking.booking_type.replace('_', ' ')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          <span className="mr-1.5">{statusConfig.icon}</span>
                          {booking.booking_status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${paymentStatusConfig.color}`}>
                            <span className="mr-1.5">{paymentStatusConfig.icon}</span>
                            {booking.payment_status}
                          </span>
                          <span className="text-sm text-gray-900">${booking.booking_charge}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleView(booking)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          {booking.booking_status === 'CONFIRMED' && (
                            <button
                              onClick={() => handleComplete(booking)}
                              className="p-1 text-emerald-400 hover:text-emerald-600 transition-colors"
                              title="Mark as Completed"
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => handleEdit(booking)}
                            className="p-1 text-blue-400 hover:text-blue-600 transition-colors"
                            title="Edit Booking"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(booking)}
                            className="p-1 text-red-400 hover:text-red-600 transition-colors"
                            title="Delete Booking"
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
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
                </span>
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
      </div>

      {/* View Modal */}
      <Modal
        isOpen={modalType === 'view'}
        onClose={closeModal}
        title="Booking Details"
        size="lg"
      >
        {selectedBooking && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Booking ID</p>
                <p className="text-sm text-gray-900">{selectedBooking.uuid}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Created By</p>
                <p className="text-sm text-gray-900">{selectedBooking.created_by}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Patient</p>
                <p className="text-sm text-gray-900">{selectedBooking.patient_name}</p>
                <p className="text-sm text-gray-500">Email: {selectedBooking.patient_email}</p>
                <p className="text-sm text-gray-500">Phone: {selectedBooking.patient_mobile}</p>
                <p className="text-sm text-gray-500">Address: {selectedBooking.patient_address}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Doctor</p>
                <p className="text-sm text-gray-900">{selectedBooking.doctor}</p>
                <p className="text-sm text-gray-500">Specialization: {selectedBooking.expert_specialization}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Date & Time</p>
                <p className="text-sm text-gray-900">{formatDateTime(selectedBooking.booking_date, selectedBooking.booking_time).date}</p>
                <p className="text-sm text-gray-500">{formatDateTime(selectedBooking.booking_date, selectedBooking.booking_time).time}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Booking Type</p>
                <div className="flex items-center gap-2">
                  {getBookingTypeIcon(selectedBooking.booking_type)}
                  <span className="text-sm text-gray-900">{selectedBooking.booking_type.replace('_', ' ')}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusConfig(selectedBooking.booking_status).color}`}>
                  <span className="mr-1.5">{getStatusConfig(selectedBooking.booking_status).icon}</span>
                  {selectedBooking.booking_status}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Payment Status</p>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusConfig(selectedBooking.payment_status).color}`}>
                    <span className="mr-1.5">{getPaymentStatusConfig(selectedBooking.payment_status).icon}</span>
                    {selectedBooking.payment_status}
                  </span>
                  <span className="text-sm text-gray-900">${selectedBooking.booking_charge}</span>
                </div>
              </div>
            </div>

            {selectedBooking.expert_meeting_link && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Meeting Link</p>
                <a
                  href={selectedBooking.expert_meeting_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                >
                  {selectedBooking.expert_meeting_link}
                </a>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                Close
              </button>
              {selectedBooking.booking_status === 'CONFIRMED' && (
                <button
                  onClick={() => {
                    closeModal();
                    handleComplete(selectedBooking);
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center gap-2"
                >
                  <CheckCircle size={16} />
                  Mark as Completed
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={modalType === 'delete'}
        onClose={closeModal}
        title={modalTitle}
        size={modalSize}
      >
        {selectedBooking && (
          <div className="space-y-6">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-600" />
                <span className="text-sm font-medium text-red-700">
                  Are you sure you want to delete this booking?
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Booking ID</p>
                <p className="text-sm text-gray-900">{selectedBooking.uuid}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Patient</p>
                <p className="text-sm text-gray-900">{selectedBooking.patient_name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Date & Time</p>
                <p className="text-sm text-gray-900">
                  {formatDateTime(selectedBooking.booking_date, selectedBooking.booking_time).date}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDateTime(selectedBooking.booking_date, selectedBooking.booking_time).time}
                </p>
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
                    Delete Booking
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Complete Modal */}
      <Modal
        isOpen={modalType === 'complete'}
        onClose={closeModal}
        title={modalTitle}
        size={modalSize}
      >
        {selectedBooking && (
          <div className="space-y-6">
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">
                  Are you sure you want to mark this booking as completed?
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Booking ID</p>
                <p className="text-sm text-gray-900">{selectedBooking.uuid}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Patient</p>
                <p className="text-sm text-gray-900">{selectedBooking.patient_name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Date & Time</p>
                <p className="text-sm text-gray-900">
                  {formatDateTime(selectedBooking.booking_date, selectedBooking.booking_time).date}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDateTime(selectedBooking.booking_date, selectedBooking.booking_time).time}
                </p>
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
                onClick={handleMarkComplete}
                disabled={isLoading}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Completing...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Mark as Completed
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={modalType === 'edit'}
        onClose={closeModal}
        title={modalTitle}
        size={modalSize}
      >
        {selectedBooking && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="patient_name" className="text-sm font-medium text-gray-700 block mb-1">
                    Patient Name
                  </label>
                  <input
                    id="patient_name"
                    type="text"
                    value={editData?.patient_name ?? selectedBooking.patient_name}
                    onChange={(e) => setEditData(prev => ({ ...prev, patient_name: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter patient name"
                  />
                </div>
                <div>
                  <label htmlFor="patient_email" className="text-sm font-medium text-gray-700 block mb-1">
                    Email
                  </label>
                  <input
                    id="patient_email"
                    type="email"
                    value={editData?.patient_email ?? selectedBooking.patient_email}
                    onChange={(e) => setEditData(prev => ({ ...prev, patient_email: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label htmlFor="patient_mobile" className="text-sm font-medium text-gray-700 block mb-1">
                    Phone
                  </label>
                  <input
                    id="patient_mobile"
                    type="tel"
                    value={editData?.patient_mobile ?? selectedBooking.patient_mobile}
                    onChange={(e) => setEditData(prev => ({ ...prev, patient_mobile: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="patient_address" className="text-sm font-medium text-gray-700 block mb-1">
                    Address
                  </label>
                  <input
                    id="patient_address"
                    type="text"
                    value={editData?.patient_address ?? selectedBooking.patient_address}
                    onChange={(e) => setEditData(prev => ({ ...prev, patient_address: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter address"
                  />
                </div>
                <div>
                  <label htmlFor="doctor" className="text-sm font-medium text-gray-700 block mb-1">
                    Doctor
                  </label>
                  <input
                    id="doctor"
                    type="text"
                    value={editData?.doctor ?? selectedBooking.doctor}
                    onChange={(e) => setEditData(prev => ({ ...prev, doctor: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter doctor name"
                  />
                </div>
                <div>
                  <label htmlFor="amount" className="text-sm font-medium text-gray-700 block mb-1">
                    Amount
                  </label>
                  <input
                    id="amount"
                    type="number"
                    value={editData?.amount ?? selectedBooking.amount}
                    onChange={(e) => setEditData(prev => ({ ...prev, amount: parseFloat(e.target.value) || undefined }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter amount"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="booking_status" className="text-sm font-medium text-gray-700 block mb-1">
                  Booking Status
                </label>
                <select
                  id="booking_status"
                  value={editData?.booking_status ?? selectedBooking.booking_status}
                  onChange={(e) => setEditData(prev => ({ ...prev, booking_status: e.target.value as typeof bookingStatuses[number] }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  {bookingStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="payment_status" className="text-sm font-medium text-gray-700 block mb-1">
                  Payment Status
                </label>
                <select
                  id="payment_status"
                  value={editData?.payment_status ?? selectedBooking.payment_status}
                  onChange={(e) => setEditData(prev => ({ ...prev, payment_status: e.target.value as typeof paymentStatuses[number] }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  {paymentStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}