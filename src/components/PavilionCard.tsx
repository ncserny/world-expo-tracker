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

const getBackgroundColorByCode = (code?: string) => {
  if (!code) return 'bg-muted border-border';
  
  const firstLetter = code.charAt(0);
  switch (firstLetter) {
    case 'S':
      return 'bg-orange-50 border-orange-200';
    case 'C':
      return 'bg-cyan-50 border-cyan-200';
    case 'E':
      return 'bg-red-50 border-red-200';
    case 'P':
      return 'bg-green-50 border-green-200';
    case 'W':
      return 'bg-blue-50 border-blue-200';
    case 'X':
      return 'bg-purple-50 border-purple-200';
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

const getPavilionCodeColor = (code?: string) => {
  if (!code) return 'bg-gray-500 text-white';
  
  const firstLetter = code.charAt(0);
  switch (firstLetter) {
    case 'S':
      return 'bg-orange-500 text-white';
    case 'C':
      return 'bg-cyan-500 text-white';
    case 'E':
      return 'bg-red-500 text-white';
    case 'P':
      return 'bg-green-500 text-white';
    case 'W':
      return 'bg-blue-500 text-white';
    case 'X':
      return 'bg-purple-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

export const PavilionCard = ({ pavilion, onToggleVisited }: PavilionCardProps) => {
  return (
    <Card className={cn(
      'transition-all duration-300 hover:shadow-lg border-2',
      getBackgroundColorByCode(pavilion.pavilionCode),
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
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2 flex-1">
                {pavilion.category === 'Country' && pavilion.countryCode && (
                  <div className="flex-shrink-0 flex items-center justify-center mt-0.5">
                    <span className={`fi fi-${pavilion.countryCode.toLowerCase()} w-5 h-4 rounded shadow-sm`}></span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={cn(
                      'font-semibold text-sm leading-tight transition-all',
                      pavilion.visited ? 'line-through text-muted-foreground' : 'text-foreground'
                    )}>
                      {pavilion.pavilion}
                    </h3>
                    <Badge 
                      variant="secondary" 
                      className={cn('text-xs font-medium flex-shrink-0', getCategoryBadgeColor(pavilion.category))}
                    >
                      {pavilion.category}
                    </Badge>
                  </div>
                </div>
              </div>
              {pavilion.pavilionCode && (
                <div className={cn(
                  'flex-shrink-0 w-6 h-6 rounded text-xs font-bold flex items-center justify-center mt-0.5',
                  getPavilionCodeColor(pavilion.pavilionCode)
                )}>
                  {pavilion.pavilionCode}
                </div>
              )}
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