import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { generateBrowserFingerprint, getUserIP } from '@/utils/browser-fingerprint';
import { useToast } from '@/hooks/use-toast';

export function useRating(baseId: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitRating = useCallback(async (rating: number) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const fingerprint = generateBrowserFingerprint();
      const ipAddress = await getUserIP();
      
      const { error } = await supabase
        .from('ratings')
        .insert({
          base_id: baseId,
          rating: rating,
          ip_address: ipAddress,
          browser_fingerprint: fingerprint
        });
      
      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Already Rated",
            description: "You have already rated this base.",
            variant: "destructive"
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Rating Submitted",
          description: "Thank you for rating this base!",
        });
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [baseId, isSubmitting, toast]);

  return { submitRating, isSubmitting };
}