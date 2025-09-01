import { VoiceCommand, ItemCategory, PriceRange, SearchResult } from '@/types/shopping';
import { LanguageConfig } from '@/types/languages';

const CATEGORY_KEYWORDS: Record<string, ItemCategory> = {
  'apple': 'produce', 'banana': 'produce', 'orange': 'produce', 'tomato': 'produce',
  'lettuce': 'produce', 'carrots': 'produce', 'onion': 'produce', 'potato': 'produce',
  'milk': 'dairy', 'cheese': 'dairy', 'yogurt': 'dairy', 'butter': 'dairy', 'eggs': 'dairy',
  'bread': 'pantry', 'rice': 'pantry', 'pasta': 'pantry', 'flour': 'pantry', 'sugar': 'pantry',
  'chicken': 'meat', 'beef': 'meat', 'pork': 'meat', 'fish': 'meat', 'turkey': 'meat',
  'water': 'beverages', 'juice': 'beverages', 'soda': 'beverages', 'coffee': 'beverages',
  'chips': 'snacks', 'cookies': 'snacks', 'crackers': 'snacks', 'nuts': 'snacks',
  'ice cream': 'frozen', 'frozen vegetables': 'frozen', 'frozen pizza': 'frozen',
  'soap': 'household', 'detergent': 'household', 'paper towels': 'household',
  'shampoo': 'personal-care', 'toothpaste': 'personal-care', 'deodorant': 'personal-care'
};

// Multilingual category keywords
const MULTILINGUAL_CATEGORY_KEYWORDS: Record<string, Record<string, ItemCategory>> = {
  'es': {
    'manzana': 'produce', 'plátano': 'produce', 'naranja': 'produce', 'tomate': 'produce',
    'lechuga': 'produce', 'zanahorias': 'produce', 'cebolla': 'produce', 'patata': 'produce',
    'leche': 'dairy', 'queso': 'dairy', 'yogur': 'dairy', 'mantequilla': 'dairy', 'huevos': 'dairy',
    'pan': 'pantry', 'arroz': 'pantry', 'pasta': 'pantry', 'harina': 'pantry', 'azúcar': 'pantry',
    'pollo': 'meat', 'ternera': 'meat', 'cerdo': 'meat', 'pescado': 'meat', 'pavo': 'meat',
    'agua': 'beverages', 'jugo': 'beverages', 'refresco': 'beverages', 'café': 'beverages',
    'papas': 'snacks', 'galletas': 'snacks', 'galletas saladas': 'snacks', 'nueces': 'snacks',
    'helado': 'frozen', 'verduras congeladas': 'frozen', 'pizza congelada': 'frozen',
    'jabón': 'household', 'detergente': 'household', 'toallas de papel': 'household',
    'champú': 'personal-care', 'pasta de dientes': 'personal-care', 'desodorante': 'personal-care'
  },
  'fr': {
    'pomme': 'produce', 'banane': 'produce', 'orange': 'produce', 'tomate': 'produce',
    'laitue': 'produce', 'carottes': 'produce', 'oignon': 'produce', 'pomme de terre': 'produce',
    'lait': 'dairy', 'fromage': 'dairy', 'yaourt': 'dairy', 'beurre': 'dairy', 'œufs': 'dairy',
    'pain': 'pantry', 'riz': 'pantry', 'pâtes': 'pantry', 'farine': 'pantry', 'sucre': 'pantry',
    'poulet': 'meat', 'bœuf': 'meat', 'porc': 'meat', 'poisson': 'meat', 'dinde': 'meat',
    'eau': 'beverages', 'jus': 'beverages', 'soda': 'beverages', 'café': 'beverages',
    'chips': 'snacks', 'biscuits': 'snacks', 'crackers': 'snacks', 'noix': 'snacks',
    'crème glacée': 'frozen', 'légumes surgelés': 'frozen', 'pizza surgelée': 'frozen',
    'savon': 'household', 'détergent': 'household', 'essuie-tout': 'household',
    'shampooing': 'personal-care', 'dentifrice': 'personal-care', 'déodorant': 'personal-care'
  },
  'de': {
    'apfel': 'produce', 'banane': 'produce', 'orange': 'produce', 'tomate': 'produce',
    'salat': 'produce', 'karotten': 'produce', 'zwiebel': 'produce', 'kartoffel': 'produce',
    'milch': 'dairy', 'käse': 'dairy', 'joghurt': 'dairy', 'butter': 'dairy', 'eier': 'dairy',
    'brot': 'pantry', 'reis': 'pantry', 'nudeln': 'pantry', 'mehl': 'pantry', 'zucker': 'pantry',
    'hähnchen': 'meat', 'rindfleisch': 'meat', 'schweinefleisch': 'meat', 'fisch': 'meat', 'truthahn': 'meat',
    'wasser': 'beverages', 'saft': 'beverages', 'limonade': 'beverages', 'kaffee': 'beverages',
    'chips': 'snacks', 'kekse': 'snacks', 'cracker': 'snacks', 'nüsse': 'snacks',
    'eiscreme': 'frozen', 'tiefkühlgemüse': 'frozen', 'tiefkühlpizza': 'frozen',
    'seife': 'household', 'waschmittel': 'household', 'küchenpapier': 'household',
    'shampoo': 'personal-care', 'zahnpasta': 'personal-care', 'deodorant': 'personal-care'
  }
};

