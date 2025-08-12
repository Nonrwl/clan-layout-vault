import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { HallType } from '@/types/database';

interface HallLevelCardProps {
  hallType: HallType;
  level: number;
  baseCount?: number;
  onClick: () => void;
  className?: string;
}

export function HallLevelCard({ 
  hallType, 
  level, 
  baseCount = 0, 
  onClick, 
  className 
}: HallLevelCardProps) {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-2",
        "hover:border-primary/50 hover:bg-card/80 group",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-accent rounded-full flex items-center justify-center group-hover:animate-pulse-glow">
          <span className="text-white font-orbitron font-bold text-lg">
            {hallType}{level}
          </span>
        </div>
        
        <h3 className="font-orbitron font-semibold text-lg mb-2">
          {hallType === 'TH' ? 'Town Hall' : 'Builder Hall'} {level}
        </h3>
        
        <Badge variant="secondary" className="mb-2">
          {baseCount} bases
        </Badge>
        
        <p className="text-muted-foreground text-sm">
          Click to view bases
        </p>
      </CardContent>
    </Card>
  );
}