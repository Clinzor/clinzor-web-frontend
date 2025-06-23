import React, { useState } from 'react';
import { Plus, Eye, Check, X, Clock, Calendar, User, Mail } from 'lucide-react';

const ExpertSlotsTable = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone_number: '',
    gender: 'MALE'
  });

  type Slot = {
    uuid: string;
    expert: string;
    start_time: string;
    end_time: string;
    status: string;
    is_booked: boolean;
  };

  const [slots, setSlots] = useState<Slot[]>([
    {
      uuid: "0ff3f914-53d1-4cbf-8418-5c411f72d33e",
      expert: "Dr. Sarah Johnson",
      start_time: "2025-06-21T18:35:00Z",
      end_time: "2025-06-21T18:50:00Z",
      status: "APPROVED",
      is_booked: false
    },
    {
      uuid: "8b1c563d-2837-4408-8d72-3b43e7192954",
      expert: "Dr. Michael Chen",
      start_time: "2025-06-21T18:34:00Z",
      end_time: "2025-06-21T18:49:00Z",
      status: "APPROVED",
      is_booked: false
    },
    {
      uuid: "4954502e-6ee3-435e-905f-748e9f212549",
      expert: "Dr. Emily Rodriguez",
      start_time: "2025-06-21T18:33:00Z",
      end_time: "2025-06-21T18:48:00Z",
      status: "PENDING",
      is_booked: false
    },
    {
      uuid: "d93cf9dc-ba18-4ce2-b28f-28ac9ad7484e",
      expert: "Dr. James Wilson",
      start_time: "2025-06-21T18:32:00Z",
      end_time: "2025-06-21T18:47:00Z",
      status: "APPROVED",
      is_booked: true
    },
    {
      uuid: "1f1a12fc-cda9-4162-80ac-fd3ae653773e",
      expert: "Dr. Lisa Thompson",
      start_time: "2025-06-21T18:31:00Z",
      end_time: "2025-06-21T18:46:00Z",
      status: "REJECTED",
      is_booked: false
    }
  ]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [showSlotModal, setShowSlotModal] = useState(false);

  const sampleData = {
    current_page: 1,
    total_pages: 5,
    total_items: 45,
    data: slots
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault?.();
    // Handle form submission here
    setShowCreateModal(false);
    setFormData({
      email: '',
      password: '',
      phone_number: '',
      gender: 'MALE'
    });
  };

  // Action handlers
  const handleAction = (action: string, uuid: string) => {
    const slot = slots.find(s => s.uuid === uuid);
    if (!slot) return;
    if (action === 'view') {
      setSelectedSlot(slot);
      setShowSlotModal(true);
    } else if (action === 'approve') {
      setSlots(prev => prev.map(s => s.uuid === uuid ? { ...s, status: 'APPROVED' } : s));
      setSelectedSlot(slot ? { ...slot, status: 'APPROVED' } : null);
    } else if (action === 'reject') {
      setSlots(prev => prev.map(s => s.uuid === uuid ? { ...s, status: 'REJECTED' } : s));
      setSelectedSlot(slot ? { ...slot, status: 'REJECTED' } : null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Expert Slots</h1>
              <p className="text-gray-600 mt-1">Manage expert availability and appointments</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Plus size={20} />
              Create Expert
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Slots</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{sampleData.total_items}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Available</p>
                <p className="text-2xl font-semibold text-green-600 mt-1">
                  {slots.filter(slot => !slot.is_booked && slot.status === 'APPROVED').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Check className="text-green-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Booked</p>
                <p className="text-2xl font-semibold text-orange-600 mt-1">
                  {slots.filter(slot => slot.is_booked).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Clock className="text-orange-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-2xl font-semibold text-yellow-600 mt-1">
                  {slots.filter(slot => slot.status === 'PENDING').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-6 text-sm font-medium text-gray-700">Expert</th>
                  <th className="text-left p-6 text-sm font-medium text-gray-700">Date & Time</th>
                  <th className="text-left p-6 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left p-6 text-sm font-medium text-gray-700">Booking</th>
                  <th className="text-left p-6 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {slots.map((slot) => {
                  const startDateTime = formatDateTime(slot.start_time);
                  const endDateTime = formatDateTime(slot.end_time);
                  return (
                    <tr key={slot.uuid} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="text-blue-600" size={20} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{slot.expert}</p>
                            <p className="text-sm text-gray-500">Medical Expert</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="space-y-1">
                          <p className="font-medium text-gray-900">{startDateTime.date}</p>
                          <p className="text-sm text-gray-500">
                            {startDateTime.time} - {endDateTime.time}
                          </p>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(slot.status)}`}>
                          {slot.status}
                        </span>
                      </td>
                      <td className="p-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          slot.is_booked 
                            ? 'bg-orange-100 text-orange-800 border border-orange-200' 
                            : 'bg-green-100 text-green-800 border border-green-200'
                        }`}>
                          {slot.is_booked ? 'Booked' : 'Available'}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAction('view', slot.uuid)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          >
                            <Eye size={16} />
                          </button>
                          {slot.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleAction('approve', slot.uuid)}
                                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                              >
                                <Check size={16} />
                              </button>
                              <button
                                onClick={() => handleAction('reject', slot.uuid)}
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                              >
                                <X size={16} />
                              </button>
                            </>
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

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Showing page {sampleData.current_page} of {sampleData.total_pages}
          </p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              Previous
            </button>
            <button className="px-4 py-2 text-sm text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Slot Details Modal */}
      {showSlotModal && selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Slot Details</h2>
              <button
                onClick={() => setShowSlotModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{selectedSlot.expert}</p>
                  <p className="text-sm text-gray-500">Medical Expert</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Calendar className="w-4 h-4" />
                <span>{formatDateTime(selectedSlot.start_time).date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Clock className="w-4 h-4" />
                <span>{formatDateTime(selectedSlot.start_time).time} - {formatDateTime(selectedSlot.end_time).time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedSlot.status)}`}>
                  {selectedSlot.status}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  selectedSlot.is_booked 
                    ? 'bg-orange-100 text-orange-800 border border-orange-200' 
                    : 'bg-green-100 text-green-800 border border-green-200'
                }`}>
                  {selectedSlot.is_booked ? 'Booked' : 'Available'}
                </span>
              </div>
              {/* Approve/Reject buttons if pending */}
              {selectedSlot.status === 'PENDING' && (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => handleAction('approve', selectedSlot.uuid)}
                    className="flex-1 px-4 py-3 text-white bg-green-600 rounded-xl hover:bg-green-700 transition-all duration-200"
                  >
                    <Check size={18} className="inline mr-1" /> Approve
                  </button>
                  <button
                    onClick={() => handleAction('reject', selectedSlot.uuid)}
                    className="flex-1 px-4 py-3 text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all duration-200"
                  >
                    <X size={18} className="inline mr-1" /> Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Expert Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Create New Expert</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <form className="p-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="expert@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="1234567890"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all duration-200"
                >
                  Create Expert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertSlotsTable;