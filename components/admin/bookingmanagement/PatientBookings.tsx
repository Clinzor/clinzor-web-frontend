import React, { useState, useMemo } from 'react';
import { Search, Calendar, Filter, ChevronLeft, ChevronRight, Clock, User, CreditCard, Video, MapPin, MoreHorizontal, Phone, Mail, ChevronDown, Bell, Settings } from 'lucide-react';

type Booking = {
  uuid: string;
  created_by: string;
  booking_type: 'VIDEO_CALL' | 'PHYSICAL_VISIT';
  booking_status: 'PENDING' | 'SCHEDULED' | 'COMPLETED';
  start_time: string;
  end_time: string;
  payment_status: 'PENDING' | 'COMPLETED';
  session_type: string;
  patient_name: string;
  patient_mobile: string;
  patient_email: string;
  booking_charge: string;
};

const BookingDashboard = () => {
  // Sample data from the JSON
  const sampleBookings: Booking[] = [
    {
      uuid: "1d56bfba-4407-41e5-b067-e55439db9607",
      created_by: "fake@exampl.com",
      booking_type: "VIDEO_CALL",
      booking_status: "PENDING",
      start_time: "2025-05-31T16:31:00Z",
      end_time: "2025-05-31T18:00:00Z",
      payment_status: "PENDING",
      session_type: "CONSULTATION",
      patient_name: "patient 1",
      patient_mobile: "1234567890",
      patient_email: "patient@email.com",
      booking_charge: "160.00"
    },
    {
      uuid: "d9a5c17d-277d-4fa9-88dd-285a588834a6",
      created_by: "fake@exampl.com",
      booking_type: "VIDEO_CALL",
      booking_status: "SCHEDULED",
      start_time: "2025-06-10T17:31:00Z",
      end_time: "2025-06-10T19:00:00Z",
      payment_status: "COMPLETED",
      session_type: "SESSION",
      patient_name: "patient 2",
      patient_mobile: "1234567891",
      patient_email: "patient2@email.com",
      booking_charge: "200.00"
    },
    {
      uuid: "0860745e-125b-408c-b614-9f47df7fa868",
      created_by: "fake@exampl.com",
      booking_type: "PHYSICAL_VISIT",
      booking_status: "COMPLETED",
      start_time: "2025-06-11T20:19:00Z",
      end_time: "2025-06-11T21:21:00Z",
      payment_status: "COMPLETED",
      session_type: "CONSULTATION",
      patient_name: "patient 3",
      patient_mobile: "1234567892",
      patient_email: "patient3@email.com",
      booking_charge: "200.00"
    },
    {
      uuid: "fd336206-9759-4b15-a756-c1f643aa0d77",
      created_by: "fake@exampl.com",
      booking_type: "VIDEO_CALL",
      booking_status: "SCHEDULED",
      start_time: "2025-06-18T16:50:00Z",
      end_time: "2025-06-18T17:21:00Z",
      payment_status: "COMPLETED",
      session_type: "CONSULTATION",
      patient_name: "patient 4",
      patient_mobile: "1234567893",
      patient_email: "patient4@email.com",
      booking_charge: "400.00"
    },
    {
      uuid: "fb7f80c1-30bd-41a4-8393-a693f37fe43c",
      created_by: "fake@exampl.com",
      booking_type: "VIDEO_CALL",
      booking_status: "PENDING",
      start_time: "2025-06-13T20:50:00Z",
      end_time: "2025-06-13T21:21:00Z",
      payment_status: "PENDING",
      session_type: "CONSULTATION",
      patient_name: "patient 5",
      patient_mobile: "1234567894",
      patient_email: "patient5@email.com",
      booking_charge: "400.00"
    },
    // Additional bookings for pagination
    {
      uuid: "a1d56bfba-4407-41e5-b067-e55439db9601",
      created_by: "fake@exampl.com",
      booking_type: "PHYSICAL_VISIT",
      booking_status: "COMPLETED",
      start_time: "2025-07-01T10:00:00Z",
      end_time: "2025-07-01T11:00:00Z",
      payment_status: "COMPLETED",
      session_type: "SESSION",
      patient_name: "patient 6",
      patient_mobile: "1234567895",
      patient_email: "patient6@email.com",
      booking_charge: "250.00"
    },
    {
      uuid: "b2d56bfba-4407-41e5-b067-e55439db9602",
      created_by: "fake@exampl.com",
      booking_type: "VIDEO_CALL",
      booking_status: "SCHEDULED",
      start_time: "2025-07-02T12:00:00Z",
      end_time: "2025-07-02T13:00:00Z",
      payment_status: "PENDING",
      session_type: "CONSULTATION",
      patient_name: "patient 7",
      patient_mobile: "1234567896",
      patient_email: "patient7@email.com",
      booking_charge: "180.00"
    },
    {
      uuid: "c3d56bfba-4407-41e5-b067-e55439db9603",
      created_by: "fake@exampl.com",
      booking_type: "PHYSICAL_VISIT",
      booking_status: "PENDING",
      start_time: "2025-07-03T14:00:00Z",
      end_time: "2025-07-03T15:00:00Z",
      payment_status: "PENDING",
      session_type: "SESSION",
      patient_name: "patient 8",
      patient_mobile: "1234567897",
      patient_email: "patient8@email.com",
      booking_charge: "220.00"
    },
    {
      uuid: "d4d56bfba-4407-41e5-b067-e55439db9604",
      created_by: "fake@exampl.com",
      booking_type: "VIDEO_CALL",
      booking_status: "COMPLETED",
      start_time: "2025-07-04T16:00:00Z",
      end_time: "2025-07-04T17:00:00Z",
      payment_status: "COMPLETED",
      session_type: "CONSULTATION",
      patient_name: "patient 9",
      patient_mobile: "1234567898",
      patient_email: "patient9@email.com",
      booking_charge: "300.00"
    },
    {
      uuid: "e5d56bfba-4407-41e5-b067-e55439db9605",
      created_by: "fake@exampl.com",
      booking_type: "PHYSICAL_VISIT",
      booking_status: "SCHEDULED",
      start_time: "2025-07-05T18:00:00Z",
      end_time: "2025-07-05T19:00:00Z",
      payment_status: "PENDING",
      session_type: "SESSION",
      patient_name: "patient 10",
      patient_mobile: "1234567899",
      patient_email: "patient10@email.com",
      booking_charge: "210.00"
    },
    {
      uuid: "f6d56bfba-4407-41e5-b067-e55439db9606",
      created_by: "fake@exampl.com",
      booking_type: "VIDEO_CALL",
      booking_status: "PENDING",
      start_time: "2025-07-06T20:00:00Z",
      end_time: "2025-07-06T21:00:00Z",
      payment_status: "PENDING",
      session_type: "CONSULTATION",
      patient_name: "patient 11",
      patient_mobile: "1234567800",
      patient_email: "patient11@email.com",
      booking_charge: "260.00"
    },
    {
      uuid: "g7d56bfba-4407-41e5-b067-e55439db9607",
      created_by: "fake@exampl.com",
      booking_type: "PHYSICAL_VISIT",
      booking_status: "COMPLETED",
      start_time: "2025-07-07T22:00:00Z",
      end_time: "2025-07-07T23:00:00Z",
      payment_status: "COMPLETED",
      session_type: "SESSION",
      patient_name: "patient 12",
      patient_mobile: "1234567801",
      patient_email: "patient12@email.com",
      booking_charge: "270.00"
    },
    {
      uuid: "h8d56bfba-4407-41e5-b067-e55439db9608",
      created_by: "fake@exampl.com",
      booking_type: "VIDEO_CALL",
      booking_status: "SCHEDULED",
      start_time: "2025-07-08T08:00:00Z",
      end_time: "2025-07-08T09:00:00Z",
      payment_status: "COMPLETED",
      session_type: "CONSULTATION",
      patient_name: "patient 13",
      patient_mobile: "1234567802",
      patient_email: "patient13@email.com",
      booking_charge: "280.00"
    },
    {
      uuid: "i9d56bfba-4407-41e5-b067-e55439db9609",
      created_by: "fake@exampl.com",
      booking_type: "PHYSICAL_VISIT",
      booking_status: "PENDING",
      start_time: "2025-07-09T10:00:00Z",
      end_time: "2025-07-09T11:00:00Z",
      payment_status: "PENDING",
      session_type: "SESSION",
      patient_name: "patient 14",
      patient_mobile: "1234567803",
      patient_email: "patient14@email.com",
      booking_charge: "290.00"
    },
    {
      uuid: "j0d56bfba-4407-41e5-b067-e55439db9610",
      created_by: "fake@exampl.com",
      booking_type: "VIDEO_CALL",
      booking_status: "COMPLETED",
      start_time: "2025-07-10T12:00:00Z",
      end_time: "2025-07-10T13:00:00Z",
      payment_status: "COMPLETED",
      session_type: "CONSULTATION",
      patient_name: "patient 15",
      patient_mobile: "1234567804",
      patient_email: "patient15@email.com",
      booking_charge: "300.00"
    }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('card'); // card or list
  const [selectedBookings, setSelectedBookings] = useState<Set<string>>(new Set());
  const pageSize = 5;

  // Filter and search logic
  const filteredBookings = useMemo(() => {
    return sampleBookings.filter(booking => {
      const matchesSearch = 
        booking.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.patient_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.created_by.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || booking.booking_status === statusFilter;
      
      const bookingDate = new Date(booking.start_time);
      const matchesFromDate = !fromDate || bookingDate >= new Date(fromDate);
      const matchesToDate = !toDate || bookingDate <= new Date(toDate);
      
      return matchesSearch && matchesStatus && matchesFromDate && matchesToDate;
    });
  }, [searchTerm, statusFilter, fromDate, toDate]);

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / pageSize);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: Booking['booking_status']) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'SCHEDULED': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const getPaymentStatusColor = (status: Booking['payment_status']) => {
    switch (status) {
      case 'COMPLETED': return 'text-emerald-600';
      case 'PENDING': return 'text-amber-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusDot = (status: Booking['booking_status']) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-500';
      case 'SCHEDULED': return 'bg-blue-500';
      case 'PENDING': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  const toggleBookingSelection = (uuid: string) => {
    const newSelected = new Set(selectedBookings);
    if (newSelected.has(uuid)) {
      newSelected.delete(uuid);
    } else {
      newSelected.add(uuid);
    }
    setSelectedBookings(newSelected);
  };

  const BookingCard = ({ booking, isSelected, onToggleSelect }: { booking: Booking; isSelected: boolean; onToggleSelect: (uuid: string) => void }) => (
    <div className={`group relative bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-100/50 hover:border-gray-200/80 hover:shadow-xl hover:shadow-gray-100/20 transition-all duration-300 ${isSelected ? 'ring-2 ring-blue-500/20 border-blue-200/50' : ''}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-4 sm:gap-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onToggleSelect(booking.uuid)}
              className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                isSelected 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {isSelected && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center group-hover:from-blue-100 group-hover:to-indigo-200 transition-all duration-300">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{booking.patient_name}</h3>
                <p className="text-gray-600 text-sm">{booking.session_type}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${getStatusColor(booking.booking_status)}`}>
              <div className={`w-2 h-2 rounded-full ${getStatusDot(booking.booking_status)}`}></div>
              <span className="text-sm font-medium">{booking.booking_status}</span>
            </div>
            <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-100 rounded-xl transition-all duration-200">
              <MoreHorizontal className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center">
                <Mail className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Email</p>
                <p className="text-gray-900 font-medium">{booking.patient_email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center">
                <Phone className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Phone</p>
                <p className="text-gray-900 font-medium">{booking.patient_mobile}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center">
                <Clock className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Appointment</p>
                <p className="text-gray-900 font-medium">{formatDate(booking.start_time)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center">
                {booking.booking_type === 'VIDEO_CALL' ? (
                  <Video className="w-4 h-4 text-blue-600" />
                ) : (
                  <MapPin className="w-4 h-4 text-emerald-600" />
                )}
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Type</p>
                <p className="text-gray-900 font-medium">
                  {booking.booking_type === 'VIDEO_CALL' ? 'Video Consultation' : 'In-Person Visit'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Payment</p>
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 font-semibold text-lg">${booking.booking_charge}</span>
                  <span className={`text-sm ${getPaymentStatusColor(booking.payment_status)}`}>
                    {booking.payment_status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Enhanced Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-blue-600/5"></div>
        <div className="relative bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      Booking Management
                    </h1>
                    </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-2xl">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">
                    {filteredBookings.length} of 24 bookings
                  </span>
                </div>
                <button className="p-3 hover:bg-gray-50 rounded-2xl transition-colors duration-200">
                  <Bell className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-3 hover:bg-gray-50 rounded-2xl transition-colors duration-200">
                  <Settings className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-8">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-gray-100/50 p-4 sm:p-6 md:p-8 mb-8 shadow-xl shadow-gray-100/20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Enhanced Search */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors duration-200" />
                <input
                  type="text"
                  placeholder="Search patients, emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 focus:bg-white transition-all duration-200 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Enhanced Status Filter */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-emerald-500 transition-colors duration-200" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 focus:bg-white transition-all duration-200 appearance-none cursor-pointer"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="COMPLETED">Completed</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            {/* Enhanced Date Inputs */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors duration-200" />
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-300 focus:bg-white transition-all duration-200"
                  placeholder="From date"
                />
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-red-500/10 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-pink-500 transition-colors duration-200" />
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-300 focus:bg-white transition-all duration-200"
                  placeholder="To date"
                />
              </div>
            </div>
          </div>

          {/* Selection Actions */}
          {selectedBookings.size > 0 && (
            <div className="mt-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex items-center justify-between">
              <span className="text-blue-700 font-medium">
                {selectedBookings.size} booking{selectedBookings.size !== 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 text-blue-700 hover:bg-blue-100/50 rounded-xl transition-colors duration-200 font-medium">
                  Export
                </button>
                <button className="px-4 py-2 text-red-700 hover:bg-red-100/50 rounded-xl transition-colors duration-200 font-medium">
                  Cancel Selected
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Bookings List */}
        <div className="space-y-6">
          {paginatedBookings.map((booking) => (
            <BookingCard
              key={booking.uuid}
              booking={booking}
              isSelected={selectedBookings.has(booking.uuid)}
              onToggleSelect={toggleBookingSelection}
            />
          ))}
        </div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-12 px-2 sm:px-6 gap-4">
            <div className="text-gray-600 font-medium">
              Showing {((currentPage - 1) * pageSize) + 1}–{Math.min(currentPage * pageSize, filteredBookings.length)} of {filteredBookings.length} results
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-3 rounded-2xl border border-gray-200/50 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white hover:shadow-lg transition-all duration-200 bg-white/50 backdrop-blur-sm"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-3 rounded-2xl font-semibold transition-all duration-200 ${
                      page === currentPage
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                        : 'text-gray-700 hover:bg-white hover:shadow-lg bg-white/50 backdrop-blur-sm border border-gray-200/50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-3 rounded-2xl border border-gray-200/50 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white hover:shadow-lg transition-all duration-200 bg-white/50 backdrop-blur-sm"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDashboard;