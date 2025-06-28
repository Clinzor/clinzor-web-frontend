import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter,
  Edit3, 
  Eye, 
  Trash2, 
  MoreHorizontal,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock,
  X,
  Heart,
  Stethoscope,
  Brain,
  Activity,
  DollarSign,
  Video,
  Home,
  Building,
  Star,
  Tag,
  FileText,
  Image as ImageIcon,
  XCircle,
  Building2
} from 'lucide-react';

// Types
interface Service {
  uuid: string;
  created_by: string;
  name: string;
  description: string;
  tags: string;
  image: string | null;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
}

interface ClinicService {
  uuid: string;
  service: string;
  clinic: string;
  service_name: string;
  created_by: string;
  clinic_provided_name: string | null;
  rank: number;
  consultation_charge_video_call: string;
  consultation_charge_physical_visit: string;
  consultation_charge_home_visit: string;
  treatment_charge_video_call: string;
  treatment_charge_physical_visit: string;
  treatment_charge_home_visit: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  is_video_call: boolean;
  is_home_visit: boolean;
  is_physical_visit: boolean;
  image: string | null;
  description: string | null;
  reason_for_rejection: string | null;
}

interface NewClinicService {
  clinic: string;
  service: string;
  rank: string;
  consultation_charge_video_call: string;
  consultation_charge_home_visit: string;
  treatment_charge_video_call: string;
  treatment_charge_physical_visit: string;
  consultation_charge_physical_visit: string;
  treatment_charge_home_visit: string;
  is_video_call: boolean;
  is_home_service: boolean;
  is_clinic_visit: boolean;
  clinic_provided_name: string;
  image: string;
  description: string;
}

// Sample data
const sampleClinics = [
  { uuid: "5a1f8f39-ca38-464c-93c5-ea8edbd6c03f", name: "City General Hospital" },
  { uuid: "b2c8f4d1-4a5b-4c7d-8e9f-1a2b3c4d5e6f", name: "Metro Medical Center" },
  { uuid: "c3d9f5e2-5b6c-5d8e-9f0g-2b3c4d5e6f7g", name: "Downtown Clinic" }
];

const sampleServices: Service[] = [
  {
    uuid: "d7afe788-af8b-4fd4-b65b-bab700df841a",
    created_by: "admin@gmail.com",
    name: "cardiologist",
    description: "Specialist in diagnosing and treating heart and blood vessel conditions.",
    tags: "heart,cardiology,blood pressure,ECG,chest pain",
    image: null,
    status: "APPROVED"
  },
  {
    uuid: "661d42bc-4393-49a3-ab8f-c24b6ab17c38",
    created_by: "admin@gmail.com",
    name: "heart speciality",
    description: "Focus on the diagnosis, treatment, and management of heart and blood vessel conditions",
    tags: "heart",
    image: null,
    status: "APPROVED"
  },
  {
    uuid: "62111833-4927-4060-acdf-f2d857e9d688",
    created_by: "admin@gmail.com",
    name: "neurologist",
    description: "Specialist in diagnosing and treating nervous system disorders.",
    tags: "brain,neurology,headache,seizure,stroke",
    image: null,
    status: "PENDING"
  },
  {
    uuid: "5bfffdfc-0af4-4d17-8d0c-08466e2315e5",
    created_by: "admin@gmail.com",
    name: "physician",
    description: "General medical practitioner providing comprehensive healthcare.",
    tags: "general,medicine,primary care,checkup",
    image: null,
    status: "REJECTED"
  }
];

const sampleClinicServices: ClinicService[] = [
  {
    uuid: "159e3627-65eb-40b2-b535-37cbb6535ab8",
    service: "d7afe788-af8b-4fd4-b65b-bab700df841a",
    clinic: "5a1f8f39-ca38-464c-93c5-ea8edbd6c03f",
    service_name: "cardiology",
    created_by: "admin@gmail.com",
    clinic_provided_name: "Advanced Cardiology Care",
    rank: 1,
    consultation_charge_video_call: "400.00",
    consultation_charge_physical_visit: "200.00",
    consultation_charge_home_visit: "200.00",
    treatment_charge_video_call: "600.00",
    treatment_charge_physical_visit: "500.00",
    treatment_charge_home_visit: "800.00",
    status: "APPROVED",
    is_video_call: true,
    is_home_visit: false,
    is_physical_visit: true,
    image: null,
    description: "Premium cardiology services with experienced specialists",
    reason_for_rejection: null
  },
  {
    uuid: "269f4738-76fc-51c3-c646-48dcc7646cb9",
    service: "661d42bc-4393-49a3-ab8f-c24b6ab17c38",
    clinic: "b2c8f4d1-4a5b-4c7d-8e9f-1a2b3c4d5e6f",
    service_name: "heart speciality",
    created_by: "admin@gmail.com",
    clinic_provided_name: null,
    rank: 2,
    consultation_charge_video_call: "350.00",
    consultation_charge_physical_visit: "180.00",
    consultation_charge_home_visit: "250.00",
    treatment_charge_video_call: "550.00",
    treatment_charge_physical_visit: "450.00",
    treatment_charge_home_visit: "700.00",
    status: "PENDING",
    is_video_call: true,
    is_home_visit: true,
    is_physical_visit: true,
    image: null,
    description: null,
    reason_for_rejection: null
  }
];

