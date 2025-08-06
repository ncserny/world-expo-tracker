import { useState, useMemo } from 'react';
import { Pavilion, PavilionCategory } from '../types/pavilion';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { usePavilions } from '../hooks/usePavilions';
import { PavilionCard } from '../components/PavilionCard';
import { StatsCard } from '../components/StatsCard';
import { FilterControls } from '../components/FilterControls';
import { useToast } from '../hooks/use-toast';
import { Heart } from 'lucide-react';

const Index = () => {
  const { toast } = useToast();
  const { pavilions: pavilionData, loading, error } = usePavilions();
  const [visitedPavilions, setVisitedPavilions] = useLocalStorage<string[]>('visited-pavilions', []);
  const [watchlistPavilions, setWatchlistPavilions] = useLocalStorage<string[]>('watchlist-pavilions', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<PavilionCategory[]>([]);
  const [selectedPavilionCodes, setSelectedPavilionCodes] = useState<string[]>([]);
  const [visitedFilter, setVisitedFilter] = useState<'all' | 'visited' | 'unvisited'>('all');
  const [watchlistFilter, setWatchlistFilter] = useState<'all' | 'watchlist'>('all');

  // Merge pavilions with visited and watchlist status from localStorage
  const pavilions = useMemo(() => {
    return pavilionData.map(pavilion => ({
      ...pavilion,
      visited: visitedPavilions.includes(pavilion.id),
      wantToVisit: watchlistPavilions.includes(pavilion.id)
    }));
  }, [pavilionData, visitedPavilions, watchlistPavilions]);

  // Get available pavilion code letters
  const availablePavilionCodes = useMemo(() => {
    return ["C", "E", "P", "S", "W", "X"];
  }, []);

  // Filter and sort pavilions based on search and filters
  const filteredPavilions = useMemo(() => {
    return pavilions.filter(pavilion => {
      const matchesSearch = pavilion.pavilion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pavilion.location?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategories.length === 0 || 
                             selectedCategories.includes(pavilion.category);
      
      const matchesPavilionCode = selectedPavilionCodes.length === 0 ||
                                 (pavilion.pavilionCode && selectedPavilionCodes.some(code => pavilion.pavilionCode!.startsWith(code)));
      
      const matchesVisited = visitedFilter === 'all' ||
                            (visitedFilter === 'visited' && pavilion.visited) ||
                            (visitedFilter === 'unvisited' && !pavilion.visited);
      
      const matchesWatchlist = watchlistFilter === 'all' ||
                              (watchlistFilter === 'watchlist' && pavilion.wantToVisit);
      
      return matchesSearch && matchesCategory && matchesPavilionCode && matchesVisited && matchesWatchlist;
    }).sort((a, b) => a.pavilion.localeCompare(b.pavilion));
  }, [pavilions, searchTerm, selectedCategories, selectedPavilionCodes, visitedFilter, watchlistFilter]);

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

  const handlePavilionCodeToggle = (code: string) => {
    setSelectedPavilionCodes(prev => 
      prev.includes(code) 
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  const handleToggleWantToVisit = (pavilionId: string) => {
    const pavilion = pavilions.find(p => p.id === pavilionId);
    if (!pavilion) return;

    if (watchlistPavilions.includes(pavilionId)) {
      setWatchlistPavilions(prev => prev.filter(id => id !== pavilionId));
      toast({
        title: "Removed from watchlist",
        description: `${pavilion.pavilion} removed from your watchlist`,
      });
    } else {
      setWatchlistPavilions(prev => [...prev, pavilionId]);
      toast({
        title: "Added to watchlist! ❤️",
        description: `${pavilion.pavilion} added to your watchlist`,
      });
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedPavilionCodes([]);
    setVisitedFilter('all');
    setWatchlistFilter('all');
  };

  // Handle loading and error states
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading pavilions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="text-center">
          <p className="text-lg text-destructive mb-4">Error loading pavilions: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4">
            <span className="md:hidden">World Expo 2025</span>
            <span className="hidden md:inline">World Expo 2025 Osaka</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track your journey through all the amazing pavilions at World Expo in Osaka, Japan
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
          selectedPavilionCodes={selectedPavilionCodes}
          onPavilionCodeToggle={handlePavilionCodeToggle}
          availablePavilionCodes={availablePavilionCodes}
          visitedFilter={visitedFilter}
          onVisitedFilterChange={setVisitedFilter}
          watchlistFilter={watchlistFilter}
          onWatchlistFilterChange={setWatchlistFilter}
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
              onToggleWantToVisit={handleToggleWantToVisit}
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
      
      {/* Footer */}
      <footer className="mt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <a 
              href="https://nader.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Heart className="w-4 h-4 text-red-500" />
              <span>Tracker by Nader</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
