import { Navigation } from "@/components/Navigation";
import { BaseCard } from "@/components/BaseCard";
import { SearchFilters } from "@/components/SearchFilters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sword, Shield, Zap } from "lucide-react";

const warBases = [
  {
    id: "w1",
    title: "Anti-3 Star War Base TH16",
    image: "",
    tags: ["Anti-3-star", "War", "TH16", "Meta"],
    rating: 4.9,
    downloads: 25420,
    type: "war" as const,
    townHall: 16
  },
  {
    id: "w2",
    title: "Hybrid War Base TH15",
    image: "",
    tags: ["Hybrid", "War", "TH15", "Anti-2-star"],
    rating: 4.7,
    downloads: 18200,
    type: "war" as const,
    townHall: 15
  },
  {
    id: "w3",
    title: "Anti-Queen Walk TH14",
    image: "",
    tags: ["Anti-Queen Walk", "War", "TH14"],
    rating: 4.8,
    downloads: 19800,
    type: "war" as const,
    townHall: 14
  },
  {
    id: "w4",
    title: "Compact War Base TH13",
    image: "",
    tags: ["Compact", "War", "TH13", "Anti-Electro"],
    rating: 4.6,
    downloads: 16700,
    type: "war" as const,
    townHall: 13
  },
  {
    id: "w5",
    title: "Spread War Base TH12",
    image: "",
    tags: ["Spread", "War", "TH12", "Anti-Bowler"],
    rating: 4.5,
    downloads: 14300,
    type: "war" as const,
    townHall: 12
  },
  {
    id: "w6",
    title: "Anti-3 Star TH11",
    image: "",
    tags: ["Anti-3-star", "War", "TH11", "Meta"],
    rating: 4.7,
    downloads: 21100,
    type: "war" as const,
    townHall: 11
  }
];

const WarBases = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header Section */}
      <section className="py-16 px-4 gradient-hero">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="war-accent rounded-full w-16 h-16 flex items-center justify-center">
              <Sword className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-orbitron font-black mb-6">
            <span className="gradient-primary bg-clip-text text-transparent">War Bases</span>
          </h1>
          
          <p className="text-xl text-foreground/90 mb-8 max-w-3xl mx-auto">
            Dominate clan wars with these battle-tested defensive layouts. 
            Each base is designed to <span className="text-war font-semibold">prevent 3-star attacks</span> and secure victories for your clan.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="text-sm">
              <Shield className="w-4 h-4 mr-1" />
              Anti-3 Star Designs
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <Zap className="w-4 h-4 mr-1" />
              Meta Counters
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <Sword className="w-4 h-4 mr-1" />
              Pro Tested
            </Badge>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <SearchFilters />
        </div>
      </section>

      {/* War Bases Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">All War Bases</h2>
              <p className="text-muted-foreground">
                {warBases.length} war bases available • Sorted by popularity
              </p>
            </div>
            
            <Button variant="outline">
              Sort by Rating
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {warBases.map((base) => (
              <BaseCard key={base.id} {...base} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button size="lg" variant="default">
              Load More War Bases
            </Button>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-orbitron font-bold mb-6">
            War Base Tips
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-war/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-war" />
              </div>
              <h3 className="font-semibold mb-2">Protect Your Eagle</h3>
              <p className="text-sm text-muted-foreground">
                Keep Eagle Artillery well-protected and centralized to maximize defense
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-war/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-war" />
              </div>
              <h3 className="font-semibold mb-2">Counter Meta Attacks</h3>
              <p className="text-sm text-muted-foreground">
                Design your base to counter popular attack strategies in current meta
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-war/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Sword className="h-6 w-6 text-war" />
              </div>
              <h3 className="font-semibold mb-2">Test Before War</h3>
              <p className="text-sm text-muted-foreground">
                Always test your base with clanmates before using in actual wars
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WarBases;