
import React, { createContext, useContext, useState } from 'react';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  rating: number;
  experience: number;
  location: string;
  consultationFee: number;
  availableSlots: string[];
  bio: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Review {
  id: string;
  doctorId: string;
  patientId: string;
  patientName: string;
  rating: number;
  comment: string;
  date: string;
  adminReply?: string;
}

interface AppointmentContextType {
  doctors: Doctor[];
  appointments: Appointment[];
  reviews: Review[];
  bookAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  addReview: (review: Omit<Review, 'id'>) => void;
  updateReview: (id: string, updates: Partial<Review>) => void;
  deleteReview: (id: string) => void;
  addAdminReply: (reviewId: string, reply: string) => void;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [doctors] = useState<Doctor[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      image: '/placeholder.svg',
      rating: 4.8,
      experience: 12,
      location: 'Heart Care Center, New York',
      consultationFee: 200,
      availableSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      bio: 'Dr. Sarah Johnson is a board-certified cardiologist with over 12 years of experience in treating heart conditions. She specializes in preventive cardiology and interventional procedures.'
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialty: 'Neurologist',
      image: '/placeholder.svg',
      rating: 4.9,
      experience: 15,
      location: 'NeuroHealth Institute, Los Angeles',
      consultationFee: 250,
      availableSlots: ['08:00', '09:00', '10:00', '13:00', '14:00', '15:00'],
      bio: 'Dr. Michael Chen is a renowned neurologist specializing in epilepsy, stroke, and neurodegenerative diseases. He has published numerous research papers and is actively involved in clinical trials.'
    },
    {
      id: '3',
      name: 'Dr. Emily Davis',
      specialty: 'Pediatrician',
      image: '/placeholder.svg',
      rating: 4.7,
      experience: 8,
      location: 'Children\'s Medical Center, Chicago',
      consultationFee: 150,
      availableSlots: ['08:30', '09:30', '10:30', '13:30', '14:30', '15:30'],
      bio: 'Dr. Emily Davis is a compassionate pediatrician dedicated to providing comprehensive care for children from infancy through adolescence. She has a special interest in developmental pediatrics.'
    },
    {
      id: '4',
      name: 'Dr. Robert Wilson',
      specialty: 'Orthopedic Surgeon',
      image: '/placeholder.svg',
      rating: 4.6,
      experience: 20,
      location: 'Orthopedic Excellence Center, Miami',
      consultationFee: 300,
      availableSlots: ['07:00', '08:00', '09:00', '13:00', '14:00'],
      bio: 'Dr. Robert Wilson is a leading orthopedic surgeon with expertise in joint replacement, sports medicine, and trauma surgery. He has performed over 5000 successful surgeries.'
    }
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      doctorId: '1',
      patientId: '1',
      patientName: 'John Doe',
      rating: 5,
      comment: 'Dr. Johnson was excellent! Very thorough and caring.',
      date: '2024-01-15'
    },
    {
      id: '2',
      doctorId: '2',
      patientId: '2',
      patientName: 'Jane Smith',
      rating: 4,
      comment: 'Great doctor, very knowledgeable. The wait time was a bit long.',
      date: '2024-01-10'
    }
  ]);

  const bookAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment = {
      ...appointment,
      id: Date.now().toString()
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const addReview = (review: Omit<Review, 'id'>) => {
    const newReview = {
      ...review,
      id: Date.now().toString()
    };
    setReviews(prev => [...prev, newReview]);
  };

  const updateReview = (id: string, updates: Partial<Review>) => {
    setReviews(prev => prev.map(review => 
      review.id === id ? { ...review, ...updates } : review
    ));
  };

  const deleteReview = (id: string) => {
    setReviews(prev => prev.filter(review => review.id !== id));
  };

  const addAdminReply = (reviewId: string, reply: string) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId ? { ...review, adminReply: reply } : review
    ));
  };

  return (
    <AppointmentContext.Provider value={{
      doctors,
      appointments,
      reviews,
      bookAppointment,
      addReview,
      updateReview,
      deleteReview,
      addAdminReply
    }}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointment must be used within an AppointmentProvider');
  }
  return context;
};
