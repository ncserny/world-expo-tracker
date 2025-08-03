import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { PavilionCategory } from '../types/pavilion';
import { Search, Filter, X } from 'lucide-react';

interface FilterControlsProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategories: PavilionCategory[];
  onCategoryToggle: (category: PavilionCategory) => void;
  visitedFilter: 'all' | 'visited' | 'unvisited';
  onVisitedFilterChange: (filter: 'all' | 'visited' | 'unvisited') => void;
  onClearFilters: () => void;
}

const categories: PavilionCategory[] = ['Country', 'Signature', 'Private Sector', 'Other'];

export const FilterControls = ({
  searchTerm,
  onSearchChange,
  selectedCategories,
  onCategoryToggle,
  visitedFilter,
  onVisitedFilterChange,
  onClearFilters
}: FilterControlsProps) => {
  const hasActiveFilters = searchTerm || selectedCategories.length > 0 || visitedFilter !== 'all';

  return (
    <div className="space-y-4 p-4 bg-card border rounded-lg mb-6">
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="w-3 h-3 mr-1" />
            Clear all
          </Button>
        </div>
      )}
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search pavilions..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="space-y-2">
        <div className="text-sm font-medium">Status</div>
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'All' },
            { value: 'visited', label: 'Visited' },
            { value: 'unvisited', label: 'Not Visited' }
          ].map((option) => (
            <Button
              key={option.value}
              variant={visitedFilter === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onVisitedFilterChange(option.value as 'all' | 'visited' | 'unvisited')}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-sm font-medium">Categories</div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategories.includes(category) ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-primary/80 transition-colors"
              onClick={() => onCategoryToggle(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};