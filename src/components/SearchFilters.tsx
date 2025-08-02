import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  X 
} from "lucide-react";

interface SearchFiltersProps {
  onSearch?: (query: string) => void;
  onFilter?: (filters: FilterState) => void;
}

interface FilterState {
  townHall: string;
  baseType: string;
  searchQuery: string;
}

export const SearchFilters = ({ onSearch, onFilter }: SearchFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTH, setSelectedTH] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const townHallLevels = Array.from({ length: 16 }, (_, i) => i + 1);
  const baseTypes = [
    { value: "war", label: "War Base" },
    { value: "farming", label: "Farming Base" },
    { value: "trophy", label: "Trophy Base" },
    { value: "hybrid", label: "Hybrid Base" }
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
    
    // Update filters
    const newFilters: FilterState = {
      townHall: selectedTH,
      baseType: selectedType,
      searchQuery: query
    };
    onFilter?.(newFilters);
  };

  const handleTownHallChange = (value: string) => {
    setSelectedTH(value);
    
    // Update active filters
    const newActiveFilters = [...activeFilters];
    if (value && value !== "all") {
      const filterLabel = `TH${value}`;
      if (!newActiveFilters.includes(filterLabel)) {
        newActiveFilters.push(filterLabel);
      }
    } else {
      const thFilters = newActiveFilters.filter(f => !f.startsWith("TH"));
      setActiveFilters(thFilters);
    }
    
    if (value && value !== "all") {
      setActiveFilters(newActiveFilters);
    }

    // Update filters
    const newFilters: FilterState = {
      townHall: value,
      baseType: selectedType,
      searchQuery: searchQuery
    };
    onFilter?.(newFilters);
  };

  const handleBaseTypeChange = (value: string) => {
    setSelectedType(value);
    
    // Update active filters
    const newActiveFilters = [...activeFilters];
    if (value && value !== "all") {
      const filterLabel = baseTypes.find(t => t.value === value)?.label || value;
      if (!newActiveFilters.includes(filterLabel)) {
        newActiveFilters.push(filterLabel);
      }
    } else {
      const typeFilters = newActiveFilters.filter(f => 
        !baseTypes.some(t => t.label === f)
      );
      setActiveFilters(typeFilters);
    }
    
    if (value && value !== "all") {
      setActiveFilters(newActiveFilters);
    }

    // Update filters
    const newFilters: FilterState = {
      townHall: selectedTH,
      baseType: value,
      searchQuery: searchQuery
    };
    onFilter?.(newFilters);
  };

  const removeFilter = (filterToRemove: string) => {
    const newActiveFilters = activeFilters.filter(f => f !== filterToRemove);
    setActiveFilters(newActiveFilters);

    // Clear corresponding select
    if (filterToRemove.startsWith("TH")) {
      setSelectedTH("");
    } else if (baseTypes.some(t => t.label === filterToRemove)) {
      setSelectedType("");
    }

    // Update filters
    const newFilters: FilterState = {
      townHall: filterToRemove.startsWith("TH") ? "" : selectedTH,
      baseType: baseTypes.some(t => t.label === filterToRemove) ? "" : selectedType,
      searchQuery: searchQuery
    };
    onFilter?.(newFilters);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedTH("");
    setSelectedType("");
    setActiveFilters([]);
    
    onSearch?.("");
    onFilter?.({
      townHall: "",
      baseType: "",
      searchQuery: ""
    });
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search base layouts..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 h-12 text-base"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        <Select value={selectedTH} onValueChange={handleTownHallChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Town Hall" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All TH</SelectItem>
            {townHallLevels.map((th) => (
              <SelectItem key={th} value={th.toString()}>
                TH{th}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={handleBaseTypeChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Base Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {baseTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {activeFilters.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <Badge 
              key={filter} 
              variant="secondary" 
              className="flex items-center space-x-1 pr-1"
            >
              <span>{filter}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeFilter(filter)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};