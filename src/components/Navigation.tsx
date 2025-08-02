import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { 
  Menu, 
  ChevronDown, 
  Castle, 
  Sword, 
  Trophy, 
  Sprout, 
  BookOpen, 
  Plus, 
  Mail,
  Search
} from "lucide-react";

const townHallLevels = Array.from({ length: 16 }, (_, i) => i + 1);

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, children, className = "" }: { to: string; children: React.ReactNode; className?: string }) => (
    <Link 
      to={to} 
      className={`font-medium transition-gaming hover:text-primary ${
        isActive(to) ? 'text-primary' : 'text-foreground'
      } ${className}`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 font-orbitron font-bold text-xl">
            <Castle className="h-8 w-8 text-primary" />
            <span className="gradient-primary bg-clip-text text-transparent">
              ClashLayouts
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/">Home</NavLink>

            {/* TH Layouts Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 font-medium text-foreground hover:text-primary transition-gaming">
                <span>TH Layouts</span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-card border-border">
                <div className="grid grid-cols-4 gap-1 p-2">
                  {townHallLevels.map((th) => (
                    <DropdownMenuItem key={th} asChild>
                      <Link 
                        to={`/th${th}`}
                        className="flex items-center justify-center p-2 rounded hover:bg-accent transition-gaming"
                      >
                        TH{th}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <NavLink to="/war-bases">
              <div className="flex items-center space-x-1">
                <Sword className="h-4 w-4" />
                <span>War Bases</span>
              </div>
            </NavLink>

            <NavLink to="/farming-trophy">
              <div className="flex items-center space-x-1">
                <Trophy className="h-4 w-4 mr-1" />
                <Sprout className="h-4 w-4" />
                <span>Farming / Trophy</span>
              </div>
            </NavLink>

            <NavLink to="/guides">
              <div className="flex items-center space-x-1">
                <BookOpen className="h-4 w-4" />
                <span>Guides</span>
              </div>
            </NavLink>

            <span className="text-muted-foreground cursor-not-allowed flex items-center space-x-1">
              <Plus className="h-4 w-4" />
              <span>Submit Base</span>
              <span className="text-xs bg-muted px-2 py-1 rounded">Coming Soon</span>
            </span>

            <NavLink to="/contact">
              <div className="flex items-center space-x-1">
                <Mail className="h-4 w-4" />
                <span>Contact</span>
              </div>
            </NavLink>
          </div>

          {/* Search and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-6 mt-6">
                  <NavLink to="/" className="text-lg">Home</NavLink>
                  
                  <div>
                    <h3 className="font-semibold mb-3 text-primary">Town Hall Layouts</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {townHallLevels.map((th) => (
                        <Link 
                          key={th}
                          to={`/th${th}`}
                          className="p-2 text-center rounded bg-card hover:bg-accent transition-gaming"
                          onClick={() => setIsOpen(false)}
                        >
                          TH{th}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <NavLink to="/war-bases" className="text-lg flex items-center space-x-2">
                      <Sword className="h-5 w-5" />
                      <span>War Bases</span>
                    </NavLink>
                    
                    <NavLink to="/farming-trophy" className="text-lg flex items-center space-x-2">
                      <Trophy className="h-5 w-5 mr-1" />
                      <Sprout className="h-5 w-5" />
                      <span>Farming / Trophy</span>
                    </NavLink>
                    
                    <NavLink to="/guides" className="text-lg flex items-center space-x-2">
                      <BookOpen className="h-5 w-5" />
                      <span>Guides</span>
                    </NavLink>
                    
                    <NavLink to="/contact" className="text-lg flex items-center space-x-2">
                      <Mail className="h-5 w-5" />
                      <span>Contact</span>
                    </NavLink>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};