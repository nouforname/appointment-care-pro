
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppointment } from '../contexts/AppointmentContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, DollarSign } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Navbar from '../components/Navbar';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const { doctors, bookAppointment } = useAppointment();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const doctor = doctors.find(d => d.id === doctorId);

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Doctor not found</h1>
        </div>
      </div>
    );
  }

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Missing information",
        description: "Please select both date and time for your appointment.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      bookAppointment({
        doctorId: doctor.id,
        patientId: user!.id,
        patientName: user!.name,
        date: selectedDate,
        time: selectedTime,
        status: 'scheduled',
        notes
      });

      toast({
        title: "Appointment booked successfully!",
        description: `Your appointment with ${doctor.name} is scheduled for ${selectedDate} at ${selectedTime}.`,
      });

      navigate('/profile');
    } catch (error) {
      toast({
        title: "Booking failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate available dates (next 30 days, excluding weekends)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    
    return dates;
  };

  const availableDates = generateAvailableDates();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Doctor Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <CardTitle className="text-center">{doctor.name}</CardTitle>
                <CardDescription className="text-center">
                  <Badge variant="secondary">{doctor.specialty}</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-center text-2xl font-bold text-blue-600">
                  <DollarSign className="w-6 h-6 mr-1" />
                  {doctor.consultationFee}
                </div>
                <div className="text-center text-sm text-gray-600">
                  Consultation Fee
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Your Appointment
                </CardTitle>
                <CardDescription>
                  Select your preferred date and time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Date Selection */}
                <div>
                  <Label className="text-base font-semibold">Select Date</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                    {availableDates.slice(0, 12).map(date => {
                      const dateObj = new Date(date);
                      const formattedDate = dateObj.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      });
                      
                      return (
                        <Button
                          key={date}
                          variant={selectedDate === date ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedDate(date)}
                          className="h-12 flex flex-col"
                        >
                          <span className="text-xs">{formattedDate}</span>
                          <span className="text-xs opacity-70">
                            {dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Selection */}
                <div>
                  <Label className="text-base font-semibold flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Available Time Slots
                  </Label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mt-2">
                    {doctor.availableSlots.map(time => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                        disabled={!selectedDate}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                  {!selectedDate && (
                    <p className="text-sm text-gray-500 mt-2">
                      Please select a date first
                    </p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any specific symptoms or concerns you'd like to discuss..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Patient Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Patient Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input value={user?.name || ''} disabled />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input value={user?.email || ''} disabled />
                    </div>
                  </div>
                </div>

                {/* Booking Summary */}
                {selectedDate && selectedTime && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">Appointment Summary</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Doctor:</strong> {doctor.name}</p>
                      <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                      <p><strong>Time:</strong> {selectedTime}</p>
                      <p><strong>Fee:</strong> ${doctor.consultationFee}</p>
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <Button 
                  onClick={handleBooking} 
                  disabled={!selectedDate || !selectedTime || loading}
                  size="lg"
                  className="w-full"
                >
                  {loading ? 'Booking...' : `Book Appointment - $${doctor.consultationFee}`}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
