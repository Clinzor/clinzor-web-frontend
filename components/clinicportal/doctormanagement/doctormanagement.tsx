"use client";
import React, { useState } from 'react';
import { 
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
  User,
  Calendar,
  FileText,
  Phone,
  Mail,
  Stethoscope,
  UserCheck,
  Award
} from 'lucide-react';

// Sample doctors data
const initialDoctorsData: Doctor[] = [
  {
    uuid: "ff4c16b8-f781-4cde-b2fc-3b9e896c81f5",
    clinic_service: "a1bc0d8e-544e-4f20-8e2f-dbcfddbabc54",
    created_by: "admin@gmail.com",
    name: "Dr. Sarah Johnson",
    dob: "1985-03-15",
    gender: "FEMALE",
    specializaton: "Cardiologist",
    experience: "8 years",
    phone_number: "1234567890",
    email: "sarah.johnson@clinic.com",
    profile_pic: null
  },
  {
    uuid: "a2cd3e4f-g5h6-7i8j-k9l0-m1n2o3p4q5r6",
    clinic_service: "b2cd1e9f-655f-5g31-9f3g-ebdcfeedcbcd",
    created_by: "admin@gmail.com",
    name: "Dr. Michael Chen",
    dob: "1978-11-22",
    gender: "MALE",
    specializaton: "Dermatologist",
    experience: "12 years",
    phone_number: "2345678901",
    email: "michael.chen@clinic.com",
    profile_pic: null
  },
  {
    uuid: "b3de4f5g-h6i7-8j9k-l0m1-n2o3p4q5r6s7",
    clinic_service: "c3de2f0g-766g-6h42-0g4h-fcedffeecded",
    created_by: "doctor@clinic.com",
    name: "Dr. Emily Rodriguez",
    dob: "1990-07-08",
    gender: "FEMALE",
    specializaton: "Pediatrician",
    experience: "5 years",
    phone_number: "3456789012",
    email: "emily.rodriguez@clinic.com",
    profile_pic: null
  },
  {
    uuid: "c4ef5g6h-i7j8-9k0l-m1n2-o3p4q5r6s7t8",
    clinic_service: "d4ef3g1h-877h-7i53-1h5i-gdfegggfdeef",
    created_by: "admin@gmail.com",
    name: "Dr. James Wilson",
    dob: "1982-01-30",
    gender: "MALE",
    specializaton: "Orthopedic Surgeon",
    experience: "10 years",
    phone_number: "4567890123",
    email: "james.wilson@clinic.com",
    profile_pic: null
  },
  {
    uuid: "d5fg6h7i-j8k9-0l1m-n2o3-p4q5r6s7t8u9",
    clinic_service: "e5fg4h2i-988i-8j64-2i6j-hegfhhhgeffg",
    created_by: "specialist@health.com",
    name: "Dr. Lisa Thompson",
    dob: "1987-09-12",
    gender: "FEMALE",
    specializaton: "Neurologist",
    experience: "7 years",
    phone_number: "5678901234",
    email: "lisa.thompson@clinic.com",
    profile_pic: null
  },
  {
    uuid: "e6gh7i8j-k9l0-1m2n-o3p4-q5r6s7t8u9v0",
    clinic_service: "f6gh5i3j-099j-9k75-3j7k-ifhgiiihhggh",
    created_by: "admin@gmail.com",
    name: "Dr. Robert Davis",
    dob: "1975-12-05",
    gender: "MALE",
    specializaton: "Psychiatrist",
    experience: "15 years",
    phone_number: "6789012345",
    email: "robert.davis@clinic.com",
    profile_pic: null
  }
];

