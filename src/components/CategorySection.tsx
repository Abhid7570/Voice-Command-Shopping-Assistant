import { ShoppingItem } from '@/components/ShoppingItem';
import { ShoppingItem as ShoppingItemType, ItemCategory } from '@/types/shopping';
import { getCategoryDisplayName, getCategoryEmoji } from '@/utils/voiceCommands';

interface CategorySectionProps {
  category: ItemCategory;
  items: ShoppingItemType[];
  onToggleComplete: (id: string) => void;
  onRemove: (id: string) => void;
}

export const CategorySection = ({ 
  category, 
  items, 
  onToggleComplete, 
  onRemove 
}: CategorySectionProps) => {
  if (items.length === 0) return null;

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <span className="text-xl">{getCategoryEmoji(category)}</span>
          {getCategoryDisplayName(category)}
        </h3>
        <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
          {completedCount}/{totalCount}
        </span>
      </div>
      
      <div className="space-y-2">
        {items.map(item => (
          <ShoppingItem
            key={item.id}
            item={item}
            onToggleComplete={onToggleComplete}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
};