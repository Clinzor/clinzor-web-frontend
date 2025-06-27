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
  XCircle
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

interface NewService {
  name: string;
  description: string;
  tags: string;
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
  const [activeTab, setActiveTab] = useState<'services' | 'clinic-services'>('services');
  const itemsPerPage = 6;

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [clinicFilter, setClinicFilter] = useState('');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Service | ClinicService | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'delete' | 'edit-rank' | null>(null);
  
  const [newService, setNewService] = useState<NewService>({
    name: '',
    description: '',
    tags: ''
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
    clinic_provided_name: ''
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

  // Filtering logic
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.tags.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? service.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  const filteredClinicServices = clinicServices.filter(clinicService => {
    const matchesSearch = clinicService.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (clinicService.clinic_provided_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesStatus = statusFilter ? clinicService.status === statusFilter : true;
    const matchesClinic = clinicFilter ? clinicService.clinic === clinicFilter : true;
    
    return matchesSearch && matchesStatus && matchesClinic;
  });

  // Pagination logic
  const currentData = activeTab === 'services' ? filteredServices : filteredClinicServices;
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const paginatedData = currentData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Statistics
  const totalServices = services.length;
  const approvedServices = services.filter(s => s.status === 'APPROVED').length;
  const pendingServices = services.filter(s => s.status === 'PENDING').length;
  const rejectedServices = services.filter(s => s.status === 'REJECTED').length;

  const totalClinicServices = clinicServices.length;
  const approvedClinicServices = clinicServices.filter(cs => cs.status === 'APPROVED').length;

  // Validation functions
  const validateServiceForm = () => {
    const errors: { [key: string]: string } = {};
    if (!newService.name.trim()) errors.name = 'Service name is required.';
    if (!newService.description.trim()) errors.description = 'Description is required.';
    if (!newService.tags.trim()) errors.tags = 'Tags are required.';
    return errors;
  };

  const validateClinicServiceForm = () => {
    const errors: { [key: string]: string } = {};
    if (!newClinicService.clinic) errors.clinic = 'Clinic is required.';
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
  const handleCreateService = () => {
    const errors = validateServiceForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const service: Service = {
      uuid: `service-${Date.now()}`,
      ...newService,
      status: 'PENDING',
      image: null,
      created_by: 'admin@clinic.com'
    };
    
    setServices([service, ...services]);
    resetServiceForm();
    setShowCreateModal(false);
    showToast('Service added successfully!', 'success');
  };

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
      image: null,
      description: null,
      reason_for_rejection: null
    };
    
    setClinicServices([clinicService, ...clinicServices]);
    resetClinicServiceForm();
    setShowCreateModal(false);
    showToast('Clinic service added successfully!', 'success');
  };

  const handleDelete = () => {
    if (!selectedItem) return;
    
    if (activeTab === 'services') {
      setServices(services.filter(s => s.uuid !== selectedItem.uuid));
      showToast('Service deleted successfully!', 'success');
    } else {
      setClinicServices(clinicServices.filter(cs => cs.uuid !== selectedItem.uuid));
      showToast('Clinic service deleted successfully!', 'success');
    }
    closeModal();
  };

  // Modal handlers
  const handleView = (item: Service | ClinicService) => {
    setSelectedItem(item);
    setModalMode('view');
  };

  const handleEdit = (item: Service | ClinicService) => {
    setSelectedItem(item);
    if (activeTab === 'services') {
      const service = item as Service;
      setNewService({
        name: service.name,
        description: service.description,
        tags: service.tags
      });
    }
    setModalMode('edit');
  };

  const handleDeleteConfirm = (item: Service | ClinicService) => {
    setSelectedItem(item);
    setModalMode('delete');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedItem(null);
    resetForms();
    setFormErrors({});
    setShowCreateModal(false);
  };

  const resetForms = () => {
    resetServiceForm();
    resetClinicServiceForm();
  };

  const resetServiceForm = () => {
    setNewService({
      name: '',
      description: '',
      tags: ''
    });
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
      clinic_provided_name: ''
    });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setClinicFilter('');
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
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-8">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent">
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
                    <p className="text-xs text-blue-600 font-medium">
                      {activeTab === 'services' ? 'Total Services' : 'Clinic Services'}
                    </p>
                    <p className="text-lg font-bold text-blue-700">
                      {activeTab === 'services' ? totalServices : totalClinicServices}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                  <div className="p-2 bg-emerald-500 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-600 font-medium">Approved</p>
                    <p className="text-lg font-bold text-emerald-700">
                      {activeTab === 'services' ? approvedServices : approvedClinicServices}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-100">
                  <div className="p-2 bg-amber-500 rounded-lg">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-amber-600 font-medium">Pending</p>
                    <p className="text-lg font-bold text-amber-700">
                      {activeTab === 'services' ? pendingServices : clinicServices.filter(cs => cs.status === 'PENDING').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Show Add button only for the active tab */}
            {activeTab === 'services' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <Plus className="w-5 h-5 mr-2 relative" />
                <span className="relative">Add Service</span>
            </button>
            )}
            {activeTab === 'clinic-services' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <Plus className="w-5 h-5 mr-2 relative" />
                <span className="relative">Add Clinic Service</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-white/80 border border-slate-200 rounded-2xl p-2 inline-flex">
            <button
              onClick={() => {setActiveTab('services'); setCurrentPage(1);}}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === 'services'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Services
            </button>
            <button
              onClick={() => {setActiveTab('clinic-services'); setCurrentPage(1);}}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === 'clinic-services'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Clinic Services
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white/80 border border-slate-200 rounded-2xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
            {/* Search Bar */}
            <div className="xl:col-span-1">
              <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab === 'services' ? 'services' : 'clinic services'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-slate-700 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200"
              >
                <option value="">All Status</option>
                <option value="APPROVED">Approved</option>
                <option value="PENDING">Pending</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            {/* Clinic Filter (only for clinic services) */}
            {activeTab === 'clinic-services' && (
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Clinic</label>
                <select
                  value={clinicFilter}
                  onChange={(e) => setClinicFilter(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200"
                >
                  <option value="">All Clinics</option>
                  {sampleClinics.map(clinic => (
                    <option key={clinic.uuid} value={clinic.uuid}>{clinic.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={resetFilters}
              className="px-6 py-2 rounded-xl bg-slate-200 text-slate-700 font-semibold border border-slate-300 hover:bg-slate-300 transition-all duration-200"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Content Grid */}
        {currentData.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
              <Settings className="relative w-16 h-16 text-slate-400 mx-auto mb-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              No {activeTab === 'services' ? 'services' : 'clinic services'} found
            </h3>
            <p className="text-slate-500 text-lg mb-8 max-w-md mx-auto">
              Try adjusting your search terms or add your first {activeTab === 'services' ? 'service' : 'clinic service'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg font-semibold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First {activeTab === 'services' ? 'Service' : 'Clinic Service'}
            </button>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {activeTab === 'services' 
              ? (paginatedData as Service[]).map((service) => {
                  const statusConfig = getStatusConfig(service.status);
                  const StatusIcon = statusConfig.icon;
                  const ServiceIcon = getServiceIcon(service.name);
                  
                  return (
                    <div key={service.uuid} className="group relative">
                      <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/60 hover:border-slate-300/60 transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 overflow-hidden">
                        <div className="p-6">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                                  <ServiceIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors capitalize">
                                    {service.name}
                                  </h3>
                                  <p className="text-sm text-slate-600">
                                    {service.description}
                                  </p>
                                </div>
                              </div>
                              <div className={`inline-flex items-center px-2 py-1 rounded-lg border text-xs font-semibold ${statusConfig.color} space-x-2`}>
                                <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></span>
                                <StatusIcon className="w-4 h-4" />
                                <span>{service.status}</span>
                              </div>
                            </div>
                          </div>
                          {/* Description */}
                          <div className="mb-4">
                            <p className="text-slate-700 text-sm line-clamp-3">
                              {service.description}
                            </p>
                          </div>
                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {service.tags.split(',').map((tag, idx) => (
                              <span key={idx} className="inline-block px-2 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-medium">
                                #{tag.trim()}
                              </span>
                            ))}
                          </div>
                          {/* Actions */}
                          <div className="flex items-center justify-between">
                            <button onClick={() => handleView(service)} className="inline-flex items-center px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all text-xs font-semibold">
                              <Eye className="w-4 h-4 mr-1" /> View
                            </button>
                            <div className="flex space-x-2">
                              <button onClick={() => handleEdit(service)} className="inline-flex items-center px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all text-xs font-semibold">
                                <Edit3 className="w-4 h-4 mr-1" /> Edit
                              </button>
                              <button onClick={() => handleDeleteConfirm(service)} className="inline-flex items-center px-3 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-all text-xs font-semibold">
                                <Trash2 className="w-4 h-4 mr-1" /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              : (paginatedData as ClinicService[]).map((clinicService) => {
                  const statusConfig = getStatusConfig(clinicService.status);
                  const StatusIcon = statusConfig.icon;
                  const ServiceIcon = getServiceIcon(clinicService.service_name);
                  return (
                    <div key={clinicService.uuid} className="group relative">
                      <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/60 hover:border-slate-300/60 transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 overflow-hidden">
                        <div className="p-6">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                                  <ServiceIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors capitalize">
                                    {clinicService.clinic_provided_name || clinicService.service_name}
                                  </h3>
                                  <p className="text-sm text-slate-600">
                                    {getClinicName(clinicService.clinic)}
                                  </p>
                                </div>
                              </div>
                              <div className={`inline-flex items-center px-2 py-1 rounded-lg border text-xs font-semibold ${statusConfig.color} space-x-2`}>
                                <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></span>
                                <StatusIcon className="w-4 h-4" />
                                <span>{clinicService.status}</span>
                              </div>
                            </div>
                          </div>
                          {/* Description */}
                          {clinicService.description && (
                            <div className="mb-4">
                              <p className="text-slate-700 text-sm line-clamp-3">
                                {clinicService.description}
                              </p>
                            </div>
                          )}
                          {/* Charges */}
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                              {clinicService.is_video_call && (
                                <span className="inline-flex items-center px-2 py-1 bg-blue-50 rounded-lg">
                                  <Video className="w-4 h-4 mr-1 text-blue-500" />
                                  Video: ₹{clinicService.consultation_charge_video_call} / ₹{clinicService.treatment_charge_video_call}
                                </span>
                              )}
                              {clinicService.is_physical_visit && (
                                <span className="inline-flex items-center px-2 py-1 bg-green-50 rounded-lg">
                                  <Home className="w-4 h-4 mr-1 text-green-500" />
                                  Physical: ₹{clinicService.consultation_charge_physical_visit} / ₹{clinicService.treatment_charge_physical_visit}
                                </span>
                              )}
                              {clinicService.is_home_visit && (
                                <span className="inline-flex items-center px-2 py-1 bg-amber-50 rounded-lg">
                                  <Building className="w-4 h-4 mr-1 text-amber-500" />
                                  Home: ₹{clinicService.consultation_charge_home_visit} / ₹{clinicService.treatment_charge_home_visit}
                                </span>
                              )}
                            </div>
                          </div>
                          {/* Actions */}
                          <div className="flex items-center justify-between">
                            <button onClick={() => handleView(clinicService)} className="inline-flex items-center px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all text-xs font-semibold">
                              <Eye className="w-4 h-4 mr-1" /> View
                            </button>
                            <div className="flex space-x-2">
                              <button onClick={() => handleEdit(clinicService)} className="inline-flex items-center px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all text-xs font-semibold">
                                <Edit3 className="w-4 h-4 mr-1" /> Edit
                              </button>
                              <button onClick={() => handleDeleteConfirm(clinicService)} className="inline-flex items-center px-3 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-all text-xs font-semibold">
                                <Trash2 className="w-4 h-4 mr-1" /> Delete
                              </button>
                              <button onClick={() => handleEditRank(clinicService)} className="inline-flex items-center px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all text-xs font-semibold">
                                <Edit3 className="w-4 h-4 mr-1" /> Edit Rank
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
            }
          </div>
        )}
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50"
              >
                &lt;
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border border-slate-300 bg-white text-sm font-medium ${currentPage === idx + 1 ? 'text-blue-600 font-bold bg-blue-50' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50"
              >
                &gt;
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Modal for Add Service or Add Clinic Service */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {activeTab === 'services' ? 'Add Service' : 'Add Clinic Service'}
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
            <div className="p-6 space-y-6">
              {activeTab === 'services' ? (
                <form onSubmit={e => { e.preventDefault(); handleCreateService(); }} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold mb-1">Service Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className={`w-full px-4 py-3 rounded-xl border ${formErrors.name ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700`}
                      value={newService.name}
                      onChange={e => setNewService(s => ({ ...s, name: e.target.value }))}
                      placeholder="e.g. Dermatology"
                    />
                    {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
                  </div>
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold mb-1">Description <span className="text-red-500">*</span></label>
                    <textarea
                      className={`w-full px-4 py-3 rounded-xl border ${formErrors.description ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700`}
                      value={newService.description}
                      onChange={e => setNewService(s => ({ ...s, description: e.target.value }))}
                      placeholder="Describe the service..."
                      rows={3}
                    />
                    {formErrors.description && <p className="text-xs text-red-500 mt-1">{formErrors.description}</p>}
                  </div>
                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-semibold mb-1">Tags <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className={`w-full px-4 py-3 rounded-xl border ${formErrors.tags ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700`}
                      value={newService.tags}
                      onChange={e => setNewService(s => ({ ...s, tags: e.target.value }))}
                      placeholder="e.g. skin,dermatology,allergy"
                    />
                    {formErrors.tags && <p className="text-xs text-red-500 mt-1">{formErrors.tags}</p>}
                  </div>
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
                      Add Service
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={e => { e.preventDefault(); handleCreateClinicService(); }} className="space-y-5">
                  {/* Clinic */}
                  <div>
                    <label className="block text-sm font-semibold mb-1">Clinic <span className="text-red-500">*</span></label>
                    <select
                      className={`w-full px-4 py-3 rounded-xl border ${formErrors.clinic ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700`}
                      value={newClinicService.clinic}
                      onChange={e => setNewClinicService(cs => ({ ...cs, clinic: e.target.value }))}
                    >
                      <option value="">Select Clinic</option>
                      {sampleClinics.map(clinic => (
                        <option key={clinic.uuid} value={clinic.uuid}>{clinic.name}</option>
                      ))}
                    </select>
                    {formErrors.clinic && <p className="text-xs text-red-500 mt-1">{formErrors.clinic}</p>}
                  </div>
                  {/* Service */}
                  <div>
                    <label className="block text-sm font-semibold mb-1">Service <span className="text-red-500">*</span></label>
                    <select
                      className={`w-full px-4 py-3 rounded-xl border ${formErrors.service ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700`}
                      value={newClinicService.service}
                      onChange={e => setNewClinicService(cs => ({ ...cs, service: e.target.value }))}
                    >
                      <option value="">Select Service</option>
                      {services.map(service => (
                        <option key={service.uuid} value={service.uuid}>{service.name}</option>
                      ))}
                    </select>
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
              )}
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {modalMode === 'view' && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">View {activeTab === 'services' ? 'Service' : 'Clinic Service'}</h2>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {activeTab === 'services' ? (
                (() => { const service = selectedItem as Service; return (
                  <>
                    {/* Image */}
                    <div className="flex justify-center mb-4">
                      {service.image ? (
                        <img src={service.image} alt={service.name} className="w-28 h-28 object-cover rounded-xl border" />
                      ) : (
                        <div className="w-28 h-28 bg-slate-200 flex items-center justify-center rounded-xl border text-slate-400">No Image</div>
                      )}
                    </div>
                    <div>
                      <span className="font-semibold">Name:</span> {service.name}
                    </div>
                    <div>
                      <span className="font-semibold">Description:</span> {service.description}
                    </div>
                    <div>
                      <span className="font-semibold">Tags:</span> {service.tags}
                    </div>
                  </>
                ); })()
              ) : (
                (() => { const clinicService = selectedItem as ClinicService & { default_image?: string };
                  // Prefer image, then default_image, else placeholder
                  const imageUrl = clinicService.image || (clinicService as any).default_image || null;
                  return (
                  <>
                    {/* Image */}
                    <div className="flex justify-center mb-4">
                      {imageUrl ? (
                        <img src={imageUrl} alt={clinicService.clinic_provided_name || clinicService.service_name} className="w-28 h-28 object-cover rounded-xl border" />
                      ) : (
                        <div className="w-28 h-28 bg-slate-200 flex items-center justify-center rounded-xl border text-slate-400">No Image</div>
                      )}
                    </div>
                    <div>
                      <span className="font-semibold">Service:</span> {getServiceName(clinicService.service)}
                    </div>
                    <div>
                      <span className="font-semibold">Clinic Provided Name:</span> {clinicService.clinic_provided_name || '-'}
                    </div>
                    <div>
                      <span className="font-semibold">Rank:</span> {clinicService.rank}
                    </div>
                    <div>
                      <span className="font-semibold">Description:</span> {clinicService.description || '-'}
                    </div>
                    <div>
                      <span className="font-semibold">Facilities:</span>
                      <ul className="list-disc ml-6">
                        {clinicService.is_video_call && <li>Video Call</li>}
                        {clinicService.is_physical_visit && <li>Physical Visit</li>}
                        {clinicService.is_home_visit && <li>Home Visit</li>}
                      </ul>
                    </div>
                    <div>
                      <span className="font-semibold">Charges:</span>
                      <ul className="list-disc ml-6">
                        {clinicService.is_video_call && <li>Consultation (Video): ₹{clinicService.consultation_charge_video_call}, Treatment (Video): ₹{clinicService.treatment_charge_video_call}</li>}
                        {clinicService.is_physical_visit && <li>Consultation (Physical): ₹{clinicService.consultation_charge_physical_visit}, Treatment (Physical): ₹{clinicService.treatment_charge_physical_visit}</li>}
                        {clinicService.is_home_visit && <li>Consultation (Home): ₹{clinicService.consultation_charge_home_visit}, Treatment (Home): ₹{clinicService.treatment_charge_home_visit}</li>}
                      </ul>
                    </div>
                    {clinicService.reason_for_rejection && (
                      <div>
                        <span className="font-semibold text-red-500">Reason for Rejection:</span> {clinicService.reason_for_rejection}
                      </div>
                    )}
                  </>
                ); })()
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
              <h2 className="text-xl font-semibold text-gray-900">Edit {activeTab === 'services' ? 'Service' : 'Clinic Service'}</h2>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {activeTab === 'services' ? (
                <form onSubmit={e => {
                  e.preventDefault();
                  const errors = validateServiceForm();
                  setFormErrors(errors);
                  if (Object.keys(errors).length > 0) return;
                  setServices(services.map(s => s.uuid === selectedItem.uuid ? { ...s, ...newService } : s));
                  closeModal();
                  showToast('Service updated successfully!', 'success');
                }} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold mb-1">Service Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className={`w-full px-4 py-3 rounded-xl border ${formErrors.name ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700`}
                      value={newService.name}
                      onChange={e => setNewService(s => ({ ...s, name: e.target.value }))}
                      placeholder="e.g. Dermatology"
                    />
                    {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
                  </div>
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold mb-1">Description <span className="text-red-500">*</span></label>
                    <textarea
                      className={`w-full px-4 py-3 rounded-xl border ${formErrors.description ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700`}
                      value={newService.description}
                      onChange={e => setNewService(s => ({ ...s, description: e.target.value }))}
                      placeholder="Describe the service..."
                      rows={3}
                    />
                    {formErrors.description && <p className="text-xs text-red-500 mt-1">{formErrors.description}</p>}
                  </div>
                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-semibold mb-1">Tags <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className={`w-full px-4 py-3 rounded-xl border ${formErrors.tags ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700`}
                      value={newService.tags}
                      onChange={e => setNewService(s => ({ ...s, tags: e.target.value }))}
                      placeholder="e.g. skin,dermatology,allergy"
                    />
                    {formErrors.tags && <p className="text-xs text-red-500 mt-1">{formErrors.tags}</p>}
                  </div>
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
              ) : (
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
                  } : cs));
                  closeModal();
                  showToast('Clinic service updated successfully!', 'success');
                }} className="space-y-5">
                  {/* Clinic */}
                  <div>
                    <label className="block text-sm font-semibold mb-1">Clinic <span className="text-red-500">*</span></label>
                    <select
                      className={`w-full px-4 py-3 rounded-xl border ${formErrors.clinic ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700`}
                      value={newClinicService.clinic}
                      onChange={e => setNewClinicService(cs => ({ ...cs, clinic: e.target.value }))}
                    >
                      <option value="">Select Clinic</option>
                      {sampleClinics.map(clinic => (
                        <option key={clinic.uuid} value={clinic.uuid}>{clinic.name}</option>
                      ))}
                    </select>
                    {formErrors.clinic && <p className="text-xs text-red-500 mt-1">{formErrors.clinic}</p>}
                  </div>
                  {/* Service */}
                  <div>
                    <label className="block text-sm font-semibold mb-1">Service <span className="text-red-500">*</span></label>
                    <select
                      className={`w-full px-4 py-3 rounded-xl border ${formErrors.service ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700`}
                      value={newClinicService.service}
                      onChange={e => setNewClinicService(cs => ({ ...cs, service: e.target.value }))}
                    >
                      <option value="">Select Service</option>
                      {services.map(service => (
                        <option key={service.uuid} value={service.uuid}>{service.name}</option>
                      ))}
                    </select>
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
              )}
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
              <p className="text-slate-700 text-lg">Are you sure you want to delete this {activeTab === 'services' ? 'service' : 'clinic service'}?</p>
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
    </div>
  );
};

export default ServiceManagement;