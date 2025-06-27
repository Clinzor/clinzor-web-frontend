import React, { useState, useEffect, FormEvent } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Plus, 
  Eye, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  Receipt,
  Search,
  Filter,
  Download,
  RefreshCw,
  X,
  IndianRupee,
  Wallet,
  PiggyBank,
  Users,
  Building
} from 'lucide-react';

// Types
interface DuesSummary {
  total_dues: number;
  total_paid: number;
  remaining_dues: number;
}

interface PaymentOrder {
  amount: number;
  amount_due: number;
  amount_paid: number;
  attempts: number;
  created_at: number;
  currency: string;
  entity: string;
  id: string;
  notes: any[];
  offer_id: string | null;
  receipt: string | null;
  status: string;
}

interface Transaction {
  id: string;
  clinic_id: string;
  clinic_name: string;
  amount: number;
  status: 'CREATED' | 'COMPLETED' | 'FAILED' | 'PENDING';
  created_at: string;
  updated_at: string;
  payment_order?: PaymentOrder;
  description: string;
  type: 'PAYMENT' | 'DUE' | 'REFUND';
}

interface Clinic {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  current_dues: number;
  total_paid: number;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

// Sample data
const sampleClinics: Clinic[] = [
  {
    id: "5a1f8f39-ca38-464c-93c5-ea8edbd6c03f",
    name: "MediCare Clinic",
    email: "admin@medicare.com",
    phone: "9876543210",
    address: "123 Health Street, Medical District",
    current_dues: 2500,
    total_paid: 7500,
    status: "ACTIVE"
  },
  {
    id: "7b2e9e4a-db49-575d-a4c6-fb9fced7d14g",
    name: "City Health Center",
    email: "contact@cityhealth.com",
    phone: "9876543211",
    address: "456 Care Avenue, Downtown",
    current_dues: 1800,
    total_paid: 12000,
    status: "ACTIVE"
  },
  {
    id: "8c3f0f5b-ec5a-686e-b5d7-gca0ged8e25h",
    name: "Family Wellness Clinic",
    email: "info@familywellness.com",
    phone: "9876543212",
    address: "789 Wellness Road, Suburbs",
    current_dues: 600,
    total_paid: 5400,
    status: "ACTIVE"
  }
];

const sampleTransactions: Transaction[] = [
  {
    id: "txn_001",
    clinic_id: "5a1f8f39-ca38-464c-93c5-ea8edbd6c03f",
    clinic_name: "MediCare Clinic",
    amount: 2000,
    status: "COMPLETED",
    created_at: "2025-01-15T10:30:00Z",
    updated_at: "2025-01-15T10:35:00Z",
    description: "Monthly subscription payment",
    type: "PAYMENT"
  },
  {
    id: "txn_002",
    clinic_id: "7b2e9e4a-db49-575d-a4c6-fb9fced7d14g",
    clinic_name: "City Health Center",
    amount: 1500,
    status: "PENDING",
    created_at: "2025-01-14T15:20:00Z",
    updated_at: "2025-01-14T15:20:00Z",
    description: "Service charges",
    type: "DUE"
  },
  {
    id: "txn_003",
    clinic_id: "8c3f0f5b-ec5a-686e-b5d7-gca0ged8e25h",
    clinic_name: "Family Wellness Clinic",
    amount: 800,
    status: "FAILED",
    created_at: "2025-01-13T09:15:00Z",
    updated_at: "2025-01-13T09:18:00Z",
    description: "Platform fees",
    type: "PAYMENT"
  }
];

const DuesManagement: React.FC = () => {
  // State management
  const [duesSummary, setDuesSummary] = useState<DuesSummary>({
    total_dues: 5500,
    total_paid: 600,
    remaining_dues: 4900
  });
  
  const [clinics, setClinics] = useState<Clinic[]>(sampleClinics);
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [clinicFilter, setClinicFilter] = useState('');
  const [dateRange, setDateRange] = useState('all');
  
  // Payment form state
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Helper functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'COMPLETED': return {
        color: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
        dot: 'bg-emerald-500',
        icon: CheckCircle
      };
      case 'PENDING': case 'CREATED': return {
        color: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
        dot: 'bg-amber-500',
        icon: Clock
      };
      case 'FAILED': return {
        color: 'bg-red-500/10 text-red-700 border-red-500/20',
        dot: 'bg-red-500',
        icon: AlertCircle
      };
      case 'ACTIVE': return {
        color: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
        dot: 'bg-emerald-500',
        icon: CheckCircle
      };
      case 'INACTIVE': return {
        color: 'bg-slate-500/10 text-slate-700 border-slate-500/20',
        dot: 'bg-slate-500',
        icon: Clock
      };
      case 'SUSPENDED': return {
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

  // API simulation functions
  const initiatePayment = async (clinicId: string, amount: number) => {
    setIsProcessingPayment(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newTransaction: Transaction = {
      id: `txn_${Date.now()}`,
      clinic_id: clinicId,
      clinic_name: clinics.find(c => c.id === clinicId)?.name || 'Unknown Clinic',
      amount: amount,
      status: 'CREATED',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      description: paymentDescription || 'Manual payment',
      type: 'PAYMENT',
      payment_order: {
        amount: amount * 100, // Convert to paise
        amount_due: amount * 100,
        amount_paid: 0,
        attempts: 0,
        created_at: Math.floor(Date.now() / 1000),
        currency: "INR",
        entity: "order",
        id: `order_${Math.random().toString(36).substr(2, 9)}`,
        notes: [],
        offer_id: null,
        receipt: null,
        status: "created"
      }
    };
    
    setTransactions([newTransaction, ...transactions]);
    setIsProcessingPayment(false);
    setShowPaymentModal(false);
    setPaymentAmount('');
    setPaymentDescription('');
    setSelectedClinic(null);
  };

  const refreshDuesSummary = async () => {
    // Simulate API call to refresh dues summary
    const totalDues = clinics.reduce((sum, clinic) => sum + clinic.current_dues, 0);
    const totalPaid = clinics.reduce((sum, clinic) => sum + clinic.total_paid, 0);
    
    setDuesSummary({
      total_dues: totalDues,
      total_paid: totalPaid,
      remaining_dues: totalDues
    });
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.clinic_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? transaction.status === statusFilter : true;
    const matchesClinic = clinicFilter ? transaction.clinic_id === clinicFilter : true;
    
    return matchesSearch && matchesStatus && matchesClinic;
  });

  useEffect(() => {
    refreshDuesSummary();
  }, [clinics]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/80 border-b border-slate-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between h-auto sm:h-20 py-4 sm:py-0 gap-2 sm:gap-0">
            <div className="flex flex-col space-y-1 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Dues Management
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Track payments and manage clinic dues</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 mt-2 sm:mt-0">
              <button
                onClick={refreshDuesSummary}
                className="p-2 sm:p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="group relative inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-sm sm:text-base"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <Plus className="w-5 h-5 mr-2 relative" />
                <span className="relative">Initiate Payment</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/60 p-6 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500 font-medium">Total Dues</p>
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(duesSummary.total_dues)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-sm text-blue-600 font-medium">Outstanding</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/60 p-6 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500 font-medium">Total Paid</p>
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(duesSummary.total_paid)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
              <span className="text-sm text-emerald-600 font-medium">Collected</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/60 p-6 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500 font-medium">Remaining</p>
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(duesSummary.remaining_dues)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <TrendingDown className="w-4 h-4 text-amber-500 mr-1" />
              <span className="text-sm text-amber-600 font-medium">Pending</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/60 p-6 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500 font-medium">Active Clinics</p>
                <p className="text-2xl font-bold text-slate-900">{clinics.filter(c => c.status === 'ACTIVE').length}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 text-purple-500 mr-1" />
              <span className="text-sm text-purple-600 font-medium">Registered</span>
            </div>
          </div>
        </div>

        {/* Clinics Overview */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/60 p-4 sm:p-6 mb-6 sm:mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Clinics Overview</h2>
            <button className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium">View All</button>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {clinics.slice(0, 3).map((clinic) => {
              const statusConfig = getStatusConfig(clinic.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <div key={clinic.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors gap-3 sm:gap-0">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                      <Building className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm sm:text-base">{clinic.name}</h3>
                      <p className="text-xs sm:text-sm text-slate-600">{clinic.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center space-x-4 sm:space-x-6 mt-2 sm:mt-0">
                    <div className="text-right">
                      <p className="text-xs sm:text-sm text-slate-500">Current Dues</p>
                      <p className="font-bold text-red-600 text-sm sm:text-base">{formatCurrency(clinic.current_dues)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs sm:text-sm text-slate-500">Total Paid</p>
                      <p className="font-bold text-emerald-600 text-sm sm:text-base">{formatCurrency(clinic.total_paid)}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 sm:px-3 py-1.5 rounded-full text-xs font-bold border ${statusConfig.color}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {clinic.status}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedClinic(clinic);
                        setShowPaymentModal(true);
                      }}
                      className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors mt-2 sm:mt-0"
                    >
                      Pay Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/60 p-4 sm:p-6 mb-6 sm:mb-8 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all text-sm"
              >
                <option value="">All Status</option>
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Pending</option>
                <option value="CREATED">Created</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
            
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Clinic</label>
              <select
                value={clinicFilter}
                onChange={(e) => setClinicFilter(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all text-sm"
              >
                <option value="">All Clinics</option>
                {clinics.map(clinic => (
                  <option key={clinic.id} value={clinic.id}>{clinic.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all text-sm"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-sm overflow-x-auto">
          <div className="p-4 sm:p-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Recent Transactions</h2>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] sm:min-w-full text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-2 sm:py-4 px-2 sm:px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">Transaction</th>
                  <th className="text-left py-2 sm:py-4 px-2 sm:px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">Clinic</th>
                  <th className="text-left py-2 sm:py-4 px-2 sm:px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">Amount</th>
                  <th className="text-left py-2 sm:py-4 px-2 sm:px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="text-left py-2 sm:py-4 px-2 sm:px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                  <th className="text-left py-2 sm:py-4 px-2 sm:px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredTransactions.map((transaction) => {
                  const statusConfig = getStatusConfig(transaction.status);
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <tr key={transaction.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2 sm:py-4 px-2 sm:px-6">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                            <Receipt className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-xs sm:text-sm">{transaction.id}</p>
                            <p className="text-xs sm:text-sm text-slate-600">{transaction.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 sm:py-4 px-2 sm:px-6">
                        <p className="font-medium text-slate-900 text-xs sm:text-sm">{transaction.clinic_name}</p>
                        <p className="text-xs sm:text-sm text-slate-600 capitalize">{transaction.type.toLowerCase()}</p>
                      </td>
                      <td className="py-2 sm:py-4 px-2 sm:px-6">
                        <p className="font-bold text-slate-900 text-xs sm:text-sm">{formatCurrency(transaction.amount)}</p>
                      </td>
                      <td className="py-2 sm:py-4 px-2 sm:px-6">
                        <span className={`inline-flex items-center px-2 sm:px-3 py-1.5 rounded-full text-xs font-bold border ${statusConfig.color}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {transaction.status}
                        </span>
                      </td>
                      <td className="py-2 sm:py-4 px-2 sm:px-6">
                        <p className="text-xs sm:text-sm text-slate-600">{formatDate(transaction.created_at)}</p>
                      </td>
                      <td className="py-2 sm:py-4 px-2 sm:px-6">
                        <button
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setShowTransactionModal(true);
                          }}
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <Receipt className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">No transactions found</h3>
              <p className="text-slate-500 text-xs sm:text-sm">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl w-full max-w-sm sm:max-w-md border border-white/20 shadow-2xl relative">
            <button
              onClick={() => {
                setShowPaymentModal(false);
                setSelectedClinic(null);
                setPaymentAmount('');
                setPaymentDescription('');
              }}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="p-4 sm:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <CreditCard className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 sm:mb-2">Initiate Payment</h2>
                <p className="text-slate-500 text-xs sm:text-sm">Create a new payment transaction</p>
              </div>

              <form onSubmit={(e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                if (!selectedClinic) return;
                if (!paymentAmount || isNaN(Number(paymentAmount)) || Number(paymentAmount) <= 0) return;
                initiatePayment(selectedClinic.id, Number(paymentAmount));
              }}>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Clinic</label>
                  <input
                    type="text"
                    value={selectedClinic ? selectedClinic.name : ''}
                    disabled
                    className="w-full px-3 sm:px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 text-xs sm:text-sm"
                  />
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Amount (INR)</label>
                  <input
                    type="number"
                    min="1"
                    value={paymentAmount}
                    onChange={e => setPaymentAmount(e.target.value)}
                    required
                    className="w-full px-3 sm:px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-xs sm:text-sm"
                  />
                </div>
                <div className="mb-4 sm:mb-6">
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={paymentDescription}
                    onChange={e => setPaymentDescription(e.target.value)}
                    placeholder="Payment for..."
                    className="w-full px-3 sm:px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-xs sm:text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className={`w-full py-2.5 sm:py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg ${isProcessingPayment ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {isProcessingPayment ? 'Processing...' : 'Initiate Payment'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      {showTransactionModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl w-full max-w-sm sm:max-w-md border border-white/20 shadow-2xl relative">
            <button
              onClick={() => {
                setShowTransactionModal(false);
                setSelectedTransaction(null);
              }}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="p-4 sm:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Receipt className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 sm:mb-2">Transaction Details</h2>
                <p className="text-slate-500 text-xs sm:text-sm">Review the transaction information</p>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <span className="block text-xs text-slate-500 font-medium mb-1">Transaction ID</span>
                  <span className="font-mono text-xs sm:text-sm text-slate-900">{selectedTransaction.id}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500 font-medium mb-1">Clinic</span>
                  <span className="text-xs sm:text-sm text-slate-900">{selectedTransaction.clinic_name}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500 font-medium mb-1">Amount</span>
                  <span className="text-xs sm:text-sm text-slate-900">{formatCurrency(selectedTransaction.amount)}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500 font-medium mb-1">Status</span>
                  <span className="text-xs sm:text-sm text-slate-900">{selectedTransaction.status}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500 font-medium mb-1">Date</span>
                  <span className="text-xs sm:text-sm text-slate-900">{formatDate(selectedTransaction.created_at)}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500 font-medium mb-1">Description</span>
                  <span className="text-xs sm:text-sm text-slate-900">{selectedTransaction.description}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DuesManagement;