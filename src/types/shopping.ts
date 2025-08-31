export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  category: ItemCategory;
  completed: boolean;
  addedAt: Date;
  brand?: string;
  size?: string;
  priceRange?: PriceRange;
  searchTerms?: string[];
}

export type ItemCategory = 
  | 'produce'
  | 'dairy'
  | 'meat'
  | 'pantry'
  | 'frozen'
  | 'beverages'
  | 'snacks'
  | 'household'
  | 'personal-care'
  | 'other';

export type PriceRange = 'under-5' | '5-10' | '10-20' | 'over-20';

export interface VoiceCommand {
  action: 'add' | 'remove' | 'modify' | 'clear' | 'complete' | 'search' | 'filter';
  item: string;
  quantity?: number;
  category?: ItemCategory;
  brand?: string;
  size?: string;
  priceRange?: PriceRange;
  searchQuery?: string;
}

export interface SmartSuggestion {
  id: string;
  name: string;
  category: ItemCategory;
  reason: string;
  confidence: number;
  brand?: string;
  priceRange?: PriceRange;
}

export interface SearchResult {
  id: string;
  name: string;
  brand?: string;
  size?: string;
  category: ItemCategory;
  priceRange?: PriceRange;
  description: string;
  matchScore: number;
}