const MOCK_PRODUCT_DATABASE: SearchResult[] = [
  { id: '1', name: 'Organic Apples', brand: 'Fresh Farm', size: '3 lbs', category: 'produce', priceRange: '5-10', description: 'Fresh organic red apples', matchScore: 0 },
  { id: '2', name: 'Whole Milk', brand: 'Dairy Best', size: '1 gallon', category: 'dairy', priceRange: 'under-5', description: 'Fresh whole milk', matchScore: 0 },
  { id: '3', name: 'Toothpaste', brand: 'Clean White', size: '4 oz', category: 'personal-care', priceRange: 'under-5', description: 'Whitening toothpaste with fluoride', matchScore: 0 },
  { id: '4', name: 'Premium Toothpaste', brand: 'Luxury Oral', size: '6 oz', category: 'personal-care', priceRange: '10-20', description: 'Premium whitening toothpaste', matchScore: 0 },
  { id: '5', name: 'Bread', brand: 'Baker\'s Choice', size: '1 loaf', category: 'pantry', priceRange: 'under-5', description: 'Fresh whole wheat bread', matchScore: 0 },
  { id: '6', name: 'Chicken Breast', brand: 'Farm Fresh', size: '2 lbs', category: 'meat', priceRange: '5-10', description: 'Boneless skinless chicken breast', matchScore: 0 },
];

// Validation functions
const validateQuantity = (quantity: number): boolean => {
  return quantity > 0 && quantity <= 100; // Reasonable limits
};

const validateItemName = (item: string): boolean => {
  return item.length >= 2 && item.length <= 100; // Reasonable length limits
};

const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, ''); // Basic XSS prevention
};

