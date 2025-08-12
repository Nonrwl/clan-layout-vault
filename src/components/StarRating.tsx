import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StarRating({ 
  rating, 
  onRatingChange, 
  interactive = false, 
  size = 'md',
  className 
}: StarRatingProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRatingChange?.(star)}
          className={cn(
            sizes[size],
            "transition-colors",
            interactive && "hover:scale-110 cursor-pointer",
            !interactive && "cursor-default"
          )}
        >
          <Star
            className={cn(
              "w-full h-full transition-colors",
              star <= rating
                ? "fill-primary text-primary"
                : "fill-none text-muted-foreground"
            )}
          />
        </button>
      ))}
    </div>
  );
}