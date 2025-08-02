import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Clock, 
  User, 
  ArrowRight,
  Sword,
  Shield,
  Trophy,
  TrendingUp,
  Target,
  Zap
} from "lucide-react";

const guides = [
  {
    id: 1,
    title: "Complete Guide to War Base Design",
    excerpt: "Learn the fundamentals of creating unbeatable war bases that consistently defend against 3-star attacks.",
    category: "War Strategy",
    readTime: "15 min",
    author: "ProClasher",
    date: "2024-01-15",
    tags: ["War", "Defense", "Strategy"],
    featured: true,
    icon: Sword
  },
  {
    id: 2,
    title: "Farming Efficiently at Every Town Hall",
    excerpt: "Master the art of resource collection with optimal farming strategies for each Town Hall level.",
    category: "Farming",
    readTime: "12 min",
    author: "ResourceKing",
    date: "2024-01-12",
    tags: ["Farming", "Resources", "Efficiency"],
    featured: true,
    icon: TrendingUp
  },
  {
    id: 3,
    title: "Trophy Pushing: From Masters to Legends",
    excerpt: "A comprehensive guide to climbing the trophy leaderboards and reaching Legend League.",
    category: "Trophy Pushing",
    readTime: "20 min",
    author: "LegendPlayer",
    date: "2024-01-10",
    tags: ["Trophies", "Pushing", "Legend League"],
    featured: true,
    icon: Trophy
  },
  {
    id: 4,
    title: "Defense Placement: The Ultimate Guide",
    excerpt: "Understand the optimal placement of every defensive building for maximum protection.",
    category: "Base Building",
    readTime: "18 min",
    author: "DefenseExpert",
    date: "2024-01-08",
    tags: ["Defense", "Placement", "Strategy"],
    featured: false,
    icon: Shield
  },
  {
    id: 5,
    title: "Attack Strategies for Every Meta",
    excerpt: "Stay ahead of the competition with attack strategies that counter current defensive metas.",
    category: "Attack Strategy",
    readTime: "25 min",
    author: "AttackMaster",
    date: "2024-01-05",
    tags: ["Attack", "Meta", "Strategy"],
    featured: false,
    icon: Target
  },
  {
    id: 6,
    title: "Optimizing Your Base for CWL",
    excerpt: "Special considerations and strategies for Clan War League base design and selection.",
    category: "CWL Strategy",
    readTime: "14 min",
    author: "CWLPro",
    date: "2024-01-03",
    tags: ["CWL", "Clan Wars", "Strategy"],
    featured: false,
    icon: Zap
  }
];

const categories = [
  { name: "All Guides", count: guides.length },
  { name: "War Strategy", count: guides.filter(g => g.category === "War Strategy").length },
  { name: "Farming", count: guides.filter(g => g.category === "Farming").length },
  { name: "Trophy Pushing", count: guides.filter(g => g.category === "Trophy Pushing").length },
  { name: "Base Building", count: guides.filter(g => g.category === "Base Building").length },
  { name: "Attack Strategy", count: guides.filter(g => g.category === "Attack Strategy").length }
];

const Guides = () => {
  const featuredGuides = guides.filter(guide => guide.featured);
  const regularGuides = guides.filter(guide => !guide.featured);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header Section */}
      <section className="py-16 px-4 gradient-hero">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="gradient-accent rounded-full w-16 h-16 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-orbitron font-black mb-6">
            <span className="gradient-primary bg-clip-text text-transparent">Guides & Tips</span>
          </h1>
          
          <p className="text-xl text-foreground/90 mb-8 max-w-3xl mx-auto">
            Master Clash of Clans with our comprehensive guides. 
            From <span className="text-primary font-semibold">beginner tutorials</span> to <span className="text-accent font-semibold">advanced strategies</span>, 
            level up your gameplay.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="text-sm">
              <Target className="w-4 h-4 mr-1" />
              Strategy Guides
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <Shield className="w-4 h-4 mr-1" />
              Defense Tips
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <Sword className="w-4 h-4 mr-1" />
              Attack Tutorials
            </Badge>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant="outline"
                className="flex items-center gap-2"
              >
                {category.name}
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Guides */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-orbitron font-bold mb-8 text-center">
            🔥 Featured Guides
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {featuredGuides.map((guide) => (
              <Card key={guide.id} className="group hover:shadow-lg transition-gaming overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {guide.category}
                    </Badge>
                    <guide.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {guide.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {guide.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {guide.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {guide.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {guide.readTime}
                    </div>
                  </div>
                  
                  <Button className="w-full group-hover:shadow-md transition-all">
                    Read Guide
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Guides */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-orbitron font-bold mb-8 text-center">
            All Guides
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {regularGuides.map((guide) => (
              <Card key={guide.id} className="group hover:shadow-lg transition-gaming">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="gradient-card rounded-lg p-3 shrink-0">
                      <guide.icon className="h-6 w-6 text-primary" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {guide.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {guide.date}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                        {guide.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {guide.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {guide.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {guide.readTime}
                          </div>
                        </div>
                        
                        <Button size="sm" variant="ghost">
                          Read
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" variant="default">
              Load More Guides
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Guides;