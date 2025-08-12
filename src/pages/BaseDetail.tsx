import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { StarRating } from '@/components/StarRating';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Download, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useRating } from '@/hooks/useRating';
import { useToast } from '@/hooks/use-toast';
import { Base } from '@/types/database';

export default function BaseDetail() {
  const { baseId } = useParams<{ baseId: string }>();
  const navigate = useNavigate();
  const [base, setBase] = useState<Base | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const { submitRating, isSubmitting } = useRating(baseId || '');
  const { toast } = useToast();

  useEffect(() => {
    if (baseId) {
      fetchBase();
    }
  }, [baseId]);

  const fetchBase = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('bases')
        .select('*')
        .eq('id', baseId)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setBase(data);
      }
    } catch (error) {
      console.error('Error fetching base:', error);
      toast({
        title: "Error",
        description: "Failed to load base details.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!base || isDownloading) return;
    
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
      
      // Update local state
      setBase(prev => prev ? { ...prev, download_count: prev.download_count + 1 } : null);
      
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

  const handleRating = async (rating: number) => {
    await submitRating(rating);
    // Refresh base data to get updated rating
    fetchBase();
  };

  const getTypeVariant = (type: string) => {
    switch (type) {
      case 'WAR': return 'war-accent';
      case 'FARMING': return 'farming-accent';
      case 'TROPHY': return 'trophy-accent';
      default: return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading base details...</p>
        </div>
      </div>
    );
  }

  if (!base) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Base Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The base you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/')}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(`/bases/${base.hall_type.toLowerCase()}${base.hall_level}`)}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="font-orbitron font-bold text-3xl">{base.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="font-orbitron">
                {base.hall_type}{base.hall_level}
              </Badge>
              <Badge className={getTypeVariant(base.base_type)}>
                {base.base_type}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image and Actions */}
          <div className="space-y-6">
            {/* Base Image */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video overflow-hidden rounded-lg">
                  {base.image_url ? (
                    <img
                      src={base.image_url}
                      alt={base.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-card flex items-center justify-center">
                      <span className="text-muted-foreground">No Image Available</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Download Button */}
            <Button 
              onClick={handleDownload}
              disabled={isDownloading}
              size="lg"
              className="w-full"
            >
              <Download className="w-5 h-5 mr-2" />
              {isDownloading ? 'Opening Layout...' : 'Download Base Layout'}
            </Button>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Rating and Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Rate This Base</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <StarRating 
                    rating={base.average_rating} 
                    size="lg" 
                  />
                  <span className="text-lg font-semibold">
                    {base.average_rating.toFixed(1)}
                  </span>
                </div>
                
                <p className="text-muted-foreground">
                  {base.rating_count} {base.rating_count === 1 ? 'rating' : 'ratings'} • 
                  {' '}{base.download_count} downloads
                </p>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Rate this base (1-5 stars):
                  </p>
                  <StarRating
                    rating={0}
                    onRatingChange={handleRating}
                    interactive={true}
                    size="lg"
                  />
                  {isSubmitting && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Submitting rating...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            {base.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {base.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Stats */}
            {base.stats && (
              <Card>
                <CardHeader>
                  <CardTitle>Base Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {base.stats}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Tips */}
            {base.tips && (
              <Card>
                <CardHeader>
                  <CardTitle>Tips & Strategy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {base.tips}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}