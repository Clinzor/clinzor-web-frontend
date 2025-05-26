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
  Image as ImageIcon
} from 'lucide-react';

// Sample services data
const initialServicesData = [
  {
    uuid: "5bfffdfc-0af4-4d17-8d0c-08466e2315e5",
    created_by: "admin@gmail.com",
    name: "Cardiology",
    description: "Specialist in diagnosing and treating heart and blood vessel conditions.",
    tags: "heart,cardiology,blood pressure,ECG,chest pain",
    image: null,
    created_at: "2025-05-20T10:30:00Z",
    updated_at: "2025-05-22T14:15:00Z"
  },
  {
    uuid: "7c12a3b4-1ef5-4a18-9e1d-12345e6789ab",
    created_by: "doctor@clinic.com",
    name: "Dermatology",
    description: "Comprehensive skin care and treatment for various dermatological conditions.",
    tags: "skin,acne,dermatitis,cosmetic,moles",
    image: null,
    created_at: "2025-05-19T09:15:00Z",
    updated_at: "2025-05-21T16:45:00Z"
  },
  {
    uuid: "9d34e5f6-2gh7-4b29-0f2e-23456f7890bc",
    created_by: "admin@gmail.com",
    name: "Pediatrics",
    description: "Medical care for infants, children, and adolescents up to 18 years old.",
    tags: "children,pediatric,vaccination,growth,development",
    image: null,
    created_at: "2025-05-18T11:20:00Z",
    updated_at: "2025-05-23T08:30:00Z"
  },
  {
    uuid: "1a56b7c8-3hi9-4c40-1g3f-34567g8901cd",
    created_by: "specialist@health.com",
    name: "Orthopedics",
    description: "Treatment of musculoskeletal system including bones, joints, and muscles.",
    tags: "bones,joints,fractures,sports injury,arthritis",
    image: null,
    created_at: "2025-05-17T13:45:00Z",
    updated_at: "2025-05-20T10:20:00Z"
  },
  {
    uuid: "2b67c8d9-4ij0-5d51-2h4g-45678h9012de",
    created_by: "admin@gmail.com",
    name: "Neurology",
    description: "Diagnosis and treatment of disorders of the nervous system.",
    tags: "brain,nerves,headache,seizures,stroke",
    image: null,
    created_at: "2025-05-16T15:30:00Z",
    updated_at: "2025-05-22T12:10:00Z"
  },
  {
    uuid: "3c78d9e0-5jk1-6e62-3i5h-56789i0123ef",
    created_by: "doctor@clinic.com",
    name: "Psychiatry",
    description: "Mental health care and treatment of psychological disorders.",
    tags: "mental health,depression,anxiety,therapy,counseling",
    image: null,
    created_at: "2025-05-15T14:20:00Z",
    updated_at: "2025-05-21T09:55:00Z"
  }
];

type Service = {
  uuid: string;
  created_by: string;
  name: string;
  description: string;
  tags: string;
  image: string | null;
  created_at: string;
  updated_at: string;
};

type Notification = {
  type: 'success' | 'warning' | 'error';
  message: string;
} | null;

type ModalMode = 'view' | 'edit' | 'add' | null;

