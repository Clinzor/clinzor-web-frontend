import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Calendar, 
  X, 
  Save, 
  Loader2, 
  ChevronLeft, 
  ChevronRight, 
  Video, 
  Home, 
  Building, 
  Info,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Menu,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Mock data and types
type Booking = {
  uuid: string;
  patient_name: string;
  patient_email: string;
  patient_mobile: string;
  patient_address: string;
  doctor: string;
  start_time: string;
  end_time: string;
  booking_status: string;
  booking_type: string;
  payment_status: string;
  is_rescheduled: boolean;
  last_modified: string;
  amount?: number;
};

type Notification = {
  type: 'success' | 'warning' | 'error';
  message: string;
} | null;

// Mock data
const initialBookingsData: Booking[] = [
  {
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },
  {
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },{
    uuid: 'BK001',
    patient_name: 'John Doe',
    patient_email: 'john@example.com',
    patient_mobile: '+1234567890',
    patient_address: '123 Main St, City',
    doctor: 'Dr. Smith',
    start_time: '2025-05-24T10:00:00Z',
    end_time: '2025-05-24T10:30:00Z',
    booking_status: 'SCHEDULED',
    booking_type: 'VIDEO_CALL',
    payment_status: 'COMPLETED',
    is_rescheduled: false,
    last_modified: '2025-05-23T08:00:00Z',
    amount: 150
  },
  {
    uuid: 'BK002',
    patient_name: 'Jane Smith',
    patient_email: 'jane@example.com',
    patient_mobile: '+1234567891',
    patient_address: '456 Oak Ave, City',
    doctor: 'Dr. Johnson',
    start_time: '2025-05-24T14:00:00Z',
    end_time: '2025-05-24T14:30:00Z',
    booking_status: 'CONFIRMED',
    booking_type: 'PHYSICAL_VISIT',
    payment_status: 'PENDING',
    is_rescheduled: false,
    last_modified: '2025-05-23T09:00:00Z',
    amount: 200
  },
  {
    uuid: 'BK003',
    patient_name: 'Michael Brown',
    patient_email: 'michael@example.com',
    patient_mobile: '+1234567892',
    patient_address: '789 Pine St, City',
    doctor: 'Dr. Wilson',
    start_time: '2025-05-25T09:00:00Z',
    end_time: '2025-05-25T09:30:00Z',
    booking_status: 'IN_PROGRESS',
    booking_type: 'HOME_VISIT',
    payment_status: 'COMPLETED',
    is_rescheduled: true,
    last_modified: '2025-05-24T10:00:00Z',
    amount: 300
  }
];

const bookingStatuses = ['All', 'SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'];
const bookingTypes = ['All', 'VIDEO_CALL', 'HOME_VISIT', 'PHYSICAL_VISIT'];
const paymentStatuses = ['All', 'PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'];

const timeSlots = [
  { value: '09:00', label: '9:00 AM', available: true },
  { value: '09:30', label: '9:30 AM', available: true },
  { value: '10:00', label: '10:00 AM', available: false },
  { value: '10:30', label: '10:30 AM', available: true },
  { value: '11:00', label: '11:00 AM', available: true },
  { value: '11:30', label: '11:30 AM', available: false },
  { value: '14:00', label: '2:00 PM', available: true },
  { value: '14:30', label: '2:30 PM', available: true },
  { value: '15:00', label: '3:00 PM', available: true },
  { value: '15:30', label: '3:30 PM', available: true },
  { value: '16:00', label: '4:00 PM', available: false },
  { value: '16:30', label: '4:30 PM', available: true }
];

