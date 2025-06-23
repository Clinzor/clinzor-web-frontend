import React, { useState } from 'react';
import { Edit3, Eye, X, Check, Search, Tag, Heart, Stethoscope, Brain, User, CheckCircle, XCircle, ChevronLeft, ChevronRight, DollarSign, Video, Home, Building, Star } from 'lucide-react';

interface Service {
  uuid: string;
  service: string;
  clinic: string;
  service_name: string;
  created_by: string;
  clinic_provided_name: string | null;
  rank: number;
  consultation_charge_video_call: string;
  consultation_charge_physical_visit: string | null;
  consultation_charge_home_visit: string | null;
  treatment_charge_video_call: string;
  treatment_charge_physical_visit: string | null;
  treatment_charge_home_visit: string | null;
  status: 'DRAFT' | 'APPROVED' | 'REJECTED';
  is_video_call: boolean;
  is_home_visit: boolean;
  is_physical_visit: boolean;
  image: string | null;
  description: string | null;
  reason_for_rejection: string | null;
}

interface FormData {
  rank: string;
  consultation_charge_video_call: string;
  consultation_charge_physical_visit: string;
  consultation_charge_home_visit: string;
  treatment_charge_video_call: string;
  treatment_charge_physical_visit: string;
  treatment_charge_home_visit: string;
  is_video_call: boolean;
  is_physical_visit: boolean;
  is_home_visit: boolean;
  description: string;
  reason_for_rejection: string;
}

