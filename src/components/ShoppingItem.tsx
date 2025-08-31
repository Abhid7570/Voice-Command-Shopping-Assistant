import { Check, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShoppingItem as ShoppingItemType } from '@/types/shopping';
import { getCategoryEmoji } from '@/utils/voiceCommands';

interface ShoppingItemProps {
  item: ShoppingItemType;
  onToggleComplete: (id: string) => void;
  onRemove: (id: string) => void;
}

export const ShoppingItem = ({ item, onToggleComplete, onRemove }: ShoppingItemProps) => {
  return (
    <Card className={`p-4 card-shadow transition-smooth ${
      item.completed ? 'bg-muted/50 opacity-75' : 'bg-card'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <span className="text-xl">{getCategoryEmoji(item.category)}</span>
          <div className="flex-1">
            <h4 className={`font-medium ${
              item.completed ? 'line-through text-muted-foreground' : 'text-foreground'
            }`}>
              {item.name}
            </h4>
            {item.quantity > 1 && (
              <p className="text-sm text-muted-foreground">
                Quantity: {item.quantity}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={item.completed ? "outline" : "success"}
            size="icon"
            onClick={() => onToggleComplete(item.id)}
            className="h-8 w-8"
          >
            {item.completed ? (
              <X className="h-3 w-3" />
            ) : (
              <Check className="h-3 w-3" />
            )}
          </Button>
          
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onRemove(item.id)}
            className="h-8 w-8"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
};