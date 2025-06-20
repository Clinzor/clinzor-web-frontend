import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  XCircle,
  Calendar,
  User,
  Building
} from 'lucide-react';

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

type Notification = {
  type: 'success' | 'warning' | 'error';
  message: string;
} | null;

type ModalMode = 'view' | 'edit' | 'add' | 'delete' | null;

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

export default function DoctorManagement() {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctorsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [formState, setFormState] = useState<Partial<Doctor>>({});
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [notification, setNotification] = useState<Notification>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Memoized filtered doctors to prevent unnecessary recalculations
  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = doctor.name.toLowerCase().includes(searchLower) ||
                           doctor.specializaton.toLowerCase().includes(searchLower) ||
                           doctor.phone_number.includes(searchTerm) ||
                           (doctor.email && doctor.email.toLowerCase().includes(searchLower));
      
      const matchesStatus = statusFilter === 'all' || doctor.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [doctors, searchTerm, statusFilter]);

  // Memoized pagination
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedDoctors = filteredDoctors.slice(startIndex, startIndex + itemsPerPage);
    
    return { totalPages, paginatedDoctors };
  }, [filteredDoctors, currentPage, itemsPerPage]);

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, itemsPerPage]);

  const getStatusConfig = useCallback((status: Doctor['status']) => {
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
  }, []);

  const getGenderColor = useCallback((gender: Doctor['gender']) => {
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
  }, []);

  const getClinicServiceName = useCallback((serviceId: string) => {
    const service = clinicServices.find(s => s.id === serviceId);
    return service ? service.name : 'Unknown Service';
  }, []);

  const showNotification = useCallback((type: 'success' | 'warning' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  }, []);

  const handleViewDoctor = useCallback((doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setModalMode('view');
  }, []);

  const handleEditDoctor = useCallback((doctor: Doctor) => {
    setFormState({ ...doctor });
    setIsFormDirty(false);
    setModalMode('edit');
  }, []);

  const handleAddDoctor = useCallback(() => {
    setFormState({
      uuid: `temp-${Date.now()}`,
      clinic_service: clinicServices[0].id,
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
    });
    setIsFormDirty(false);
    setModalMode('add');
  }, []);

  const handleDeleteDoctor = useCallback((doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setModalMode('delete');
  }, []);

  const confirmDeleteDoctor = async () => {
    if (!selectedDoctor) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDoctors(doctors.filter(doctor => doctor.uuid !== selectedDoctor.uuid));
      showNotification('success', 'Doctor deleted successfully.');
      handleCloseModal();
    } catch (error) {
      showNotification('error', 'Failed to delete doctor. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateDoctor = useCallback((doctor: Doctor) => {
    const errors: string[] = [];
    
    if (!doctor.name.trim()) errors.push('Doctor name is required');
    if (!doctor.specializaton.trim()) errors.push('Specialization is required');
    if (!doctor.phone_number.trim()) errors.push('Phone number is required');
    if (doctor.phone_number && !/^\d{10}$/.test(doctor.phone_number.replace(/\D/g, ''))) {
      errors.push('Phone number must be 10 digits');
    }
    if (doctor.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(doctor.email)) {
      errors.push('Please enter a valid email address');
    }
    
    return errors;
  }, []);

  const handleSaveDoctor = async () => {
    if (!formState) return;
    
    const errors = validateDoctor(formState as Doctor);
    if (errors.length > 0) {
      showNotification('error', errors[0]);
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let updatedDoctors;
      
      if (modalMode === 'add') {
        const newDoctor = {
          ...formState,
          uuid: `doctor-${Date.now()}`,
          status: "DRAFT" as const
        } as Doctor;
        updatedDoctors = [...doctors, newDoctor];
        showNotification('success', 'Doctor created successfully.');
      } else {
        updatedDoctors = doctors.map(doctor =>
          doctor.uuid === formState.uuid
            ? { ...formState } as Doctor
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

  const handleCloseModal = useCallback(() => {
    setModalMode(null);
    setSelectedDoctor(null);
    setFormState({});
    setIsFormDirty(false);
  }, []);

  // Optimized form field change handlers using useCallback
  const handleFormFieldChange = useCallback((field: keyof Doctor, value: any) => {
    setFormState(prev => ({ ...prev, [field]: value }));
    setIsFormDirty(true);
  }, []);

  // Doctor Card Component - Memoized to prevent unnecessary re-renders
  const DoctorCard = React.memo(({ doctor }: { doctor: Doctor }) => {
    const statusConfig = getStatusConfig(doctor.status);
    const StatusIcon = statusConfig.icon;

    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 hover:border-blue-200">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg mb-1">{doctor.name}</h3>
            <p className="text-sm text-gray-600 flex items-center">
              <Stethoscope size={14} className="mr-2 text-blue-500" />
              {doctor.specializaton}
            </p>
          </div>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
            <StatusIcon size={12} className="mr-1" />
            {statusConfig.text}
          </div>
        </div>
        
        {/* Essential Info */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <Phone size={14} className="mr-2 text-green-500" />
              {doctor.phone_number}
            </div>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getGenderColor(doctor.gender)}`}>
              {doctor.gender}
            </span>
          </div>
          
          {doctor.email && (
            <div className="flex items-center text-sm text-gray-600">
              <Mail size={14} className="mr-2 text-purple-500" />
              <span className="truncate">{doctor.email}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-600">
            <Building size={14} className="mr-2 text-orange-500" />
            <span className="truncate">{getClinicServiceName(doctor.clinic_service)}</span>
          </div>
          
          {doctor.experience && (
            <div className="flex items-center text-sm text-gray-600">
              <Award size={14} className="mr-2 text-yellow-500" />
              {doctor.experience} experience
            </div>
          )}

          {doctor.dob && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar size={14} className="mr-2 text-indigo-500" />
              Born: {new Date(doctor.dob).toLocaleDateString()}
            </div>
          )}
        </div>
        
        {/* Rejection reason */}
        {doctor.status === 'REJECTED' && doctor.reason_for_rejection && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-4 border border-red-200">
            <div className="flex items-start">
              <AlertTriangle size={14} className="mr-2 flex-shrink-0 mt-0.5" />
              <span>{doctor.reason_for_rejection}</span>
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
          <button
            onClick={() => handleViewDoctor(doctor)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleEditDoctor(doctor)}
            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Edit Doctor"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => handleDeleteDoctor(doctor)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Doctor"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    );
  });

  // Optimized FormFields component
  const FormFields = React.memo(() => (
    <form onSubmit={(e) => { e.preventDefault(); handleSaveDoctor(); }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Doctor Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formState.name || ''}
            onChange={(e) => handleFormFieldChange('name', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Enter doctor name"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Clinic Service <span className="text-red-500">*</span>
          </label>
          <select
            value={formState.clinic_service || ''}
            onChange={(e) => handleFormFieldChange('clinic_service', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          >
            {clinicServices.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Specialization <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formState.specializaton || ''}
            onChange={(e) => handleFormFieldChange('specializaton', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Enter specialization"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formState.phone_number || ''}
            onChange={(e) => handleFormFieldChange('phone_number', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Enter phone number"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <select
            value={formState.gender || 'FEMALE'}
            onChange={(e) => handleFormFieldChange('gender', e.target.value as Doctor['gender'])}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={formState.email || ''}
            onChange={(e) => handleFormFieldChange('email', e.target.value || null)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Enter email address"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
          <input
            type="text"
            value={formState.experience || ''}
            onChange={(e) => handleFormFieldChange('experience', e.target.value || null)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="e.g., 5 years"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
          <input
            type="date"
            value={formState.dob || ''}
            onChange={(e) => handleFormFieldChange('dob', e.target.value || null)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Modal Footer */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={handleCloseModal}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  ));

  // Modal Component
  const Modal = () => {
    if (!modalMode) return null;

    const isViewMode = modalMode === 'view';
    const isDeleteMode = modalMode === 'delete';
    
    const currentDoctor = isViewMode ? selectedDoctor : formState;
    if (!currentDoctor && !isDeleteMode) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {isViewMode ? 'Doctor Details' :
                 isDeleteMode ? 'Delete Doctor' :
                 modalMode === 'add' ? 'Add New Doctor' : 'Edit Doctor'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {isDeleteMode ? (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    Are you sure you want to delete this doctor? This action cannot be undone.
                  </p>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={handleCloseModal}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDeleteDoctor}
                      className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ) : isViewMode && selectedDoctor ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                      <p className="text-gray-900">{selectedDoctor.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Specialization</label>
                      <p className="text-gray-900">{selectedDoctor.specializaton}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                      <p className="text-gray-900">{selectedDoctor.phone_number}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                      <p className="text-gray-900">{selectedDoctor.email || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Gender</label>
                      <p className="text-gray-900">{selectedDoctor.gender}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Experience</label>
                      <p className="text-gray-900">{selectedDoctor.experience || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Date of Birth</label>
                      <p className="text-gray-900">{selectedDoctor.dob || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                      <p className="text-gray-900">{selectedDoctor.status}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Clinic Service</label>
                    <p className="text-gray-900">{getClinicServiceName(selectedDoctor.clinic_service)}</p>
                  </div>
                  {selectedDoctor.reason_for_rejection && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Rejection Reason</label>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-700">{selectedDoctor.reason_for_rejection}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <FormFields />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Doctor Management</h1>
        <button
          onClick={handleAddDoctor}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusCircle size={20} />
          Add Doctor
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search doctors by name, specialization, phone or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="w-full md:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="APPROVED">Approved</option>
            <option value="DRAFT">Draft</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
        {paginationData.paginatedDoctors.map((doctor) => (
          <DoctorCard key={doctor.uuid} doctor={doctor} />
        ))}
      </div>

      {/* Empty State */}
      {paginationData.paginatedDoctors.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <User size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by adding a new doctor'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {paginationData.totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-500">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredDoctors.length)} of {filteredDoctors.length} doctors
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="px-4 py-2 text-sm text-gray-700">
              Page {currentPage} of {paginationData.totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, paginationData.totalPages))}
              disabled={currentPage === paginationData.totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
          notification.type === 'success' ? 'bg-green-100 text-green-700' :
          notification.type === 'warning' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {notification.type === 'success' ? <CheckCircle size={20} /> :
           notification.type === 'warning' ? <AlertTriangle size={20} /> :
           <XCircle size={20} />}
          {notification.message}
        </div>
      )}

      {/* Modal */}
      <Modal />
    </div>
  );
}