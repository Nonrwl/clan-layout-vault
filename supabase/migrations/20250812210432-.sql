-- Create enum for base types
CREATE TYPE public.base_type AS ENUM ('WAR', 'FARMING', 'HYBRID', 'CWL', 'TROPHY', 'FUN', 'PROGRESS_BASE');

-- Create enum for hall types
CREATE TYPE public.hall_type AS ENUM ('TH', 'BH');

-- Create bases table
CREATE TABLE public.bases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    image_url TEXT,
    layout_link TEXT NOT NULL,
    description TEXT,
    stats TEXT,
    tips TEXT,
    hall_type hall_type NOT NULL,
    hall_level INTEGER NOT NULL,
    base_type base_type NOT NULL,
    download_count INTEGER DEFAULT 0,
    average_rating DECIMAL(2,1) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_th_level CHECK (
        (hall_type = 'TH' AND hall_level >= 3 AND hall_level <= 17) OR
        (hall_type = 'BH' AND hall_level >= 3 AND hall_level <= 10)
    )
);

-- Create ratings table
CREATE TABLE public.ratings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    base_id UUID REFERENCES public.bases(id) ON DELETE CASCADE,
    ip_address INET NOT NULL,
    browser_fingerprint TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(base_id, ip_address, browser_fingerprint)
);

-- Create downloads table for analytics
CREATE TABLE public.downloads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    base_id UUID REFERENCES public.bases(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.bases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view bases" ON public.bases FOR SELECT USING (true);
CREATE POLICY "Anyone can view ratings" ON public.ratings FOR SELECT USING (true);
CREATE POLICY "Anyone can insert ratings" ON public.ratings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert downloads" ON public.downloads FOR INSERT WITH CHECK (true);

-- Create storage bucket for base images
INSERT INTO storage.buckets (id, name, public) VALUES ('base-images', 'base-images', true);

-- Create storage policies
CREATE POLICY "Anyone can view base images" ON storage.objects FOR SELECT USING (bucket_id = 'base-images');

-- Function to update rating statistics
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
$$ LANGUAGE plpgsql;

-- Trigger to automatically update rating stats
CREATE TRIGGER update_rating_stats_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.ratings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_base_rating_stats();

-- Function to increment download count
CREATE OR REPLACE FUNCTION public.increment_download_count(base_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.bases 
    SET download_count = download_count + 1 
    WHERE id = base_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for bases updated_at
CREATE TRIGGER update_bases_updated_at
    BEFORE UPDATE ON public.bases
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();