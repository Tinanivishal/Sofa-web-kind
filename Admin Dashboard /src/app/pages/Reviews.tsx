import React, { useState } from 'react';
import { Star, CheckCircle, XCircle, MessageSquare, Trash2 } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

const mockReviews = [
  {
    id: 1,
    product: 'Premium Velvet Sofa Fabric',
    customer: 'Sarah Johnson',
    rating: 5,
    review: 'Excellent quality fabric! The velvet is soft and luxurious. Perfect for my sofa repair.',
    date: '2026-02-25',
    status: 'Approved',
    reply: null
  },
  {
    id: 2,
    product: 'Luxury Blackout Curtains',
    customer: 'Michael Chen',
    rating: 4,
    review: 'Great curtains, really blocks out the light. Only 4 stars because shipping took a while.',
    date: '2026-02-24',
    status: 'Approved',
    reply: 'Thank you for your feedback! We apologize for the shipping delay and are working to improve our delivery times.'
  },
  {
    id: 3,
    product: 'Decorative Cushion Set',
    customer: 'Emily Davis',
    rating: 5,
    review: 'Love these cushions! They add a beautiful touch to my living room.',
    date: '2026-02-23',
    status: 'Pending',
    reply: null
  },
  {
    id: 4,
    product: 'Leather Repair Kit',
    customer: 'James Wilson',
    rating: 2,
    review: 'Product is okay but instructions were unclear. Had trouble using it.',
    date: '2026-02-22',
    status: 'Pending',
    reply: null
  },
  {
    id: 5,
    product: 'Cotton Blend Fabric',
    customer: 'Lisa Anderson',
    rating: 5,
    review: 'Perfect fabric for my DIY project. Highly recommend!',
    date: '2026-02-21',
    status: 'Approved',
    reply: null
  },
];

export default function Reviews() {
  const [selectedReview, setSelectedReview] = useState<typeof mockReviews[0] | null>(null);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-amber-500 text-amber-500'
                : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
            }`}
          />
        ))}
      </div>
    );
  };

  const averageRating = (mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Reviews</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage customer product reviews</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Reviews</p>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{mockReviews.length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Average Rating</p>
              <h3 className="text-2xl font-semibold text-amber-600 dark:text-amber-400 mt-1 flex items-center justify-center gap-1">
                {averageRating}
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
              </h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-green-600 dark:text-green-400">Approved</p>
              <h3 className="text-2xl font-semibold text-green-600 dark:text-green-400 mt-1">
                {mockReviews.filter(r => r.status === 'Approved').length}
              </h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-amber-600 dark:text-amber-400">Pending</p>
              <h3 className="text-2xl font-semibold text-amber-600 dark:text-amber-400 mt-1">
                {mockReviews.filter(r => r.status === 'Pending').length}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium text-gray-900 dark:text-white max-w-[200px]">
                    {review.product}
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">{review.customer}</TableCell>
                  <TableCell>{renderStars(review.rating)}</TableCell>
                  <TableCell className="max-w-[300px]">
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                      {review.review}
                    </p>
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">{review.date}</TableCell>
                  <TableCell>
                    <Badge variant={review.status === 'Approved' ? 'default' : 'secondary'}>
                      {review.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedReview(review)}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                      {review.status === 'Pending' && (
                        <>
                          <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Review Details Dialog */}
      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-6 py-4">
              {/* Product & Customer */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Product</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedReview.product}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Customer</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedReview.customer}</p>
                </div>
              </div>

              {/* Rating & Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Rating</p>
                  {renderStars(selectedReview.rating)}
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date</p>
                  <p className="text-gray-900 dark:text-white">{selectedReview.date}</p>
                </div>
              </div>

              {/* Review Text */}
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Review</p>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300">{selectedReview.review}</p>
                </div>
              </div>

              {/* Admin Reply */}
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Admin Reply</p>
                {selectedReview.reply ? (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-900">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{selectedReview.reply}</p>
                  </div>
                ) : (
                  <Textarea
                    placeholder="Write a reply to this review..."
                    rows={4}
                  />
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                {selectedReview.status === 'Pending' ? (
                  <>
                    <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Review
                    </Button>
                    <Button variant="outline" className="flex-1 border-red-600 text-red-600">
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Review
                    </Button>
                  </>
                ) : (
                  <Button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {selectedReview.reply ? 'Update Reply' : 'Send Reply'}
                  </Button>
                )}
                <Button variant="outline" className="border-red-600 text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
