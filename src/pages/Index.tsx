import { useState, useMemo } from 'react';
import { pavilions as initialPavilions } from '../data/pavilions';
import { Pavilion, PavilionCategory } from '../types/pavilion';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { PavilionCard } from '../components/PavilionCard';
import { StatsCard } from '../components/StatsCard';
import { FilterControls } from '../components/FilterControls';
import { useToast } from '../hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [visitedPavilions, setVisitedPavilions] = useLocalStorage<string[]>('visited-pavilions', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<PavilionCategory[]>([]);
  const [visitedFilter, setVisitedFilter] = useState<'all' | 'visited' | 'unvisited'>('all');

  // Merge pavilions with visited status from localStorage
  const pavilions = useMemo(() => {
    return initialPavilions.map(pavilion => ({
      ...pavilion,
      visited: visitedPavilions.includes(pavilion.id)
    }));
  }, [visitedPavilions]);

  // Filter pavilions based on search and filters
  const filteredPavilions = useMemo(() => {
    return pavilions.filter(pavilion => {
      const matchesSearch = pavilion.pavilion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pavilion.location?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategories.length === 0 || 
                             selectedCategories.includes(pavilion.category);
      
      const matchesVisited = visitedFilter === 'all' ||
                            (visitedFilter === 'visited' && pavilion.visited) ||
                            (visitedFilter === 'unvisited' && !pavilion.visited);
      
      return matchesSearch && matchesCategory && matchesVisited;
    });
  }, [pavilions, searchTerm, selectedCategories, visitedFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalPavilions = pavilions.length;
    const visitedCount = pavilions.filter(p => p.visited).length;
    
    const categoryStats = pavilions.reduce((acc, pavilion) => {
      if (!acc[pavilion.category]) {
        acc[pavilion.category] = { total: 0, visited: 0 };
      }
      acc[pavilion.category].total++;
      if (pavilion.visited) {
        acc[pavilion.category].visited++;
      }
      return acc;
    }, {} as Record<string, { total: number; visited: number }>);

    return { totalPavilions, visitedCount, categoryStats };
  }, [pavilions]);

  const handleToggleVisited = (pavilionId: string) => {
    const pavilion = pavilions.find(p => p.id === pavilionId);
    if (!pavilion) return;

    if (visitedPavilions.includes(pavilionId)) {
      setVisitedPavilions(prev => prev.filter(id => id !== pavilionId));
      toast({
        title: "Pavilion unmarked",
        description: `${pavilion.pavilion} removed from visited list`,
      });
    } else {
      setVisitedPavilions(prev => [...prev, pavilionId]);
      toast({
        title: "Pavilion visited! 🎉",
        description: `${pavilion.pavilion} marked as visited`,
      });
    }
  };

  const handleCategoryToggle = (category: PavilionCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setVisitedFilter('all');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4">
            World Expo 2025 Osaka
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track your journey through all the amazing pavilions at World Expo 2025 in Osaka, Japan
          </p>
        </div>

        {/* Stats */}
        <StatsCard 
          totalPavilions={stats.totalPavilions}
          visitedCount={stats.visitedCount}
          categoryStats={stats.categoryStats}
        />

        {/* Filters */}
        <FilterControls
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategories={selectedCategories}
          onCategoryToggle={handleCategoryToggle}
          visitedFilter={visitedFilter}
          onVisitedFilterChange={setVisitedFilter}
          onClearFilters={handleClearFilters}
        />

        {/* Results count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredPavilions.length} of {pavilions.length} pavilions
        </div>

        {/* Pavilions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPavilions.map((pavilion) => (
            <PavilionCard
              key={pavilion.id}
              pavilion={pavilion}
              onToggleVisited={handleToggleVisited}
            />
          ))}
        </div>

        {filteredPavilions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No pavilions match your current filters</p>
            <button 
              onClick={handleClearFilters}
              className="text-primary hover:underline mt-2"
            >
              Clear filters to see all pavilions
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
