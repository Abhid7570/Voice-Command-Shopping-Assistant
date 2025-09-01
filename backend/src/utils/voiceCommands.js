// Voice command parsing utility for backend
const CATEGORY_KEYWORDS = {
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

// Validation functions
const validateQuantity = (quantity) => {
  return quantity > 0 && quantity <= 100;
};

const validateItemName = (item) => {
  return item.length >= 2 && item.length <= 100;
};

const sanitizeInput = (input) => {
  return input.trim().replace(/[<>]/g, '');
};

export const parseVoiceCommand = (transcript, language) => {
  if (!transcript || typeof transcript !== 'string') {
    return null;
  }

  const text = sanitizeInput(transcript.toLowerCase().trim());
  
  if (text.length < 2) {
    return null;
  }

  try {
    // Get language-specific command patterns
    const patterns = language.voiceCommands || {
      add: ['add', 'i need', 'buy', 'get', 'pick up', 'put', 'include'],
      search: ['find', 'search for', 'look for', 'show me'],
      remove: ['remove', 'delete', 'take off', 'cross off', 'mark off'],
      complete: ['mark', 'check', 'got', 'bought', 'found'],
      clear: ['clear', 'delete', 'remove', 'start over', 'start fresh'],
      filter: ['filter', 'show', 'find', 'under', 'below']
    };
    
    // Create regex patterns with proper escaping
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

const extractQuantityAndItem = (text) => {
  if (!text || typeof text !== 'string') {
    return { item: '', quantity: 1 };
  }

  const quantityPatterns = [
    /^(\d+)\s+(.+)$/,
    /^(one|two|three|four|five|six|seven|eight|nine|ten)\s+(.+)$/i,
    /^(a|an)\s+(.+)$/i
  ];

  const numberWords = {
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

const getCategoryForItem = (item, languageCode = 'en') => {
  if (!item || typeof item !== 'string') {
    return 'other';
  }

  const cleanItem = item.toLowerCase().trim();
  
  // Check English keywords
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

const getPriceRangeFromLimit = (limit) => {
  if (limit <= 5) return 'under-5';
  if (limit <= 10) return '5-10';
  if (limit <= 20) return '10-20';
  return 'over-20';
};
