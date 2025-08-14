import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Upload, Search, Edit, ImageIcon, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AdminUpload } from '@/components/admin/AdminUpload';
import { AdminBases } from '@/components/admin/AdminBases';
import { AdminImageOptimizer } from '@/components/admin/AdminImageOptimizer';

export default function AdminPanel() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const isAdmin = localStorage.getItem('adminAuth') === 'true';
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    toast({
      title: "Logged Out",
      description: "You have been logged out of the admin panel.",
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Bulk Upload
            </TabsTrigger>
            <TabsTrigger value="bases" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Manage Bases
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Image Optimizer
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <AdminUpload />
          </TabsContent>

          <TabsContent value="bases">
            <AdminBases />
          </TabsContent>

          <TabsContent value="images">
            <AdminImageOptimizer />
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Search</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Analytics functionality coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}