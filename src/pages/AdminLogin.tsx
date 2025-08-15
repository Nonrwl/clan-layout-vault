import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Shield, AlertTriangle } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Check if user is admin
        const { data: adminUser } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('is_active', true)
          .single();
        
        if (adminUser) {
          navigate('/admin');
        }
      }
    };
    checkAuth();
  }, [navigate]);

  const getClientIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error getting IP:', error);
      return '0.0.0.0'; // fallback
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setRateLimited(false);

    try {
      const ip_address = await getClientIP();
      const user_agent = navigator.userAgent;

      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { 
          email, 
          password, 
          ip_address,
          user_agent 
        }
      });

      if (error) {
        console.error('Auth function error:', error);
        throw new Error('Authentication service error');
      }

      if (data.error) {
        if (data.code === 'RATE_LIMITED') {
          setRateLimited(true);
          toast({
            title: "Too Many Attempts",
            description: "Please wait before trying again. Maximum 5 attempts per hour.",
            variant: "destructive"
          });
        } else if (data.code === 'IP_NOT_ALLOWED') {
          toast({
            title: "IP Address Blocked",
            description: "Your IP address is not authorized for admin access.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Authentication Failed",
            description: data.error || "Invalid credentials.",
            variant: "destructive"
          });
        }
        return;
      }

      // Set the session from the response
      if (data.session) {
        await supabase.auth.setSession(data.session);
        
        toast({
          title: "Login Successful",
          description: "Welcome to the secure admin panel.",
        });
        
        navigate('/admin');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Connection Error",
        description: "Unable to connect to authentication service.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[400px]">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Secure Admin Access</CardTitle>
          <p className="text-sm text-muted-foreground">
            Protected by rate limiting and IP monitoring
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Admin email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading || rateLimited}
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading || rateLimited}
              />
            </div>
            
            {rateLimited && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <p className="text-sm text-destructive">
                  Rate limited. Please wait before trying again.
                </p>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || rateLimited}
            >
              {isLoading ? 'Authenticating...' : 'Secure Login'}
            </Button>
          </form>
          
          <div className="mt-4 text-xs text-muted-foreground text-center">
            <p>• Maximum 5 login attempts per hour</p>
            <p>• IP address monitoring enabled</p>
            <p>• All attempts are logged</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}