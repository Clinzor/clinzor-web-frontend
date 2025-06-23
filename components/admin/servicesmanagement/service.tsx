import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Eye, X, Check, Search, Tag, Heart, Stethoscope, Brain, User, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';

type ServiceStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface Service {
  uuid: string;
  name: string;
  description: string;
  tags: string;
  status: ServiceStatus;
}

const MedicalServicesApp: React.FC = () => {
  const [services, setServices] = useState<Service[]>([
    {
      uuid: "d7afe788-af8b-4fd4-b65b-bab700df841a",
      name: "cardiologist",
      description: "Specialist in diagnosing and treating heart and blood vessel conditions.",
      tags: "heart,cardiology,blood pressure,ECG,chest pain",
      status: "PENDING"
    },
    {
      uuid: "661d42bc-4393-49a3-ab8f-c24b6ab17c38",
      name: "heart speciality",
      description: "Focus on the diagnosis, treatment, and management of heart and blood vessel conditions",
      tags: "heart",
      status: "APPROVED"
    },
    {
      uuid: "62111833-4927-4060-acdf-f2d857e9d688",
      name: "neurologist",
      description: "Specialist in diagnosing and treating neurological disorders and brain conditions.",
      tags: "brain,neurology,headache,seizures,memory",
      status: "REJECTED"
    },
    {
      uuid: "5bfffdfc-0af4-4d17-8d0c-08466e2315e5",
      name: "physician",
      description: "General practitioner providing comprehensive healthcare and preventive medicine.",
      tags: "general,healthcare,checkup,prevention,medicine",
      status: "PENDING"
    },
    {
      uuid: "1234567890",
      name: "dermatologist",
      description: "Specialist in diagnosing and treating skin, hair, and nail conditions.",
      tags: "skin,dermatology,acne,eczema,hair",
      status: "APPROVED"
    },
    {
      uuid: "0987654321",
      name: "orthopedic surgeon",
      description: "Specialist in treating musculoskeletal system disorders and injuries.",
      tags: "bones,joints,surgery,fractures,sports",
      status: "PENDING"
    },
    {
      uuid: "1122334455",
      name: "pediatrician",
      description: "Medical doctor specializing in the care of infants, children, and adolescents.",
      tags: "children,pediatrics,vaccination,growth,development",
      status: "APPROVED"
    }
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [viewingService, setViewingService] = useState<Service | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ServiceStatus>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: ''
  });

  const getServiceIcon = (name: string) => {
    const serviceLower = name.toLowerCase();
    if (serviceLower.includes('cardio') || serviceLower.includes('heart')) {
      return <Heart className="w-5 h-5 text-red-500" />;
    } else if (serviceLower.includes('neuro') || serviceLower.includes('brain')) {
      return <Brain className="w-5 h-5 text-purple-500" />;
    } else if (serviceLower.includes('physician') || serviceLower.includes('doctor')) {
      return <User className="w-5 h-5 text-blue-500" />;
    } else {
      return <Stethoscope className="w-5 h-5 text-green-500" />;
    }
  };

  const getStatusColor = (status: ServiceStatus) => {
    switch (status) {
      case 'APPROVED':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'REJECTED':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.description.trim() || !formData.tags.trim()) {
      alert('Please fill in all fields');
      return;
    }
    if (editingService) {
      setServices(services.map((service) =>
        service.uuid === editingService.uuid
          ? { ...service, ...formData }
          : service
      ));
    } else {
      const newService: Service = {
        uuid: Date.now().toString(),
        ...formData,
        status: 'PENDING'
      };
      setServices([...services, newService]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', tags: '' });
    setIsFormOpen(false);
    setEditingService(null);
  };

  const handleEdit = (service: Service) => {
    setFormData({
      name: service.name,
      description: service.description,
      tags: service.tags
    });
    setEditingService(service);
    setIsFormOpen(true);
  };

  const handleDelete = (uuid: string) => {
    setServices(services.filter((service) => service.uuid !== uuid));
  };

  const handleStatusChange = (uuid: string, newStatus: ServiceStatus) => {
    setServices(services.map((service) =>
      service.uuid === uuid
        ? { ...service, status: newStatus }
        : service
    ));
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.tags.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || service.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentServices = filteredServices.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const getStatusCounts = () => {
    return {
      ALL: services.length,
      PENDING: services.filter((s) => s.status === 'PENDING').length,
      APPROVED: services.filter((s) => s.status === 'APPROVED').length,
      REJECTED: services.filter((s) => s.status === 'REJECTED').length
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-20 py-4 sm:py-0 gap-4 sm:gap-0">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Service Management</h1>
                <p className="text-sm text-gray-500">Manage and monitor medical services</p>
              </div>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Service</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-8">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div
              key={status}
              onClick={() => setStatusFilter(status as 'ALL' | ServiceStatus)}
              className={`p-4 sm:p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                statusFilter === status
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    {status === 'ALL' ? 'Total Services' : status.charAt(0) + status.slice(1).toLowerCase()}
                  </p>
                  <p className="text-xl sm:text-3xl font-bold text-gray-900">{count}</p>
                </div>
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${
                  status === 'APPROVED' ? 'bg-green-100' :
                  status === 'REJECTED' ? 'bg-red-100' :
                  status === 'PENDING' ? 'bg-yellow-100' : 'bg-blue-100'
                }`}>
                  {status === 'APPROVED' ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" /> :
                   status === 'REJECTED' ? <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" /> :
                   status === 'PENDING' ? <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" /> :
                   <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="mb-4 sm:mb-8 flex flex-col sm:flex-row gap-2 sm:gap-4">
          <div className="relative flex-1 max-w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
            />
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-8">
          {currentServices.map((service) => (
            <div key={service.uuid} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getServiceIcon(service.name)}
                    <div>
                      <h3 className="font-semibold text-gray-900 capitalize text-base sm:text-lg">{service.name}</h3>
                      <span className={`text-xs px-3 py-1 rounded-full border font-medium ${getStatusColor(service.status)}`}>
                        {service.status}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm mb-4 line-clamp-3 leading-relaxed">{service.description}</p>
                <div className="flex flex-wrap gap-1 mb-4 sm:mb-6">
                  {service.tags.split(',').slice(0, 3).map((tag, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md flex items-center space-x-1">
                      <Tag className="w-3 h-3" />
                      <span>{tag.trim()}</span>
                    </span>
                  ))}
                  {service.tags.split(',').length > 3 && (
                    <span className="text-xs text-gray-400">+{service.tags.split(',').length - 3} more</span>
                  )}
                </div>
                {/* Action Buttons */}
                <div className="space-y-2 sm:space-y-3">
                  {/* Approve/Reject Buttons */}
                  {service.status === 'PENDING' && (
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() => handleStatusChange(service.uuid, 'APPROVED')}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleStatusChange(service.uuid, 'REJECTED')}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                  {/* Status Change for Approved/Rejected */}
                  {service.status !== 'PENDING' && (
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      {service.status === 'APPROVED' && (
                        <button
                          onClick={() => handleStatusChange(service.uuid, 'REJECTED')}
                          className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                        >
                          Mark as Rejected
                        </button>
                      )}
                      {service.status === 'REJECTED' && (
                        <button
                          onClick={() => handleStatusChange(service.uuid, 'APPROVED')}
                          className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                        >
                          Mark as Approved
                        </button>
                      )}
                      <button
                        onClick={() => handleStatusChange(service.uuid, 'PENDING')}
                        className="flex-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                      >
                        Mark as Pending
                      </button>
                    </div>
                  )}
                  {/* View/Edit/Delete */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <button
                      onClick={() => setViewingService(service)}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(service)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(service.uuid)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <div className="text-center py-8 sm:py-16">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Search className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-500 mb-4 sm:mb-6">Try adjusting your search criteria or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between bg-white px-4 sm:px-6 py-2 sm:py-4 rounded-xl border border-gray-200 gap-2 sm:gap-0">
            <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-2 sm:mb-0">
              <span>
                Showing {startIndex + 1} to {Math.min(endIndex, filteredServices.length)} of {filteredServices.length} results
              </span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex space-x-0.5 sm:space-x-1">
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm rounded-lg transition-colors ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return <span key={page} className="px-1 sm:px-2 text-gray-400">...</span>;
                  }
                  return null;
                })}
              </div>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-2xl max-w-full sm:max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Service Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter service name"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Enter service description"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-all transition-all"
                    placeholder="heart, cardiology, blood pressure"
                  />
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-2 sm:pt-4">
                  <button
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 sm:py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:py-3 rounded-xl transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingService ? 'Update' : 'Create'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewingService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-2xl max-w-full sm:max-w-md w-full shadow-2xl">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center space-x-3">
                  {getServiceIcon(viewingService.name)}
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 capitalize">
                    {viewingService.name}
                  </h2>
                </div>
                <button
                  onClick={() => setViewingService(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Status</h3>
                  <span className={`text-xs sm:text-sm px-3 py-1 rounded-full border font-medium ${getStatusColor(viewingService.status)}`}>
                    {viewingService.status}
                  </span>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Description</h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    {viewingService.description}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {viewingService.tags.split(',').map((tag, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md flex items-center space-x-1">
                        <Tag className="w-3 h-3" />
                        <span>{tag.trim()}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-gray-100">
                <button
                  onClick={() => {
                    setViewingService(null);
                    handleEdit(viewingService);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:py-3 rounded-xl transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Service</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalServicesApp;