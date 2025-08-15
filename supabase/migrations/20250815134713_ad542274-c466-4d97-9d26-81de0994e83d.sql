-- Create admin users table for proper authentication
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  allowed_ips TEXT[],
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only admin users can manage admin users
CREATE POLICY "Admin users can manage admin access" 
ON public.admin_users 
FOR ALL
USING (auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_active = true));

-- Create login attempts table for rate limiting
CREATE TABLE public.admin_login_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address INET NOT NULL,
  user_agent TEXT,
  success BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_login_attempts ENABLE ROW LEVEL SECURITY;

-- Only admins can view login attempts
CREATE POLICY "Admin users can view login attempts" 
ON public.admin_login_attempts 
FOR SELECT
USING (auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_active = true));

-- Create index for efficient querying
CREATE INDEX idx_admin_login_attempts_ip_created ON public.admin_login_attempts(ip_address, created_at);
CREATE INDEX idx_admin_login_attempts_created ON public.admin_login_attempts(created_at);

-- Create function to clean up old login attempts (older than 24 hours)
CREATE OR REPLACE FUNCTION public.cleanup_old_login_attempts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    DELETE FROM public.admin_login_attempts 
    WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$;

-- Create trigger for updating timestamps
CREATE TRIGGER update_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();