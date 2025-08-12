import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { LegacyBaseCard } from "@/components/LegacyBaseCard";
import { SearchFilters } from "@/components/SearchFilters";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Castle, 
  Sword, 
  Trophy, 
  TrendingUp, 
  Users, 
  Star,
  Download,
  Zap,
  Shield,
  Target
} from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

// Mock data for featured bases
const featuredBases = [
  {
    id: "1",
    title: "Anti-3 Star War Base TH14",
    image: "",
    tags: ["Anti-3-star", "War", "Meta"],
    rating: 4.8,
    downloads: 15420,
    type: "war" as const,
    townHall: 14
  },
  {
    id: "2", 
    title: "Best Farming Base TH13",
    image: "",
    tags: ["Farming", "Resource Protection", "Popular"],
    rating: 4.6,
    downloads: 22100,
    type: "farming" as const,
    townHall: 13
  },
  {
    id: "3",
    title: "Legend League Trophy Base TH15",
    image: "",
    tags: ["Trophy", "Legend League", "Defense"],
    rating: 4.9,
    downloads: 8900,
    type: "trophy" as const,
    townHall: 15
  },
  {
    id: "4",
    title: "Hybrid War/Trophy TH12",
    image: "",
    tags: ["Hybrid", "Versatile", "Strong"],
    rating: 4.7,
    downloads: 12300,
    type: "hybrid" as const,
    townHall: 12
  }
];

const stats = [
  { icon: Castle, label: "Base Layouts", value: "10,000+" },
  { icon: Users, label: "Active Users", value: "50,000+" },
  { icon: Download, label: "Downloads", value: "500,000+" },
  { icon: Star, label: "Average Rating", value: "4.8" }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section 
        className="relative min-h-[600px] flex items-center justify-center text-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <Badge variant="secondary" className="mb-4 font-orbitron font-bold">
              🏆 #1 Clash of Clans Base Hub
            </Badge>
            <h1 className="text-5xl md:text-7xl font-orbitron font-black mb-6 gradient-primary bg-clip-text text-transparent">
              ClashLayouts
            </h1>
            <p className="text-xl md:text-2xl text-foreground/90 mb-8 font-medium">
              Discover the most powerful base layouts for every Town Hall level.
              <br />
              <span className="text-primary">Win more wars, protect your loot, climb the leaderboards.</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button size="xl" variant="gaming" className="animate-pulse-glow">
              <Zap className="mr-2 h-5 w-5" />
              Browse All Bases
            </Button>
            <Button size="xl" variant="outline" className="border-primary/50 hover:border-primary">
              <Shield className="mr-2 h-5 w-5" />
              War Bases
            </Button>
            <Button size="xl" variant="outline" className="border-primary/50 hover:border-primary">
              <Target className="mr-2 h-5 w-5" />
              Trophy Bases
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4">
              Find Your Perfect Base
            </h2>
            <p className="text-lg text-muted-foreground">
              Search and filter through thousands of proven base layouts
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <SearchFilters />
          </div>
        </div>
      </section>

      {/* Featured Bases */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4">
              🔥 Featured Base Layouts
            </h2>
            <p className="text-lg text-muted-foreground">
              Top-rated bases used by pro players worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBases.map((base) => (
              <LegacyBaseCard key={base.id} {...base} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="default">
              View All Base Layouts
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4">
              Base Categories
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose the perfect strategy for your gameplay style
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-gaming cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="war-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-gaming">
                  <Sword className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">War Bases</h3>
                <p className="text-muted-foreground mb-4">
                  Defensive layouts designed to prevent 3-star attacks in clan wars
                </p>
                <Button variant="war" size="sm">
                  Browse War Bases
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-gaming cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="farming-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-gaming">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Farming Bases</h3>
                <p className="text-muted-foreground mb-4">
                  Resource protection layouts to keep your loot safe while farming
                </p>
                <Button variant="farming" size="sm">
                  Browse Farming Bases
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-gaming cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="trophy-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-gaming">
                  <Trophy className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-bold mb-2">Trophy Bases</h3>
                <p className="text-muted-foreground mb-4">
                  Push to higher leagues with these trophy-defending layouts
                </p>
                <Button variant="trophy" size="sm">
                  Browse Trophy Bases
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Castle className="h-6 w-6 text-primary" />
            <span className="font-orbitron font-bold text-xl gradient-primary bg-clip-text text-transparent">
              ClashLayouts
            </span>
          </div>
          <p className="text-muted-foreground mb-4">
            The ultimate destination for Clash of Clans base layouts
          </p>
          <p className="text-sm text-muted-foreground">
            © 2024 ClashLayouts. Not affiliated with Supercell.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
