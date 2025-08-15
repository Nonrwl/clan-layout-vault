import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Shield, Eye, Plus, X, Calendar, MapPin, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AdminSecurityProps {
  adminUser: any;
}

interface LoginAttempt {
  id: string;
  ip_address: string;
  user_agent: string;
  success: boolean;
  created_at: string;
}

export function AdminSecurity({ adminUser }: AdminSecurityProps) {
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [newIP, setNewIP] = useState('');
  const [allowedIPs, setAllowedIPs] = useState<string[]>(adminUser?.allowed_ips || []);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchLoginAttempts();
  }, []);

  const fetchLoginAttempts = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_login_attempts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLoginAttempts((data || []) as LoginAttempt[]);
    } catch (error) {
      console.error('Error fetching login attempts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch login attempts.",
        variant: "destructive"
      });
    }
  };

  const addAllowedIP = async () => {
    if (!newIP.trim()) return;
    
    const ipPattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipPattern.test(newIP.trim())) {
      toast({
        title: "Invalid IP",
        description: "Please enter a valid IPv4 address.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const updatedIPs = [...allowedIPs, newIP.trim()];
      
      const { error } = await supabase
        .from('admin_users')
        .update({ allowed_ips: updatedIPs })
        .eq('id', adminUser.id);

      if (error) throw error;

      setAllowedIPs(updatedIPs);
      setNewIP('');
      toast({
        title: "IP Added",
        description: "IP address has been added to the whitelist.",
      });
    } catch (error) {
      console.error('Error adding IP:', error);
      toast({
        title: "Error",
        description: "Failed to add IP address.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeAllowedIP = async (ipToRemove: string) => {
    setIsLoading(true);
    try {
      const updatedIPs = allowedIPs.filter(ip => ip !== ipToRemove);
      
      const { error } = await supabase
        .from('admin_users')
        .update({ allowed_ips: updatedIPs })
        .eq('id', adminUser.id);

      if (error) throw error;

      setAllowedIPs(updatedIPs);
      toast({
        title: "IP Removed",
        description: "IP address has been removed from the whitelist.",
      });
    } catch (error) {
      console.error('Error removing IP:', error);
      toast({
        title: "Error",
        description: "Failed to remove IP address.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      setNewIP(data.ip);
    } catch (error) {
      console.error('Error getting current IP:', error);
      toast({
        title: "Error",
        description: "Failed to get current IP address.",
        variant: "destructive"
      });
    }
  };

  const recentFailedAttempts = loginAttempts.filter(attempt => 
    !attempt.success && 
    new Date(attempt.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  );

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm font-medium">Security Status</p>
                <p className="text-lg font-bold text-green-500">Protected</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Failed Attempts (24h)</p>
                <p className="text-lg font-bold">{recentFailedAttempts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Whitelisted IPs</p>
                <p className="text-lg font-bold">{allowedIPs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="ip-whitelist" className="w-full">
        <TabsList>
          <TabsTrigger value="ip-whitelist">IP Whitelist</TabsTrigger>
          <TabsTrigger value="login-attempts">Login Attempts</TabsTrigger>
        </TabsList>

        <TabsContent value="ip-whitelist">
          <Card>
            <CardHeader>
              <CardTitle>IP Address Whitelist</CardTitle>
              <p className="text-sm text-muted-foreground">
                Only IPs in this list can access the admin panel. Leave empty to allow all IPs.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter IP address (e.g., 192.168.1.100)"
                    value={newIP}
                    onChange={(e) => setNewIP(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addAllowedIP()}
                  />
                  <Button onClick={getCurrentIP} variant="outline">
                    <MapPin className="h-4 w-4 mr-2" />
                    Current IP
                  </Button>
                  <Button onClick={addAllowedIP} disabled={isLoading}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>

                <div className="space-y-2">
                  {allowedIPs.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">
                      No IP restrictions - all IPs can access admin panel
                    </p>
                  ) : (
                    allowedIPs.map((ip, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span className="font-mono">{ip}</span>
                        <Button
                          onClick={() => removeAllowedIP(ip)}
                          size="sm"
                          variant="ghost"
                          disabled={isLoading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="login-attempts">
          <Card>
            <CardHeader>
              <CardTitle>Recent Login Attempts</CardTitle>
              <p className="text-sm text-muted-foreground">
                Monitor all login attempts to the admin panel.
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>User Agent</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loginAttempts.map((attempt) => (
                    <TableRow key={attempt.id}>
                      <TableCell>
                        <Badge variant={attempt.success ? "default" : "destructive"}>
                          {attempt.success ? "Success" : "Failed"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">{attempt.ip_address}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={attempt.user_agent}>
                        {attempt.user_agent}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {new Date(attempt.created_at).toLocaleString()}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {loginAttempts.length === 0 && (
                <div className="text-center py-8">
                  <Eye className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">No login attempts recorded</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}