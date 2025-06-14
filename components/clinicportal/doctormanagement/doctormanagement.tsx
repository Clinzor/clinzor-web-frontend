"use client";
import React, { useState } from 'react';
import { 
  PlusCircle, 
  X, 
  Save, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Check,
  Edit3,
  Trash2,
  Eye,
  Search,
  Phone,
  Mail,
  Stethoscope,
  Award,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

// Sample doctors data with status
const initialDoctorsData: Doctor[] = [
  {
    uuid: "bf1460af-b799-4022-b1a1-2c13b709413f",
    clinic_service: "a1bc0d8e-544e-4f20-8e2f-dbcfddbabc54",
    created_by: "admin@gmail.com",
    name: "Dr. Sarah Johnson",
    dob: "1985-03-15",
    gender: "FEMALE",
    specializaton: "Nephrologist",
    experience: "8 years",
    phone_number: "1234567890",
    email: "sarah.johnson@clinic.com",
    profile_pic: null,
    status: "APPROVED",
    reason_for_rejection: null
  },
  {
    uuid: "ff4c16b8-f781-4cde-b2fc-3b9e896c81f5",
    clinic_service: "a1bc0d8e-544e-4f20-8e2f-dbcfddbabc54",
    created_by: "admin@gmail.com",
    name: "Dr. Michael Chen",
    dob: "1978-11-22",
    gender: "MALE",
    specializaton: "Cardiologist",
    experience: "12 years",
    phone_number: "2345678901",
    email: "michael.chen@clinic.com",
    profile_pic: null,
    status: "APPROVED",
    reason_for_rejection: null
  },
  {
    uuid: "8f9de2cb-e687-4a99-b0e1-c676e8ccc4f6",
    clinic_service: "a1bc0d8e-544e-4f20-8e2f-dbcfddbabc54",
    created_by: "admin@gmail.com",
    name: "Dr. Emily Rodriguez",
    dob: "1990-07-08",
    gender: "OTHER",
    specializaton: "Gynaecologist",
    experience: "5 years",
    phone_number: "3456789012",
    email: "emily.rodriguez@clinic.com",
    profile_pic: null,
    status: "DRAFT",
    reason_for_rejection: null
  },
  {
    uuid: "6f322c0e-00e4-4b66-b4e9-eec0dd620130",
    clinic_service: "a1bc0d8e-544e-4f20-8e2f-dbcfddbabc54",
    created_by: "clinicuser@gmail.com",
    name: "Dr. James Wilson",
    dob: null,
    gender: "MALE",
    specializaton: "Cardiologist",
    experience: null,
    phone_number: "4567890123",
    email: null,
    profile_pic: null,
    status: "REJECTED",
    reason_for_rejection: "Incomplete documentation"
  }
];

type Doctor = {
  uuid: string;
  clinic_service: string;
  created_by: string;
  name: string;
  dob: string | null;
  gender: "MALE" | "FEMALE" | "OTHER";
  specializaton: string;
  experience: string | null;
  phone_number: string;
  email: string | null;
  profile_pic: string | null;
  status: "APPROVED" | "DRAFT" | "REJECTED";
  reason_for_rejection: string | null;
};

type ClinicService = {
  id: string;
  name: string;
  description: string;
};

// Sample clinic services data
const clinicServices: ClinicService[] = [
  {
    id: "a1bc0d8e-544e-4f20-8e2f-dbcfddbabc54",
    name: "General Medicine",
    description: "Primary healthcare services"
  },
  {
    id: "b2cd1e9f-655f-5g31-9f3g-ece1eeccd65",
    name: "Cardiology",
    description: "Heart and cardiovascular care"
  },
  {
    id: "c3de2f0g-766g-6h42-0h4h-fdf2ffdde76",
    name: "Neurology",
    description: "Brain and nervous system care"
  },
  {
    id: "d4ef3g1h-877h-7i53-1i5i-geg3ggeef87",
    name: "Pediatrics",
    description: "Child healthcare services"
  }
];

type Notification = {
  type: 'success' | 'warning' | 'error';
  message: string;
} | null;

type ModalMode = 'view' | 'edit' | 'add' | null;

export default function DoctorManagement() {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctorsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [notification, setNotification] = useState<Notification>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Filter doctors based on search and status
  const filteredDoctors = doctors.filter(doctor => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = doctor.name.toLowerCase().includes(searchLower) ||
                         doctor.specializaton.toLowerCase().includes(searchLower) ||
                         doctor.phone_number.includes(searchTerm) ||
                         (doctor.email && doctor.email.toLowerCase().includes(searchLower));
    
    const matchesStatus = statusFilter === 'all' || doctor.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDoctors = filteredDoctors.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when search or filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, itemsPerPage]);

  const getStatusConfig = (status: Doctor['status']) => {
    switch (status) {
      case 'APPROVED':
        return {
          color: 'bg-green-100 text-green-700 border-green-200',
          icon: CheckCircle,
          text: 'Approved'
        };
      case 'DRAFT':
        return {
          color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
          icon: Clock,
          text: 'Draft'
        };
      case 'REJECTED':
        return {
          color: 'bg-red-100 text-red-700 border-red-200',
          icon: XCircle,
          text: 'Rejected'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: Clock,
          text: status
        };
    }
  };

  const getGenderColor = (gender: Doctor['gender']) => {
    switch (gender) {
      case 'MALE':
        return 'bg-blue-100 text-blue-700';
      case 'FEMALE':
        return 'bg-pink-100 text-pink-700';
      case 'OTHER':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const showNotification = (type: 'success' | 'warning' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleViewDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setModalMode('view');
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setEditingDoctor({ ...doctor });
    setModalMode('edit');
  };

  const handleAddDoctor = () => {
    const newDoctor: Doctor = {
      uuid: `temp-${Date.now()}`,
      clinic_service: clinicServices[0].id, // Default to first clinic service
      created_by: "current@user.com",
      name: '',
      dob: null,
      gender: "FEMALE",
      specializaton: '',
      experience: null,
      phone_number: '',
      email: null,
      profile_pic: null,
      status: "DRAFT",
      reason_for_rejection: null
    };
    
    setEditingDoctor(newDoctor);
    setModalMode('add');
  };

  const handleDeleteDoctor = (uuid: string) => {
    if (window.confirm('Are you sure you want to delete this doctor? This action cannot be undone.')) {
      setDoctors(doctors.filter(doctor => doctor.uuid !== uuid));
      showNotification('success', 'Doctor deleted successfully.');
    }
  };

  const handleSaveDoctor = async () => {
    if (!editingDoctor) return;
    
    // Validation - only required fields
    if (!editingDoctor.name.trim()) {
      showNotification('error', 'Doctor name is required.');
      return;
    }
    
    if (!editingDoctor.specializaton.trim()) {
      showNotification('error', 'Specialization is required.');
      return;
    }

    if (!editingDoctor.phone_number.trim()) {
      showNotification('error', 'Phone number is required.');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      let updatedDoctors;
      
      if (modalMode === 'add') {
        const newDoctor = {
          ...editingDoctor,
          uuid: `doctor-${Date.now()}`,
          status: "DRAFT" as const // New doctors start as DRAFT
        };
        updatedDoctors = [...doctors, newDoctor];
        showNotification('success', 'Doctor created successfully.');
      } else {
        updatedDoctors = doctors.map(doctor =>
          doctor.uuid === editingDoctor.uuid
            ? { ...editingDoctor }
            : doctor
        );
        showNotification('success', 'Doctor updated successfully.');
      }
      
      setDoctors(updatedDoctors);
      handleCloseModal();
    } catch (error) {
      showNotification('error', 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setSelectedDoctor(null);
    setEditingDoctor(null);
  };

  // Optimized Doctor Card Component
  const DoctorCard = ({ doctor }: { doctor: Doctor }) => {
    const statusConfig = getStatusConfig(doctor.status);
    const StatusIcon = statusConfig.icon;

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
        {/* Header with status */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 text-sm truncate">{doctor.name}</h3>
            <p className="text-xs text-gray-500 flex items-center mt-1 truncate">
              <Stethoscope size={10} className="mr-1 flex-shrink-0" />
              {doctor.specializaton}
            </p>
          </div>
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
            <StatusIcon size={10} className="mr-1" />
            {statusConfig.text}
          </div>
        </div>
        
        {/* Essential Info */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-600">
              <Phone size={10} className="mr-1" />
              {doctor.phone_number}
            </div>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getGenderColor(doctor.gender)}`}>
              {doctor.gender}
            </span>
          </div>
          
          {doctor.email && (
            <div className="flex items-center text-xs text-gray-600 truncate">
              <Mail size={10} className="mr-1 flex-shrink-0" />
              <span className="truncate">{doctor.email}</span>
            </div>
          )}
          
          {doctor.experience && (
            <div className="flex items-center text-xs text-gray-600">
              <Award size={10} className="mr-1" />
              {doctor.experience}
            </div>
          )}
        </div>
        
        {/* Rejection reason if applicable */}
        {doctor.status === 'REJECTED' && doctor.reason_for_rejection && (
          <div className="text-xs text-red-600 bg-red-50 p-2 rounded mb-3 truncate">
            <AlertTriangle size={10} className="inline mr-1" />
            {doctor.reason_for_rejection}
          </div>
        )}
        
        {/* Actions */}
        <div className="flex justify-end gap-1">
          <button
            onClick={() => handleViewDoctor(doctor)}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={() => handleEditDoctor(doctor)}
            className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Edit Doctor"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={() => handleDeleteDoctor(doctor.uuid)}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Doctor"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    );
  };

  // Optimized Modal Component
  const Modal = () => {
    if (!modalMode) return null;

    const isViewMode = modalMode === 'view';
    const isEditMode = modalMode === 'edit';
    const isAddMode = modalMode === 'add';
    
    const currentDoctor = isViewMode ? selectedDoctor : editingDoctor;
    if (!currentDoctor) return null;

    const statusConfig = getStatusConfig(currentDoctor.status);
    const StatusIcon = statusConfig.icon;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {isViewMode && 'Doctor Details'}
              {isEditMode && 'Edit Doctor'}
              {isAddMode && 'Add New Doctor'}
            </h2>
            <button
              onClick={handleCloseModal}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Modal Content */}
          <div className="p-6 space-y-6">
            {isViewMode ? (
              // View Mode - Only show essential info
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{currentDoctor.name}</h3>
                    <p className="text-gray-600 flex items-center mt-1">
                      <Stethoscope size={16} className="mr-2" />
                      {currentDoctor.specializaton}
                    </p>
                  </div>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.color}`}>
                    <StatusIcon size={14} className="mr-2" />
                    {statusConfig.text}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <p className="text-gray-900 flex items-center">
                      <Phone size={14} className="mr-2" />
                      {currentDoctor.phone_number}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getGenderColor(currentDoctor.gender)}`}>
                      {currentDoctor.gender}
                    </span>
                  </div>
                </div>
                
                {currentDoctor.email && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900 flex items-center">
                      <Mail size={14} className="mr-2" />
                      {currentDoctor.email}
                    </p>
                  </div>
                )}
                
                {currentDoctor.experience && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                    <p className="text-gray-900 flex items-center">
                      <Award size={14} className="mr-2" />
                      {currentDoctor.experience}
                    </p>
                  </div>
                )}
                
                {currentDoctor.status === 'REJECTED' && currentDoctor.reason_for_rejection && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Reason</label>
                    <p className="text-red-600 bg-red-50 p-3 rounded-lg flex items-start">
                      <AlertTriangle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                      {currentDoctor.reason_for_rejection}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              // Edit/Add Mode - Only essential fields
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Doctor Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={currentDoctor.name}
                      onChange={(e) => setEditingDoctor({ ...currentDoctor, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter doctor name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Clinic Service <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={currentDoctor.clinic_service}
                      onChange={(e) => setEditingDoctor({ ...currentDoctor, clinic_service: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {clinicServices.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specialization <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={currentDoctor.specializaton}
                      onChange={(e) => setEditingDoctor({ ...currentDoctor, specializaton: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter specialization"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={currentDoctor.phone_number}
                      onChange={(e) => setEditingDoctor({ ...currentDoctor, phone_number: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      value={currentDoctor.gender}
                      onChange={(e) => setEditingDoctor({ ...currentDoctor, gender: e.target.value as Doctor['gender'] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={currentDoctor.email || ''}
                      onChange={(e) => setEditingDoctor({ ...currentDoctor, email: e.target.value || null })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                    <input
                      type="text"
                      value={currentDoctor.experience || ''}
                      onChange={(e) => setEditingDoctor({ ...currentDoctor, experience: e.target.value || null })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 5 years"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Modal Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {isViewMode ? 'Close' : 'Cancel'}
            </button>
            
            {!isViewMode && (
              <button
                onClick={handleSaveDoctor}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {isAddMode ? 'Create Doctor' : 'Update Doctor'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Doctor Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              {filteredDoctors.length} doctors found
            </p>
          </div>
          <button
            onClick={handleAddDoctor}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto"
          >
            <PlusCircle size={16} />
            <span>Add Doctor</span>
          </button>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`mx-4 sm:mx-6 mt-4 p-3 rounded-lg flex justify-between items-center ${
          notification.type === 'success' ? 'bg-green-50 border border-green-200' : 
          notification.type === 'error' ? 'bg-red-50 border border-red-200' :
          'bg-amber-50 border border-amber-200'
        }`}>
          <div className="flex items-center text-sm font-medium">
            {notification.type === 'success' ? (
              <Check size={16} className="text-green-500 mr-2" />
            ) : notification.type === 'error' ? (
              <X size={16} className="text-red-500 mr-2" />
            ) : (
              <AlertTriangle size={16} className="text-amber-500 mr-2" />
            )}
            <span className={
              notification.type === 'success' ? 'text-green-700' : 
              notification.type === 'error' ? 'text-red-700' :
              'text-amber-700'
            }>
              {notification.message}
            </span>
          </div>
          <button 
            onClick={() => setNotification(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white mx-4 sm:mx-6 mt-4 p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, specialization, phone, or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          
          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="APPROVED">Approved</option>
              <option value="DRAFT">Draft</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          
          {/* Items Per Page */}
          <div>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={6}>6 per page</option>
              <option value={12}>12 per page</option>
              <option value={24}>24 per page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Doctor Cards */}
      <div className="flex-1 px-4 sm:px-6 py-6">
        {paginatedDoctors.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Stethoscope size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedDoctors.map((doctor) => (
              <DoctorCard key={doctor.uuid} doctor={doctor} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white border-t border-gray-200 px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredDoctors.length)} of {filteredDoctors.length} doctors
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal />
    </div>
  );
}