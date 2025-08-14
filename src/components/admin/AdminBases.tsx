import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Search, Edit, Trash2, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Base, BaseType, HallType } from '@/types/database';

export function AdminBases() {
  const [bases, setBases] = useState<Base[]>([]);
  const [filteredBases, setFilteredBases] = useState<Base[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [hallTypeFilter, setHallTypeFilter] = useState<string>('ALL');
  const [baseTypeFilter, setBaseTypeFilter] = useState<string>('ALL');
  const [selectedBase, setSelectedBase] = useState<Base | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchBases();
  }, []);

  useEffect(() => {
    filterBases();
  }, [bases, searchTerm, hallTypeFilter, baseTypeFilter]);

  const fetchBases = async () => {
    try {
      const { data, error } = await supabase
        .from('bases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBases(data || []);
    } catch (error) {
      console.error('Error fetching bases:', error);
      toast({
        title: "Error",
        description: "Failed to fetch bases.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterBases = () => {
    let filtered = bases;

    if (searchTerm) {
      filtered = filtered.filter(base =>
        base.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        base.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (hallTypeFilter !== 'ALL') {
      filtered = filtered.filter(base => base.hall_type === hallTypeFilter);
    }

    if (baseTypeFilter !== 'ALL') {
      filtered = filtered.filter(base => base.base_type === baseTypeFilter);
    }

    setFilteredBases(filtered);
  };

  const handleEdit = (base: Base) => {
    setSelectedBase(base);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!selectedBase) return;

    try {
      const { error } = await supabase
        .from('bases')
        .update({
          name: selectedBase.name,
          description: selectedBase.description,
          stats: selectedBase.stats,
          tips: selectedBase.tips,
          layout_link: selectedBase.layout_link,
          image_url: selectedBase.image_url,
          hall_type: selectedBase.hall_type,
          hall_level: selectedBase.hall_level,
          base_type: selectedBase.base_type
        })
        .eq('id', selectedBase.id);

      if (error) throw error;

      toast({
        title: "Base Updated",
        description: "Base has been successfully updated.",
      });

      setIsEditing(false);
      fetchBases();
    } catch (error) {
      console.error('Error updating base:', error);
      toast({
        title: "Error",
        description: "Failed to update base.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (baseId: string) => {
    if (!confirm('Are you sure you want to delete this base?')) return;

    try {
      const { error } = await supabase
        .from('bases')
        .delete()
        .eq('id', baseId);

      if (error) throw error;

      toast({
        title: "Base Deleted",
        description: "Base has been successfully deleted.",
      });

      fetchBases();
    } catch (error) {
      console.error('Error deleting base:', error);
      toast({
        title: "Error",
        description: "Failed to delete base.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Manage Bases
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search bases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={hallTypeFilter} onValueChange={setHallTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Hall Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Hall Types</SelectItem>
              <SelectItem value="TH">Town Hall</SelectItem>
              <SelectItem value="BH">Builder Hall</SelectItem>
            </SelectContent>
          </Select>
          <Select value={baseTypeFilter} onValueChange={setBaseTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Base Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Base Types</SelectItem>
              <SelectItem value="WAR">War</SelectItem>
              <SelectItem value="FARMING">Farming</SelectItem>
              <SelectItem value="TROPHY">Trophy</SelectItem>
              <SelectItem value="HYBRID">Hybrid</SelectItem>
              <SelectItem value="CWL">CWL</SelectItem>
              <SelectItem value="FUN">Fun</SelectItem>
              <SelectItem value="PROGRESS_BASE">Progress Base</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Hall</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBases.map((base) => (
                <TableRow key={base.id}>
                  <TableCell className="font-medium">{base.name}</TableCell>
                  <TableCell>{base.base_type}</TableCell>
                  <TableCell>{base.hall_type}{base.hall_level}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {base.average_rating.toFixed(1)} ({base.rating_count})
                    </div>
                  </TableCell>
                  <TableCell>{base.download_count}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(base)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(base.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Base</DialogTitle>
            </DialogHeader>
            {selectedBase && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={selectedBase.name}
                    onChange={(e) => setSelectedBase({...selectedBase, name: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hall-type">Hall Type</Label>
                    <Select value={selectedBase.hall_type} onValueChange={(value) => setSelectedBase({...selectedBase, hall_type: value as HallType})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TH">Town Hall</SelectItem>
                        <SelectItem value="BH">Builder Hall</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="hall-level">Hall Level</Label>
                    <Input
                      id="hall-level"
                      type="number"
                      value={selectedBase.hall_level}
                      onChange={(e) => setSelectedBase({...selectedBase, hall_level: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="base-type">Base Type</Label>
                  <Select value={selectedBase.base_type} onValueChange={(value) => setSelectedBase({...selectedBase, base_type: value as BaseType})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WAR">War</SelectItem>
                      <SelectItem value="FARMING">Farming</SelectItem>
                      <SelectItem value="TROPHY">Trophy</SelectItem>
                      <SelectItem value="HYBRID">Hybrid</SelectItem>
                      <SelectItem value="CWL">CWL</SelectItem>
                      <SelectItem value="FUN">Fun</SelectItem>
                      <SelectItem value="PROGRESS_BASE">Progress Base</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="layout-link">Layout Link</Label>
                  <Input
                    id="layout-link"
                    value={selectedBase.layout_link}
                    onChange={(e) => setSelectedBase({...selectedBase, layout_link: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="image-url">Image URL</Label>
                  <Input
                    id="image-url"
                    value={selectedBase.image_url || ''}
                    onChange={(e) => setSelectedBase({...selectedBase, image_url: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={selectedBase.description || ''}
                    onChange={(e) => setSelectedBase({...selectedBase, description: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="stats">Stats</Label>
                  <Textarea
                    id="stats"
                    value={selectedBase.stats || ''}
                    onChange={(e) => setSelectedBase({...selectedBase, stats: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="tips">Tips</Label>
                  <Textarea
                    id="tips"
                    value={selectedBase.tips || ''}
                    onChange={(e) => setSelectedBase({...selectedBase, tips: e.target.value})}
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}