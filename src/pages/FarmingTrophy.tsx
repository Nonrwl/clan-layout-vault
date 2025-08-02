import { Navigation } from "@/components/Navigation";
import { BaseCard } from "@/components/BaseCard";
import { SearchFilters } from "@/components/SearchFilters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, TrendingUp, Shield, Coins } from "lucide-react";

const farmingBases = [
  {
    id: "f1",
    title: "DE Protection Farming TH14",
    image: "",
    tags: ["DE Protection", "Farming", "TH14"],
    rating: 4.8,
    downloads: 23400,
    type: "farming" as const,
    townHall: 14
  },
  {
    id: "f2",
    title: "Gold/Elixir Farming TH13",
    image: "",
    tags: ["Gold Protection", "Elixir", "TH13"],
    rating: 4.6,
    downloads: 19200,
    type: "farming" as const,
    townHall: 13
  },
  {
    id: "f3",
    title: "Resource Protection TH12",
    image: "",
    tags: ["All Resources", "Farming", "TH12"],
    rating: 4.7,
    downloads: 17800,
    type: "farming" as const,
    townHall: 12
  }
];

const trophyBases = [
  {
    id: "t1",
    title: "Legend League TH16",
    image: "",
    tags: ["Legend League", "Trophy", "TH16"],
    rating: 4.9,
    downloads: 15600,
    type: "trophy" as const,
    townHall: 16
  },
  {
    id: "t2",
    title: "Champion League TH15",
    image: "",
    tags: ["Champion", "Trophy", "TH15"],
    rating: 4.8,
    downloads: 14300,
    type: "trophy" as const,
    townHall: 15
  },
  {
    id: "t3",
    title: "Masters League TH14",
    image: "",
    tags: ["Masters", "Trophy", "TH14"],
    rating: 4.7,
    downloads: 16900,
    type: "trophy" as const,
    townHall: 14
  }
];

const FarmingTrophy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header Section */}
      <section className="py-16 px-4 gradient-hero">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="farming-accent rounded-full w-16 h-16 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <div className="trophy-accent rounded-full w-16 h-16 flex items-center justify-center">
              <Trophy className="h-8 w-8 text-black" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-orbitron font-black mb-6">
            <span className="gradient-primary bg-clip-text text-transparent">Farming & Trophy</span>
          </h1>
          
          <p className="text-xl text-foreground/90 mb-8 max-w-3xl mx-auto">
            Maximize your resource collection and climb the leaderboards. 
            Choose between <span className="text-farming font-semibold">resource protection</span> and <span className="text-trophy font-semibold">trophy pushing</span> layouts.
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <SearchFilters />
        </div>
      </section>

      {/* Tabs for Farming vs Trophy */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="farming" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
              <TabsTrigger value="farming" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Farming Bases
              </TabsTrigger>
              <TabsTrigger value="trophy" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Trophy Bases
              </TabsTrigger>
            </TabsList>

            <TabsContent value="farming" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">🌾 Farming Bases</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Protect your resources while farming. These bases prioritize keeping your loot safe from raiders.
                </p>
                
                <div className="flex flex-wrap justify-center gap-4 mt-6">
                  <Badge variant="secondary" className="text-sm">
                    <Coins className="w-4 h-4 mr-1" />
                    Resource Protection
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    <Shield className="w-4 h-4 mr-1" />
                    Anti-Barch
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Loot Security
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {farmingBases.map((base) => (
                  <BaseCard key={base.id} {...base} />
                ))}
              </div>

              {/* Farming Tips */}
              <div className="bg-farming/10 rounded-lg p-8 mt-12">
                <h3 className="text-xl font-bold mb-4 text-center">💡 Farming Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <h4 className="font-semibold mb-2">Centralize Storages</h4>
                    <p className="text-sm text-muted-foreground">
                      Keep your most valuable resources in the center of your base
                    </p>
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold mb-2">Spread Collectors</h4>
                    <p className="text-sm text-muted-foreground">
                      Place collectors on the outside to give attackers easy loot
                    </p>
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold mb-2">Upgrade Defenses</h4>
                    <p className="text-sm text-muted-foreground">
                      Prioritize splash damage defenses for better protection
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="trophy" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">🏆 Trophy Bases</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Climb the leaderboards with these defensive layouts designed to prevent attackers from getting stars.
                </p>
                
                <div className="flex flex-wrap justify-center gap-4 mt-6">
                  <Badge variant="secondary" className="text-sm">
                    <Trophy className="w-4 h-4 mr-1" />
                    Trophy Defense
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    <Shield className="w-4 h-4 mr-1" />
                    Anti-2 Star
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    League Push
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {trophyBases.map((base) => (
                  <BaseCard key={base.id} {...base} />
                ))}
              </div>

              {/* Trophy Tips */}
              <div className="bg-trophy/10 rounded-lg p-8 mt-12">
                <h3 className="text-xl font-bold mb-4 text-center">🎯 Trophy Pushing Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <h4 className="font-semibold mb-2">Protect Town Hall</h4>
                    <p className="text-sm text-muted-foreground">
                      Keep your Town Hall well-defended to prevent easy 1-star attacks
                    </p>
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold mb-2">Anti-Air Defense</h4>
                    <p className="text-sm text-muted-foreground">
                      Strong air defenses are crucial for stopping air-based attacks
                    </p>
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold mb-2">Active Defense</h4>
                    <p className="text-sm text-muted-foreground">
                      Stay online to protect your trophies and maintain your rank
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default FarmingTrophy;