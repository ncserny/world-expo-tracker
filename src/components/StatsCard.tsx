import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CheckCircle, Circle, Target } from 'lucide-react';

interface StatsCardProps {
  totalPavilions: number;
  visitedCount: number;
  categoryStats: Record<string, { total: number; visited: number }>;
}

export const StatsCard = ({ totalPavilions, visitedCount, categoryStats }: StatsCardProps) => {
  const progressPercentage = totalPavilions > 0 ? (visitedCount / totalPavilions) * 100 : 0;
  
  return (
    <Card className="mb-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Target className="w-5 h-5" />
          World Expo 2025 Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{visitedCount}</span>
            </div>
            <p className="text-sm text-muted-foreground">Visited</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Circle className="w-4 h-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{totalPavilions - visitedCount}</span>
            </div>
            <p className="text-sm text-muted-foreground">Remaining</p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{totalPavilions}</div>
            <p className="text-sm text-muted-foreground">Total</p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{progressPercentage.toFixed(1)}%</div>
            <p className="text-sm text-muted-foreground">Complete</p>
          </div>
        </div>
        
        <div className="w-full bg-secondary rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
          {Object.entries(categoryStats).map(([category, stats]) => (
            <div key={category} className="text-center p-2 bg-background/50 rounded">
              <div className="text-sm font-medium">{category}</div>
              <div className="text-xs text-muted-foreground">
                {stats.visited}/{stats.total}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};