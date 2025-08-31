import { SmartSuggestion, ShoppingItem, ItemCategory } from '@/types/shopping';

const COMMON_SUGGESTIONS: Record<ItemCategory, string[]> = {
  'produce': ['bananas', 'apples', 'lettuce', 'tomatoes', 'onions', 'carrots'],
  'dairy': ['milk', 'eggs', 'cheese', 'yogurt', 'butter'],
  'pantry': ['bread', 'rice', 'pasta', 'olive oil', 'salt', 'black pepper'],
  'meat': ['chicken breast', 'ground beef', 'salmon'],
  'beverages': ['water bottles', 'orange juice', 'coffee'],
  'household': ['toilet paper', 'paper towels', 'dish soap'],
  'personal-care': ['toothpaste', 'shampoo', 'soap'],
  'snacks': ['crackers', 'nuts', 'granola bars'],
  'frozen': ['frozen vegetables', 'ice cream'],
  'other': []
};

const SEASONAL_SUGGESTIONS = {
  spring: ['strawberries', 'asparagus', 'spring onions'],
  summer: ['watermelon', 'corn', 'tomatoes', 'peaches'],
  fall: ['pumpkin', 'apples', 'squash', 'sweet potatoes'],
  winter: ['oranges', 'root vegetables', 'hot chocolate']
};

const FREQUENT_PAIRS = {
  'milk': ['cereal', 'cookies'],
  'pasta': ['tomato sauce', 'parmesan cheese'],
  'chicken': ['rice', 'vegetables'],
  'bread': ['butter', 'jam'],
  'eggs': ['bacon', 'toast'],
  'coffee': ['cream', 'sugar'],
  'pizza': ['soda', 'salad'],
  'salad': ['dressing', 'croutons']
};

export const generateSmartSuggestions = (
  currentItems: ShoppingItem[],
  recentHistory: ShoppingItem[] = []
): SmartSuggestion[] => {
  const suggestions: SmartSuggestion[] = [];
  const currentItemNames = new Set(currentItems.map(item => item.name.toLowerCase()));
  
  // 1. Suggest frequently paired items
  currentItems.forEach(item => {
    const pairs = FREQUENT_PAIRS[item.name.toLowerCase() as keyof typeof FREQUENT_PAIRS];
    if (pairs) {
      pairs.forEach(pairedItem => {
        if (!currentItemNames.has(pairedItem.toLowerCase())) {
          suggestions.push({
            id: `pair-${pairedItem}`,
            name: pairedItem,
            category: getCategoryForItem(pairedItem),
            reason: `Often bought with ${item.name}`,
            confidence: 0.8
          });
        }
      });
    }
  });
  
  // 2. Suggest common essentials if list is small
  if (currentItems.length < 3) {
    const essentials = ['milk', 'bread', 'eggs'];
    essentials.forEach(essential => {
      if (!currentItemNames.has(essential)) {
        suggestions.push({
          id: `essential-${essential}`,
          name: essential,
          category: getCategoryForItem(essential),
          reason: 'Essential item',
          confidence: 0.7
        });
      }
    });
  }
  
  // 3. Suggest based on current season
  const season = getCurrentSeason();
  const seasonalItems = SEASONAL_SUGGESTIONS[season];
  seasonalItems.forEach(item => {
    if (!currentItemNames.has(item.toLowerCase())) {
      suggestions.push({
        id: `seasonal-${item}`,
        name: item,
        category: getCategoryForItem(item),
        reason: `In season now`,
        confidence: 0.6
      });
    }
  });
  
  // 4. Suggest frequently bought items from history
  const frequentItems = getFrequentItems(recentHistory);
  frequentItems.forEach(item => {
    if (!currentItemNames.has(item.name.toLowerCase())) {
      suggestions.push({
        id: `frequent-${item.name}`,
        name: item.name,
        category: item.category,
        reason: 'You buy this often',
        confidence: 0.9
      });
    }
  });
  
  // Remove duplicates and sort by confidence
  const uniqueSuggestions = suggestions.filter((suggestion, index, self) =>
    index === self.findIndex(s => s.name.toLowerCase() === suggestion.name.toLowerCase())
  );
  
  return uniqueSuggestions
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 6); // Limit to top 6 suggestions
};

const getCategoryForItem = (item: string): ItemCategory => {
  const itemLower = item.toLowerCase();
  
  for (const [category, items] of Object.entries(COMMON_SUGGESTIONS)) {
    if (items.some(catItem => itemLower.includes(catItem) || catItem.includes(itemLower))) {
      return category as ItemCategory;
    }
  }
  
  return 'other';
};

const getCurrentSeason = (): keyof typeof SEASONAL_SUGGESTIONS => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
};

const getFrequentItems = (history: ShoppingItem[]): ShoppingItem[] => {
  const itemCounts = new Map<string, { item: ShoppingItem; count: number }>();
  
  history.forEach(item => {
    const key = item.name.toLowerCase();
    const existing = itemCounts.get(key);
    if (existing) {
      existing.count++;
    } else {
      itemCounts.set(key, { item, count: 1 });
    }
  });
  
  return Array.from(itemCounts.values())
    .filter(entry => entry.count >= 2)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map(entry => entry.item);
};