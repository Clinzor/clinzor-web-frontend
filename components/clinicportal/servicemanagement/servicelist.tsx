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
  Tag,
  User,
  Calendar,
  FileText,
  Image as ImageIcon,
  Shield,
  Building,
  DollarSign,
  Video,
  Home,
  MapPin,
  Clock,
  Star,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle
} from 'lucide-react';

// Sample services data based on your API structure
const initialServicesData: Service[] = [
  {
    uuid: "1",
    name: "Cardiology Consultation",
    description: "Expert consultation for heart-related issues",
    tags: "heart,cardiology,blood pressure,ECG,chest pain",
    image: null,
    status: "APPROVED",
    is_video_call: true,
    is_clinic_visit: true,
    is_home_service: false,
    consultation_charge_video_call: "0",
    consultation_charge_clinic: null,
    consultation_charge_home_visit: "0",
    treatment_charge_video_call: "0",
    treatment_charge_clinic: null,
    treatment_charge_home_visit: "0"
  },
  {
    uuid: "2",
    name: "Heart Surgery",
    description: "Advanced surgical procedures for heart conditions",
    tags: "heart",
    image: null,
    status: "APPROVED",
    is_video_call: true,
    is_clinic_visit: true,
    is_home_service: false,
    consultation_charge_video_call: "0",
    consultation_charge_clinic: null,
    consultation_charge_home_visit: "0",
    treatment_charge_video_call: "0",
    treatment_charge_clinic: null,
    treatment_charge_home_visit: "0"
  },
  {
    uuid: "3",
    name: "Neurology Consultation",
    description: "Specialized consultation for neurological disorders",
    tags: "brain,nerves,headache,seizures,stroke",
    image: null,
    status: "PENDING",
    is_video_call: true,
    is_clinic_visit: true,
    is_home_service: false,
    consultation_charge_video_call: "0",
    consultation_charge_clinic: null,
    consultation_charge_home_visit: "0",
    treatment_charge_video_call: "0",
    treatment_charge_clinic: null,
    treatment_charge_home_visit: "0"
  },
  {
    uuid: "4",
    name: "General Medicine",
    description: "Comprehensive medical consultation and treatment",
    tags: "general,medicine,consultation,diagnosis",
    image: null,
    status: "APPROVED",
    is_video_call: true,
    is_clinic_visit: true,
    is_home_service: false,
    consultation_charge_video_call: "0",
    consultation_charge_clinic: null,
    consultation_charge_home_visit: "0",
    treatment_charge_video_call: "0",
    treatment_charge_clinic: null,
    treatment_charge_home_visit: "0"
  }
];

type Service = {
  uuid: string;
  name: string;
  description: string;
  tags: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  image: string | null;
  is_video_call: boolean;
  is_clinic_visit: boolean;
  is_home_service: boolean;
  consultation_charge_video_call: string | null;
  consultation_charge_clinic: string | null;
  consultation_charge_home_visit: string | null;
  treatment_charge_video_call: string | null;
  treatment_charge_clinic: string | null;
  treatment_charge_home_visit: string | null;
};

type ServiceLink = {
  clinic: string;
  service: string;
  rank: string;
  consultation_charge_video_call?: number;
  consultation_charge_home_visit?: number;
  treatment_charge_video_call?: number;
  treatment_charge_physical_visit?: number;
  consultation_charge_physical_visit?: number;
  treatment_charge_home_visit?: number;
  is_video_call: boolean;
  is_home_service: boolean;
  is_clinic_visit: boolean;
};

type Notification = {
  type: 'success' | 'warning' | 'error';
  message: string;
} | null;

type ModalMode = 'view' | 'edit' | 'add' | 'link' | 'delete' | null;

type NewService = {
  name: string;
  description: string;
  tags: string;
  is_video_call: boolean;
  is_clinic_visit: boolean;
  is_home_service: boolean;
  consultation_charge_video_call: string | null;
  consultation_charge_clinic: string | null;
  consultation_charge_home_visit: string | null;
  treatment_charge_video_call: string | null;
  treatment_charge_clinic: string | null;
  treatment_charge_home_visit: string | null;
};

