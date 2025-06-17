
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAppointment } from '../contexts/AppointmentContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Calendar, Clock, MapPin, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const { appointments, doctors, reviews, addReview } = useAppointment();
  const [reviewRating, setReviewRating] = useState<{ [key: string]: number }>({});
  const [reviewComment, setReviewComment] = useState<{ [key: string]: string }>({});

  const userAppointments = appointments.filter(apt => apt.patientId === user?.id);
  const userReviews = reviews.filter(review => review.patientId === user?.id);

  const completedAppointments = userAppointments.filter(apt => apt.status === 'completed');
  const upcomingAppointments = userAppointments.filter(apt => apt.status === 'scheduled');

  const getAppointmentDoctor = (doctorId: string) => {
    return doctors.find(doc => doc.id === doctorId);
  };

  const hasReviewedDoctor = (doctorId: string) => {
    return userReviews.some(review => review.doctorId === doctorId);
  };

  const submitReview = (appointmentId: string, doctorId: string) => {
    const rating = reviewRating[appointmentId];
    const comment = reviewComment[appointmentId];

    if (!rating || !comment.trim()) return;

    addReview({
      doctorId,
      patientId: user!.id,
      patientName: user!.name,
      rating,
      comment: comment.trim(),
      date: new Date().toISOString().split('T')[0]
    });

    // Clear form
    setReviewRating(prev => ({ ...prev, [appointmentId]: 0 }));
    setReviewComment(prev => ({ ...prev, [appointmentId]: '' }));
  };

  const StarRating = ({ 
    appointmentId, 
    currentRating, 
    onRatingChange 
  }: { 
    appointmentId: string; 
    currentRating: number; 
    onRatingChange: (rating: number) => void;
  }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 cursor-pointer ${
              star <= currentRating 
                ? 'text-yellow-500 fill-yellow-500' 
                : 'text-gray-300 hover:text-yellow-400'
            }`}
            onClick={() => onRatingChange(star)}
          />
        ))}
      </div>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Please login to view your profile</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription className="text-lg">{user.email}</CardDescription>
                {user.phone && (
                  <p className="text-gray-600 mt-1">{user.phone}</p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{userAppointments.length}</div>
                <div className="text-sm text-gray-600">Total Appointments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completedAppointments.length}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{upcomingAppointments.length}</div>
                <div className="text-sm text-gray-600">Upcoming</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments and Reviews */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="reviews">My Reviews</TabsTrigger>
          </TabsList>

          {/* Upcoming Appointments */}
          <TabsContent value="upcoming">
            <div className="space-y-4">
              {upcomingAppointments.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No upcoming appointments</h3>
                    <p className="text-gray-600 mb-4">Book an appointment with our qualified doctors</p>
                    <Link to="/doctors">
                      <Button>Find Doctors</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                upcomingAppointments.map(appointment => {
                  const doctor = getAppointmentDoctor(appointment.doctorId);
                  return (
                    <Card key={appointment.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4">
                            <img
                              src={doctor?.image}
                              alt={doctor?.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                            <div>
                              <h3 className="font-semibold text-lg">{doctor?.name}</h3>
                              <Badge variant="secondary" className="mb-2">{doctor?.specialty}</Badge>
                              <div className="space-y-1 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  {new Date(appointment.date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-2" />
                                  {appointment.time}
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-2" />
                                  {doctor?.location}
                                </div>
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            {appointment.status}
                          </Badge>
                        </div>
                        {appointment.notes && (
                          <div className="mt-4 p-3 bg-gray-50 rounded">
                            <p className="text-sm"><strong>Notes:</strong> {appointment.notes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* Appointment History */}
          <TabsContent value="history">
            <div className="space-y-4">
              {completedAppointments.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <h3 className="text-lg font-semibold mb-2">No appointment history</h3>
                    <p className="text-gray-600">Your completed appointments will appear here</p>
                  </CardContent>
                </Card>
              ) : (
                completedAppointments.map(appointment => {
                  const doctor = getAppointmentDoctor(appointment.doctorId);
                  const hasReviewed = hasReviewedDoctor(appointment.doctorId);
                  
                  return (
                    <Card key={appointment.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex gap-4">
                            <img
                              src={doctor?.image}
                              alt={doctor?.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                            <div>
                              <h3 className="font-semibold text-lg">{doctor?.name}</h3>
                              <Badge variant="secondary" className="mb-2">{doctor?.specialty}</Badge>
                              <div className="space-y-1 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  {new Date(appointment.date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-2" />
                                  {appointment.time}
                                </div>
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-blue-50 text-blue-700">
                            Completed
                          </Badge>
                        </div>

                        {/* Review Form */}
                        {!hasReviewed && (
                          <div className="border-t pt-4 space-y-4">
                            <h4 className="font-semibold">Rate your experience</h4>
                            <div>
                              <label className="block text-sm font-medium mb-2">Rating</label>
                              <StarRating 
                                appointmentId={appointment.id}
                                currentRating={reviewRating[appointment.id] || 0}
                                onRatingChange={(rating) => setReviewRating(prev => ({ ...prev, [appointment.id]: rating }))}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Comment</label>
                              <textarea
                                className="w-full p-2 border rounded-md"
                                rows={3}
                                placeholder="Share your experience..."
                                value={reviewComment[appointment.id] || ''}
                                onChange={(e) => setReviewComment(prev => ({ ...prev, [appointment.id]: e.target.value }))}
                              />
                            </div>
                            <Button 
                              onClick={() => submitReview(appointment.id, appointment.doctorId)}
                              disabled={!reviewRating[appointment.id] || !reviewComment[appointment.id]?.trim()}
                              size="sm"
                            >
                              Submit Review
                            </Button>
                          </div>
                        )}

                        {hasReviewed && (
                          <div className="border-t pt-4">
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              ✓ Review submitted
                            </Badge>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* My Reviews */}
          <TabsContent value="reviews">
            <div className="space-y-4">
              {userReviews.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                    <p className="text-gray-600">Complete appointments to leave reviews</p>
                  </CardContent>
                </Card>
              ) : (
                userReviews.map(review => {
                  const doctor = getAppointmentDoctor(review.doctorId);
                  return (
                    <Card key={review.id}>
                      <CardContent className="pt-6">
                        <div className="flex gap-4">
                          <img
                            src={doctor?.image}
                            alt={doctor?.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">{doctor?.name}</h3>
                              <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                            <div className="flex items-center mb-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating 
                                      ? 'text-yellow-500 fill-yellow-500' 
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="ml-2 text-sm font-medium">{review.rating}/5</span>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                            
                            {review.adminReply && (
                              <div className="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                                <p className="text-sm font-semibold text-blue-800 mb-1">Doctor's Response:</p>
                                <p className="text-sm text-blue-700">{review.adminReply}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
