import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Edit3, 
  Building, 
  Heart, 
  Brain, 
  User, 
  Stethoscope, 
  Video, 
  Home, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  X,
  Calendar,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  FileText,
  Image as ImageIcon
} from 'lucide-react';

interface ServiceRequest {
  id: string;
  clinicName: string;
  clinicEmail: string;
  clinicPhone: string;
  clinicAddress: string;
  serviceName: string;
  serviceDescription: string;
  serviceImage: string | null;
  consultationFeeVideo: string | null;
  consultationFeePhysical: string | null;
  consultationFeeHome: string | null;
  treatmentFeeVideo: string | null;
  treatmentFeePhysical: string | null;
  treatmentFeeHome: string | null;
  isVideoCallAvailable: boolean;
  isPhysicalVisitAvailable: boolean;
  isHomeVisitAvailable: boolean;
  requestedDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason: string | null;
  additionalInfo: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

const ClinicServiceRequests: React.FC = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([
    {
      id: '1',
      clinicName: 'CardioHealth Medical Center',
      clinicEmail: 'admin@cardiohealth.com',
      clinicPhone: '+91 98765 43210',
      clinicAddress: '123 Medical District, Mumbai, Maharashtra 400001',
      serviceName: 'Advanced Cardiology',
      serviceDescription: 'Comprehensive cardiac care including ECG, Echo, stress tests, and cardiac catheterization. Specialized in treating heart diseases, arrhythmias, and preventive cardiology.',
      serviceImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
      consultationFeeVideo: '500',
      consultationFeePhysical: '800',
      consultationFeeHome: '1200',
      treatmentFeeVideo: '300',
      treatmentFeePhysical: '600',
      treatmentFeeHome: '1000',
      isVideoCallAvailable: true,
      isPhysicalVisitAvailable: true,
      isHomeVisitAvailable: true,
      requestedDate: '2024-06-25',
      status: 'PENDING',
      rejectionReason: null,
      additionalInfo: 'We have state-of-the-art equipment and certified cardiologists with 15+ years experience.',
      priority: 'HIGH'
    },
    {
      id: '2',
      clinicName: 'NeuroWise Clinic',
      clinicEmail: 'contact@neurowise.com',
      clinicPhone: '+91 87654 32109',
      clinicAddress: '456 Brain Street, Delhi, Delhi 110001',
      serviceName: 'Neurology & Brain Health',
      serviceDescription: 'Complete neurological evaluation and treatment for headaches, seizures, stroke, Parkinson\'s disease, and memory disorders.',
      serviceImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
      consultationFeeVideo: '400',
      consultationFeePhysical: '600',
      consultationFeeHome: '900',
      treatmentFeeVideo: '250',
      treatmentFeePhysical: '500',
      treatmentFeeHome: '800',
      isVideoCallAvailable: true,
      isPhysicalVisitAvailable: true,
      isHomeVisitAvailable: false,
      requestedDate: '2024-06-28',
      status: 'APPROVED',
      rejectionReason: null,
      additionalInfo: 'Equipped with EEG, EMG, and advanced neuroimaging facilities.',
      priority: 'MEDIUM'
    },
    {
      id: '3',
      clinicName: 'Family Care Plus',
      clinicEmail: 'info@familycareplus.com',
      clinicPhone: '+91 76543 21098',
      clinicAddress: '789 Wellness Avenue, Bangalore, Karnataka 560001',
      serviceName: 'General Medicine',
      serviceDescription: 'Primary healthcare services including routine checkups, vaccinations, health screenings, and treatment of common illnesses.',
      serviceImage: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=300&fit=crop',
      consultationFeeVideo: '200',
      consultationFeePhysical: '300',
      consultationFeeHome: '500',
      treatmentFeeVideo: '150',
      treatmentFeePhysical: '250',
      treatmentFeeHome: '400',
      isVideoCallAvailable: true,
      isPhysicalVisitAvailable: true,
      isHomeVisitAvailable: true,
      requestedDate: '2024-06-20',
      status: 'REJECTED',
      rejectionReason: 'Insufficient documentation provided. Please submit proper medical certifications and facility photos.',
      additionalInfo: 'We serve families with comprehensive primary care.',
      priority: 'LOW'
    },
    {
      id: '4',
      clinicName: 'Orthopedic Excellence',
      clinicEmail: 'admin@orthoexcellence.com',
      clinicPhone: '+91 65432 10987',
      clinicAddress: '321 Bone Street, Chennai, Tamil Nadu 600001',
      serviceName: 'Orthopedic Surgery',
      serviceDescription: 'Specialized orthopedic care including joint replacement, sports medicine, spine surgery, and trauma care.',
      serviceImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
      consultationFeeVideo: '600',
      consultationFeePhysical: '1000',
      consultationFeeHome: null,
      treatmentFeeVideo: '400',
      treatmentFeePhysical: '800',
      treatmentFeeHome: null,
      isVideoCallAvailable: true,
      isPhysicalVisitAvailable: true,
      isHomeVisitAvailable: false,
      requestedDate: '2024-06-29',
      status: 'PENDING',
      rejectionReason: null,
      additionalInfo: 'Advanced surgical facilities with robotic surgery capabilities.',
      priority: 'HIGH'
    }
  ]);

