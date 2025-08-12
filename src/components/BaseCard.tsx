import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/StarRating';
import { Download, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Base } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BaseCardProps {
  base: Base;
  onViewDetails: (base: Base) => void;
  className?: string;
}

export function BaseCard({ base, onViewDetails, className }: BaseCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const getTypeVariant = (type: string) => {
    switch (type) {
      case 'WAR': return 'war-accent';
      case 'FARMING': return 'farming-accent';
      case 'TROPHY': return 'trophy-accent';
      default: return 'secondary';
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDownloading) return;
    
    setIsDownloading(true);
    
    try {
      // Track download
      await supabase.from('downloads').insert({
        base_id: base.id,
        ip_address: 'placeholder-ip',
        user_agent: navigator.userAgent
      });
      
      // Increment download count
      await supabase.rpc('increment_download_count', { base_id: base.id });
      
      // Open layout link
      window.open(base.layout_link, '_blank');
      
      toast({
        title: "Download Started",
        description: "Base layout link opened in new tab."
      });
    } catch (error) {
      console.error('Error tracking download:', error);
      // Still open the link even if tracking fails
      window.open(base.layout_link, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className={cn(
      "group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg",
      "hover:border-primary/50 overflow-hidden",
      className
    )}>
      <CardHeader className="p-0">
        <div className="relative aspect-video overflow-hidden">
          {base.image_url ? (
            <img
              src={base.image_url}
              alt={base.name}
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-card flex items-center justify-center">
              <span className="text-muted-foreground">No Image</span>
            </div>
          )}
          
          <div className="absolute top-2 left-2 flex gap-2">
            <Badge variant="secondary" className="font-orbitron">
              {base.hall_type}{base.hall_level}
            </Badge>
            <Badge className={getTypeVariant(base.base_type)}>
              {base.base_type}
            </Badge>
          </div>
          
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button 
              size="sm" 
              onClick={() => onViewDetails(base)}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            <Button 
              size="sm" 
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-primary/80 backdrop-blur-sm hover:bg-primary"
            >
              <Download className="w-4 h-4 mr-1" />
              {isDownloading ? 'Opening...' : 'Download'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{base.name}</h3>
        
        <div className="flex items-center justify-between mb-2">
          <StarRating rating={base.average_rating} size="sm" />
          <span className="text-sm text-muted-foreground">
            ({base.rating_count} {base.rating_count === 1 ? 'rating' : 'ratings'})
          </span>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {base.download_count} downloads
        </div>
      </CardContent>
    </Card>
  );
}