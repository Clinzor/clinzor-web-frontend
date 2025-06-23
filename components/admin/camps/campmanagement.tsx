import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Users, Mail, MapPin, Instagram, Building2, Search, Filter, MoreHorizontal, Sparkles, TrendingUp, Eye, CheckCircle, Clock, AlertCircle } from 'lucide-react';

// Add Camp type
interface Camp {
  uuid: string;
  created_by: string;
  org_name: string;
  hear_about_us: string;
  association_type: string;
  expected_participants: number;
  preferred_date: string;
  contact_person: string;
  email: string;
  additional_info: string | null;
  status: string;
  priority: string;
  created_at: string;
}

// Add NewCamp type for form state
interface NewCamp {
  org_name: string;
  hear_about_us: string;
  association_type: string;
  expected_participants: string;
  preferred_date: string;
  contact_person: string;
  email: string;
  additional_info: string;
  priority: string;
}

const CampManagement = () => {
  const [camps, setCamps] = useState<Camp[]>([
    {
      uuid: "e940b288-9713-409e-b374-3195491c45b3",
      created_by: "admin@gmail.com",
      org_name: "A2 Fitness Gym",
      hear_about_us: "on instagram",
      association_type: "Gym",
      expected_participants: 50,
      preferred_date: "2025-06-01",
      contact_person: "prakash",
      email: "gym@gmail.com",
      additional_info: null,
      status: "pending",
      priority: "high",
      created_at: new Date().toISOString()
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCamp, setSelectedCamp] = useState<Camp | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(false);

  const [newCamp, setNewCamp] = useState<NewCamp>({
    org_name: '',
    hear_about_us: '',
    association_type: '',
    expected_participants: '',
    preferred_date: '',
    contact_person: '',
    email: '',
    additional_info: '',
    priority: 'medium'
  });

  const handleAddCamp = async () => {
    if (newCamp.org_name && newCamp.contact_person && newCamp.email) {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const camp: Camp = {
        uuid: crypto.randomUUID(),
        created_by: "admin@gmail.com",
        ...newCamp,
        expected_participants: parseInt(newCamp.expected_participants) || 0,
        status: "pending",
        created_at: new Date().toISOString(),
        additional_info: newCamp.additional_info ? newCamp.additional_info : null
      };
      setCamps([...camps, camp]);
      setNewCamp({
        org_name: '',
        hear_about_us: '',
        association_type: '',
        expected_participants: '',
        preferred_date: '',
        contact_person: '',
        email: '',
        additional_info: '',
        priority: 'medium'
      });
      setShowAddForm(false);
      setIsLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved': 
        return { 
          color: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white', 
          icon: CheckCircle,
          glow: 'shadow-emerald-500/25'
        };
      case 'rejected': 
        return { 
          color: 'bg-gradient-to-r from-red-500 to-rose-600 text-white', 
          icon: AlertCircle,
          glow: 'shadow-red-500/25'
        };
      default: 
        return { 
          color: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white', 
          icon: Clock,
          glow: 'shadow-amber-500/25'
        };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-gradient-to-r from-red-500 to-pink-500';
      case 'medium': return 'bg-gradient-to-r from-blue-500 to-purple-500';
      case 'low': return 'bg-gradient-to-r from-green-500 to-teal-500';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500';
    }
  };

  const getHearAboutIcon = (source: string) => {
    if (source?.includes('instagram')) return <Instagram className="w-4 h-4" />;
    return <MapPin className="w-4 h-4" />;
  };

  const filteredCamps = camps.filter(camp => {
    const matchesSearch = camp.org_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         camp.contact_person.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || camp.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: camps.length,
    pending: camps.filter(c => c.status === 'pending').length,
    approved: camps.filter(c => c.status === 'approved').length,
    totalParticipants: camps.reduce((sum, c) => sum + c.expected_participants, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-yellow-400 to-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative backdrop-blur-sm bg-white/80 border-b border-white/20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Camp Management
                </h1>
                <p className="text-gray-600 mt-1">Manage your camp registrations with style</p>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="flex flex-wrap gap-4 mt-6 lg:mt-0">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Camps</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-xl">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Participants</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalParticipants}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
            {/* Search */}
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search camps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 shadow-lg text-base sm:text-lg"
              />
            </div>
            
            {/* Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 shadow-lg text-base sm:text-lg"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Add Button */}
          <button
            onClick={() => setShowAddForm(true)}
            className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transform hover:-translate-y-0.5 text-base sm:text-lg"
          >
            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Add Camp
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </button>
        </div>

        {/* Camp Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 gap-y-8">
          {filteredCamps.map((camp, index) => {
            const statusConfig = getStatusConfig(camp.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <div
                key={camp.uuid}
                className="group relative bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 cursor-pointer transform hover:-translate-y-2 overflow-hidden"
                onClick={() => setSelectedCamp(camp)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Priority Indicator */}
                <div className={`absolute top-0 left-0 w-full h-1 ${getPriorityColor(camp.priority)}`}></div>
                
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
                
                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                        {camp.org_name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Building2 className="w-4 h-4 mr-2" />
                        <span className="bg-gray-100 px-2 py-1 rounded-lg text-xs font-medium">
                          {camp.association_type}
                        </span>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200 opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center text-sm text-gray-600 bg-gray-50/50 rounded-xl p-3">
                        <Users className="w-4 h-4 mr-2 text-blue-500" />
                        <div>
                          <p className="font-medium">{camp.expected_participants}</p>
                          <p className="text-xs text-gray-500">participants</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 bg-gray-50/50 rounded-xl p-3">
                        <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                        <div>
                          <p className="font-medium">{new Date(camp.preferred_date).toLocaleDateString('en', {month: 'short', day: 'numeric'})}</p>
                          <p className="text-xs text-gray-500">preferred</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50/50 rounded-xl p-3">
                      <Mail className="w-4 h-4 mr-2 text-green-500" />
                      <div className="flex-1">
                        <p className="font-medium truncate">{camp.contact_person}</p>
                        <p className="text-xs text-gray-500 truncate">{camp.email}</p>
                      </div>
                    </div>
                    
                    {camp.hear_about_us && (
                      <div className="flex items-center text-sm text-gray-600 bg-gray-50/50 rounded-xl p-3">
                        {getHearAboutIcon(camp.hear_about_us)}
                        <span className="ml-2 capitalize font-medium">{camp.hear_about_us}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold ${statusConfig.color} ${statusConfig.glow} shadow-lg`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {camp.status.toUpperCase()}
                    </span>
                    
                    <div className="flex items-center text-xs text-gray-500">
                      <Eye className="w-3 h-3 mr-1" />
                      View Details
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredCamps.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-6">
              <Building2 className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No camps found</h3>
            <p className="text-gray-500 max-w-md mx-auto">Try adjusting your search filters or add a new camp registration to get started.</p>
          </div>
        )}
      </div>

      {/* Add Camp Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl w-full max-w-full md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 animate-in fade-in slide-in-from-bottom-4 duration-300 px-2 sm:px-8">
            <div className="p-4 sm:p-8 border-b border-gray-200/50">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Add New Camp Registration</h2>
                  <p className="text-gray-600">Fill in the details to register a new camp</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Organization Name</label>
                  <input
                    type="text"
                    value={newCamp.org_name}
                    onChange={(e) => setNewCamp({...newCamp, org_name: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                    placeholder="Enter organization name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Association Type</label>
                  <select
                    value={newCamp.association_type}
                    onChange={(e) => setNewCamp({...newCamp, association_type: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Select type</option>
                    <option value="Gym">🏋️ Gym</option>
                    <option value="School">🏫 School</option>
                    <option value="Club">⚽ Club</option>
                    <option value="Community">🏘️ Community</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Contact Person</label>
                  <input
                    type="text"
                    value={newCamp.contact_person}
                    onChange={(e) => setNewCamp({...newCamp, contact_person: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                    placeholder="Contact person name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                  <input
                    type="email"
                    value={newCamp.email}
                    onChange={(e) => setNewCamp({...newCamp, email: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                    placeholder="contact@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Expected Participants</label>
                  <input
                    type="number"
                    value={newCamp.expected_participants}
                    onChange={(e) => setNewCamp({...newCamp, expected_participants: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                    placeholder="50"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Preferred Date</label>
                  <input
                    type="date"
                    value={newCamp.preferred_date}
                    onChange={(e) => setNewCamp({...newCamp, preferred_date: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Priority Level</label>
                  <select
                    value={newCamp.priority}
                    onChange={(e) => setNewCamp({...newCamp, priority: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                  >
                    <option value="low">🟢 Low Priority</option>
                    <option value="medium">🟡 Medium Priority</option>
                    <option value="high">🔴 High Priority</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">How did you hear about us?</label>
                <input
                  type="text"
                  value={newCamp.hear_about_us}
                  onChange={(e) => setNewCamp({...newCamp, hear_about_us: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                  placeholder="e.g., on instagram, through friend, website"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Additional Information</label>
                <textarea
                  value={newCamp.additional_info ?? ''}
                  onChange={(e) => setNewCamp({...newCamp, additional_info: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Any additional notes or special requirements..."
                />
              </div>
            </div>

            <div className="p-8 border-t border-gray-200/50 flex justify-end space-x-4">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCamp}
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Adding...
                  </div>
                ) : (
                  'Add Camp'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Camp Detail Modal */}
      {selectedCamp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl w-full max-w-full md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 animate-in fade-in slide-in-from-bottom-4 duration-300 px-2 sm:px-8">
            <div className="p-4 sm:p-8 border-b border-gray-200/50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{selectedCamp.org_name}</h2>
                    <p className="text-gray-600">Registration Details</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCamp(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200 text-gray-500 hover:text-gray-700"
                >
                  <MoreHorizontal className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-8 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                      Organization Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <span className="block text-sm font-medium text-gray-500 mb-1">Name</span>
                        <span className="text-lg font-semibold text-gray-900">{selectedCamp.org_name}</span>
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-gray-500 mb-1">Type</span>
                        <span className="inline-flex items-center px-3 py-1 bg-white rounded-xl text-sm font-medium text-gray-700 shadow-sm">
                          {selectedCamp.association_type}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <Mail className="w-5 h-5 mr-2 text-green-600" />
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <span className="block text-sm font-medium text-gray-500 mb-1">Contact Person</span>
                        <span className="text-lg font-semibold text-gray-900">{selectedCamp.contact_person}</span>
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-gray-500 mb-1">Email</span>
                        <span className="text-lg font-semibold text-gray-900">{selectedCamp.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-amber-600" />
                    Participants
                  </h3>
                  <div className="text-3xl font-bold text-amber-600 mb-2">{selectedCamp.expected_participants}</div>
                  <div className="text-sm text-gray-500">Expected Participants</div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                    Preferred Date
                  </h3>
                  <div className="text-lg font-semibold text-purple-600 mb-2">{selectedCamp.preferred_date ? new Date(selectedCamp.preferred_date).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}</div>
                  <div className="text-sm text-gray-500">Preferred Date</div>
                </div>
                <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-pink-600" />
                    Priority
                  </h3>
                  <div className={`inline-block px-4 py-2 rounded-xl font-bold text-white text-sm ${getPriorityColor(selectedCamp.priority)}`}>{selectedCamp.priority?.toUpperCase()}</div>
                </div>
              </div>

              {selectedCamp.hear_about_us && (
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-indigo-600" />
                    How did you hear about us?
                  </h3>
                  <div className="flex items-center text-gray-700 text-base font-medium">
                    {getHearAboutIcon(selectedCamp.hear_about_us)}
                    <span className="ml-2 capitalize">{selectedCamp.hear_about_us}</span>
                  </div>
                </div>
              )}

              {selectedCamp.additional_info && (
                <div className="bg-gradient-to-r from-gray-50 to-slate-100 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-gray-600" />
                    Additional Information
                  </h3>
                  <div className="text-gray-700 text-base">{selectedCamp.additional_info}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Type fixes for linter
export default CampManagement;