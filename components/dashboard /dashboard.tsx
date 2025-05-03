"use client";   
import { useState } from 'react';
import { 
  User, Bell, Settings, Search, Calendar, Clock,
  ChevronRight, ArrowRight, Heart, Activity, 
  FileText, Pill, Clipboard, MessageSquare, PlusCircle
} from 'lucide-react';

export default function ClinicDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock patient data
  const patientData = {
    name: 'Alex Johnson',
    patientId: 'PT-10042',
    nextAppointment: {
      date: 'May 10, 2025',
      time: '9:00 AM',
      doctor: 'Dr. Sarah Wilson',
      specialty: 'Cardiology'
    },
    pastAppointments: [
      { 
        id: 1, 
        date: 'April 15, 2025', 
        time: '10:30 AM', 
        doctor: 'Dr. Sarah Wilson',
        specialty: 'Cardiology',
        notes: 'Follow-up consultation'
      },
      { 
        id: 2, 
        date: 'March 22, 2025', 
        time: '2:15 PM',
        doctor: 'Dr. Michael Chen',
        specialty: 'General Medicine',
        notes: 'Annual check-up'
      },
      { 
        id: 3, 
        date: 'February 5, 2025', 
        time: '11:00 AM',
        doctor: 'Dr. Emily Rodriguez',
        specialty: 'Dermatology',
        notes: 'Skin consultation'
      }
    ],
    prescriptions: [
      { 
        id: 1, 
        name: 'Lisinopril', 
        dosage: '10mg', 
        instructions: 'Take once daily',
        refillDate: 'May 20, 2025',
        prescribedBy: 'Dr. Sarah Wilson'
      },
      { 
        id: 2, 
        name: 'Atorvastatin', 
        dosage: '20mg', 
        instructions: 'Take once daily in the evening',
        refillDate: 'June 5, 2025',
        prescribedBy: 'Dr. Sarah Wilson'
      }
    ],
    recentTests: [
      { 
        id: 1, 
        name: 'Complete Blood Count', 
        date: 'April 15, 2025', 
        status: 'Completed',
        results: 'Available'
      },
      { 
        id: 2, 
        name: 'Lipid Profile', 
        date: 'April 15, 2025', 
        status: 'Completed',
        results: 'Available'
      },
      { 
        id: 3, 
        name: 'Electrocardiogram', 
        date: 'April 15, 2025', 
        status: 'Completed',
        results: 'Available'
      }
    ],
    billing: {
      nextPayment: {
        amount: '$150.00',
        date: 'May 15, 2025',
        description: 'Co-pay for cardiology appointment'
      },
      insurancePlan: 'HealthPlus Premium',
      insuranceNumber: 'INS-78542169'
    }
  };

  // Sidebar navigation items
  const navItems = [
    { label: 'Overview', value: 'overview', icon: <Activity size={20} /> },
    { label: 'Appointments', value: 'appointments', icon: <Calendar size={20} /> },
    { label: 'Medical Records', value: 'records', icon: <FileText size={20} /> },
    { label: 'Prescriptions', value: 'prescriptions', icon: <Pill size={20} /> },
    { label: 'Lab Results', value: 'labs', icon: <Clipboard size={20} /> },
    { label: 'Messages', value: 'messages', icon: <MessageSquare size={20} /> },
    { label: 'Settings', value: 'settings', icon: <Settings size={20} /> }
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <User size={20} />
            </div>
            <div>
              <h3 className="font-medium">{patientData.name}</h3>
              <p className="text-sm text-gray-500">Patient ID: {patientData.patientId}</p>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search"
              className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <nav>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.value}>
                <button
                  className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                    activeTab === item.value 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab(item.value)}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 py-4 px-8 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-2xl font-medium">Patient Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Bell size={20} />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Settings size={20} />
            </button>
          </div>
        </header>
        
        {/* Dashboard content */}
        <div className="p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-medium mb-2">Hello, {patientData.name}</h2>
            <p className="text-gray-500">Here's a summary of your health information.</p>
          </div>
          
          {/* Next Appointment */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-lg flex items-center">
                <Calendar size={20} className="mr-2 text-blue-500" />
                Next Appointment
              </h3>
              <button className="text-sm text-blue-500 hover:underline flex items-center">
                Schedule New
                <PlusCircle size={16} className="ml-1" />
              </button>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-4">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-medium text-lg">{patientData.nextAppointment.doctor}</h4>
                  <p className="text-gray-600">{patientData.nextAppointment.specialty}</p>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <Calendar size={14} className="mr-1" />
                    <span>{patientData.nextAppointment.date}</span>
                    <Clock size={14} className="ml-3 mr-1" />
                    <span>{patientData.nextAppointment.time}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                  Check In
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                  Reschedule
                </button>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Health Summary Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-lg flex items-center">
                  <Heart size={20} className="mr-2 text-red-500" />
                  Health Summary
                </h3>
                <button className="text-sm text-blue-500 hover:underline flex items-center">
                  Details
                  <ChevronRight size={16} />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Last Visit</p>
                  <p className="font-medium">{patientData.pastAppointments[0].date}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Last Test</p>
                  <p className="font-medium">{patientData.recentTests[0].name}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Active Prescriptions</p>
                  <p className="font-medium">{patientData.prescriptions.length}</p>
                </div>
              </div>
            </div>
            
            {/* Insurance Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-lg flex items-center">
                  <Clipboard size={20} className="mr-2 text-blue-500" />
                  Insurance
                </h3>
                <button className="text-sm text-blue-500 hover:underline flex items-center">
                  View Card
                  <ChevronRight size={16} />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Insurance Plan</p>
                  <p className="font-medium">{patientData.billing.insurancePlan}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Member ID</p>
                  <p className="font-medium">{patientData.billing.insuranceNumber}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Next Payment</p>
                  <p className="font-medium">{patientData.billing.nextPayment.amount} · {patientData.billing.nextPayment.date}</p>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="font-medium text-lg mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button className="w-full p-3 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-100 transition flex items-center justify-between">
                  <span className="font-medium flex items-center">
                    <Calendar size={18} className="mr-2" />
                    Book Appointment
                  </span>
                  <ChevronRight size={18} />
                </button>
                
                <button className="w-full p-3 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-100 transition flex items-center justify-between">
                  <span className="font-medium flex items-center">
                    <MessageSquare size={18} className="mr-2" />
                    Message Doctor
                  </span>
                  <ChevronRight size={18} />
                </button>
                
                <button className="w-full p-3 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-100 transition flex items-center justify-between">
                  <span className="font-medium flex items-center">
                    <Pill size={18} className="mr-2" />
                    Refill Prescription
                  </span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Past Appointments */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-medium text-lg">Past Appointments</h3>
              <button className="text-sm text-blue-500 hover:underline flex items-center">
                View All
                <ArrowRight size={16} className="ml-1" />
              </button>
            </div>
            
            <div className="space-y-4">
              {patientData.pastAppointments.map(appointment => (
                <div key={appointment.id} className="flex items-center border-b border-gray-100 pb-4 last:border-0">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mr-4">
                    <Calendar size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{appointment.doctor}</h4>
                      <span className="text-sm text-gray-500">{appointment.date}</span>
                    </div>
                    <p className="text-sm text-gray-500">{appointment.specialty}</p>
                    <p className="text-sm text-gray-600 mt-1">{appointment.notes}</p>
                  </div>
                  <button className="ml-4 p-2 text-gray-400 hover:text-gray-600">
                    <ChevronRight size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Prescriptions */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-medium text-lg">Active Prescriptions</h3>
              <button className="text-sm text-blue-500 hover:underline flex items-center">
                View All
                <ArrowRight size={16} className="ml-1" />
              </button>
            </div>
            
            <div className="space-y-4">
              {patientData.prescriptions.map(prescription => (
                <div key={prescription.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 mr-4">
                      <Pill size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium">{prescription.name} {prescription.dosage}</h4>
                      <p className="text-sm text-gray-500">{prescription.instructions}</p>
                      <p className="text-xs text-gray-500 mt-1">Prescribed by {prescription.prescribedBy}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm">
                      Refill
                    </button>
                    <p className="text-xs text-gray-500 mt-2">Next refill: {prescription.refillDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}