export default function ServiceManagement() {
  const [services, setServices] = useState<Service[]>(initialServicesData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
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

  // Filter services based on search
  const filteredServices = services.filter(service => {
    const searchLower = searchTerm.toLowerCase();
    return service.name.toLowerCase().includes(searchLower) ||
           service.description.toLowerCase().includes(searchLower) ||
           service.tags.toLowerCase().includes(searchLower) ||
           service.created_by.toLowerCase().includes(searchLower);
  });

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedServices = filteredServices.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTags = (tags: string) => {
    return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  };

  const showNotification = (type: 'success' | 'warning' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleViewService = (service: Service) => {
    setSelectedService(service);
    setModalMode('view');
  };

  const handleEditService = (service: Service) => {
    setEditingService({ ...service });
    setModalMode('edit');
  };

  const handleAddService = () => {
    const newService: Service = {
      uuid: `temp-${Date.now()}`,
      created_by: "current@user.com", // This would come from auth context
      name: '',
      description: '',
      tags: '',
      image: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setEditingService(newService);
    setModalMode('add');
  };

  const handleDeleteService = (uuid: string) => {
    if (window.confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      setServices(services.filter(service => service.uuid !== uuid));
      showNotification('success', 'Service deleted successfully.');
    }
  };

  const handleSaveService = async () => {
    if (!editingService) return;
    
    // Validation
    if (!editingService.name.trim()) {
      showNotification('error', 'Service name is required.');
      return;
    }
    
    if (!editingService.description.trim()) {
      showNotification('error', 'Service description is required.');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      let updatedServices;
      
      if (modalMode === 'add') {
        const newService = {
          ...editingService,
          uuid: `service-${Date.now()}`, // In real app, this comes from backend
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        updatedServices = [...services, newService];
        showNotification('success', 'Service created successfully.');
      } else {
        updatedServices = services.map(service =>
          service.uuid === editingService.uuid
            ? { ...editingService, updated_at: new Date().toISOString() }
            : service
        );
        showNotification('success', 'Service updated successfully.');
      }
      
      setServices(updatedServices);
      handleCloseModal();
    } catch (error) {
      showNotification('error', 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setSelectedService(null);
    setEditingService(null);
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
  const MobileServiceCard = ({ service }: { service: Service }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 text-sm">{service.name}</h3>
          <p className="text-xs text-gray-500 flex items-center mt-1">
            <User size={10} className="mr-1" />
            {service.created_by}
          </p>
        </div>
      </div>
      
      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
        {service.description}
      </p>
      
      <div className="flex flex-wrap gap-1 mb-3">
        {formatTags(service.tags).slice(0, 3).map((tag, index) => (
          <span key={index} className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-xs text-blue-700">
            <Tag size={8} className="mr-1" />
            {tag}
          </span>
        ))}
        {formatTags(service.tags).length > 3 && (
          <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs text-gray-600">
            +{formatTags(service.tags).length - 3} more
          </span>
        )}
      </div>
      
      <div className="text-xs text-gray-500 mb-3">
        <div className="flex items-center">
          <Calendar size={10} className="mr-1" />
          Updated: {formatDate(service.updated_at)}
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <button
          onClick={() => handleViewService(service)}
          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="View Details"
        >
          <Eye size={14} />
        </button>
        <button
          onClick={() => handleEditService(service)}
          className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          title="Edit Service"
        >
          <Edit3 size={14} />
        </button>
        <button
          onClick={() => handleDeleteService(service.uuid)}
          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete Service"
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
    
    const currentService = isViewMode ? selectedService : editingService;
    if (!currentService) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {isViewMode && 'Service Details'}
              {isEditMode && 'Edit Service'}
              {isAddMode && 'Add New Service'}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                  <p className="text-gray-900">{currentService.name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-gray-700">{currentService.description}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {formatTags(currentService.tags).map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-sm text-blue-700">
                        <Tag size={12} className="mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Created By</label>
                    <p className="text-gray-700 flex items-center">
                      <User size={14} className="mr-2" />
                      {currentService.created_by}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service ID</label>
                    <p className="text-gray-700 font-mono text-sm">{currentService.uuid}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                    <p className="text-gray-700 text-sm">{formatDate(currentService.created_at)}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                    <p className="text-gray-700 text-sm">{formatDate(currentService.updated_at)}</p>
                  </div>
                </div>
              </div>
            ) : (
              // Edit/Add Mode
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={currentService.name}
                    onChange={(e) => setEditingService({ ...currentService, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter service name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={currentService.description}
                    onChange={(e) => setEditingService({ ...currentService, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter service description"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <input
                    type="text"
                    value={currentService.tags}
                    onChange={(e) => setEditingService({ ...currentService, tags: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter tags separated by commas"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
                </div>
                
                {isEditMode && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Service ID</label>
                      <p className="text-gray-700 font-mono text-sm">{currentService.uuid}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Created By</label>
                      <p className="text-gray-700">{currentService.created_by}</p>
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
                onClick={handleSaveService}
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
              Manage your clinic's services and their details
            </p>
          </div>
          <button
            onClick={handleAddService}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto"
          >
            <PlusCircle size={16} />
            <span>Add New Service</span>
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
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search services by name, description, tags, or creator..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Items per page */}
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mx-4 sm:mx-6 mt-4 px-4 py-3 bg-white rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredServices.length)} of {filteredServices.length} services
          </p>
          <p className="text-xs text-gray-500">
            Page {currentPage} of {totalPages}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow mx-4 sm:mx-6 mt-4 mb-4">
        {filteredServices.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by adding your first service.'}
            </p>
            {!searchTerm && (
              <button
                onClick={handleAddService}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <PlusCircle size={16} />
                Add New Service
              </button>
            )}
          </div>
        ) : isMobileView ? (
          /* Mobile Card View */
          <div className="space-y-3">
            {paginatedServices.map((service) => (
              <MobileServiceCard key={service.uuid} service={service} />
            ))}
          </div>
        ) : (
          /* Desktop Table View */
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tags
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedServices.map((service) => (
                    <tr key={service.uuid} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{service.name}</div>
                          <div className="text-xs text-gray-500 font-mono">{service.uuid}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          <p className="line-clamp-2">{service.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {formatTags(service.tags).slice(0, 2).map((tag, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-xs text-blue-700">
                              <Tag size={10} className="mr-1" />
                              {tag}
                            </span>
                          ))}
                          {formatTags(service.tags).length > 2 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs text-gray-600">
                              +{formatTags(service.tags).length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">{service.created_by}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{formatDate(service.updated_at)}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleViewService(service)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEditService(service)}
                            className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteService(service.uuid)}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-1 mb-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronLeft size={14} />
          </button>
          {generatePageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 text-sm border rounded ${
                page === currentPage
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Modal */}
      {Modal()}
    </div>
  );
}