const ServiceManagement: React.FC = () => {
  // State management
  const [services, setServices] = useState<Service[]>(sampleServices);
  const [clinicServices, setClinicServices] = useState<ClinicService[]>(sampleClinicServices);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'clinic-services'>('clinic-services');
  const itemsPerPage = 6;

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showServiceSearchModal, setShowServiceSearchModal] = useState(false);
  const [showRequestServiceModal, setShowRequestServiceModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ClinicService | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'delete' | 'edit-rank' | null>(null);
  
  // Service search states
  const [serviceSearchTerm, setServiceSearchTerm] = useState('');
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);

  // Service request states
  const [serviceRequest, setServiceRequest] = useState({
    name: '',
    image: '',
    description: '',
    type: '',
    rates: '',
    additionalInfo: ''
  });

  const [newClinicService, setNewClinicService] = useState<NewClinicService>({
    clinic: '',
    service: '',
    rank: '1',
    consultation_charge_video_call: '',
    consultation_charge_home_visit: '',
    treatment_charge_video_call: '',
    treatment_charge_physical_visit: '',
    consultation_charge_physical_visit: '',
    treatment_charge_home_visit: '',
    is_video_call: false,
    is_home_service: false,
    is_clinic_visit: true,
    clinic_provided_name: '',
    image: '',
    description: ''
  });

  // Validation state
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Add after state declarations
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Helper functions
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'APPROVED': return {
        color: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
        dot: 'bg-emerald-500',
        icon: CheckCircle
      };
      case 'PENDING': return {
        color: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
        dot: 'bg-amber-500',
        icon: Clock
      };
      case 'REJECTED': return {
        color: 'bg-red-500/10 text-red-700 border-red-500/20',
        dot: 'bg-red-500',
        icon: AlertCircle
      };
      default: return {
        color: 'bg-slate-500/10 text-slate-700 border-slate-500/20',
        dot: 'bg-slate-500',
        icon: AlertCircle
      };
    }
  };

  const getServiceIcon = (serviceName: string) => {
    const name = serviceName.toLowerCase();
    if (name.includes('cardio') || name.includes('heart')) return Heart;
    if (name.includes('neuro') || name.includes('brain')) return Brain;
    if (name.includes('physician') || name.includes('general')) return Stethoscope;
    return Activity;
  };

  const getClinicName = (clinicId: string) => {
    return sampleClinics.find(c => c.uuid === clinicId)?.name || 'Unknown Clinic';
  };

  const getServiceName = (serviceId: string) => {
    return services.find(s => s.uuid === serviceId)?.name || 'Unknown Service';
  };

  // Mock data for all services from backend
  const mockAllServices: Service[] = [
    {
      uuid: "d7afe788-af8b-4fd4-b65b-bab700df841a",
      created_by: "admin@gmail.com",
      name: "Cardiology",
      description: "Specialist in diagnosing and treating heart and blood vessel conditions.",
      tags: "heart,cardiology,blood pressure,ECG,chest pain",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop",
      status: "APPROVED"
    },
    {
      uuid: "661d42bc-4393-49a3-ab8f-c24b6ab17c38",
      created_by: "admin@gmail.com",
      name: "Neurology",
      description: "Specialist in diagnosing and treating nervous system disorders.",
      tags: "brain,neurology,headache,seizure,stroke",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=400&fit=crop",
      status: "APPROVED"
    },
    {
      uuid: "62111833-4927-4060-acdf-f2d857e9d688",
      created_by: "admin@gmail.com",
      name: "Dermatology",
      description: "Specialist in diagnosing and treating skin conditions.",
      tags: "skin,dermatology,acne,eczema,psoriasis",
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop",
      status: "APPROVED"
    },
    {
      uuid: "5bfffdfc-0af4-4d17-8d0c-08466e2315e5",
      created_by: "admin@gmail.com",
      name: "Orthopedics",
      description: "Specialist in diagnosing and treating bone and joint conditions.",
      tags: "bones,joints,orthopedics,fracture,arthritis",
      image: "https://images.unsplash.com/photo-1559757172-9b3c5a9c0b5a?w=400&h=400&fit=crop",
      status: "APPROVED"
    },
    {
      uuid: "7c8e9f0a-1b2c-3d4e-5f6g-7h8i9j0k1l2m",
      created_by: "admin@gmail.com",
      name: "Pediatrics",
      description: "Specialist in diagnosing and treating children's health conditions.",
      tags: "children,pediatrics,childcare,development",
      image: "https://images.unsplash.com/photo-1559757173-9b3c5a9c0b5b?w=400&h=400&fit=crop",
      status: "APPROVED"
    },
    {
      uuid: "8d9e0f1b-2c3d-4e5f-6g7h-8i9j0k1l2m3n",
      created_by: "admin@gmail.com",
      name: "Psychiatry",
      description: "Specialist in diagnosing and treating mental health conditions.",
      tags: "mental health,psychiatry,depression,anxiety,therapy",
      image: "https://images.unsplash.com/photo-1559757174-9b3c5a9c0b5c?w=400&h=400&fit=crop",
      status: "APPROVED"
    }
  ];

  // Filtering logic
  const filteredClinicServices = clinicServices.filter(clinicService => {
    // Only show approved services
    if (clinicService.status !== 'APPROVED') {
      return false;
    }
    
    // Apply search filter
    const matchesSearch = clinicService.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (clinicService.clinic_provided_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         clinicService.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getClinicName(clinicService.clinic).toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Pagination logic
  const currentData = filteredClinicServices;
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const paginatedData = currentData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Statistics
  const totalClinicServices = clinicServices.length;
  const approvedClinicServices = clinicServices.filter(cs => cs.status === 'APPROVED').length;
  const pendingClinicServices = clinicServices.filter(cs => cs.status === 'PENDING').length;
  const rejectedClinicServices = clinicServices.filter(cs => cs.status === 'REJECTED').length;

  // Validation functions
  const validateClinicServiceForm = () => {
    const errors: { [key: string]: string } = {};
    // Remove clinic validation since we're removing the dropdown
    if (!newClinicService.service) errors.service = 'Service is required.';
    if (!newClinicService.rank || isNaN(Number(newClinicService.rank))) errors.rank = 'Valid rank is required.';
    
    // Validate charges based on enabled services
    if (newClinicService.is_video_call) {
      if (!newClinicService.consultation_charge_video_call) errors.consultation_charge_video_call = 'Video consultation charge is required.';
      if (!newClinicService.treatment_charge_video_call) errors.treatment_charge_video_call = 'Video treatment charge is required.';
    }
    if (newClinicService.is_clinic_visit) {
      if (!newClinicService.consultation_charge_physical_visit) errors.consultation_charge_physical_visit = 'Physical consultation charge is required.';
      if (!newClinicService.treatment_charge_physical_visit) errors.treatment_charge_physical_visit = 'Physical treatment charge is required.';
    }
    if (newClinicService.is_home_service) {
      if (!newClinicService.consultation_charge_home_visit) errors.consultation_charge_home_visit = 'Home consultation charge is required.';
      if (!newClinicService.treatment_charge_home_visit) errors.treatment_charge_home_visit = 'Home treatment charge is required.';
    }
    
    return errors;
  };

  // CRUD operations
  const handleCreateClinicService = () => {
    const errors = validateClinicServiceForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const clinicService: ClinicService = {
      uuid: `clinic-service-${Date.now()}`,
      service: newClinicService.service,
      clinic: newClinicService.clinic,
      service_name: getServiceName(newClinicService.service),
      created_by: 'admin@clinic.com',
      clinic_provided_name: newClinicService.clinic_provided_name || null,
      rank: parseInt(newClinicService.rank),
      consultation_charge_video_call: newClinicService.consultation_charge_video_call,
      consultation_charge_physical_visit: newClinicService.consultation_charge_physical_visit,
      consultation_charge_home_visit: newClinicService.consultation_charge_home_visit,
      treatment_charge_video_call: newClinicService.treatment_charge_video_call,
      treatment_charge_physical_visit: newClinicService.treatment_charge_physical_visit,
      treatment_charge_home_visit: newClinicService.treatment_charge_home_visit,
      status: 'PENDING',
      is_video_call: newClinicService.is_video_call,
      is_home_visit: newClinicService.is_home_service,
      is_physical_visit: newClinicService.is_clinic_visit,
      image: newClinicService.image || null,
      description: newClinicService.description || null,
      reason_for_rejection: null
    };
    
    setClinicServices([clinicService, ...clinicServices]);
    resetClinicServiceForm();
    setShowCreateModal(false);
    showToast('Clinic service added successfully!', 'success');
  };

  const handleDelete = () => {
    if (!selectedItem) return;
    
    setClinicServices(clinicServices.filter(cs => cs.uuid !== selectedItem.uuid));
    showToast('Clinic service deleted successfully!', 'success');
    closeModal();
  };

  // Modal handlers
  const handleView = (item: ClinicService) => {
    setSelectedItem(item);
    setModalMode('view');
  };

  const handleEdit = (item: ClinicService) => {
    setSelectedItem(item);
    setModalMode('edit');
  };

  const handleDeleteConfirm = (item: ClinicService) => {
    setSelectedItem(item);
    setModalMode('delete');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedItem(null);
    resetClinicServiceForm();
    setFormErrors({});
    setShowCreateModal(false);
  };

  const resetClinicServiceForm = () => {
    setNewClinicService({
      clinic: '',
      service: '',
      rank: '1',
      consultation_charge_video_call: '',
      consultation_charge_home_visit: '',
      treatment_charge_video_call: '',
      treatment_charge_physical_visit: '',
      consultation_charge_physical_visit: '',
      treatment_charge_home_visit: '',
      is_video_call: false,
      is_home_service: false,
      is_clinic_visit: true,
      clinic_provided_name: '',
      image: '',
      description: ''
    });
  };

  // Add state for rank editing
  const [rankEditValue, setRankEditValue] = useState('');

  // Add handler to open rank edit modal
  const handleEditRank = (clinicService: ClinicService) => {
    setSelectedItem(clinicService);
    setRankEditValue(clinicService.rank.toString());
    setModalMode('edit-rank');
  };

  // Add handler to save rank
  const handleSaveRank = () => {
    if (!selectedItem) return;
    setClinicServices(clinicServices.map(cs =>
      cs.uuid === selectedItem.uuid ? { ...cs, rank: parseInt(rankEditValue) } : cs
    ));
    showToast('Rank updated successfully!', 'success');
    closeModal();
  };

  // Service search functions
  const handleOpenServiceSearch = () => {
    setAllServices(mockAllServices);
    setShowServiceSearchModal(true);
  };

  const handleSelectService = (service: Service) => {
    setNewClinicService(prev => ({
      ...prev,
      service: service.uuid
    }));
    setShowServiceSearchModal(false);
    setServiceSearchTerm('');
  };

  const handleRequestService = () => {
    // In a real app, this would send the request to the backend
    console.log('Service Request:', serviceRequest);
    showToast('Service request submitted successfully! We will review and add it soon.', 'success');
    setShowRequestServiceModal(false);
    resetServiceRequest();
  };

  const resetServiceRequest = () => {
    setServiceRequest({
      name: '',
      image: '',
      description: '',
      type: '',
      rates: '',
      additionalInfo: ''
    });
  };

  const filteredAllServices = allServices.filter(service =>
    service.name.toLowerCase().includes(serviceSearchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(serviceSearchTerm.toLowerCase()) ||
    service.tags.toLowerCase().includes(serviceSearchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] px-6 py-4 rounded-xl shadow-lg flex items-center space-x-3
          ${toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}
        >
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/80 border-b border-slate-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 py-4 lg:py-0 lg:h-20">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Service Management
                </h1>
                <p className="text-sm text-slate-500 mt-1">Manage services and clinic service offerings</p>
              </div>
              
              {/* Stats Cards */}
              <div className="hidden lg:flex items-center space-x-6">
                <div className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Settings className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 font-medium">Clinic Services</p>
                    <p className="text-lg font-bold text-blue-700">{totalClinicServices}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                  <div className="p-2 bg-emerald-500 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-600 font-medium">Approved</p>
                    <p className="text-lg font-bold text-emerald-700">{approvedClinicServices}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-100">
                  <div className="p-2 bg-amber-500 rounded-lg">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-amber-600 font-medium">Pending</p>
                    <p className="text-lg font-bold text-amber-700">{pendingClinicServices}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Show Add button only for the active tab */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowRequestServiceModal(true)}
                className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <Plus className="w-5 h-5 mr-2 relative" />
                <span className="relative">Request Service</span>
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <Plus className="w-5 h-5 mr-2 relative" />
                <span className="relative">Add Clinic Service</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Search Bar */}
        <div className="bg-white/80 border border-slate-200 rounded-2xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search clinic services by name, description, or clinic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-slate-700 placeholder-slate-400 text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Content Grid */}
        {currentData.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
              <Settings className="relative w-12 h-12 sm:w-16 sm:h-16 text-slate-400 mx-auto mb-4 sm:mb-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">
              No clinic services found
            </h3>
            <p className="text-slate-500 text-base sm:text-lg mb-6 sm:mb-8 max-w-md mx-auto px-4">
              Try adjusting your search terms or add your first clinic service
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg font-semibold text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
              Add Your First Clinic Service
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {paginatedData.map((clinicService) => {
              const statusConfig = getStatusConfig(clinicService.status);
              const StatusIcon = statusConfig.icon;
              const ServiceIcon = getServiceIcon(clinicService.service_name);
              return (
                <div key={clinicService.uuid} className="group relative">
                  <div className="relative bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                    {/* Status Badge */}
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10">
                      <span className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium ${statusConfig.color} space-x-2`}>
                        <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></span>
                        <statusConfig.icon className="w-4 h-4" />
                        <span>{clinicService.status}</span>
                      </span>
                    </div>

                    {/* Service Image */}
                    <div className="relative h-32 sm:h-40 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                      {clinicService.image ? (
                        <img
                          src={clinicService.image}
                          alt={clinicService.service_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Settings className="w-8 h-8 sm:w-12 sm:h-12 text-slate-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 sm:mb-2 truncate">
                            {clinicService.service_name}
                          </h3>
                          <p className="text-sm sm:text-base text-slate-600 mb-2 sm:mb-3 line-clamp-2">
                            {clinicService.description}
                          </p>
                        </div>
                      </div>

                      {/* Service Type */}
                      <div className="flex items-center mb-3 sm:mb-4">
                        <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 mr-2" />
                        <span className="text-sm sm:text-base text-slate-600 font-medium">
                          {clinicService.service_name}
                        </span>
                      </div>

                      {/* Clinic Info */}
                      <div className="flex items-center mb-4 sm:mb-6">
                        <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 mr-2" />
                        <span className="text-sm sm:text-base text-slate-600 font-medium">
                          {getClinicName(clinicService.clinic)}
                        </span>
                      </div>

                      {/* Price and Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-lg sm:text-xl font-bold text-slate-900">
                            ₹{clinicService.consultation_charge_video_call} / ₹{clinicService.treatment_charge_video_call}
                          </span>
                          <span className="text-sm sm:text-base text-slate-500 ml-1">/session</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleView(clinicService)}
                            className="p-1.5 sm:p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          >
                            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteConfirm(clinicService)}
                            className="p-1.5 sm:p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                          <button
                            onClick={() => handleEditRank(clinicService)}
                            className="p-1.5 sm:p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          >
                            <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-slate-200">
            <div className="text-sm sm:text-base text-slate-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, currentData.length)} of {currentData.length} results
            </div>
            <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 sm:px-3 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &lt;
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`relative inline-flex items-center px-3 sm:px-4 py-2 border border-slate-300 bg-white text-sm font-medium ${
                    currentPage === idx + 1 
                      ? 'text-blue-600 font-bold bg-blue-50' 
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 sm:px-3 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &gt;
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Modal for Add Clinic Service */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Add Clinic Service
              </h2>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <form onSubmit={e => { e.preventDefault(); handleCreateClinicService(); }} className="space-y-4 sm:space-y-5">
                {/* Service */}
                <div>
                  <label className="block text-sm font-semibold mb-1 sm:mb-2">Service <span className="text-red-500">*</span></label>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                    {newClinicService.service ? (
                      <div className="flex-1">
                        {/* Selected Service Card */}
                        <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4">
                          <div className="flex items-start space-x-3 sm:space-x-4">
                            {/* Service Image */}
                            <div className="flex-shrink-0">
                              {(() => {
                                const selectedService = mockAllServices.find(s => s.uuid === newClinicService.service);
                                return selectedService?.image ? (
                                  <img
                                    src={selectedService.image}
                                    alt={selectedService.name}
                                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
                                  />
                                ) : (
                                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
                                    <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                                  </div>
                                );
                              })()}
                            </div>
                            
                            {/* Service Info */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-slate-900 mb-1 text-sm sm:text-base">
                                {getServiceName(newClinicService.service)}
                              </h4>
                              <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">
                                {(() => {
                                  const selectedService = mockAllServices.find(s => s.uuid === newClinicService.service);
                                  return selectedService?.description || 'No description available';
                                })()}
                              </p>
                            </div>
                            
                            {/* Change Button */}
                            <button
                              type="button"
                              onClick={handleOpenServiceSearch}
                              className="flex-shrink-0 px-2 sm:px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-200"
                            >
                              Change
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 flex items-center justify-center text-sm sm:text-base">
                        No service selected
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={handleOpenServiceSearch}
                      className="px-3 sm:px-4 py-2 sm:py-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-200 hover:bg-blue-100 transition-all duration-200 flex items-center gap-2 text-sm sm:text-base"
                    >
                      <Search className="w-4 h-4" />
                      {newClinicService.service ? 'Change' : 'Search'}
                    </button>
                  </div>
                  {formErrors.service && <p className="text-xs text-red-500 mt-1">{formErrors.service}</p>}
                </div>
                {/* Clinic Provided Name (optional) */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Clinic Provided Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700"
                    value={newClinicService.clinic_provided_name}
                    onChange={e => setNewClinicService(cs => ({ ...cs, clinic_provided_name: e.target.value }))}
                    placeholder="(Optional) Custom name for this service at the clinic"
                  />
                </div>
                
                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Description</label>
                  <textarea
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700"
                    value={newClinicService.description}
                    onChange={e => setNewClinicService(cs => ({ ...cs, description: e.target.value }))}
                    placeholder="Describe this clinic service..."
                    rows={3}
                  />
                </div>
                
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // In a real app, you would upload the file to a server and get back a URL
                        // For now, we'll create a local URL for preview
                        const imageUrl = URL.createObjectURL(file);
                        setNewClinicService(cs => ({ ...cs, image: imageUrl }));
                      }
                    }}
                  />
                </div>
                {/* Rank */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Rank <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    className={`w-full px-4 py-3 rounded-xl border ${formErrors.rank ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700`}
                    value={newClinicService.rank}
                    onChange={e => setNewClinicService(cs => ({ ...cs, rank: e.target.value }))}
                    min={1}
                    placeholder="e.g. 1"
                  />
                  {formErrors.rank && <p className="text-xs text-red-500 mt-1">{formErrors.rank}</p>}
                </div>
                {/* Facility Toggles */}
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newClinicService.is_video_call}
                      onChange={e => setNewClinicService(cs => ({ ...cs, is_video_call: e.target.checked }))}
                    /> Video Call
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newClinicService.is_clinic_visit}
                      onChange={e => setNewClinicService(cs => ({ ...cs, is_clinic_visit: e.target.checked }))}
                    /> Physical Visit
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newClinicService.is_home_service}
                      onChange={e => setNewClinicService(cs => ({ ...cs, is_home_service: e.target.checked }))}
                    /> Home Visit
                  </label>
                </div>
                {/* Charges - show fields as per toggles */}
                {newClinicService.is_video_call && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Consultation Charge (Video Call) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        className={`w-full px-4 py-3 rounded-xl border ${formErrors.consultation_charge_video_call ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700`}
                        value={newClinicService.consultation_charge_video_call}
                        onChange={e => setNewClinicService(cs => ({ ...cs, consultation_charge_video_call: e.target.value }))}
                        placeholder="e.g. 400"
                      />
                      {formErrors.consultation_charge_video_call && <p className="text-xs text-red-500 mt-1">{formErrors.consultation_charge_video_call}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Treatment Charge (Video Call) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        className={`w-full px-4 py-3 rounded-xl border ${formErrors.treatment_charge_video_call ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700`}
                        value={newClinicService.treatment_charge_video_call}
                        onChange={e => setNewClinicService(cs => ({ ...cs, treatment_charge_video_call: e.target.value }))}
                        placeholder="e.g. 800"
                      />
                      {formErrors.treatment_charge_video_call && <p className="text-xs text-red-500 mt-1">{formErrors.treatment_charge_video_call}</p>}
                    </div>
                  </div>
                )}
                {newClinicService.is_clinic_visit && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Consultation Charge (Physical Visit) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        className={`w-full px-4 py-3 rounded-xl border ${formErrors.consultation_charge_physical_visit ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700`}
                        value={newClinicService.consultation_charge_physical_visit}
                        onChange={e => setNewClinicService(cs => ({ ...cs, consultation_charge_physical_visit: e.target.value }))}
                        placeholder="e.g. 200"
                      />
                      {formErrors.consultation_charge_physical_visit && <p className="text-xs text-red-500 mt-1">{formErrors.consultation_charge_physical_visit}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Treatment Charge (Physical Visit) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        className={`w-full px-4 py-3 rounded-xl border ${formErrors.treatment_charge_physical_visit ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700`}
                        value={newClinicService.treatment_charge_physical_visit}
                        onChange={e => setNewClinicService(cs => ({ ...cs, treatment_charge_physical_visit: e.target.value }))}
                        placeholder="e.g. 500"
                      />
                      {formErrors.treatment_charge_physical_visit && <p className="text-xs text-red-500 mt-1">{formErrors.treatment_charge_physical_visit}</p>}
                    </div>
                  </div>
                )}
                {newClinicService.is_home_service && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Consultation Charge (Home Visit) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        className={`w-full px-4 py-3 rounded-xl border ${formErrors.consultation_charge_home_visit ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700`}
                        value={newClinicService.consultation_charge_home_visit}
                        onChange={e => setNewClinicService(cs => ({ ...cs, consultation_charge_home_visit: e.target.value }))}
                        placeholder="e.g. 200"
                      />
                      {formErrors.consultation_charge_home_visit && <p className="text-xs text-red-500 mt-1">{formErrors.consultation_charge_home_visit}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Treatment Charge (Home Visit) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        className={`w-full px-4 py-3 rounded-xl border ${formErrors.treatment_charge_home_visit ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700`}
                        value={newClinicService.treatment_charge_home_visit}
                        onChange={e => setNewClinicService(cs => ({ ...cs, treatment_charge_home_visit: e.target.value }))}
                        placeholder="e.g. 600"
                      />
                      {formErrors.treatment_charge_home_visit && <p className="text-xs text-red-500 mt-1">{formErrors.treatment_charge_home_visit}</p>}
                    </div>
                  </div>
                )}
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    className="px-6 py-2 rounded-xl bg-slate-200 text-slate-700 font-semibold border border-slate-300 hover:bg-slate-300 transition-all duration-200"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                  >
                    Add Clinic Service
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {modalMode === 'view' && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">View Clinic Service</h2>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <span className="font-semibold">Service:</span> {getServiceName(selectedItem.service)}
              </div>
              <div>
                <span className="font-semibold">Clinic Provided Name:</span> {selectedItem.clinic_provided_name || '-'}
              </div>
              <div>
                <span className="font-semibold">Rank:</span> {selectedItem.rank}
              </div>
              <div>
                <span className="font-semibold">Description:</span> {selectedItem.description || '-'}
              </div>
              <div>
                <span className="font-semibold">Facilities:</span>
                <ul className="list-disc ml-6">
                  {selectedItem.is_video_call && <li>Video Call</li>}
                  {selectedItem.is_physical_visit && <li>Physical Visit</li>}
                  {selectedItem.is_home_visit && <li>Home Visit</li>}
                </ul>
              </div>
              <div>
                <span className="font-semibold">Charges:</span>
                <ul className="list-disc ml-6">
                  {selectedItem.is_video_call && <li>Consultation (Video): ₹{selectedItem.consultation_charge_video_call}, Treatment (Video): ₹{selectedItem.treatment_charge_video_call}</li>}
                  {selectedItem.is_physical_visit && <li>Consultation (Physical): ₹{selectedItem.consultation_charge_physical_visit}, Treatment (Physical): ₹{selectedItem.treatment_charge_physical_visit}</li>}
                  {selectedItem.is_home_visit && <li>Consultation (Home): ₹{selectedItem.consultation_charge_home_visit}, Treatment (Home): ₹{selectedItem.treatment_charge_home_visit}</li>}
                </ul>
              </div>
              {selectedItem.reason_for_rejection && (
                <div>
                  <span className="font-semibold text-red-500">Reason for Rejection:</span> {selectedItem.reason_for_rejection}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {modalMode === 'edit' && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Edit Clinic Service</h2>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <form onSubmit={e => {
                e.preventDefault();
                const errors = validateClinicServiceForm();
                setFormErrors(errors);
                if (Object.keys(errors).length > 0) return;
                setClinicServices(clinicServices.map(cs => cs.uuid === selectedItem.uuid ? {
                  ...cs,
                  ...newClinicService,
                  rank: parseInt(newClinicService.rank),
                  service_name: getServiceName(newClinicService.service),
                  is_video_call: newClinicService.is_video_call,
                  is_home_visit: newClinicService.is_home_service,
                  is_physical_visit: newClinicService.is_clinic_visit,
                  image: newClinicService.image || null,
                  description: newClinicService.description || null,
                } : cs));
                closeModal();
                showToast('Clinic service updated successfully!', 'success');
              }} className="space-y-5">
                {/* Service */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Service <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    {newClinicService.service ? (
                      <div className="flex-1">
                        {/* Selected Service Card */}
                        <div className="bg-white border border-slate-200 rounded-xl p-4">
                          <div className="flex items-start space-x-4">
                            {/* Service Image */}
                            <div className="flex-shrink-0">
                              {(() => {
                                const selectedService = mockAllServices.find(s => s.uuid === newClinicService.service);
                                return selectedService?.image ? (
                                  <img
                                    src={selectedService.image}
                                    alt={selectedService.name}
                                    className="w-16 h-16 object-cover rounded-lg"
                                  />
                                ) : (
                                  <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
                                    <Activity className="w-8 h-8 text-blue-500" />
                                  </div>
                                );
                              })()}
                            </div>
                            
                            {/* Service Info */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-slate-900 mb-1">
                                {getServiceName(newClinicService.service)}
                              </h4>
                              <p className="text-sm text-slate-600 line-clamp-2">
                                {(() => {
                                  const selectedService = mockAllServices.find(s => s.uuid === newClinicService.service);
                                  return selectedService?.description || 'No description available';
                                })()}
                              </p>
                            </div>
                            
                            {/* Change Button */}
                            <button
                              type="button"
                              onClick={handleOpenServiceSearch}
                              className="flex-shrink-0 px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-200"
                            >
                              Change
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 flex items-center justify-center">
                        No service selected
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={handleOpenServiceSearch}
                      className="px-4 py-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-200 hover:bg-blue-100 transition-all duration-200 flex items-center gap-2"
                    >
                      <Search className="w-4 h-4" />
                      {newClinicService.service ? 'Change' : 'Search'}
                    </button>
                  </div>
                  {formErrors.service && <p className="text-xs text-red-500 mt-1">{formErrors.service}</p>}
                </div>
                {/* Clinic Provided Name (optional) */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Clinic Provided Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700"
                    value={newClinicService.clinic_provided_name}
                    onChange={e => setNewClinicService(cs => ({ ...cs, clinic_provided_name: e.target.value }))}
                    placeholder="(Optional) Custom name for this service at the clinic"
                  />
                </div>
                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Description</label>
                  <textarea
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700"
                    value={newClinicService.description}
                    onChange={e => setNewClinicService(cs => ({ ...cs, description: e.target.value }))}
                    placeholder="Describe this clinic service..."
                    rows={3}
                  />
                </div>
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // In a real app, you would upload the file to a server and get back a URL
                        // For now, we'll create a local URL for preview
                        const imageUrl = URL.createObjectURL(file);
                        setNewClinicService(cs => ({ ...cs, image: imageUrl }));
                      }
                    }}
                  />
                </div>
                {/* Rank */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Rank <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    className={`w-full px-4 py-3 rounded-xl border ${formErrors.rank ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700`}
                    value={newClinicService.rank}
                    onChange={e => setNewClinicService(cs => ({ ...cs, rank: e.target.value }))}
                    min={1}
                    placeholder="e.g. 1"
                  />
                  {formErrors.rank && <p className="text-xs text-red-500 mt-1">{formErrors.rank}</p>}
                </div>
                {/* Facility Toggles */}
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newClinicService.is_video_call}
                      onChange={e => setNewClinicService(cs => ({ ...cs, is_video_call: e.target.checked }))}
                    /> Video Call
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newClinicService.is_clinic_visit}
                      onChange={e => setNewClinicService(cs => ({ ...cs, is_clinic_visit: e.target.checked }))}
                    /> Physical Visit
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newClinicService.is_home_service}
                      onChange={e => setNewClinicService(cs => ({ ...cs, is_home_service: e.target.checked }))}
                    /> Home Visit
                  </label>
                </div>
                {/* Charges - show fields as per toggles */}
                {newClinicService.is_video_call && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Consultation Charge (Video Call) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        className={`w-full px-4 py-3 rounded-xl border ${formErrors.consultation_charge_video_call ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700`}
                        value={newClinicService.consultation_charge_video_call}
                        onChange={e => setNewClinicService(cs => ({ ...cs, consultation_charge_video_call: e.target.value }))}
                        placeholder="e.g. 400"
                      />
                      {formErrors.consultation_charge_video_call && <p className="text-xs text-red-500 mt-1">{formErrors.consultation_charge_video_call}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Treatment Charge (Video Call) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        className={`w-full px-4 py-3 rounded-xl border ${formErrors.treatment_charge_video_call ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700`}
                        value={newClinicService.treatment_charge_video_call}
                        onChange={e => setNewClinicService(cs => ({ ...cs, treatment_charge_video_call: e.target.value }))}
                        placeholder="e.g. 800"
                      />
                      {formErrors.treatment_charge_video_call && <p className="text-xs text-red-500 mt-1">{formErrors.treatment_charge_video_call}</p>}
                    </div>
                  </div>
                )}
                {newClinicService.is_clinic_visit && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Consultation Charge (Physical Visit) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        className={`w-full px-4 py-3 rounded-xl border ${formErrors.consultation_charge_physical_visit ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700`}
                        value={newClinicService.consultation_charge_physical_visit}
                        onChange={e => setNewClinicService(cs => ({ ...cs, consultation_charge_physical_visit: e.target.value }))}
                        placeholder="e.g. 200"
                      />
                      {formErrors.consultation_charge_physical_visit && <p className="text-xs text-red-500 mt-1">{formErrors.consultation_charge_physical_visit}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Treatment Charge (Physical Visit) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        className={`w-full px-4 py-3 rounded-xl border ${formErrors.treatment_charge_physical_visit ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700`}
                        value={newClinicService.treatment_charge_physical_visit}
                        onChange={e => setNewClinicService(cs => ({ ...cs, treatment_charge_physical_visit: e.target.value }))}
                        placeholder="e.g. 500"
                      />
                      {formErrors.treatment_charge_physical_visit && <p className="text-xs text-red-500 mt-1">{formErrors.treatment_charge_physical_visit}</p>}
                    </div>
                  </div>
                )}
                {newClinicService.is_home_service && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Consultation Charge (Home Visit) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        className={`w-full px-4 py-3 rounded-xl border ${formErrors.consultation_charge_home_visit ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700`}
                        value={newClinicService.consultation_charge_home_visit}
                        onChange={e => setNewClinicService(cs => ({ ...cs, consultation_charge_home_visit: e.target.value }))}
                        placeholder="e.g. 200"
                      />
                      {formErrors.consultation_charge_home_visit && <p className="text-xs text-red-500 mt-1">{formErrors.consultation_charge_home_visit}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Treatment Charge (Home Visit) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        className={`w-full px-4 py-3 rounded-xl border ${formErrors.treatment_charge_home_visit ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700`}
                        value={newClinicService.treatment_charge_home_visit}
                        onChange={e => setNewClinicService(cs => ({ ...cs, treatment_charge_home_visit: e.target.value }))}
                        placeholder="e.g. 600"
                      />
                      {formErrors.treatment_charge_home_visit && <p className="text-xs text-red-500 mt-1">{formErrors.treatment_charge_home_visit}</p>}
                    </div>
                  </div>
                )}
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    className="px-6 py-2 rounded-xl bg-slate-200 text-slate-700 font-semibold border border-slate-300 hover:bg-slate-300 transition-all duration-200"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modalMode === 'delete' && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[95vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Confirm Delete</h2>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <p className="text-slate-700 text-lg">Are you sure you want to delete this clinic service?</p>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  className="px-6 py-2 rounded-xl bg-slate-200 text-slate-700 font-semibold border border-slate-300 hover:bg-slate-300 transition-all duration-200"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold shadow hover:from-red-700 hover:to-pink-700 transition-all duration-200"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Rank Modal */}
      {modalMode === 'edit-rank' && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[95vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Edit Rank</h2>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <label className="block text-sm font-semibold mb-1">Rank</label>
              <input
                type="number"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700"
                value={rankEditValue}
                onChange={e => setRankEditValue(e.target.value)}
                min={1}
              />
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  className="px-6 py-2 rounded-xl bg-slate-200 text-slate-700 font-semibold border border-slate-300 hover:bg-slate-300 transition-all duration-200"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                  onClick={handleSaveRank}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Search Modal */}
      {showServiceSearchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Search Services</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowServiceSearchModal(false);
                    setShowRequestServiceModal(true);
                  }}
                  className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-200 text-sm font-semibold flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Request Service
                </button>
                <button
                  onClick={() => setShowServiceSearchModal(false)}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="p-6 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search services by name, description, or tags..."
                  value={serviceSearchTerm}
                  onChange={(e) => setServiceSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-slate-700 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Services Grid */}
            <div className="p-6">
              {filteredAllServices.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No services found</h3>
                  <p className="text-slate-500 mb-6">Try adjusting your search terms or request a new service</p>
                  <button
                    onClick={() => {
                      setShowServiceSearchModal(false);
                      setShowRequestServiceModal(true);
                    }}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg font-semibold"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Request a Service
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAllServices.map((service) => {
                    const ServiceIcon = getServiceIcon(service.name);
                    return (
                      <div
                        key={service.uuid}
                        onClick={() => handleSelectService(service)}
                        className="group cursor-pointer bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
                      >
                        {/* Service Image */}
                        <div className="relative mb-4">
                          {service.image ? (
                            <img
                              src={service.image}
                              alt={service.name}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-32 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
                              <ServiceIcon className="w-8 h-8 text-blue-500" />
                            </div>
                          )}
                          <div className="absolute top-2 right-2">
                            <div className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                              {service.status}
                            </div>
                          </div>
                        </div>

                        {/* Service Info */}
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {service.name}
                          </h3>
                          <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                            {service.description}
                          </p>
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-1">
                            {service.tags.split(',').slice(0, 3).map((tag, idx) => (
                              <span key={idx} className="inline-block px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs">
                                #{tag.trim()}
                              </span>
                            ))}
                            {service.tags.split(',').length > 3 && (
                              <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs">
                                +{service.tags.split(',').length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Select Button */}
                        <div className="mt-4 pt-4 border-t border-slate-100">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectService(service);
                            }}
                            className="w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-200 text-sm font-semibold"
                          >
                            Select Service
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Request a Service Modal */}
      {showRequestServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Request a Service</h2>
              <button
                onClick={() => {
                  setShowRequestServiceModal(false);
                  resetServiceRequest();
                }}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <form onSubmit={e => { e.preventDefault(); handleRequestService(); }} className="space-y-5">
                {/* Name of Service */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Name of Service <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                    value={serviceRequest.name}
                    onChange={e => setServiceRequest(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Dermatology, Cardiology"
                  />
                </div>

                {/* Image */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const imageUrl = URL.createObjectURL(file);
                        setServiceRequest(prev => ({ ...prev, image: imageUrl }));
                      }
                    }}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Description <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                    value={serviceRequest.description}
                    onChange={e => setServiceRequest(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the service in detail..."
                    rows={3}
                  />
                </div>

                {/* Type of Service */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Type of Service <span className="text-red-500">*</span></label>
                  <select
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                    value={serviceRequest.type}
                    onChange={e => setServiceRequest(prev => ({ ...prev, type: e.target.value }))}
                  >
                    <option value="">Select Service Type</option>
                    <option value="medical">Medical</option>
                    <option value="surgical">Surgical</option>
                    <option value="diagnostic">Diagnostic</option>
                    <option value="therapeutic">Therapeutic</option>
                    <option value="preventive">Preventive</option>
                    <option value="rehabilitative">Rehabilitative</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Rates of Services */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Rates of Services <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                    value={serviceRequest.rates}
                    onChange={e => setServiceRequest(prev => ({ ...prev, rates: e.target.value }))}
                    placeholder="Describe the pricing structure, consultation fees, treatment costs..."
                    rows={3}
                  />
                </div>

                {/* Additional Information */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Additional Information</label>
                  <textarea
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                    value={serviceRequest.additionalInfo}
                    onChange={e => setServiceRequest(prev => ({ ...prev, additionalInfo: e.target.value }))}
                    placeholder="Any additional details, requirements, or special considerations..."
                    rows={2}
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRequestServiceModal(false);
                      resetServiceRequest();
                    }}
                    className="px-6 py-2 rounded-xl bg-slate-200 text-slate-700 font-semibold border border-slate-300 hover:bg-slate-300 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;