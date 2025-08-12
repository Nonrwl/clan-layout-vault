import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { BaseCard } from '@/components/BaseCard';
import { BaseTypeFilter } from '@/components/BaseTypeFilter';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Base, BaseType, HallType } from '@/types/database';

export default function BaseListing() {
  const { hallId } = useParams<{ hallId: string }>();
  const navigate = useNavigate();
  const [bases, setBases] = useState<Base[]>([]);
  const [filteredBases, setFilteredBases] = useState<Base[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<BaseType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Parse hall type and level from URL parameter
  const hallType = hallId?.toUpperCase().startsWith('TH') ? 'TH' : 'BH';
  const hallLevel = parseInt(hallId?.replace(/^(th|bh)/i, '') || '0');

  useEffect(() => {
    if (hallId) {
      fetchBases();
    }
  }, [hallId]);

  useEffect(() => {
    if (selectedTypes.length === 0) {
      setFilteredBases(bases);
    } else {
      setFilteredBases(bases.filter(base => selectedTypes.includes(base.base_type)));
    }
  }, [bases, selectedTypes]);

  const fetchBases = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('bases')
        .select('*')
        .eq('hall_type', hallType)
        .eq('hall_level', hallLevel)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setBases(data || []);
    } catch (error) {
      console.error('Error fetching bases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTypeToggle = (type: BaseType) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleViewDetails = (base: Base) => {
    navigate(`/base/${base.id}`);
  };

  if (!hallId || isNaN(hallLevel)) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Invalid Hall Level</h1>
          <Button onClick={() => navigate('/')} className="mt-4">
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
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="font-orbitron font-bold text-3xl">
              {hallType === 'TH' ? 'Town Hall' : 'Builder Hall'} {hallLevel}
            </h1>
            <p className="text-muted-foreground">
              {filteredBases.length} {filteredBases.length === 1 ? 'base' : 'bases'} found
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <h3 className="font-semibold mb-4">Filter by Base Type:</h3>
          <BaseTypeFilter
            selectedTypes={selectedTypes}
            onTypeToggle={handleTypeToggle}
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading bases...</p>
          </div>
        )}

        {/* No Bases */}
        {!isLoading && filteredBases.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No Bases Found</h3>
            <p className="text-muted-foreground mb-4">
              {selectedTypes.length > 0 
                ? 'Try removing some filters or check back later.'
                : 'No bases available for this hall level yet. Check back later!'
              }
            </p>
            {selectedTypes.length > 0 && (
              <Button 
                variant="outline" 
                onClick={() => setSelectedTypes([])}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* Bases Grid */}
        {!isLoading && filteredBases.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBases.map(base => (
              <BaseCard
                key={base.id}
                base={base}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}