  const [viewingRequest, setViewingRequest] = useState<ServiceRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | 'LOW' | 'MEDIUM' | 'HIGH'>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(6);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [showRejectionModal, setShowRejectionModal] = useState<string | null>(null);

  const getServiceIcon = (name: string) => {
    const serviceLower = name.toLowerCase();
    if (serviceLower.includes('cardio') || serviceLower.includes('heart')) {
      return <Heart className="w-5 h-5 text-red-500" />;
    } else if (serviceLower.includes('neuro') || serviceLower.includes('brain')) {
      return <Brain className="w-5 h-5 text-purple-500" />;
    } else if (serviceLower.includes('ortho') || serviceLower.includes('bone')) {
      return <Stethoscope className="w-5 h-5 text-orange-500" />;
    } else {
      return <User className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'REJECTED':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'PENDING':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'LOW':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleApprove = (id: string) => {
    setRequests(requests.map(request =>
      request.id === id
        ? { ...request, status: 'APPROVED' as const, rejectionReason: null }
        : request
    ));
  };

  const handleReject = (id: string, reason: string) => {
    setRequests(requests.map(request =>
      request.id === id
        ? { ...request, status: 'REJECTED' as const, rejectionReason: reason }
        : request
    ));
    setShowRejectionModal(null);
    setRejectionReason('');
  };

  const handleStatusChange = (id: string, newStatus: 'PENDING' | 'APPROVED' | 'REJECTED') => {
    const request = requests.find(r => r.id === id);
    if (!request) return;
    // Prevent changing from REJECTED to APPROVED
    if (request.status === 'REJECTED' && newStatus === 'APPROVED') {
      return;
    }
    if (newStatus === 'REJECTED') {
      setShowRejectionModal(id);
      return;
    }
    setRequests(requests.map(request =>
      request.id === id
        ? { ...request, status: newStatus, rejectionReason: newStatus === 'APPROVED' ? null : request.rejectionReason }
        : request
    ));
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.clinicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.clinicEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || request.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = filteredRequests.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, priorityFilter]);

  const getStatusCounts = () => {
    return {
      ALL: requests.length,
      PENDING: requests.filter(r => r.status === 'PENDING').length,
      APPROVED: requests.filter(r => r.status === 'APPROVED').length,
      REJECTED: requests.filter(r => r.status === 'REJECTED').length
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
                <h1 className="text-2xl font-bold text-gray-900">Service Requests</h1>
                <p className="text-sm text-gray-500">Review and manage clinic service requests</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Pending Requests</p>
              <p className="text-2xl font-bold text-orange-600">{statusCounts.PENDING}</p>
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
              onClick={() => setStatusFilter(status as 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED')}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                statusFilter === status
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {status === 'ALL' ? 'Total Requests' : status.charAt(0) + status.slice(1).toLowerCase()}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">{count}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  status === 'APPROVED' ? 'bg-green-100' :
                  status === 'REJECTED' ? 'bg-red-100' :
                  status === 'PENDING' ? 'bg-orange-100' : 'bg-blue-100'
                }`}>
                  {status === 'APPROVED' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                   status === 'REJECTED' ? <XCircle className="w-5 h-5 text-red-600" /> :
                   status === 'PENDING' ? <Clock className="w-5 h-5 text-orange-600" /> :
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
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
            />
          </div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as 'ALL' | 'LOW' | 'MEDIUM' | 'HIGH')}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>

        {/* Requests Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {currentRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getServiceIcon(request.serviceName)}
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{request.serviceName}</h3>
                      <p className="text-sm text-gray-600">{request.clinicName}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`text-xs px-3 py-1 rounded-full border font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                  </div>
                </div>

                {/* Service Image */}
                {request.serviceImage && (
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <img 
                      src={request.serviceImage} 
                      alt={request.serviceName}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}

                {/* Quick Info */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Requested: {new Date(request.requestedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{request.clinicEmail}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{request.clinicPhone}</span>
                  </div>
                </div>

                {/* Service Types */}
                <div className="flex items-center space-x-2 mb-4">
                  {request.isVideoCallAvailable && (
                    <span className="flex items-center space-x-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md">
                      <Video className="w-3 h-3" />
                      <span>Video</span>
                    </span>
                  )}
                  {request.isPhysicalVisitAvailable && (
                    <span className="flex items-center space-x-1 text-xs bg-green-50 text-green-600 px-2 py-1 rounded-md">
                      <Building className="w-3 h-3" />
                      <span>Physical</span>
                    </span>
                  )}
                  {request.isHomeVisitAvailable && (
                    <span className="flex items-center space-x-1 text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-md">
                      <Home className="w-3 h-3" />
                      <span>Home</span>
                    </span>
                  )}
                </div>

                {/* Pricing Preview */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="text-xs text-gray-600 mb-2">Consultation Fees</div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {request.consultationFeeVideo && (
                      <div className="text-center">
                        <div className="text-gray-500">Video</div>
                        <div className="font-medium">₹{request.consultationFeeVideo}</div>
                      </div>
                    )}
                    {request.consultationFeePhysical && (
                      <div className="text-center">
                        <div className="text-gray-500">Physical</div>
                        <div className="font-medium">₹{request.consultationFeePhysical}</div>
                      </div>
                    )}
                    {request.consultationFeeHome && (
                      <div className="text-center">
                        <div className="text-gray-500">Home</div>
                        <div className="font-medium">₹{request.consultationFeeHome}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {request.status === 'PENDING' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => setShowRejectionModal(request.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                  
                  {request.status !== 'PENDING' && (
                    <div className="flex space-x-2">
                      {request.status !== 'REJECTED' && (
                        <button
                          onClick={() => handleStatusChange(request.id, 'PENDING')}
                          className="flex-1 bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                        >
                          Mark as Pending
                        </button>
                      )}
                      {request.status === 'APPROVED' && (
                        <button
                          onClick={() => handleStatusChange(request.id, 'REJECTED')}
                          className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => setViewingRequest(request)}
                    className="w-full flex items-center justify-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors py-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Full Details</span>
                  </button>
                </div>

                {/* Rejection Reason */}
                {request.rejectionReason && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="text-xs text-red-600 font-medium mb-1">Rejection Reason:</div>
                    <div className="text-xs text-red-700">{request.rejectionReason}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredRequests.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No requests found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search criteria or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
                setPriorityFilter('ALL');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between bg-white px-6 py-4 rounded-xl border border-gray-200">
            <div className="flex items-center text-sm text-gray-500">
              <span>
                Showing {startIndex + 1} to {Math.min(endIndex, filteredRequests.length)} of {filteredRequests.length} results
              </span>
            </div>
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
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
      {viewingRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
                  {getServiceIcon(viewingRequest.serviceName)}
                  {viewingRequest.serviceName}
                </h2>
                <button
                  onClick={() => setViewingRequest(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Service Image */}
                  {viewingRequest.serviceImage && (
                    <div className="rounded-lg overflow-hidden">
                      <img 
                        src={viewingRequest.serviceImage} 
                        alt={viewingRequest.serviceName}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  )}

                  {/* Clinic Information */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <h3 className="font-semibold text-gray-900">Clinic Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <Building className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-900">{viewingRequest.clinicName}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">{viewingRequest.clinicAddress}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">{viewingRequest.clinicEmail}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">{viewingRequest.clinicPhone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Service Description */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Service Description</h3>
                    <p className="text-sm text-gray-600">{viewingRequest.serviceDescription}</p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Status and Priority */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(viewingRequest.status)}`}>
                        {viewingRequest.status}
                      </span>
                    </div>
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(viewingRequest.priority)}`}>
                        {viewingRequest.priority} Priority
                      </span>
                    </div>
                  </div>

                  {/* Service Types */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Available Service Types</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {viewingRequest.isVideoCallAvailable && (
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-center space-x-3">
                            <Video className="w-5 h-5 text-blue-500" />
                            <div>
                              <p className="font-medium text-gray-900">Video Consultation</p>
                              <p className="text-sm text-gray-500">Online video consultation service</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">₹{viewingRequest.consultationFeeVideo}</p>
                            <p className="text-xs text-gray-500">Consultation</p>
                          </div>
                        </div>
                      )}

                      {viewingRequest.isPhysicalVisitAvailable && (
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-center space-x-3">
                            <Building className="w-5 h-5 text-green-500" />
                            <div>
                              <p className="font-medium text-gray-900">Physical Visit</p>
                              <p className="text-sm text-gray-500">In-clinic consultation</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">₹{viewingRequest.consultationFeePhysical}</p>
                            <p className="text-xs text-gray-500">Consultation</p>
                          </div>
                        </div>
                      )}

                      {viewingRequest.isHomeVisitAvailable && (
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-center space-x-3">
                            <Home className="w-5 h-5 text-purple-500" />
                            <div>
                              <p className="font-medium text-gray-900">Home Visit</p>
                              <p className="text-sm text-gray-500">At-home consultation service</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">₹{viewingRequest.consultationFeeHome}</p>
                            <p className="text-xs text-gray-500">Consultation</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Information */}
                  {viewingRequest.additionalInfo && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Additional Information</h3>
                      <p className="text-sm text-gray-600">{viewingRequest.additionalInfo}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {viewingRequest.status === 'PENDING' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            handleApprove(viewingRequest.id);
                            setViewingRequest(null);
                          }}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => {
                            setShowRejectionModal(viewingRequest.id);
                            setViewingRequest(null);
                          }}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Service Request</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please provide a reason for rejection..."
              className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            />
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => setShowRejectionModal(null)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(showRejectionModal, rejectionReason)}
                disabled={!rejectionReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicServiceRequests;