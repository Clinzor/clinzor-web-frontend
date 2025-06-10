import React, { useState } from 'react';
import { Calendar, Clock, BookOpen, CheckCircle, TrendingUp, DollarSign, Star, MoreHorizontal } from 'lucide-react';

interface ExpertStat {
  title: string;
  value: string;
  interval: string;
  trend: 'up' | 'down';
  change: string;
  icon: React.ElementType;
  gradient: string;
}

interface Booking {
  id: number;
  clientName: string;
  clientInitials: string;
  service: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed';
  duration: string;
  fee: string;
  rating: number;
}

interface Slot {
  id: number;
  date: string;
  time: string;
  endTime: string;
  status: 'booked' | 'available';
  service: string;
  client?: string;
}

// Mock data for expert dashboard
const expertStats: ExpertStat[] = [
  {
    title: 'Total Slots',
    value: '248',
    interval: 'Last 30 days',
    trend: 'up',
    change: '+12%',
    icon: Calendar,
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    title: 'Active Bookings',
    value: '89',
    interval: 'This month',
    trend: 'up',
    change: '+8%',
    icon: BookOpen,
    gradient: 'from-emerald-500 to-emerald-600'
  },
  {
    title: 'Completed Sessions',
    value: '156',
    interval: 'Last 30 days',
    trend: 'up',
    change: '+15%',
    icon: CheckCircle,
    gradient: 'from-purple-500 to-purple-600'
  },
  {
    title: 'Revenue',
    value: '$12,450',
    interval: 'This month',
    trend: 'up',
    change: '+22%',
    icon: DollarSign,
    gradient: 'from-orange-500 to-orange-600'
  }
];

const recentBookings: Booking[] = [
  {
    id: 1,
    clientName: 'John Smith',
    clientInitials: 'JS',
    service: 'Business Consultation',
    date: 'Jun 12',
    time: '10:00 AM',
    status: 'confirmed',
    duration: '60 min',
    fee: '$150',
    rating: 4.9
  },
  {
    id: 2,
    clientName: 'Sarah Johnson',
    clientInitials: 'SJ',
    service: 'Career Guidance',
    date: 'Jun 12',
    time: '2:00 PM',
    status: 'pending',
    duration: '45 min',
    fee: '$120',
    rating: 4.8
  },
  {
    id: 3,
    clientName: 'Mike Davis',
    clientInitials: 'MD',
    service: 'Technical Review',
    date: 'Jun 13',
    time: '11:00 AM',
    status: 'confirmed',
    duration: '90 min',
    fee: '$200',
    rating: 5.0
  },
  {
    id: 4,
    clientName: 'Emily Chen',
    clientInitials: 'EC',
    service: 'Strategy Planning',
    date: 'Jun 13',
    time: '3:30 PM',
    status: 'completed',
    duration: '75 min',
    fee: '$180',
    rating: 4.7
  }
];

const upcomingSlots: Slot[] = [
  {
    id: 1,
    date: 'Today',
    time: '10:00 AM',
    endTime: '11:00 AM',
    status: 'booked',
    service: 'Business Consultation',
    client: 'John Smith'
  },
  {
    id: 2,
    date: 'Today',
    time: '2:00 PM',
    endTime: '2:45 PM',
    status: 'available',
    service: 'Open Slot'
  },
  {
    id: 3,
    date: 'Tomorrow',
    time: '11:00 AM',
    endTime: '12:30 PM',
    status: 'booked',
    service: 'Technical Review',
    client: 'Mike Davis'
  },
  {
    id: 4,
    date: 'Tomorrow',
    time: '3:30 PM',
    endTime: '4:45 PM',
    status: 'available',
    service: 'Open Slot'
  }
];

const StatCard = ({ stat }: { stat: ExpertStat }) => {
  const Icon = stat.icon;
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-gray-100/50 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-right">
          <div className="flex items-center text-emerald-600 text-sm font-medium">
            <TrendingUp className="w-3 h-3 mr-1" />
            {stat.change}
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
        <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
        <p className="text-xs text-gray-500">{stat.interval}</p>
      </div>
    </div>
  );
};

const BookingCard = ({ booking }: { booking: Booking }) => {
  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'completed': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-xl p-5 border border-gray-100/50 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-700">{booking.clientInitials}</span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">{booking.clientName}</h4>
            <div className="flex items-center mt-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-xs text-gray-500 ml-1">{booking.rating}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
            {booking.status}
          </span>
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-900">{booking.service}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {booking.date}
          </span>
          <span className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {booking.time}
          </span>
          <span className="font-semibold text-gray-900">{booking.fee}</span>
        </div>
      </div>
    </div>
  );
};

const SlotCard = ({ slot }: { slot: Slot }) => {
  const getStatusStyle = (status: Slot['status']) => {
    switch (status) {
      case 'booked': return 'bg-red-50 border-red-200 text-red-700';
      case 'available': return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-xl p-4 border border-gray-100/50 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-500">{slot.date}</span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusStyle(slot.status)}`}>
          {slot.status}
        </span>
      </div>
      
      <div className="space-y-2">
        <p className="font-semibold text-gray-900 text-sm">{slot.time} - {slot.endTime}</p>
        <p className="text-xs text-gray-600">{slot.service}</p>
        {slot.client && (
          <p className="text-xs text-gray-500">with {slot.client}</p>
        )}
      </div>
    </div>
  );
};

const PerformanceCard = () => (
  <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-100/50">
    <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Overview</h3>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">Session Completion Rate</p>
          <p className="text-xs text-gray-500">Last 30 days</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-gray-900">94%</p>
          <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
            <div className="w-15 h-2 bg-emerald-500 rounded-full"></div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">Client Satisfaction</p>
          <p className="text-xs text-gray-500">Average rating</p>
        </div>
        <div className="text-right">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <p className="text-xl font-bold text-gray-900 ml-1">4.8</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">Response Time</p>
          <p className="text-xs text-gray-500">Average</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-gray-900">2.3h</p>
          <p className="text-xs text-emerald-600">↓ 15% faster</p>
        </div>
      </div>
    </div>
  </div>
);

export default function ExpertDashboard() {
  const [selectedTab, setSelectedTab] = useState('bookings');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Expert Dashboard</h1>
          <p className="text-gray-600 text-lg">Welcome back! Here's your expert overview.</p>
        </div>

        {/* Stats Overview */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {expertStats.map((stat, index) => (
              <StatCard key={index} stat={stat} />
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Activity Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-100/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
                <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                  <div
                    className={`px-4 py-2 text-sm font-medium rounded-md cursor-pointer transition-all ${
                      selectedTab === 'bookings' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setSelectedTab('bookings')}
                  >
                    Bookings
                  </div>
                  <div
                    className={`px-4 py-2 text-sm font-medium rounded-md cursor-pointer transition-all ${
                      selectedTab === 'slots' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setSelectedTab('slots')}
                  >
                    Slots
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {selectedTab === 'bookings' ? (
                  recentBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))
                ) : (
                  upcomingSlots.map((slot) => (
                    <SlotCard key={slot.id} slot={slot} />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Performance Overview */}
          <div>
            <PerformanceCard />
          </div>
        </div>

        {/* Management Insights */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-100/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sessions</span>
                  <span className="text-sm font-semibold text-gray-900">4 scheduled</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Duration</span>
                  <span className="text-sm font-semibold text-gray-900">6.5 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Potential Earnings</span>
                  <span className="text-sm font-semibold text-gray-900">$650</span>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-100/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">This Week</h3>
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Available Slots</span>
                  <span className="text-sm font-semibold text-gray-900">18 remaining</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Booking Rate</span>
                  <span className="text-sm font-semibold text-gray-900">73%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">New Clients</span>
                  <span className="text-sm font-semibold text-gray-900">5 this week</span>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-100/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Growth</h3>
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Monthly Growth</span>
                  <span className="text-sm font-semibold text-emerald-600">+22%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Client Retention</span>
                  <span className="text-sm font-semibold text-emerald-600">89%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Repeat Bookings</span>
                  <span className="text-sm font-semibold text-emerald-600">67%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}