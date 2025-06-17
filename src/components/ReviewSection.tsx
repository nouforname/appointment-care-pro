
import { useState } from 'react';
import { useAppointment } from '../contexts/AppointmentContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ReviewSectionProps {
  doctorId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ doctorId }) => {
  const { reviews, addReview } = useAppointment();
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const doctorReviews = reviews.filter(r => r.doctorId === doctorId);

  const handleSubmitReview = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to leave a review.",
        variant: "destructive",
      });
      return;
    }

    if (rating === 0 || !comment.trim()) {
      toast({
        title: "Invalid review",
        description: "Please provide both rating and comment.",
        variant: "destructive",
      });
      return;
    }

    addReview({
      doctorId,
      patientId: user.id,
      patientName: user.name,
      rating,
      comment: comment.trim(),
      date: new Date().toISOString().split('T')[0]
    });

    setRating(0);
    setComment('');
    setShowReviewForm(false);
    
    toast({
      title: "Review submitted",
      description: "Thank you for your feedback!",
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
            className={`w-5 h-5 ${
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Patient Reviews</h3>
        {user && !showReviewForm && (
          <Button onClick={() => setShowReviewForm(true)}>
            Write Review
          </Button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <StarRating rating={rating} onRatingChange={setRating} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Comment</label>
              <Textarea
                placeholder="Share your experience with this doctor..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSubmitReview}>Submit Review</Button>
              <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {doctorReviews.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600">No reviews yet. Be the first to review this doctor!</p>
            </CardContent>
          </Card>
        ) : (
          doctorReviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{review.patientName}</span>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <StarRating rating={review.rating} readonly />
                    <p className="mt-2 text-gray-700">{review.comment}</p>
                    
                    {/* Admin Reply */}
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
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
