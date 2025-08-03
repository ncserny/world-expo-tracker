import { Pavilion, PavilionCategory } from '../types/pavilion';
import { Card, CardContent } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { MapPin, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

interface PavilionCardProps {
  pavilion: Pavilion;
  onToggleVisited: (id: string) => void;
}

const getCategoryColor = (category: PavilionCategory) => {
  switch (category) {
    case 'Country':
      return 'bg-expo-country border-blue-200';
    case 'Signature':
      return 'bg-expo-signature border-purple-200';
    case 'Private Sector':
      return 'bg-expo-private border-green-200';
    case 'Other':
      return 'bg-expo-other border-orange-200';
    default:
      return 'bg-muted border-border';
  }
};

const getCategoryBadgeColor = (category: PavilionCategory) => {
  switch (category) {
    case 'Country':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'Signature':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
    case 'Private Sector':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'Other':
      return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

export const PavilionCard = ({ pavilion, onToggleVisited }: PavilionCardProps) => {
  return (
    <Card className={cn(
      'transition-all duration-300 hover:shadow-lg border-2',
      getCategoryColor(pavilion.category),
      pavilion.visited && 'opacity-75 scale-[0.98]'
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={pavilion.visited}
            onCheckedChange={() => onToggleVisited(pavilion.id)}
            className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className={cn(
                'font-semibold text-sm leading-tight transition-all',
                pavilion.visited ? 'line-through text-muted-foreground' : 'text-foreground'
              )}>
                {pavilion.pavilion}
              </h3>
              <Badge 
                variant="secondary" 
                className={cn('text-xs font-medium', getCategoryBadgeColor(pavilion.category))}
              >
                {pavilion.category}
              </Badge>
            </div>
            
            {(pavilion.location || pavilion.reserve) && (
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                {pavilion.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{pavilion.location}</span>
                  </div>
                )}
                {pavilion.reserve && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{pavilion.reserve}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};