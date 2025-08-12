import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { BaseType } from '@/types/database';

interface BaseTypeFilterProps {
  selectedTypes: BaseType[];
  onTypeToggle: (type: BaseType) => void;
  className?: string;
}

const BASE_TYPES: { type: BaseType; label: string; variant: string }[] = [
  { type: 'WAR', label: 'War', variant: 'war-accent' },
  { type: 'FARMING', label: 'Farming', variant: 'farming-accent' },
  { type: 'TROPHY', label: 'Trophy', variant: 'trophy-accent' },
  { type: 'HYBRID', label: 'Hybrid', variant: 'default' },
  { type: 'CWL', label: 'CWL', variant: 'secondary' },
  { type: 'FUN', label: 'Fun', variant: 'accent' },
  { type: 'PROGRESS_BASE', label: 'Progress', variant: 'muted' },
];

export function BaseTypeFilter({ selectedTypes, onTypeToggle, className }: BaseTypeFilterProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {BASE_TYPES.map(({ type, label, variant }) => (
        <Badge
          key={type}
          variant={selectedTypes.includes(type) ? "default" : "outline"}
          className={cn(
            "cursor-pointer transition-all hover:scale-105",
            selectedTypes.includes(type) && variant,
            !selectedTypes.includes(type) && "hover:bg-muted"
          )}
          onClick={() => onTypeToggle(type)}
        >
          {label}
        </Badge>
      ))}
    </div>
  );
}