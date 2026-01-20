'use client';

import { useMemo } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { openModal } from '@/store/slices/uiSlice';

export function PeerRatingSummary() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.data);
  const ratings = useAppSelector((state) => state.ratings.data);
  const comments = useAppSelector((state) => state.comments.data);

  const stats = useMemo(() => {
    if (!user) return { rating: 0, ratingCount: 0, commentCount: 0 };

    const userRatings = ratings.filter((r) => r.toEmployeeId === user.id);
    const avgRating = userRatings.length > 0
      ? userRatings.reduce((sum, r) => sum + r.score, 0) / userRatings.length
      : user.rating;

    const userComments = comments.filter((c) => c.targetEmployeeId === user.id && !c.flagged);

    return {
      rating: Math.round(avgRating * 10) / 10,
      ratingCount: userRatings.length || user.ratingCount,
      commentCount: userComments.length,
    };
  }, [user, ratings, comments]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-muted text-muted'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          Peer Rating
        </CardTitle>
        <CardDescription>Your anonymous peer feedback</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold text-foreground">{stats.rating}</div>
          <div className="space-y-1">
            {renderStars(stats.rating)}
            <p className="text-xs text-muted-foreground">
              Based on {stats.ratingCount} review{stats.ratingCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-muted/50 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Comments</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {stats.commentCount} received
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full bg-transparent"
          onClick={() => dispatch(openModal('FEEDBACK'))}
        >
          View Feedback
        </Button>
      </CardContent>
    </Card>
  );
}