type Doctor = {
  uuid: string;
  clinic_service: string;
  created_by: string;
  name: string;
  dob: string | null;
  gender: "MALE" | "FEMALE";
  specializaton: string;
  experience: string | null;
  phone_number: string;
  email: string | null;
  profile_pic: string | null;
};

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
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if we're in mobile view
  React.useEffect(() => {
    const checkViewport = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Filter doctors based on search
  const filteredDoctors = doctors.filter(doctor => {
    const searchLower = searchTerm.toLowerCase();
    return doctor.name.toLowerCase().includes(searchLower) ||
           doctor.specializaton.toLowerCase().includes(searchLower) ||
           doctor.gender.toLowerCase().includes(searchLower) ||
           doctor.created_by.toLowerCase().includes(searchLower) ||
           (doctor.email && doctor.email.toLowerCase().includes(searchLower)) ||
           doctor.phone_number.includes(searchTerm);
  });

  // Pagination
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDoctors = filteredDoctors.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateAge = (dob: string | null) => {
    if (!dob) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
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
      clinic_service: '',
      created_by: "current@user.com", // This would come from auth context
      name: '',
      dob: null,
      gender: "MALE",
      specializaton: '',
      experience: null,
      phone_number: '',
      email: null,
      profile_pic: null
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
    
    // Validation
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
          uuid: `doctor-${Date.now()}`, // In real app, this comes from backend
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

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = isMobileView ? 3 : 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(1, currentPage - halfVisible);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  // Mobile Card Component
  const MobileDoctorCard = ({ doctor }: { doctor: Doctor }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 text-sm">{doctor.name}</h3>
          <p className="text-xs text-gray-500 flex items-center mt-1">
            <Stethoscope size={10} className="mr-1" />
            {doctor.specializaton}
          </p>
        </div>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          doctor.gender === 'MALE' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
        }`}>
          {doctor.gender}
        </span>
      </div>
      
      <div className="space-y-2 mb-3">
        <div className="flex items-center text-xs text-gray-600">
          <Phone size={10} className="mr-2" />
          {doctor.phone_number}
        </div>
        {doctor.email && (
          <div className="flex items-center text-xs text-gray-600">
            <Mail size={10} className="mr-2" />
            {doctor.email}
          </div>
        )}
        {doctor.experience && (
          <div className="flex items-center text-xs text-gray-600">
            <Award size={10} className="mr-2" />
            {doctor.experience} experience
          </div>
        )}
      </div>
      
      <div className="text-xs text-gray-500 mb-3">
        <div className="flex items-center">
          <User size={10} className="mr-1" />
          Created by: {doctor.created_by}
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
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

  // Modal Component
  const Modal = () => {
    if (!modalMode) return null;

    const isViewMode = modalMode === 'view';
    const isEditMode = modalMode === 'edit';
    const isAddMode = modalMode === 'add';
    
    const currentDoctor = isViewMode ? selectedDoctor : editingDoctor;
    if (!currentDoctor) return null;

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
              // View Mode
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
                    <p className="text-gray-900">{currentDoctor.name}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                    <p className="text-gray-900 flex items-center">
                      <Stethoscope size={14} className="mr-2" />
                      {currentDoctor.specializaton}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      currentDoctor.gender === 'MALE' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                    }`}>
                      {currentDoctor.gender}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <p className="text-gray-700">{formatDate(currentDoctor.dob)}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <p className="text-gray-700">{calculateAge(currentDoctor.dob)} years</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <p className="text-gray-700 flex items-center">
                      <Phone size={14} className="mr-2" />
                      {currentDoctor.phone_number}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-700 flex items-center">
                      <Mail size={14} className="mr-2" />
                      {currentDoctor.email || 'Not provided'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                  <p className="text-gray-700 flex items-center">
                    <Award size={14} className="mr-2" />
                    {currentDoctor.experience || 'Not specified'}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Created By</label>
                    <p className="text-gray-700 flex items-center">
                      <User size={14} className="mr-2" />
                      {currentDoctor.created_by}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Doctor ID</label>
                    <p className="text-gray-700 font-mono text-sm">{currentDoctor.uuid}</p>
                  </div>
                </div>
              </div>
            ) : (
              // Edit/Add Mode
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
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      value={currentDoctor.gender}
                      onChange={(e) => setEditingDoctor({ ...currentDoctor, gender: e.target.value as "MALE" | "FEMALE" })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={currentDoctor.dob || ''}
                      onChange={(e) => setEditingDoctor({ ...currentDoctor, dob: e.target.value || null })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                  <input
                    type="text"
                    value={currentDoctor.experience || ''}
                    onChange={(e) => setEditingDoctor({ ...currentDoctor, experience: e.target.value || null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 5 years, 10+ years"
                  />
                </div>
                
                {isEditMode && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Doctor ID</label>
                      <p className="text-gray-700 font-mono text-sm">{currentDoctor.uuid}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Created By</label>
                      <p className="text-gray-700">{currentDoctor.created_by}</p>
                    </div>
                  </div>
                )}
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
              Manage your clinic's doctors and their information
            </p>
          </div>
          <button
            onClick={handleAddDoctor}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto"
          >
            <PlusCircle size={16} />
            <span>Add New Doctor</span>
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
              placeholder="Search doctors by name, specialization, email, phone..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          {/* Items Per Page */}
          <div>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={15}>15 per page</option>
              <option value={20}>20 per page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Doctor Cards / Table */}
      <div className="flex-1 px-4 sm:px-6 py-6 space-y-4">
        {paginatedDoctors.length === 0 ? (
          <div className="text-center text-sm text-gray-500">No doctors found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {paginatedDoctors.map((doctor) => (
              <MobileDoctorCard key={doctor.uuid} doctor={doctor} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pb-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
          >
            <ChevronLeft size={16} />
          </button>

          {generatePageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-2 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Modal */}
      {Modal()}
    </div>
  );
}
