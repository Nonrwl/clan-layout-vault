import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ExternalLink, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface LegacyBaseCardProps {
  id: string;
  title: string;
  image: string;
  tags: string[];
  rating: number;
  downloads: number;
  type: string;
  townHall: number;
  copyLink?: string;
}

export function LegacyBaseCard({
  id,
  title,
  image,
  tags,
  rating,
  downloads,
  type,
  townHall,
  copyLink,
}: LegacyBaseCardProps) {
  const [liked, setLiked] = useState(false);
  const [localRating, setLocalRating] = useState(rating);
  const { toast } = useToast();

  const getTypeVariant = (type: string) => {
    switch (type.toLowerCase()) {
      case 'war':
        return 'destructive';
      case 'farming':
        return 'secondary';
      case 'trophy':
        return 'default';
      default:
        return 'outline';
    }
  };

  const handleCopyLink = () => {
    if (copyLink) {
      navigator.clipboard.writeText(copyLink);
      toast({
        title: "Link Copied!",
        description: "Base link has been copied to clipboard.",
      });
    }
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: `Downloading ${title}...`,
    });
  };

  const handleLike = () => {
    setLiked(!liked);
    setLocalRating(liked ? localRating - 0.1 : localRating + 0.1);
    toast({
      title: liked ? "Removed from favorites" : "Added to favorites",
      description: liked ? "Base removed from your favorites." : "Base added to your favorites!",
    });
  };

  return (
    <Card className="group relative overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute top-2 left-2 flex gap-2">
            <Badge variant="secondary" className="text-xs">
              {townHall}
            </Badge>
            <Badge variant={getTypeVariant(type)} className="text-xs">
              {type}
            </Badge>
          </div>
          {/* Hover overlay with actions */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            {copyLink && (
              <Button size="sm" variant="outline" onClick={handleCopyLink}>
                <Copy className="w-4 h-4" />
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={handleDownload}>
              <Download className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">⭐</span>
            <span className="text-sm font-medium">{localRating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">{downloads} downloads</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={cn(
            "text-muted-foreground hover:text-foreground transition-colors",
            liked && "text-red-500 hover:text-red-600"
          )}
        >
          {liked ? "❤️" : "🤍"}
        </Button>
      </CardFooter>
    </Card>
  );
}