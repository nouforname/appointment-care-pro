
import { useState } from 'react';
import { useAppointment } from '../contexts/AppointmentContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Users, 
  Star, 
  MessageCircle, 
  Edit, 
  Trash2, 
  Reply,
  Clock,
  User,
  MapPin
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const { appointments, reviews, doctors, updateReview, deleteReview, addAdminReply } = useAppointment();
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editComment, setEditComment] = useState('');
  const [editRating, setEditRating] = useState(0);
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});

  const getDoctorName = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor?.name || 'Unknown Doctor';
  };

  const getDoctorDetails = (doctorId: string) => {
    return doctors.find(d => d.id === doctorId);
  };

  const handleEditReview = (review: any) => {
    setEditingReview(review.id);
    setEditComment(review.comment);
    setEditRating(review.rating);
  };

  const handleSaveEdit = () => {
    if (editingReview) {
      updateReview(editingReview, {
        comment: editComment,
        rating: editRating
      });
      setEditingReview(null);
      setEditComment('');
      setEditRating(0);
      toast({
        title: "Review updated",
        description: "The review has been successfully updated.",
      });
    }
  };

  const handleDeleteReview = (reviewId: string) => {
    if (confirm('Are you sure you want to delete this review?')) {
      deleteReview(reviewId);
      toast({
        title: "Review deleted",
        description: "The review has been successfully deleted.",
      });
    }
  };

  const handleAddReply = (reviewId: string) => {
    const reply = replyText[reviewId];
    if (!reply?.trim()) return;

    addAdminReply(reviewId, reply.trim());
    setReplyText(prev => ({ ...prev, [reviewId]: '' }));
    toast({
      title: "Reply added",
      description: "Your reply has been added to the review.",
    });
  };

  const StarRating = ({ 
    rating, 
    onRatingChange, 
    readonly = false 
  }: { 
    rating: number; 
    onRatingChange?: (rating: number) => void; 
    readonly?: boolean;
  }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? 'text-yellow-500 fill-yellow-500' 
                : 'text-gray-300'
            } ${!readonly ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => !readonly && onRatingChange?.(star)}
          />
        ))}
      </div>
    );
  };

  const totalPatients = new Set(appointments.map(apt => apt.patientId)).size;
  const totalAppointments = appointments.length;
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage appointments, reviews, and patient feedback</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{totalPatients}</p>
                  <p className="text-gray-600">Total Patients</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{totalAppointments}</p>
                  <p className="text-gray-600">Appointments</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <MessageCircle className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{reviews.length}</p>
                  <p className="text-gray-600">Reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Star className="w-8 h-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{averageRating}</p>
                  <p className="text-gray-600">Avg Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="reviews">Reviews & Comments</TabsTrigger>
          </TabsList>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Patient Appointments</CardTitle>
                <CardDescription>
                  View and manage all patient appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.length === 0 ? (
                    <p className="text-center text-gray-600 py-8">No appointments found</p>
                  ) : (
                    appointments.map(appointment => {
                      const doctor = getDoctorDetails(appointment.doctorId);
                      return (
                        <div key={appointment.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex gap-4">
                              <img
                                src={doctor?.image}
                                alt={doctor?.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div>
                                <h3 className="font-semibold">{appointment.patientName}</h3>
                                <p className="text-sm text-gray-600">with {getDoctorName(appointment.doctorId)}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                  <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {new Date(appointment.date).toLocaleDateString()}
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {appointment.time}
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {doctor?.location}
                                  </div>
                                </div>
                                {appointment.notes && (
                                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                                    <strong>Notes:</strong> {appointment.notes}
                                  </div>
                                )}
                              </div>
                            </div>
                            <Badge 
                              variant={appointment.status === 'completed' ? 'default' : 'secondary'}
                              className={
                                appointment.status === 'completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : appointment.status === 'scheduled'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-red-100 text-red-800'
                              }
                            >
                              {appointment.status}
                            </Badge>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Patient Reviews & Comments</CardTitle>
                <CardDescription>
                  Manage patient feedback, edit comments, and reply to reviews
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {reviews.length === 0 ? (
                    <p className="text-center text-gray-600 py-8">No reviews found</p>
                  ) : (
                    reviews.map(review => (
                      <div key={review.id} className="border rounded-lg p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-600" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <span className="font-semibold">{review.patientName}</span>
                                <span className="text-gray-500 ml-2">• {getDoctorName(review.doctorId)}</span>
                                <span className="text-gray-500 ml-2">• {review.date}</span>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditReview(review)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteReview(review.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            {editingReview === review.id ? (
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium mb-2">Rating</label>
                                  <StarRating 
                                    rating={editRating}
                                    onRatingChange={setEditRating}
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-2">Comment</label>
                                  <Textarea
                                    value={editComment}
                                    onChange={(e) => setEditComment(e.target.value)}
                                    rows={3}
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <Button onClick={handleSaveEdit} size="sm">
                                    Save Changes
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    onClick={() => setEditingReview(null)}
                                    size="sm"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <StarRating rating={review.rating} readonly />
                                <p className="mt-2 text-gray-700">{review.comment}</p>
                              </>
                            )}

                            {/* Admin Reply Section */}
                            {review.adminReply ? (
                              <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                                <p className="text-sm font-semibold text-blue-800 mb-1">Your Reply:</p>
                                <p className="text-sm text-blue-700">{review.adminReply}</p>
                              </div>
                            ) : (
                              <div className="mt-4 space-y-2">
                                <div className="flex items-center gap-2">
                                  <Reply className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm font-medium">Reply to this review</span>
                                </div>
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Type your reply..."
                                    value={replyText[review.id] || ''}
                                    onChange={(e) => setReplyText(prev => ({ 
                                      ...prev, 
                                      [review.id]: e.target.value 
                                    }))}
                                    className="flex-1"
                                  />
                                  <Button 
                                    onClick={() => handleAddReply(review.id)}
                                    disabled={!replyText[review.id]?.trim()}
                                    size="sm"
                                  >
                                    Reply
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
