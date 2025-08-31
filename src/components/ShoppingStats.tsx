import { ShoppingItem } from '@/types/shopping';
import { Card } from '@/components/ui/card';
import { CheckCircle, Circle, ShoppingCart } from 'lucide-react';

interface ShoppingStatsProps {
  items: ShoppingItem[];
}

export const ShoppingStats = ({ items }: ShoppingStatsProps) => {
  const totalItems = items.length;
  const completedItems = items.filter(item => item.completed).length;
  const remainingItems = totalItems - completedItems;
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <Card className="p-4 card-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          Shopping Progress
        </h3>
        <span className="text-2xl font-bold text-primary">
          {completionPercentage}%
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-3 mb-4">
        <div 
          className="gradient-tech h-3 rounded-full transition-all duration-500"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="space-y-1">
          <div className="flex items-center justify-center">
            <Circle className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground">{totalItems}</p>
          <p className="text-xs text-muted-foreground">Total Items</p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-center">
            <CheckCircle className="h-4 w-4 text-success" />
          </div>
          <p className="text-2xl font-bold text-success">{completedItems}</p>
          <p className="text-xs text-muted-foreground">Completed</p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-center">
            <Circle className="h-4 w-4 text-warning" />
          </div>
          <p className="text-2xl font-bold text-warning">{remainingItems}</p>
          <p className="text-xs text-muted-foreground">Remaining</p>
        </div>
      </div>
    </Card>
  );
};