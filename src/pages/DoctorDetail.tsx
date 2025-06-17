
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppointment } from '../contexts/AppointmentContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, MapPin, Clock, DollarSign, User, Calendar } from 'lucide-react';
import Navbar from '../components/Navbar';
import ReviewSection from '../components/ReviewSection';

const DoctorDetail = () => {
  const { id } = useParams();
  const { doctors, reviews } = useAppointment();
  const { user } = useAuth();
  
  const doctor = doctors.find(d => d.id === id);
  const doctorReviews = reviews.filter(r => r.doctorId === id);
  
  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Doctor not found</h1>
          <Link to="/doctors">
            <Button className="mt-4">Back to Doctors</Button>
          </Link>
        </div>
      </div>
    );
  }

  const averageRating = doctorReviews.length > 0 
    ? doctorReviews.reduce((sum, review) => sum + review.rating, 0) / doctorReviews.length 
    : doctor.rating;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Doctor Info */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{doctor.name}</CardTitle>
                    <Badge variant="secondary" className="mb-3">{doctor.specialty}</Badge>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-2" />
                        <span className="font-semibold">{averageRating.toFixed(1)}</span>
                        <span className="text-gray-600 ml-1">({doctorReviews.length} reviews)</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-gray-500 mr-2" />
                        <span>{doctor.experience} years experience</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-gray-500 mr-2" />
                        <span>${doctor.consultationFee}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">About</h3>
                  <p className="text-gray-600">{doctor.bio}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Location
                  </h3>
                  <p className="text-gray-600">{doctor.location}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Available Time Slots</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {doctor.availableSlots.map(slot => (
                      <Badge key={slot} variant="outline" className="justify-center py-1">
                        {slot}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Reviews Section */}
            <div className="mt-8">
              <ReviewSection doctorId={doctor.id} />
            </div>
          </div>
          
          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-center">Book Appointment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">${doctor.consultationFee}</div>
                  <div className="text-sm text-gray-600">Consultation Fee</div>
                </div>
                
                <Separator />
                
                {user ? (
                  <Link to={`/book-appointment/${doctor.id}`}>
                    <Button className="w-full" size="lg">
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Now
                    </Button>
                  </Link>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 text-center">
                      Please login to book an appointment
                    </p>
                    <Link to="/login">
                      <Button className="w-full" size="lg">
                        <User className="w-4 h-4 mr-2" />
                        Login to Book
                      </Button>
                    </Link>
                  </div>
                )}
                
                <div className="text-xs text-gray-500 text-center">
                  <p>• Instant confirmation</p>
                  <p>• 24/7 support available</p>
                  <p>• Easy rescheduling</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;
