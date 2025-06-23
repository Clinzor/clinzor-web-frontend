import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpRight, TrendingUp, TrendingDown, DollarSign, Building2, Calendar, MoreHorizontal, X, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from 'lucide-react';

// Modal component
const Modal = ({ isOpen, onClose, title, children, size = 'md' }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: 'sm' | 'md' | 'lg'; }) => {
  if (!isOpen) return null;
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
  };
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}></div>
        <div className={`inline-block w-full ${sizeClasses[size || 'md']} p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-3xl`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors group" aria-label="Close modal">
              <X className="w-6 h-6 text-gray-400 group-hover:text-gray-600" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

// Pagination component
const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void; totalItems: number; itemsPerPage: number; }) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };
  if (totalPages <= 1) return null;
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200">
      <div className="text-sm text-gray-700">
        Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of <span className="font-medium">{totalItems}</span> results
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => onPageChange(1)} disabled={currentPage === 1} className="p-2 rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" title="First page"><ChevronsLeft className="w-4 h-4" /></button>
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" title="Previous page"><ChevronLeft className="w-4 h-4" /></button>
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page) => (
            <button key={page} onClick={() => onPageChange(page)} className={`px-3 py-2 rounded-lg border transition-colors ${currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>{page}</button>
          ))}
        </div>
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" title="Next page"><ChevronRight className="w-4 h-4" /></button>
        <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" title="Last page"><ChevronsRight className="w-4 h-4" /></button>
      </div>
    </div>
  );
};

const DueManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [animateCards, setAnimateCards] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<typeof clinicsData[0] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Sample data from your API response
  const clinicsData = [
    {
      clinic_uuid: "7b420213-bdba-487f-a5f5-553ab55a81e8",
      clinic_name: "Aurbindo",
      due_detail: {
        total_dues: 0,
        total_paid: 0,
        remaining_dues: 0
      }
    },
    {
      clinic_uuid: "8c16ae4e-bb2a-48d3-90bf-7cb84d9a3a03",
      clinic_name: "Getwell",
      due_detail: {
        total_dues: 550,
        total_paid: 200,
        remaining_dues: 350
      }
    },
    {
      clinic_uuid: "be080dc7-ba7e-4e44-ae49-5a8a5c604a62",
      clinic_name: "Greater Kailash Hospital",
      due_detail: {
        total_dues: 0,
        total_paid: 0,
        remaining_dues: 0
      }
    },
    {
      clinic_uuid: "d7204f42-d700-40b9-b29f-045dcd023e4a",
      clinic_name: "Harmony Health Hub",
      due_detail: {
        total_dues: 0,
        total_paid: 0,
        remaining_dues: 0
      }
    },
    {
      clinic_uuid: "5a1f8f39-ca38-464c-93c5-ea8edbd6c03f",
      clinic_name: "Sunrise Dental Clinic",
      due_detail: {
        total_dues: -200,
        total_paid: 0,
        remaining_dues: -200
      }
    },
    // Additional mock clinics
    {
      clinic_uuid: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      clinic_name: "City Care Clinic",
      due_detail: {
        total_dues: 1200,
        total_paid: 800,
        remaining_dues: 400
      }
    },
    {
      clinic_uuid: "b2c3d4e5-f6a7-8901-bcde-fa2345678901",
      clinic_name: "Wellness Point",
      due_detail: {
        total_dues: 900,
        total_paid: 900,
        remaining_dues: 0
      }
    },
    {
      clinic_uuid: "c3d4e5f6-a7b8-9012-cdef-ab3456789012",
      clinic_name: "Family Health Center",
      due_detail: {
        total_dues: 300,
        total_paid: 0,
        remaining_dues: 300
      }
    },
    {
      clinic_uuid: "d4e5f6a7-b8c9-0123-defa-bc4567890123",
      clinic_name: "Prime Medicals",
      due_detail: {
        total_dues: 0,
        total_paid: 100,
        remaining_dues: -100
      }
    },
    {
      clinic_uuid: "e5f6a7b8-c9d0-1234-efab-cd5678901234",
      clinic_name: "Hope Hospital",
      due_detail: {
        total_dues: 2000,
        total_paid: 1500,
        remaining_dues: 500
      }
    }
  ];

  useEffect(() => {
    setAnimateCards(true);
  }, []);

  // Calculate totals
  const totalDues = clinicsData.reduce((sum, clinic) => sum + clinic.due_detail.total_dues, 0);
  const totalPaid = clinicsData.reduce((sum, clinic) => sum + clinic.due_detail.total_paid, 0);
  const totalRemaining = clinicsData.reduce((sum, clinic) => sum + clinic.due_detail.remaining_dues, 0);

  // Filter and search logic
  const filteredClinics = clinicsData.filter(clinic => {
    const matchesSearch = clinic.clinic_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'outstanding') return matchesSearch && clinic.due_detail.remaining_dues > 0;
    if (selectedFilter === 'paid') return matchesSearch && clinic.due_detail.remaining_dues === 0 && clinic.due_detail.total_paid > 0;
    if (selectedFilter === 'credit') return matchesSearch && clinic.due_detail.remaining_dues < 0;
    
    return matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredClinics.length / itemsPerPage);
  const paginatedClinics = filteredClinics.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusColor = (remaining: number) => {
    if (remaining > 0) return 'text-red-500 bg-red-50';
    if (remaining < 0) return 'text-green-500 bg-green-50';
    return 'text-gray-500 bg-gray-50';
  };

  const getStatusText = (remaining: number) => {
    if (remaining > 0) return 'Outstanding';
    if (remaining < 0) return 'Credit';
    return 'Settled';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(Math.abs(amount));
  };

  const handleViewDetails = (clinic: typeof clinicsData[0]) => {
    setSelectedClinic(clinic);
    setViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setViewModalOpen(false);
    setSelectedClinic(null);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                Due Management
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Monitor and manage clinic payments</p>
            </div>
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className={`bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg transform transition-all duration-700 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Dues</p>
                <p className="text-3xl font-bold mt-2">{formatCurrency(totalDues)}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <DollarSign className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className={`bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg transform transition-all duration-700 delay-100 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Paid</p>
                <p className="text-3xl font-bold mt-2">{formatCurrency(totalPaid)}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <TrendingUp className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className={`bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg transform transition-all duration-700 delay-200 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Remaining</p>
                <p className="text-3xl font-bold mt-2">{formatCurrency(totalRemaining)}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <TrendingDown className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg border border-gray-200/50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 gap-4">
            <div className="relative flex-1 max-w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search clinics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
              />
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3 w-full md:w-auto">
              <Filter className="text-gray-500 w-5 h-5" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full md:w-auto px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
              >
                <option value="all">All Clinics</option>
                <option value="outstanding">Outstanding</option>
                <option value="paid">Settled</option>
                <option value="credit">Credit Balance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Clinics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {paginatedClinics.map((clinic, index) => (
            <div
              key={clinic.clinic_uuid}
              className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 transform ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{clinic.clinic_name}</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(clinic.due_detail.remaining_dues)}`}>
                      {getStatusText(clinic.due_detail.remaining_dues)}
                    </span>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <MoreHorizontal className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Total Dues</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(clinic.due_detail.total_dues)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Paid</span>
                  <span className="font-semibold text-green-600">{formatCurrency(clinic.due_detail.total_paid)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 font-medium">Remaining</span>
                    <span className={`font-bold text-lg ${
                      clinic.due_detail.remaining_dues > 0 ? 'text-red-600' : 
                      clinic.due_detail.remaining_dues < 0 ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {clinic.due_detail.remaining_dues < 0 ? '-' : ''}{formatCurrency(clinic.due_detail.remaining_dues)}
                    </span>
                  </div>
                </div>

                {clinic.due_detail.total_dues > 0 && (
                  <div className="pt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Payment Progress</span>
                      <span>{Math.round((clinic.due_detail.total_paid / clinic.due_detail.total_dues) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((clinic.due_detail.total_paid / clinic.due_detail.total_dues) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 mt-6">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2" onClick={() => handleViewDetails(clinic)}>
                  <span>View Details</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                {clinic.due_detail.remaining_dues > 0 && (
                  <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-all duration-200">
                    Record Payment
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={filteredClinics.length}
          itemsPerPage={itemsPerPage}
        />

        {filteredClinics.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No clinics found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      <Modal isOpen={viewModalOpen} onClose={handleCloseModal} title={selectedClinic?.clinic_name || 'Clinic Details'} size="md">
        {selectedClinic && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <div className="font-semibold text-lg text-gray-900">{selectedClinic.clinic_name}</div>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedClinic.due_detail.remaining_dues)}`}>{getStatusText(selectedClinic.due_detail.remaining_dues)}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-gray-600 text-sm mb-1">Total Dues</div>
                <div className="font-bold text-xl text-gray-900">{formatCurrency(selectedClinic.due_detail.total_dues)}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-gray-600 text-sm mb-1">Total Paid</div>
                <div className="font-bold text-xl text-green-600">{formatCurrency(selectedClinic.due_detail.total_paid)}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 col-span-1 sm:col-span-2">
                <div className="text-gray-600 text-sm mb-1">Remaining Dues</div>
                <div className={`font-bold text-xl ${selectedClinic.due_detail.remaining_dues > 0 ? 'text-red-600' : selectedClinic.due_detail.remaining_dues < 0 ? 'text-green-600' : 'text-gray-600'}`}>{selectedClinic.due_detail.remaining_dues < 0 ? '-' : ''}{formatCurrency(selectedClinic.due_detail.remaining_dues)}</div>
              </div>
            </div>
            {selectedClinic.due_detail.total_dues > 0 && (
              <div className="pt-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Payment Progress</span>
                  <span>{Math.round((selectedClinic.due_detail.total_paid / selectedClinic.due_detail.total_dues) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min((selectedClinic.due_detail.total_paid / selectedClinic.due_detail.total_dues) * 100, 100)}%` }}></div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DueManagement;