export default function ServiceManagement() {
  const [services, setServices] = useState<Service[]>(initialServicesData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [linkingService, setLinkingService] = useState<ServiceLink | null>(null);
  const [notification, setNotification] = useState<Notification>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newService, setNewService] = useState<NewService>({
    name: '',
    description: '',
    tags: '',
    is_video_call: true,
    is_clinic_visit: true,
    is_home_service: false,
    consultation_charge_video_call: null,
    consultation_charge_clinic: null,
    consultation_charge_home_visit: null,
    treatment_charge_video_call: null,
    treatment_charge_clinic: null,
    treatment_charge_home_visit: null
  });

  // Check if we're in mobile view
  React.useEffect(() => {
    const checkViewport = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Filter services based on search and status
  const filteredServices = services.filter(service => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = service.name.toLowerCase().includes(searchLower) ||
                         service.description.toLowerCase().includes(searchLower) ||
                         (service.tags && service.tags.toLowerCase().includes(searchLower));
    
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedServices = filteredServices.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage, statusFilter]);

  const getStatusConfig = (status: Service['status']) => {
    switch (status) {
      case 'APPROVED':
        return {
          color: 'bg-green-100 text-green-700 border-green-200',
          icon: CheckCircle,
          text: 'Approved'
        };
      case 'PENDING':
        return {
          color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
          icon: Clock,
          text: 'Pending'
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

  const formatTags = (tags: string | null) => {
    if (!tags) return [];
    return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  };

  const showNotification = (type: 'success' | 'warning' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleAddClick = () => {
    setModalMode('add');
    setIsModalOpen(true);
    setNewService({
      name: '',
      description: '',
      tags: '',
      is_video_call: true,
      is_clinic_visit: true,
      is_home_service: false,
      consultation_charge_video_call: null,
      consultation_charge_clinic: null,
      consultation_charge_home_visit: null,
      treatment_charge_video_call: null,
      treatment_charge_clinic: null,
      treatment_charge_home_visit: null
    });
  };

  const handleViewService = (service: Service) => {
    setSelectedService(service);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEditClick = (service: Service) => {
    setSelectedService(service);
    setNewService({
      name: service.name,
      description: service.description,
      tags: service.tags,
      is_video_call: service.is_video_call,
      is_clinic_visit: service.is_clinic_visit,
      is_home_service: service.is_home_service,
      consultation_charge_video_call: service.consultation_charge_video_call,
      consultation_charge_clinic: service.consultation_charge_clinic,
      consultation_charge_home_visit: service.consultation_charge_home_visit,
      treatment_charge_video_call: service.treatment_charge_video_call,
      treatment_charge_clinic: service.treatment_charge_clinic,
      treatment_charge_home_visit: service.treatment_charge_home_visit
    });
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteClick = (service: Service) => {
    setSelectedService(service);
    setModalMode('delete');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalMode(null);
    setSelectedService(null);
  };

  const handleAddService = async () => {
    if (!newService.name || !newService.description) {
      showNotification('error', 'Please fill in all required fields.');
      return;
    }

    setIsLoading(true);

    try {
      const service: Service = {
        uuid: Math.random().toString(36).substr(2, 9),
        name: newService.name,
        description: newService.description,
        tags: newService.tags,
        image: null,
        status: 'PENDING',
        is_video_call: newService.is_video_call,
        is_clinic_visit: newService.is_clinic_visit,
        is_home_service: newService.is_home_service,
        consultation_charge_video_call: newService.consultation_charge_video_call,
        consultation_charge_clinic: newService.consultation_charge_clinic,
        consultation_charge_home_visit: newService.consultation_charge_home_visit,
        treatment_charge_video_call: newService.treatment_charge_video_call,
        treatment_charge_clinic: newService.treatment_charge_clinic,
        treatment_charge_home_visit: newService.treatment_charge_home_visit
      };

      setServices([...services, service]);
      showNotification('success', 'Service added successfully.');
      handleCloseModal();
    } catch (error) {
      showNotification('error', 'Failed to add service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditService = async () => {
    if (!selectedService) return;
    
    if (!newService.name || !newService.description) {
      showNotification('error', 'Please fill in all required fields.');
      return;
    }

    setIsLoading(true);

    try {
      const updatedService: Service = {
        ...selectedService,
        name: newService.name,
        description: newService.description,
        tags: newService.tags,
        is_video_call: newService.is_video_call,
        is_clinic_visit: newService.is_clinic_visit,
        is_home_service: newService.is_home_service,
        consultation_charge_video_call: newService.consultation_charge_video_call,
        consultation_charge_clinic: newService.consultation_charge_clinic,
        consultation_charge_home_visit: newService.consultation_charge_home_visit,
        treatment_charge_video_call: newService.treatment_charge_video_call,
        treatment_charge_clinic: newService.treatment_charge_clinic,
        treatment_charge_home_visit: newService.treatment_charge_home_visit
      };

      setServices(services.map(service => 
        service.uuid === selectedService.uuid ? updatedService : service
      ));
      showNotification('success', 'Service updated successfully.');
      handleCloseModal();
    } catch (error) {
      showNotification('error', 'Failed to update service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteService = async () => {
    if (!selectedService) return;

    setIsLoading(true);

    try {
      setServices(services.filter(service => service.uuid !== selectedService.uuid));
      showNotification('success', 'Service deleted successfully.');
      handleCloseModal();
    } catch (error) {
      showNotification('error', 'Failed to delete service. Please try again.');
    } finally {
      setIsLoading(false);
    }
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

  // Modal Component
  const Modal = () => {
    if (!modalMode) return null;

    const isViewMode = modalMode === 'view';
    const isEditMode = modalMode === 'edit';
    const isAddMode = modalMode === 'add';
    const isDeleteMode = modalMode === 'delete';
    
    const currentService = isViewMode ? selectedService : editingService;
    if (!currentService && !isDeleteMode) return null;

    const statusConfig = getStatusConfig(currentService?.status || 'PENDING');
    const StatusIcon = statusConfig.icon;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {isViewMode && 'Service Details'}
              {isEditMode && 'Edit Service'}
              {isAddMode && 'Add New Service'}
              {isDeleteMode && 'Delete Service'}
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
            {isDeleteMode && selectedService ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center text-red-500 mb-4">
                  <AlertTriangle size={48} />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Are you sure you want to delete this service?
                  </h3>
                  <p className="text-gray-600 mb-4">
                    This action cannot be undone. This will permanently delete the service
                    <span className="font-semibold"> {selectedService.name}</span> and all associated data.
                  </p>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={handleCloseModal}
                      className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteService}
                      disabled={isLoading}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 size={16} />
                          Delete Service
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : isViewMode ? (
              // View Mode - Show service details
              <div className="space-y-6">
                {/* Service Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                      {StatusIcon && <StatusIcon size={14} />}
                      {statusConfig.text}
                    </span>
                  </div>
                </div>

                {/* Service Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Service Name</h3>
                    <p className="text-base text-gray-900">{currentService?.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                    <p className="text-base text-gray-900">{currentService?.description}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentService?.tags ? formatTags(currentService.tags).map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-xs text-blue-700 font-medium border border-blue-100">
                          {tag}
                        </span>
                      )) : (
                        <span className="text-gray-500">No tags</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Service Type</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentService?.is_video_call && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-purple-50 text-xs text-purple-700 font-medium border border-purple-100">
                          Video Call
                        </span>
                      )}
                      {currentService?.is_clinic_visit && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-50 text-xs text-green-700 font-medium border border-green-100">
                          Clinic Visit
                        </span>
                      )}
                      {currentService?.is_home_service && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-xs text-blue-700 font-medium border border-blue-100">
                          Home Visit
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Charges */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Service Charges</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Consultation Charges */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-3">Consultation Charges</h4>
                      <div className="space-y-3">
                        {currentService?.is_video_call && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Video Call</span>
                            <span className="text-sm font-medium text-gray-900">
                              {currentService.consultation_charge_video_call ? 
                                `₹${currentService.consultation_charge_video_call}` : 
                                'Not available'}
                            </span>
                          </div>
                        )}
                        {currentService?.is_clinic_visit && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Clinic Visit</span>
                            <span className="text-sm font-medium text-gray-900">
                              {currentService.consultation_charge_clinic ? 
                                `₹${currentService.consultation_charge_clinic}` : 
                                'Not available'}
                            </span>
                          </div>
                        )}
                        {currentService?.is_home_service && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Home Visit</span>
                            <span className="text-sm font-medium text-gray-900">
                              {currentService.consultation_charge_home_visit ? 
                                `₹${currentService.consultation_charge_home_visit}` : 
                                'Not available'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Treatment Charges */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-3">Treatment Charges</h4>
                      <div className="space-y-3">
                        {currentService?.is_video_call && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Video Call</span>
                            <span className="text-sm font-medium text-gray-900">
                              {currentService.treatment_charge_video_call ? 
                                `₹${currentService.treatment_charge_video_call}` : 
                                'Not available'}
                            </span>
                          </div>
                        )}
                        {currentService?.is_clinic_visit && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Clinic Visit</span>
                            <span className="text-sm font-medium text-gray-900">
                              {currentService.treatment_charge_clinic ? 
                                `₹${currentService.treatment_charge_clinic}` : 
                                'Not available'}
                            </span>
                          </div>
                        )}
                        {currentService?.is_home_service && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Home Visit</span>
                            <span className="text-sm font-medium text-gray-900">
                              {currentService.treatment_charge_home_visit ? 
                                `₹${currentService.treatment_charge_home_visit}` : 
                                'Not available'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Edit/Add Mode
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={newService.name}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tags</label>
                  <input
                    type="text"
                    value={newService.tags}
                    onChange={(e) => setNewService({ ...newService, tags: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Video Call</label>
                    <input
                      type="checkbox"
                      checked={newService.is_video_call}
                      onChange={(e) => setNewService({ ...newService, is_video_call: e.target.checked })}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Clinic Visit</label>
                    <input
                      type="checkbox"
                      checked={newService.is_clinic_visit}
                      onChange={(e) => setNewService({ ...newService, is_clinic_visit: e.target.checked })}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Home Service</label>
                    <input
                      type="checkbox"
                      checked={newService.is_home_service}
                      onChange={(e) => setNewService({ ...newService, is_home_service: e.target.checked })}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Video Call Consultation Charge</label>
                    <input
                      type="number"
                      value={newService.consultation_charge_video_call || ''}
                      onChange={(e) => setNewService({ ...newService, consultation_charge_video_call: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Clinic Consultation Charge</label>
                    <input
                      type="number"
                      value={newService.consultation_charge_clinic || ''}
                      onChange={(e) => setNewService({ ...newService, consultation_charge_clinic: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Home Visit Consultation Charge</label>
                    <input
                      type="number"
                      value={newService.consultation_charge_home_visit || ''}
                      onChange={(e) => setNewService({ ...newService, consultation_charge_home_visit: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Video Call Treatment Charge</label>
                    <input
                      type="number"
                      value={newService.treatment_charge_video_call || ''}
                      onChange={(e) => setNewService({ ...newService, treatment_charge_video_call: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Clinic Treatment Charge</label>
                    <input
                      type="number"
                      value={newService.treatment_charge_clinic || ''}
                      onChange={(e) => setNewService({ ...newService, treatment_charge_clinic: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Home Visit Treatment Charge</label>
                    <input
                      type="number"
                      value={newService.treatment_charge_home_visit || ''}
                      onChange={(e) => setNewService({ ...newService, treatment_charge_home_visit: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
                onClick={handleEditService}
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
                    {isAddMode ? 'Create Service' : 'Update Service'}
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
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Service Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              {filteredServices.length} services found
            </p>
          </div>
          <button
            onClick={handleAddClick}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto"
          >
            <PlusCircle size={16} />
            <span>Add Service</span>
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
              placeholder="Search by name, description, or tags..."
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
              <option value="PENDING">Pending</option>
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

      {/* Service Cards */}
      <div className="flex-1 px-4 sm:px-6 py-6">
        {paginatedServices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FileText size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedServices.map((service) => (
              <div key={service.uuid} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                {/* Header with status */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm truncate">{service.name}</h3>
                    <p className="text-xs text-gray-500 flex items-center mt-1 truncate">
                      <Tag size={10} className="mr-1 flex-shrink-0" />
                      {service.tags ? formatTags(service.tags)[0] : 'No tags'}
                    </p>
                  </div>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusConfig(service.status).color}`}>
                    {(() => {
                      const StatusIcon = getStatusConfig(service.status).icon;
                      return StatusIcon ? <StatusIcon size={10} className="mr-1" /> : null;
                    })()}
                    {getStatusConfig(service.status).text}
                  </div>
                </div>
                
                {/* Description */}
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  {service.description}
                </p>
                
                {/* Tags */}
                {service.tags && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {formatTags(service.tags).slice(0, 2).map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 text-xs text-blue-700 font-medium border border-blue-100">
                        {tag}
                      </span>
                    ))}
                    {formatTags(service.tags).length > 2 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-50 text-xs text-gray-600 font-medium border border-gray-200">
                        +{formatTags(service.tags).length - 2} more
                      </span>
                    )}
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => handleViewService(service)}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => handleEditClick(service)}
                    className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Edit Service"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(service)}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Service"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white border-t border-gray-200 px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredServices.length)} of {filteredServices.length} services
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