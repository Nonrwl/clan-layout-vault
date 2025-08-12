-- Fix function search path security warnings
CREATE OR REPLACE FUNCTION public.update_base_rating_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.bases 
    SET 
        average_rating = (
            SELECT ROUND(AVG(rating)::numeric, 1) 
            FROM public.ratings 
            WHERE base_id = COALESCE(NEW.base_id, OLD.base_id)
        ),
        rating_count = (
            SELECT COUNT(*) 
            FROM public.ratings 
            WHERE base_id = COALESCE(NEW.base_id, OLD.base_id)
        )
    WHERE id = COALESCE(NEW.base_id, OLD.base_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

-- Fix increment download count function
CREATE OR REPLACE FUNCTION public.increment_download_count(base_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.bases 
    SET download_count = download_count + 1 
    WHERE id = base_id;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

-- Fix update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;