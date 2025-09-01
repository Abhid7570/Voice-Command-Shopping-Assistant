// In-memory storage for demo purposes
// In production, this would be replaced with a database
let shoppingItems = [];
let productDatabase = [
  { id: '1', name: 'Organic Apples', brand: 'Fresh Farm', size: '3 lbs', category: 'produce', priceRange: '5-10', description: 'Fresh organic red apples', matchScore: 0 },
  { id: '2', name: 'Whole Milk', brand: 'Dairy Best', size: '1 gallon', category: 'dairy', priceRange: 'under-5', description: 'Fresh whole milk', matchScore: 0 },
  { id: '3', name: 'Toothpaste', brand: 'Clean White', size: '4 oz', category: 'personal-care', priceRange: 'under-5', description: 'Whitening toothpaste with fluoride', matchScore: 0 },
  { id: '4', name: 'Premium Toothpaste', brand: 'Luxury Oral', size: '6 oz', category: 'personal-care', priceRange: '10-20', description: 'Premium whitening toothpaste', matchScore: 0 },
  { id: '5', name: 'Bread', brand: 'Baker\'s Choice', size: '1 loaf', category: 'pantry', priceRange: 'under-5', description: 'Fresh whole wheat bread', matchScore: 0 },
  { id: '6', name: 'Chicken Breast', brand: 'Farm Fresh', size: '2 lbs', category: 'meat', priceRange: '5-10', description: 'Boneless skinless chicken breast', matchScore: 0 },
];

// Get all shopping items
export const getShoppingList = async () => {
  return shoppingItems;
};

// Add new shopping item
export const addShoppingItem = async (itemData) => {
  const newItem = {
    id: Date.now().toString(),
    ...itemData,
    completed: false,
    addedAt: new Date(),
    updatedAt: new Date()
  };
  
  shoppingItems.push(newItem);
  return newItem;
};

// Update shopping item
export const updateShoppingItem = async (id, updateData) => {
  const index = shoppingItems.findIndex(item => item.id === id);
  if (index === -1) return null;
  
  shoppingItems[index] = {
    ...shoppingItems[index],
    ...updateData,
    updatedAt: new Date()
  };
  
  return shoppingItems[index];
};

// Delete shopping item
export const deleteShoppingItem = async (id) => {
  const index = shoppingItems.findIndex(item => item.id === id);
  if (index === -1) return false;
  
  shoppingItems.splice(index, 1);
  return true;
};

// Search products
export const searchProducts = async (query, filters = {}) => {
  const searchTerm = query.toLowerCase();
  let results = productDatabase.filter(product => {
    const matchesQuery = product.name.toLowerCase().includes(searchTerm) ||
                        product.brand?.toLowerCase().includes(searchTerm) ||
                        product.description.toLowerCase().includes(searchTerm);
    
    const matchesPrice = !filters.priceRange || product.priceRange === filters.priceRange;
    
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
};

// Get smart suggestions
export const getSmartSuggestions = async () => {
  // Simple algorithm for demo - in production this would use ML
  const suggestions = [];
  const categories = ['produce', 'dairy', 'meat', 'pantry'];
  
  categories.forEach(category => {
    const categoryItems = shoppingItems.filter(item => item.category === category);
    if (categoryItems.length > 0) {
      suggestions.push({
        id: `suggestion-${category}`,
        name: `${category.charAt(0).toUpperCase() + category.slice(1)} items`,
        category,
        reason: `You frequently buy ${category} items`,
        confidence: 0.8,
        brand: 'Smart Suggestion',
        priceRange: '5-10'
      });
    }
  });

  return suggestions;
};

// Clear all items
export const clearAllItems = async () => {
  shoppingItems = [];
  return true;
};

// Helper function to calculate match score
const calculateMatchScore = (product, searchTerm) => {
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