const BookingManagementTable = () => {
  const [bookings, setBookings] = useState<Booking[]>(initialBookingsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'reschedule' | 'edit'>('list');
  const [notification, setNotification] = useState<Notification>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);
  const [rescheduleData, setRescheduleData] = useState({
    date: '',
    selectedSlot: '',
    isOffDay: false
  });
  const [editData, setEditData] = useState<Partial<Booking>>({});
  const [availableSlots, setAvailableSlots] = useState(timeSlots);
  const [showFilters, setShowFilters] = useState(false);

  // Filter bookings based on search and filters
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.uuid.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.patient_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.patient_mobile.includes(searchTerm) ||
                         (booking.doctor && booking.doctor.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All' || booking.booking_status === statusFilter;
    const matchesType = typeFilter === 'All' || booking.booking_type === typeFilter;
    const matchesPayment = paymentFilter === 'All' || booking.payment_status === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesPayment;
  });

  // Sort bookings
  const sortedBookings = React.useMemo(() => {
    if (!sortConfig) return filteredBookings;
    
    return [...filteredBookings].sort((a, b) => {
      const aVal = a[sortConfig.key as keyof Booking] ?? '';
      const bVal = b[sortConfig.key as keyof Booking] ?? '';
      
      if (aVal === null) return 1;
      if (bVal === null) return -1;
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredBookings, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = sortedBookings.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, typeFilter, paymentFilter, itemsPerPage]);

  // Simulate fetching available slots when date changes
  React.useEffect(() => {
    if (rescheduleData.date) {
      setIsLoading(true);
      setTimeout(() => {
        const updatedSlots = timeSlots.map(slot => ({
          ...slot,
          available: Math.random() > 0.3
        }));
        setAvailableSlots(updatedSlots);
        setIsLoading(false);
      }, 500);
    }
  }, [rescheduleData.date]);

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return current.direction === 'asc' 
          ? { key, direction: 'desc' }
          : null;
      }
      return { key, direction: 'asc' };
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CONFIRMED':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'IN_PROGRESS':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CANCELLED':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'RESCHEDULED':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'REFUNDED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'FAILED':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getBookingTypeIcon = (type: string) => {
    switch (type) {
      case 'VIDEO_CALL':
        return <Video size={14} className="mr-1" />;
      case 'HOME_VISIT':
        return <Home size={14} className="mr-1" />;
      case 'PHYSICAL_VISIT':
        return <Building size={14} className="mr-1" />;
      default:
        return null;
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const formatForInput = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  const showNotification = (type: 'success' | 'warning' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setViewMode('detail');
  };

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditData(booking);
    setViewMode('edit');
  };

  const handleRescheduleBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setRescheduleData({
      date: formatForInput(booking.start_time),
      selectedSlot: '',
      isOffDay: false
    });
    setViewMode('reschedule');
  };

  const handleSaveReschedule = () => {
    if (!selectedBooking || !rescheduleData.date || !rescheduleData.selectedSlot) {
      showNotification('error', 'Please select a date and time slot.');
      return;
    }

    setIsLoading(true);
    
    const [hours, minutes] = rescheduleData.selectedSlot.split(':');
    const newStartTime = new Date(rescheduleData.date + 'T' + rescheduleData.selectedSlot + ':00Z').toISOString();
    const newEndTime = new Date(rescheduleData.date + 'T' + hours + ':' + (parseInt(minutes) + 30).toString().padStart(2, '0') + ':00Z').toISOString();
    
    setTimeout(() => {
      setBookings(bookings.map(booking => 
        booking.uuid === selectedBooking.uuid 
          ? { 
              ...booking, 
              start_time: newStartTime,
              end_time: newEndTime,
              is_rescheduled: true,
              booking_status: 'SCHEDULED',
              last_modified: new Date().toISOString() 
            }
          : booking
      ));
      
      showNotification('success', 'Booking rescheduled successfully.');
      setIsLoading(false);
      setViewMode('list');
      setSelectedBooking(null);
    }, 1000);
  };

  const handleSaveEdit = () => {
    if (!selectedBooking || !editData) {
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setBookings(bookings.map(booking => 
        booking.uuid === selectedBooking.uuid 
          ? { 
              ...booking, 
              ...editData,
              last_modified: new Date().toISOString() 
            }
          : booking
      ));
      
      showNotification('success', 'Booking updated successfully.');
      setIsLoading(false);
      setViewMode('list');
      setSelectedBooking(null);
    }, 1000);
  };

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setIsLoading(true);
      
      setTimeout(() => {
        setBookings(bookings.map(booking => 
          booking.uuid === bookingId 
            ? { 
                ...booking, 
                booking_status: 'CANCELLED', 
                payment_status: booking.payment_status === 'COMPLETED' ? 'REFUNDED' : booking.payment_status,
                last_modified: new Date().toISOString() 
              }
            : booking
        ));
        
        showNotification('success', 'Booking cancelled successfully.');
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    setIsLoading(true);
    
    setTimeout(() => {
      setBookings(bookings.map(booking => 
        booking.uuid === bookingId 
          ? { ...booking, booking_status: newStatus, last_modified: new Date().toISOString() }
          : booking
      ));
      
      showNotification('success', `Booking status updated to ${newStatus.toLowerCase()}.`);
      setIsLoading(false);
    }, 500);
  };

  const handlePaymentStatusChange = (bookingId: string, newPaymentStatus: string) => {
    setIsLoading(true);
    
    setTimeout(() => {
      setBookings(bookings.map(booking => 
        booking.uuid === bookingId 
          ? { ...booking, payment_status: newPaymentStatus, last_modified: new Date().toISOString() }
          : booking
      ));
      
      showNotification('success', `Payment status updated to ${newPaymentStatus.toLowerCase()}.`);
      setIsLoading(false);
    }, 500);
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
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

  // Notification Component
  const NotificationBar = () => {
    if (!notification) return null;

    const getNotificationIcon = () => {
      switch (notification.type) {
        case 'success':
          return <CheckCircle size={20} className="text-green-600" />;
        case 'warning':
          return <AlertCircle size={20} className="text-yellow-600" />;
        case 'error':
          return <XCircle size={20} className="text-red-600" />;
        default:
          return <Info size={20} className="text-blue-600" />;
      }
    };

    const getNotificationClass = () => {
      switch (notification.type) {
        case 'success':
          return 'bg-green-50 border-green-200 text-green-800';
        case 'warning':
          return 'bg-yellow-50 border-yellow-200 text-yellow-800';
        case 'error':
          return 'bg-red-50 border-red-200 text-red-800';
        default:
          return 'bg-blue-50 border-blue-200 text-blue-800';
      }
    };

    return (
      <div className={`fixed top-4 right-4 left-4 sm:left-auto z-50 flex items-center gap-2 px-4 py-3 rounded-lg border ${getNotificationClass()} shadow-lg`}>
        {getNotificationIcon()}
        <span className="font-medium flex-1">{notification.message}</span>
        <button
          onClick={() => setNotification(null)}
          className="ml-2 text-gray-500 hover:text-gray-700 flex-shrink-0"
        >
          <X size={16} />
        </button>
      </div>
    );
  };

  // Mobile Card Component
  const BookingCard = ({ booking }: { booking: Booking }) => {
    const dateTime = formatDateTime(booking.start_time);
    
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-sm font-mono text-gray-600">{booking.uuid}</span>
            {booking.is_rescheduled && (
              <div className="flex items-center gap-1 mt-1">
                <Clock size={12} className="text-amber-500" />
                <span className="text-xs text-amber-600">Rescheduled</span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleViewDetails(booking)}
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => handleEditBooking(booking)}
              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => handleRescheduleBooking(booking)}
              className="p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors"
              title="Reschedule"
            >
              <Calendar size={16} />
            </button>
          </div>
        </div>
        
        <div>
          <div className="font-medium text-gray-900">{booking.patient_name}</div>
          <div className="text-sm text-gray-600">{booking.patient_email}</div>
          <div className="text-sm text-gray-600">{booking.patient_mobile}</div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <div className="font-medium">{booking.doctor}</div>
            <div className="flex items-center mt-1">
              {getBookingTypeIcon(booking.booking_type)}
              <span>{booking.booking_type.replace('_', ' ')}</span>
            </div>
          </div>
          <div className="text-right text-sm">
            <div className="font-medium">{dateTime.date}</div>
            <div className="text-gray-600">{dateTime.time}</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex gap-2">
            <select
              value={booking.booking_status}
              onChange={(e) => handleStatusChange(booking.uuid, e.target.value)}
              className={`text-xs font-medium px-2 py-1 rounded-full border cursor-pointer ${getStatusColor(booking.booking_status)}`}
            >
              {bookingStatuses.filter(status => status !== 'All').map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <select
              value={booking.payment_status}
              onChange={(e) => handlePaymentStatusChange(booking.uuid, e.target.value)}
              className={`text-xs font-medium px-2 py-1 rounded-full border cursor-pointer ${getPaymentStatusColor(booking.payment_status)}`}
            >
              {paymentStatuses.filter(status => status !== 'All').map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          {booking.amount && (
            <div className="text-sm font-medium text-gray-900">${booking.amount}</div>
          )}
        </div>
      </div>
    );
  };

  // Detail Modal
  const DetailModal = ({ booking, onClose }: { booking: Booking; onClose: () => void }) => {
    const dateTime = formatDateTime(booking.start_time);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Booking Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>
          </div>
          
          <div className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Patient Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-gray-900">{booking.patient_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900 break-all">{booking.patient_email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900">{booking.patient_mobile}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="text-gray-900">{booking.patient_address}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Appointment Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Booking ID</label>
                    <p className="text-gray-900 font-mono text-sm">{booking.uuid}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Doctor</label>
                    <p className="text-gray-900">{booking.doctor}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date & Time</label>
                    <p className="text-gray-900">{dateTime.date} at {dateTime.time}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Type</label>
                    <div className="flex items-center">
                      {getBookingTypeIcon(booking.booking_type)}
                      <span className="text-gray-900">{booking.booking_type.replace('_', ' ')}</span>
                    </div>
                  </div>
                  {booking.amount && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Amount</label>
                      <p className="text-gray-900">${booking.amount}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Booking Status</label>
                <div className={`mt-1 inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.booking_status)}`}>
                  {booking.booking_status}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Payment Status</label>
                <div className={`mt-1 inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(booking.payment_status)}`}>
                  {booking.payment_status}
                </div>
              </div>
            </div>
            
            {booking.is_rescheduled && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-amber-700">
                  <Clock size={16} />
                  <span className="font-medium">This booking has been rescheduled</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="sticky bottom-0 bg-white flex flex-col sm:flex-row justify-end gap-3 p-4 sm:p-6 border-t border-gray-200">
            <button
              onClick={() => {
                onClose();
                handleEditBooking(booking);
              }}
              className="w-full sm:w-auto px-4 py-2 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Edit size={16} />
              Edit
            </button>
            <button
              onClick={() => {
                onClose();
                handleRescheduleBooking(booking);
              }}
              className="w-full sm:w-auto px-4 py-2 text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Calendar size={16} />
              Reschedule
            </button>
          </div>
        </div>
      </div>
    );
  };
// ... (previous imports and code remain the same until RescheduleModal)

  // Reschedule Modal
  const RescheduleModal = ({ booking, onClose }: { booking: Booking; onClose: () => void }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Reschedule Booking</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="p-4 sm:p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Booking ID</label>
                <p className="text-gray-900 font-mono text-sm">{booking.uuid}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Patient Name</label>
                <p className="text-gray-900">{booking.patient_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Current Appointment</label>
                <p className="text-gray-900">
                  {formatDateTime(booking.start_time).date} at {formatDateTime(booking.start_time).time}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="reschedule-date" className="text-sm font-medium text-gray-500 block mb-1">
                  New Date
                </label>
                <input
                  id="reschedule-date"
                  type="date"
                  value={rescheduleData.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {rescheduleData.date && (
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">Available Time Slots</label>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="animate-spin text-blue-500" size={24} />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {availableSlots.map(slot => (
                        <button
                          key={slot.value}
                          onClick={() => setRescheduleData({ ...rescheduleData, selectedSlot: slot.value })}
                          disabled={!slot.available}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            slot.available
                              ? rescheduleData.selectedSlot === slot.value
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {slot.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {rescheduleData.isOffDay && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle size={16} />
                  <span className="font-medium">Selected date is an off day</span>
                </div>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-white flex flex-col sm:flex-row justify-end gap-3 p-4 sm:p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveReschedule}
              disabled={isLoading || !rescheduleData.date || !rescheduleData.selectedSlot}
              className="w-full sm:w-auto px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Edit Modal
  const EditModal = ({ booking, onClose }: { booking: Booking; onClose: () => void }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Edit Booking</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="patient_name" className="text-sm font-medium text-gray-500 block mb-1">
                    Patient Name
                  </label>
                  <input
                    id="patient_name"
                    type="text"
                    value={editData.patient_name || ''}
                    onChange={(e) => setEditData({ ...editData, patient_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="patient_email" className="text-sm font-medium text-gray-500 block mb-1">
                    Email
                  </label>
                  <input
                    id="patient_email"
                    type="email"
                    value={editData.patient_email || ''}
                    onChange={(e) => setEditData({ ...editData, patient_email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="patient_mobile" className="text-sm font-medium text-gray-500 block mb-1">
                    Phone
                  </label>
                  <input
                    id="patient_mobile"
                    type="tel"
                    value={editData.patient_mobile || ''}
                    onChange={(e) => setEditData({ ...editData, patient_mobile: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="patient_address" className="text-sm font-medium text-gray-500 block mb-1">
                    Address
                  </label>
                  <input
                    id="patient_address"
                    type="text"
                    value={editData.patient_address || ''}
                    onChange={(e) => setEditData({ ...editData, patient_address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="doctor" className="text-sm font-medium text-gray-500 block mb-1">
                    Doctor
                  </label>
                  <input
                    id="doctor"
                    type="text"
                    value={editData.doctor || ''}
                    onChange={(e) => setEditData({ ...editData, doctor: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="amount" className="text-sm font-medium text-gray-500 block mb-1">
                    Amount
                  </label>
                  <input
                    id="amount"
                    type="number"
                    value={editData.amount || ''}
                    onChange={(e) => setEditData({ ...editData, amount: parseFloat(e.target.value) || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="booking_status" className="text-sm font-medium text-gray-500 block mb-1">
                  Booking Status
                </label>
                <select
                  id="booking_status"
                  value={editData.booking_status || ''}
                  onChange={(e) => setEditData({ ...editData, booking_status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {bookingStatuses.filter(status => status !== 'All').map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="payment_status" className="text-sm font-medium text-gray-500 block mb-1">
                  Payment Status
                </label>
                <select
                  id="payment_status"
                  value={editData.payment_status || ''}
                  onChange={(e) => setEditData({ ...editData, payment_status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {paymentStatuses.filter(status => status !== 'All').map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white flex flex-col sm:flex-row justify-end gap-3 p-4 sm:p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={isLoading}
              className="w-full sm:w-auto px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full mx-auto space-y-6">
      {/* Notification */}
      <NotificationBar />

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by ID, name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter size={20} />
            <span className="hidden sm:inline">Filters</span>
            {showFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">Booking Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {bookingStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">Booking Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {bookingTypes.map(type => (
                  <option key={type} value={type}>{type.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">Payment Status</label>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {paymentStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th
                onClick={() => handleSort('uuid')}
                className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
              >
                ID
                {sortConfig?.key === 'uuid' && (
                  sortConfig.direction === 'asc' ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />
                )}
              </th>
              <th
                onClick={() => handleSort('patient_name')}
                className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
              >
                Patient
                {sortConfig?.key === 'patient_name' && (
                  sortConfig.direction === 'asc' ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />
                )}
              </th>
              <th
                onClick={() => handleSort('doctor')}
                className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
              >
                Doctor
                {sortConfig?.key === 'doctor' && (
                  sortConfig.direction === 'asc' ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />
                )}
              </th>
              <th
                onClick={() => handleSort('start_time')}
                className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
              >
                Date & Time
                {sortConfig?.key === 'start_time' && (
                  sortConfig.direction === 'asc' ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />
                )}
              </th>
              <th
                onClick={() => handleSort('booking_type')}
                className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
              >
                Type
                {sortConfig?.key === 'booking_type' && (
                  sortConfig.direction === 'asc' ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />
                )}
              </th>
              <th
                onClick={() => handleSort('booking_status')}
                className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
              >
                Status
                {sortConfig?.key === 'booking_status' && (
                  sortConfig.direction === 'asc' ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />
                )}
              </th>
              <th
                onClick={() => handleSort('payment_status')}
                className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
              >
                Payment
                {sortConfig?.key === 'payment_status' && (
                  sortConfig.direction === 'asc' ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />
                )}
              </th>
              <th
                onClick={() => handleSort('amount')}
                className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
              >
                Amount
                {sortConfig?.key === 'amount' && (
                  sortConfig.direction === 'asc' ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />
                )}
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBookings.map(booking => {
              const dateTime = formatDateTime(booking.start_time);
              return (
                <tr key={booking.uuid} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 font-mono">{booking.uuid}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div>{booking.patient_name}</div>
                    <div className="text-xs text-gray-600">{booking.patient_email}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{booking.doctor}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {dateTime.date}
                    <br />
                    <span className="text-xs text-gray-600">{dateTime.time}</span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center">
                      {getBookingTypeIcon(booking.booking_type)}
                      <span>{booking.booking_type.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={booking.booking_status}
                      onChange={(e) => handleStatusChange(booking.uuid, e.target.value)}
                      className={`text-xs font-medium px-2 py-1 rounded-full border cursor-pointer ${getStatusColor(booking.booking_status)}`}
                    >
                      {bookingStatuses.filter(status => status !== 'All').map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={booking.payment_status}
                      onChange={(e) => handlePaymentStatusChange(booking.uuid, e.target.value)}
                      className={`text-xs font-medium px-2 py-1 rounded-full border cursor-pointer ${getPaymentStatusColor(booking.payment_status)}`}
                    >
                      {paymentStatuses.filter(status => status !== 'All').map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">${booking.amount || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(booking)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEditBooking(booking)}
                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleRescheduleBooking(booking)}
                        className="p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Reschedule"
                      >
                        <Calendar size={16} />
                      </button>
                      <button
                        onClick={() => handleCancelBooking(booking.uuid)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        title="Cancel"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {paginatedBookings.map(booking => (
          <BookingCard key={booking.uuid} booking={booking} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg disabled:text-gray-300 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-1">
              {generatePageNumbers().map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg disabled:text-gray-300 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <span className="text-sm text-gray-600">
            Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, sortedBookings.length)} of {sortedBookings.length}
          </span>
        </div>
      )}

      {/* Modals */}
      {viewMode === 'detail' && selectedBooking && (
        <DetailModal booking={selectedBooking} onClose={() => setViewMode('list')} />
      )}
      {viewMode === 'reschedule' && selectedBooking && (
        <RescheduleModal booking={selectedBooking} onClose={() => setViewMode('list')} />
      )}
      {viewMode === 'edit' && selectedBooking && (
        <EditModal booking={selectedBooking} onClose={() => setViewMode('list')} />
      )}
    </div>
  );
};

export default BookingManagementTable;