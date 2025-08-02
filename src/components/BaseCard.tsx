import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { 
  Star, 
  Download, 
  Copy, 
  Heart, 
  ExternalLink,
  StarIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BaseCardProps {
  id: string;
  title: string;
  image: string;
  tags: string[];
  rating: number;
  downloads: number;
  type: 'war' | 'farming' | 'trophy' | 'hybrid';
  townHall: number;
  copyLink?: string;
}

export const BaseCard = ({ 
  id, 
  title, 
  image, 
  tags, 
  rating, 
  downloads, 
  type, 
  townHall,
  copyLink = "#"
}: BaseCardProps) => {
  const [liked, setLiked] = useState(false);
  const [localRating, setLocalRating] = useState(rating);
  const { toast } = useToast();

  const getTypeVariant = (type: string) => {
    switch (type) {
      case 'war': return 'war';
      case 'farming': return 'farming';
      case 'trophy': return 'trophy';
      default: return 'accent';
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(copyLink);
    toast({
      title: "Link Copied!",
      description: "Base layout link copied to clipboard",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Base layout is being downloaded",
    });
  };

  const handleLike = () => {
    setLiked(!liked);
    setLocalRating(liked ? localRating - 0.1 : localRating + 0.1);
    toast({
      title: liked ? "Removed from favorites" : "Added to favorites",
      description: liked ? "Base removed from your favorites" : "Base added to your favorites",
    });
  };

  return (
    <Card className="group overflow-hidden transition-gaming hover:shadow-lg hover:-translate-y-1 bg-card border-border">
      {/* Base Image */}
      <div className="relative overflow-hidden">
        <div className="aspect-video w-full bg-muted flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mb-2">
              <span className="text-2xl font-bold text-primary">TH{townHall}</span>
            </div>
            <p className="text-sm text-muted-foreground">Base Layout Preview</p>
          </div>
        </div>
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-gaming flex items-center justify-center space-x-2">
          <Button size="sm" variant="outline" onClick={handleCopyLink}>
            <Copy className="h-4 w-4 mr-1" />
            Copy Link
          </Button>
          <Button size="sm" variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>

        {/* TH Badge */}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="font-bold">
            TH{townHall}
          </Badge>
        </div>

        {/* Type Badge */}
        <div className="absolute top-2 right-2">
          <Badge 
            variant="secondary"
            className={`${getTypeVariant(type)} text-xs font-semibold`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
        </div>

        {/* Like Button */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-gaming"
          onClick={handleLike}
        >
          <Heart className={`h-4 w-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
      </div>

      <CardContent className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{title}</h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(localRating) 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {localRating.toFixed(1)} ({downloads}+ downloads)
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex w-full space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={handleCopyLink}
          >
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};