export const parseVoiceCommand = (transcript: string, language: LanguageConfig): VoiceCommand | null => {
  if (!transcript || typeof transcript !== 'string') {
    console.warn('Invalid transcript provided to parseVoiceCommand');
    return null;
  }

  const text = sanitizeInput(transcript.toLowerCase().trim());
  
  if (text.length < 2) {
    return null;
  }

  // Get language-specific command patterns
  const patterns = language.voiceCommands;
  
  try {
    // Create regex patterns for the current language with better escaping
    const searchPatterns = patterns.search.map(cmd => 
      new RegExp(`^(?:${cmd.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\s+(.+)$`, 'i')
    );
    
    const filterPatterns = patterns.filter.map(cmd => 
      new RegExp(`^(?:${cmd.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\s+(.+)\\s+(?:under|below|menos de|por debajo de|moins de|en dessous de|unter|weniger als|sotto|meno di|abaixo de|以下|未満|이하|미만|以下|少于)\\s+\\$?(\\d+)$`, 'i')
    );
    
    const addPatterns = patterns.add.map(cmd => 
      new RegExp(`^(?:${cmd.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\s+(.+?)(?:\\s+brand\\s+(.+?))?(?:\\s+size\\s+(.+?))?$`, 'i')
    );
    
    const removePatterns = patterns.remove.map(cmd => 
      new RegExp(`^(?:${cmd.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\s+(.+)(?:\\s+from\\s+(?:my\\s+)?list)?$`, 'i')
    );
    
    const completePatterns = patterns.complete.map(cmd => 
      new RegExp(`^(?:${cmd.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\s+(.+)\\s+as\\s+(?:done|complete|bought|hecho|completado|comprado|fini|terminé|acheté|fertig|abgeschlossen|gekauft|fatto|completato|comprato|feito|completado|comprado|完了|完了|구매|완료|구매|完成|完成|购买)$`, 'i')
    );
    
    const clearPatterns = patterns.clear.map(cmd => 
      new RegExp(`^(?:${cmd.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\s+(?:all|everything|my\\s+)?(?:list|lista|liste|liste|lista|リスト|목록|列表)?$`, 'i')
    );

    // Check for search commands
    for (const pattern of searchPatterns) {
      const match = text.match(pattern);
      if (match) {
        const searchQuery = match[1];
        if (validateItemName(searchQuery)) {
          return { action: 'search', item: '', searchQuery };
        }
      }
    }

    // Check for filter commands
    for (const pattern of filterPatterns) {
      const match = text.match(pattern);
      if (match) {
        const item = match[1];
        const priceLimit = parseInt(match[2]);
        
        if (validateItemName(item) && !isNaN(priceLimit) && priceLimit > 0) {
          const priceRange = getPriceRangeFromLimit(priceLimit);
          return { action: 'filter', item, priceRange, searchQuery: item };
        }
      }
    }

    // Check for clear commands
    for (const pattern of clearPatterns) {
      if (pattern.test(text)) {
        return { action: 'clear', item: '' };
      }
    }

    // Check for enhanced add commands
    for (const pattern of addPatterns) {
      const match = text.match(pattern);
      if (match) {
        const itemText = match[1];
        const brand = match[2] ? sanitizeInput(match[2]) : undefined;
        const size = match[3] ? sanitizeInput(match[3]) : undefined;
        
        const { item, quantity } = extractQuantityAndItem(itemText);
        
        if (validateItemName(item) && validateQuantity(quantity)) {
          const category = getCategoryForItem(item, language.code);
          
          return { action: 'add', item, quantity, category, brand, size };
        }
      }
    }

    // Check for remove commands
    for (const pattern of removePatterns) {
      const match = text.match(pattern);
      if (match) {
        const itemText = match[1];
        const { item } = extractQuantityAndItem(itemText);
        
        if (validateItemName(item)) {
          return { action: 'remove', item };
        }
      }
    }

    // Check for complete commands
    for (const pattern of completePatterns) {
      const match = text.match(pattern);
      if (match) {
        const itemText = match[1];
        const { item } = extractQuantityAndItem(itemText);
        
        if (validateItemName(item)) {
          return { action: 'complete', item };
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error parsing voice command:', error, { transcript, language: language.code });
    return null;
  }
};

const extractQuantityAndItem = (text: string): { item: string; quantity: number } => {
  if (!text || typeof text !== 'string') {
    return { item: '', quantity: 1 };
  }

  const quantityPatterns = [
    /^(\d+)\s+(.+)$/,
    /^(one|two|three|four|five|six|seven|eight|nine|ten)\s+(.+)$/i,
    /^(a|an)\s+(.+)$/i
  ];

  const numberWords: Record<string, number> = {
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    'a': 1, 'an': 1
  };

  for (const pattern of quantityPatterns) {
    const match = text.match(pattern);
    if (match) {
      const quantityText = match[1].toLowerCase();
      const item = match[2];
      
      const quantity = isNaN(Number(quantityText)) 
        ? (numberWords[quantityText] || 1)
        : Number(quantityText);
      
      return { item: sanitizeInput(item), quantity };
    }
  }

  return { item: sanitizeInput(text), quantity: 1 };
};

const getCategoryForItem = (item: string, languageCode: string = 'en'): ItemCategory => {
  if (!item || typeof item !== 'string') {
    return 'other';
  }

  const cleanItem = item.toLowerCase().trim();
  
  // First check language-specific keywords
  if (languageCode !== 'en' && MULTILINGUAL_CATEGORY_KEYWORDS[languageCode]) {
    const langKeywords = MULTILINGUAL_CATEGORY_KEYWORDS[languageCode];
    if (langKeywords[cleanItem]) {
      return langKeywords[cleanItem];
    }
  }
  
  // Fall back to English keywords
  if (CATEGORY_KEYWORDS[cleanItem]) {
    return CATEGORY_KEYWORDS[cleanItem];
  }
  
  // Try partial matches for compound words
  for (const [keyword, category] of Object.entries(CATEGORY_KEYWORDS)) {
    if (cleanItem.includes(keyword) || keyword.includes(cleanItem)) {
      return category;
    }
  }
  
  return 'other';
};

const getPriceRangeFromLimit = (limit: number): PriceRange => {
  if (limit <= 5) return 'under-5';
  if (limit <= 10) return '5-10';
  if (limit <= 20) return '10-20';
  return 'over-20';
};

export const searchProducts = async (query: string, filters?: { priceRange?: PriceRange }): Promise<SearchResult[]> => {
  if (!query || typeof query !== 'string') {
    return [];
  }

  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const searchTerm = query.toLowerCase();
    let results = MOCK_PRODUCT_DATABASE.filter(product => {
      const matchesQuery = product.name.toLowerCase().includes(searchTerm) ||
                          product.brand?.toLowerCase().includes(searchTerm) ||
                          product.description.toLowerCase().includes(searchTerm);
      
      const matchesPrice = !filters?.priceRange || product.priceRange === filters.priceRange;
      
      return matchesQuery && matchesPrice;
    });

    // Calculate match scores
    results = results.map(product => ({
      ...product,
      matchScore: calculateMatchScore(product, searchTerm)
    }));

    // Sort by match score
    results.sort((a, b) => b.matchScore - a.matchScore);

    return results.slice(0, 10); // Limit results
  } catch (error) {
    console.error('Error searching products:', error);
    throw new Error('Failed to search products');
  }
};

const calculateMatchScore = (product: SearchResult, searchTerm: string): number => {
  let score = 0;
  const term = searchTerm.toLowerCase();
  
  // Exact name match gets highest score
  if (product.name.toLowerCase() === term) score += 100;
  else if (product.name.toLowerCase().includes(term)) score += 50;
  
  // Brand match
  if (product.brand?.toLowerCase().includes(term)) score += 30;
  
  // Description match
  if (product.description.toLowerCase().includes(term)) score += 20;
  
  // Category relevance
  if (product.category === 'produce' || product.category === 'dairy') score += 10;
  
  return score;
};

export const getCategoryDisplayName = (category: ItemCategory): string => {
  const names: Record<ItemCategory, string> = {
    'produce': 'Produce',
    'dairy': 'Dairy',
    'meat': 'Meat & Seafood',
    'pantry': 'Pantry',
    'frozen': 'Frozen',
    'beverages': 'Beverages',
    'snacks': 'Snacks',
    'household': 'Household',
    'personal-care': 'Personal Care',
    'other': 'Other'
  };
  
  return names[category];
};

export const getCategoryEmoji = (category: ItemCategory): string => {
  const emojis: Record<ItemCategory, string> = {
    'produce': '🥬',
    'dairy': '🥛',
    'meat': '🥩',
    'pantry': '🥫',
    'frozen': '🧊',
    'beverages': '🥤',
    'snacks': '🍿',
    'household': '🧽',
    'personal-care': '🧴',
    'other': '📦'
  };
  
  return emojis[category];
};

export const getPriceRangeDisplay = (priceRange: PriceRange): string => {
  const displays: Record<PriceRange, string> = {
    'under-5': 'Under $5',
    '5-10': '$5 - $10',
    '10-20': '$10 - $20',
    'over-20': 'Over $20'
  };
  
  return displays[priceRange];
};