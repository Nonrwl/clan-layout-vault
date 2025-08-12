import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { HallLevelCard } from '@/components/HallLevelCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Shield, Trophy, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { HallType } from '@/types/database';

const TH_LEVELS = Array.from({ length: 15 }, (_, i) => i + 3); // TH3 to TH17
const BH_LEVELS = Array.from({ length: 8 }, (_, i) => i + 3); // BH3 to BH10

interface HallLevelCounts {
  [key: string]: number;
}

export default function Home() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [hallCounts, setHallCounts] = useState<HallLevelCounts>({});

  useEffect(() => {
    fetchHallCounts();
  }, []);

  const fetchHallCounts = async () => {
    try {
      const { data, error } = await supabase
        .from('bases')
        .select('hall_type, hall_level, id');
      
      if (error) throw error;
      
      const counts: HallLevelCounts = {};
      data?.forEach(base => {
        const key = `${base.hall_type}${base.hall_level}`;
        counts[key] = (counts[key] || 0) + 1;
      });
      
      setHallCounts(counts);
    } catch (error) {
      console.error('Error fetching hall counts:', error);
    }
  };

  const handleHallClick = (hallType: HallType, level: number) => {
    navigate(`/bases/${hallType.toLowerCase()}${level}`);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="font-orbitron font-bold text-4xl md:text-6xl mb-6 bg-gradient-primary bg-clip-text text-transparent">
            ClashLayouts
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Discover the most powerful Clash of Clans base layouts for every Town Hall and Builder Hall level
          </p>
          
          {/* Search Bar */}
          <div className="flex gap-2 max-w-md mx-auto mb-12">
            <Input
              placeholder="Search bases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} size="icon">
              <Search className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 border">
              <Shield className="w-8 h-8 text-war mx-auto mb-2" />
              <h3 className="font-semibold text-lg">War Bases</h3>
              <p className="text-muted-foreground">Proven defensive layouts</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 border">
              <Zap className="w-8 h-8 text-farming mx-auto mb-2" />
              <h3 className="font-semibold text-lg">Farming Bases</h3>
              <p className="text-muted-foreground">Protect your resources</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 border">
              <Trophy className="w-8 h-8 text-trophy mx-auto mb-2" />
              <h3 className="font-semibold text-lg">Trophy Bases</h3>
              <p className="text-muted-foreground">Climb the leaderboards</p>
            </div>
          </div>
        </div>
      </section>

      {/* Town Hall Levels */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="font-orbitron font-bold text-3xl text-center mb-12">
            Town Hall Levels
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {TH_LEVELS.map(level => (
              <HallLevelCard
                key={`TH${level}`}
                hallType="TH"
                level={level}
                baseCount={hallCounts[`TH${level}`] || 0}
                onClick={() => handleHallClick('TH', level)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Builder Hall Levels */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="font-orbitron font-bold text-3xl text-center mb-12">
            Builder Hall Levels
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {BH_LEVELS.map(level => (
              <HallLevelCard
                key={`BH${level}`}
                hallType="BH"
                level={level}
                baseCount={hallCounts[`BH${level}`] || 0}
                onClick={() => handleHallClick('BH', level)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto text-center">
          <h3 className="font-orbitron font-bold text-xl mb-2">ClashLayouts</h3>
          <p className="text-muted-foreground">
            Your ultimate destination for Clash of Clans base layouts
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            © 2024 ClashLayouts. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}