const ClinicServices = () => {
  const [services, setServices] = useState<Service[]>([
    {
      "uuid": "1abdeca9-244b-4696-94d6-d6ad69d088c0",
      "service": "d7afe788-af8b-4fd4-b65b-bab700df841a",
      "clinic": "7b420213-bdba-487f-a5f5-553ab55a81e8",
      "service_name": "cardiology",
      "created_by": "admin@gmail.com",
      "clinic_provided_name": null,
      "rank": 1,
      "consultation_charge_video_call": "400.00",
      "consultation_charge_physical_visit": null,
      "consultation_charge_home_visit": "200.00",
      "treatment_charge_video_call": "200.00",
      "treatment_charge_physical_visit": "200.00",
      "treatment_charge_home_visit": "200.00",
      "status": "DRAFT",
      "is_video_call": true,
      "is_home_visit": false,
      "is_physical_visit": true,
      "image": null,
      "description": null,
      "reason_for_rejection": null
    },
    {
      "uuid": "77d7b4ff-7080-4a4f-bf5c-1611e45b92fb",
      "service": "d7afe788-af8b-4fd4-b65b-bab700df841a",
      "clinic": "d7204f42-d700-40b9-b29f-045dcd023e4a",
      "service_name": "cardiology",
      "created_by": "admin@gmail.com",
      "clinic_provided_name": null,
      "rank": 1,
      "consultation_charge_video_call": "400.00",
      "consultation_charge_physical_visit": null,
      "consultation_charge_home_visit": "200.00",
      "treatment_charge_video_call": "200.00",
      "treatment_charge_physical_visit": "200.00",
      "treatment_charge_home_visit": "200.00",
      "status": "DRAFT",
      "is_video_call": true,
      "is_home_visit": false,
      "is_physical_visit": true,
      "image": null,
      "description": null,
      "reason_for_rejection": null
    },
    {
      "uuid": "159e3627-65eb-40b2-b535-37cbb6535ab8",
      "service": "d7afe788-af8b-4fd4-b65b-bab700df841a",
      "clinic": "5a1f8f39-ca38-464c-93c5-ea8edbd6c03f",
      "service_name": "cardiology",
      "created_by": "admin@gmail.com",
      "clinic_provided_name": null,
      "rank": 1,
      "consultation_charge_video_call": "400.00",
      "consultation_charge_physical_visit": "200.00",
      "consultation_charge_home_visit": "200.00",
      "treatment_charge_video_call": "600.00",
      "treatment_charge_physical_visit": "500.00",
      "treatment_charge_home_visit": "800.00",
      "status": "APPROVED",
      "is_video_call": true,
      "is_home_visit": false,
      "is_physical_visit": true,
      "image": null,
      "description": null,
      "reason_for_rejection": null
    },
    {
      "uuid": "59044e96-2558-4d9b-a6ee-2d38ab4f3b35",
      "service": "661d42bc-4393-49a3-ab8f-c24b6ab17c38",
      "clinic": "8c16ae4e-bb2a-48d3-90bf-7cb84d9a3a03",
      "service_name": "heart speciality",
      "created_by": "admin@gmail.com",
      "clinic_provided_name": null,
      "rank": 1,
      "consultation_charge_video_call": "200.00",
      "consultation_charge_physical_visit": "200.00",
      "consultation_charge_home_visit": "200.00",
      "treatment_charge_video_call": "500.00",
      "treatment_charge_physical_visit": "300.00",
      "treatment_charge_home_visit": "680.00",
      "status": "APPROVED",
      "is_video_call": true,
      "is_home_visit": false,
      "is_physical_visit": true,
      "image": null,
      "description": null,
      "reason_for_rejection": null
    },
    {
      "uuid": "a1bc0d8e-544e-4f20-8e2f-dbcfddbabc54",
      "service": "661d42bc-4393-49a3-ab8f-c24b6ab17c38",
      "clinic": "7b420213-bdba-487f-a5f5-553ab55a81e8",
      "service_name": "heart speciality",
      "created_by": "admin@gmail.com",
      "clinic_provided_name": null,
      "rank": 3,
      "consultation_charge_video_call": "300.00",
      "consultation_charge_physical_visit": "200.00",
      "consultation_charge_home_visit": "300.00",
      "treatment_charge_video_call": "450.00",
      "treatment_charge_physical_visit": "400.00",
      "treatment_charge_home_visit": "900.00",
      "status": "APPROVED",
      "is_video_call": true,
      "is_home_visit": false,
      "is_physical_visit": true,
      "image": null,
      "description": null,
      "reason_for_rejection": null
    },
    {
      "uuid": "189b7875-b9f3-4c86-bd1d-157d3413ab00",
      "service": "62111833-4927-4060-acdf-f2d857e9d688",
      "clinic": "8c16ae4e-bb2a-48d3-90bf-7cb84d9a3a03",
      "service_name": "neurologist",
      "created_by": "admin@gmail.com",
      "clinic_provided_name": null,
      "rank": 5,
      "consultation_charge_video_call": "150.00",
      "consultation_charge_physical_visit": "200.00",
      "consultation_charge_home_visit": "200.00",
      "treatment_charge_video_call": "200.00",
      "treatment_charge_physical_visit": "500.00",
      "treatment_charge_home_visit": "200.00",
      "status": "DRAFT",
      "is_video_call": true,
      "is_home_visit": false,
      "is_physical_visit": true,
      "image": null,
      "description": null,
      "reason_for_rejection": null
    }
  ]);

  const [editingService, setEditingService] = useState<Service | null>(null);
  const [viewingService, setViewingService] = useState<Service | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DRAFT' | 'APPROVED' | 'REJECTED'>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(6);
  const [formData, setFormData] = useState<FormData>({
    rank: '',
    consultation_charge_video_call: '',
    consultation_charge_physical_visit: '',
    consultation_charge_home_visit: '',
    treatment_charge_video_call: '',
    treatment_charge_physical_visit: '',
    treatment_charge_home_visit: '',
    is_video_call: false,
    is_physical_visit: false,
    is_home_visit: false,
    description: '',
    reason_for_rejection: ''
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'REJECTED':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'DRAFT':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleSubmit = () => {
    if (!editingService) return;
    setServices(services.map(service =>
      service.uuid === editingService.uuid
        ? {
            ...service,
            ...formData,
            rank: Number(formData.rank),
            description: formData.description || null,
            reason_for_rejection: formData.reason_for_rejection || null,
            consultation_charge_physical_visit: formData.consultation_charge_physical_visit || null,
            consultation_charge_home_visit: formData.consultation_charge_home_visit || null,
            treatment_charge_physical_visit: formData.treatment_charge_physical_visit || null,
            treatment_charge_home_visit: formData.treatment_charge_home_visit || null
          }
        : service
    ));
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      rank: '',
      consultation_charge_video_call: '',
      consultation_charge_physical_visit: '',
      consultation_charge_home_visit: '',
      treatment_charge_video_call: '',
      treatment_charge_physical_visit: '',
      treatment_charge_home_visit: '',
      is_video_call: false,
      is_physical_visit: false,
      is_home_visit: false,
      description: '',
      reason_for_rejection: ''
    });
    setEditingService(null);
  };

  const handleEdit = (service: Service) => {
    setFormData({
      rank: service.rank.toString(),
      consultation_charge_video_call: service.consultation_charge_video_call || '',
      consultation_charge_physical_visit: service.consultation_charge_physical_visit || '',
      consultation_charge_home_visit: service.consultation_charge_home_visit || '',
      treatment_charge_video_call: service.treatment_charge_video_call || '',
      treatment_charge_physical_visit: service.treatment_charge_physical_visit || '',
      treatment_charge_home_visit: service.treatment_charge_home_visit || '',
      is_video_call: service.is_video_call,
      is_physical_visit: service.is_physical_visit,
      is_home_visit: service.is_home_visit,
      description: service.description || '',
      reason_for_rejection: service.reason_for_rejection || ''
    });
    setEditingService(service);
  };

  const handleStatusChange = (uuid: string, newStatus: 'DRAFT' | 'APPROVED' | 'REJECTED') => {
    setServices(services.map(service =>
      service.uuid === uuid
        ? { ...service, status: newStatus }
        : service
    ));
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.created_by.toLowerCase().includes(searchTerm.toLowerCase());
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
      DRAFT: services.filter(s => s.status === 'DRAFT').length,
      APPROVED: services.filter(s => s.status === 'APPROVED').length,
      REJECTED: services.filter(s => s.status === 'REJECTED').length
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Clinic Services</h1>
                <p className="text-sm text-gray-500">Manage clinic service offerings and pricing</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Services</p>
              <p className="text-2xl font-bold text-gray-900">{services.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-8">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div
              key={status}
              onClick={() => setStatusFilter(status as 'ALL' | 'DRAFT' | 'APPROVED' | 'REJECTED')}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                statusFilter === status
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {status === 'ALL' ? 'Total Services' : status.charAt(0) + status.slice(1).toLowerCase()}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">{count}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  status === 'APPROVED' ? 'bg-green-100' :
                  status === 'REJECTED' ? 'bg-red-100' :
                  status === 'DRAFT' ? 'bg-yellow-100' : 'bg-blue-100'
                }`}>
                  {status === 'APPROVED' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                   status === 'REJECTED' ? <XCircle className="w-5 h-5 text-red-600" /> :
                   status === 'DRAFT' ? <Edit3 className="w-5 h-5 text-yellow-600" /> :
                   <Building className="w-5 h-5 text-blue-600" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-2 sm:gap-4">
          <div className="relative flex-1 max-w-md">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {currentServices.map((service) => (
            <div key={service.uuid} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getServiceIcon(service.service_name)}
                    <div>
                      <h3 className="font-semibold text-gray-900 capitalize text-lg">{service.service_name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs px-3 py-1 rounded-full border font-medium ${getStatusColor(service.status)}`}>
                          {service.status}
                        </span>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Star className="w-3 h-3" />
                          <span>Rank {service.rank}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Service Types */}
                <div className="flex items-center space-x-3 mb-4">
                  {service.is_video_call && (
                    <div className="flex items-center space-x-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md">
                      <Video className="w-3 h-3" />
                      <span>Video</span>
                    </div>
                  )}
                  {service.is_physical_visit && (
                    <div className="flex items-center space-x-1 text-xs bg-green-50 text-green-600 px-2 py-1 rounded-md">
                      <Building className="w-3 h-3" />
                      <span>Physical</span>
                    </div>
                  )}
                  {service.is_home_visit && (
                    <div className="flex items-center space-x-1 text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-md">
                      <Home className="w-3 h-3" />
                      <span>Home</span>
                    </div>
                  )}
                </div>

                {/* Pricing Info */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="text-xs text-gray-600 mb-2">Consultation Charges</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {service.consultation_charge_video_call && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Video:</span>
                        <span className="font-medium">₹{service.consultation_charge_video_call}</span>
                      </div>
                    )}
                    {service.consultation_charge_physical_visit && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Physical:</span>
                        <span className="font-medium">₹{service.consultation_charge_physical_visit}</span>
                      </div>
                    )}
                    {service.consultation_charge_home_visit && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Home:</span>
                        <span className="font-medium">₹{service.consultation_charge_home_visit}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {/* Approve/Reject Buttons */}
                  {service.status === 'DRAFT' && (
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full">
                      <button
                        onClick={() => handleStatusChange(service.uuid, 'APPROVED')}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1 min-w-[120px]"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleStatusChange(service.uuid, 'REJECTED')}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1 min-w-[120px]"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                  {/* Status Change for Approved/Rejected */}
                  {service.status !== 'DRAFT' && (
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full">
                      {service.status === 'APPROVED' && (
                        <button
                          onClick={() => handleStatusChange(service.uuid, 'REJECTED')}
                          className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-3 rounded-lg text-sm font-medium transition-colors min-w-[120px]"
                        >
                          Mark as Rejected
                        </button>
                      )}
                      {service.status === 'REJECTED' && (
                        <button
                          onClick={() => handleStatusChange(service.uuid, 'APPROVED')}
                          className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-3 rounded-lg text-sm font-medium transition-colors min-w-[120px]"
                        >
                          Mark as Approved
                        </button>
                      )}
                      <button
                        onClick={() => handleStatusChange(service.uuid, 'DRAFT')}
                        className="flex-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-3 rounded-lg text-sm font-medium transition-colors min-w-[120px]"
                      >
                        Mark as Draft
                      </button>
                    </div>
                  )}
                  {/* View/Edit */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 border-t border-gray-100 gap-2 sm:gap-0 w-full">
                    <button
                      onClick={() => setViewingService(service)}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors px-2 py-2 rounded-lg min-w-[120px]"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                    <button
                      onClick={() => handleEdit(service)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all min-w-[48px]"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search criteria or filters</p>
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
          <div className="flex flex-col sm:flex-row items-center justify-between bg-white px-2 sm:px-6 py-4 rounded-xl border border-gray-200 gap-2 sm:gap-0">
            <div className="flex items-center text-sm text-gray-500">
              <span>
                Showing {startIndex + 1} to {Math.min(endIndex, filteredServices.length)} of {filteredServices.length} results
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex space-x-1">
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
                        className={`px-3 py-2 text-sm rounded-lg transition-colors ${
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
                    return <span key={page} className="px-2 text-gray-400">...</span>;
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

      {/* View Details Modal */}
      {viewingService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setViewingService(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 z-10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-4 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                {getServiceIcon(viewingService.service_name)}
                <span>{viewingService.service_name}</span>
              </h2>
              <div className="mb-2 text-sm text-gray-500">Created by: {viewingService.created_by}</div>
              <div className="mb-2 text-sm text-gray-500">Rank: {viewingService.rank}</div>
              <div className="mb-2 text-sm text-gray-500">Status: <span className={`font-bold ${getStatusColor(viewingService.status)}`}>{viewingService.status}</span></div>
              <div className="mb-2 text-sm text-gray-500">Description: {viewingService.description || <span className="italic text-gray-400">No description</span>}</div>
              <div className="mb-2 text-sm text-gray-500">Reason for Rejection: {viewingService.reason_for_rejection || <span className="italic text-gray-400">None</span>}</div>
              <div className="mb-2 text-sm text-gray-500">Available Types:</div>
              <div className="flex flex-wrap gap-2 mb-4">
                {viewingService.is_video_call && (
                  <span className="flex items-center space-x-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md">
                    <Video className="w-3 h-3" /> <span>Video</span>
                  </span>
                )}
                {viewingService.is_physical_visit && (
                  <span className="flex items-center space-x-1 text-xs bg-green-50 text-green-600 px-2 py-1 rounded-md">
                    <Building className="w-3 h-3" /> <span>Physical</span>
                  </span>
                )}
                {viewingService.is_home_visit && (
                  <span className="flex items-center space-x-1 text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-md">
                    <Home className="w-3 h-3" /> <span>Home</span>
                  </span>
                )}
              </div>
              <div className="mb-2 text-sm text-gray-500 font-semibold">Consultation Charges:</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                {viewingService.consultation_charge_video_call && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Video:</span>
                    <span className="font-medium">₹{viewingService.consultation_charge_video_call}</span>
                  </div>
                )}
                {viewingService.consultation_charge_physical_visit && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Physical:</span>
                    <span className="font-medium">₹{viewingService.consultation_charge_physical_visit}</span>
                  </div>
                )}
                {viewingService.consultation_charge_home_visit && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Home:</span>
                    <span className="font-medium">₹{viewingService.consultation_charge_home_visit}</span>
                  </div>
                )}
              </div>
              <div className="mb-2 text-sm text-gray-500 font-semibold">Treatment Charges:</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                {viewingService.treatment_charge_video_call && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Video:</span>
                    <span className="font-medium">₹{viewingService.treatment_charge_video_call}</span>
                  </div>
                )}
                {viewingService.treatment_charge_physical_visit && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Physical:</span>
                    <span className="font-medium">₹{viewingService.treatment_charge_physical_visit}</span>
                  </div>
                )}
                {viewingService.treatment_charge_home_visit && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Home:</span>
                    <span className="font-medium">₹{viewingService.treatment_charge_home_visit}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setViewingService(null)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {editingService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Edit {editingService.service_name} Service
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Rank */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Rank
                  </label>
                  <input
                    type="number"
                    value={formData.rank}
                    onChange={(e) => setFormData({...formData, rank: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter rank"
                  />
                </div>

                {/* Service Types */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Available Service Types
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.is_video_call}
                        onChange={(e) => setFormData({...formData, is_video_call: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Video Call</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.is_physical_visit}
                        onChange={(e) => setFormData({...formData, is_physical_visit: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Physical Visit</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.is_home_visit}
                        onChange={(e) => setFormData({...formData, is_home_visit: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Home Visit</span>
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter description"
                  />
                </div>

                {/* Reason for Rejection (only if status is REJECTED) */}
                {editingService.status === 'REJECTED' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Rejection
                    </label>
                    <textarea
                      value={formData.reason_for_rejection}
                      onChange={(e) => setFormData({...formData, reason_for_rejection: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Enter reason for rejection"
                    />
                  </div>
                )}

                {/* Save Button */}
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
                  <button
                    onClick={resetForm}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicServices;