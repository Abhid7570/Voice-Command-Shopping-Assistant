import { useState, useCallback, useEffect, useMemo } from 'react';
import { VoiceButton } from '@/components/VoiceButton';
import { VoiceVisualizer } from '@/components/VoiceVisualizer';
import { VoiceSearchResults } from '@/components/VoiceSearchResults';
import { CategorySection } from '@/components/CategorySection';
import { SmartSuggestions } from '@/components/SmartSuggestions';
import { ShoppingStats } from '@/components/ShoppingStats';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useLanguage } from '@/hooks/useLanguage';
import { parseVoiceCommand, searchProducts } from '@/utils/voiceCommands';
import { generateSmartSuggestions } from '@/utils/smartSuggestions';
import { getTranslationForLanguage } from '@/utils/translations';
import { ShoppingItem, ItemCategory, SmartSuggestion, SearchResult, VoiceCommand } from '@/types/shopping';
import { LanguageConfig } from '@/types/languages';
import { useToast } from '@/hooks/use-toast';
import { Trash2, RefreshCw, Mic, ShoppingCart, Search, Sparkles, Plus, Globe, AlertCircle } from 'lucide-react';

export const VoiceShoppingAssistant = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');
  const [lastCommand, setLastCommand] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  
  const { currentLanguage, changeLanguage, isLoading: isLanguageLoading } = useLanguage();
  const { toast } = useToast();

  // Get translations for current language
  const translations = useMemo(() => 
    getTranslationForLanguage(currentLanguage), 
    [currentLanguage]
  );

  // Update suggestions when items change
  useEffect(() => {
    const newSuggestions = generateSmartSuggestions(items);
    setSuggestions(newSuggestions);
  }, [items]);

  // Group items by category with memoization
  const itemsByCategory = useMemo(() => {
    return items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<ItemCategory, ShoppingItem[]>);
  }, [items]);

  const categories: ItemCategory[] = [
    'produce', 'dairy', 'meat', 'pantry', 'frozen', 
    'beverages', 'snacks', 'household', 'personal-care', 'other'
  ];

  const handleVoiceResult = useCallback((result: { transcript: string; confidence: number; isFinal: boolean }) => {
    if (result.isFinal) {
      const command = parseVoiceCommand(result.transcript, currentLanguage);
      setLastCommand(result.transcript);
      setLastError(null); // Clear previous errors
      
      if (command) {
        executeCommand(command).catch(error => {
          console.error('Command execution error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          setLastError(errorMessage);
          toast({
            title: translations.commandFailed,
            description: errorMessage,
            variant: "destructive"
          });
        });
        setCurrentTranscript('');
      } else {
        const errorMsg = `Command not recognized: "${result.transcript}"`;
        setLastError(errorMsg);
        toast({
          title: translations.commandNotRecognized,
          description: `Try '${translations.examples.add[0]}', '${translations.examples.search[0]}', or '${translations.examples.manage[0]}'`,
          variant: "destructive"
        });
      }
    } else {
      setCurrentTranscript(result.transcript);
    }
  }, [currentLanguage, toast, translations]);

  const handleVoiceError = useCallback((error: string) => {
    setLastError(error);
    toast({
      title: translations.voiceRecognitionError,
      description: error,
      variant: "destructive"
    });
  }, [toast, translations]);

  const {
    isListening,
    isSupported,
    toggleListening,
    resetRecognition,
    errorHistory,
    retryCount,
    maxRetries
  } = useSpeechRecognition({
    onResult: handleVoiceResult,
    onError: handleVoiceError,
    continuous: true,
    language: currentLanguage,
    maxRetries: 3
  });

  const handleLanguageChange = (newLanguage: LanguageConfig) => {
    changeLanguage(newLanguage);
    // The speech recognition hook will automatically update when the language changes
  };

  const executeCommand = async (command: VoiceCommand) => {
    try {
      switch (command.action) {
        case 'add': {
          const newItem: ShoppingItem = {
            id: Date.now().toString(),
            name: command.item,
            quantity: command.quantity || 1,
            category: command.category || 'other',
            completed: false,
            brand: command.brand,
            size: command.size,
            addedAt: new Date()
          };
          setItems(prev => [...prev, newItem]);
          toast({
            title: "Item added",
            description: `Added ${command.quantity || 1} ${command.item} to your list`,
          });
          break;
        }

        case 'remove':
          setItems(prev => prev.filter(item => 
            !item.name.toLowerCase().includes(command.item.toLowerCase())
          ));
          toast({
            title: "Item removed",
            description: `Removed ${command.item} from your list`,
          });
          break;

        case 'complete':
          setItems(prev => prev.map(item => 
            item.name.toLowerCase().includes(command.item.toLowerCase())
              ? { ...item, completed: !item.completed }
              : item
          ));
          toast({
            title: "Item updated",
            description: `Updated ${command.item} status`,
          });
          break;

        case 'search':
          if (command.searchQuery) {
            setIsSearching(true);
            setCurrentSearchQuery(command.searchQuery);
            try {
              const results = await searchProducts(command.searchQuery);
              setSearchResults(results);
            } catch (error) {
              console.error('Search error:', error);
              throw new Error('Unable to search for products');
            } finally {
              setIsSearching(false);
            }
          }
          break;

        case 'filter':
          if (command.searchQuery) {
            setIsSearching(true);
            setCurrentSearchQuery(command.searchQuery);
            try {
              const results = await searchProducts(command.searchQuery, { priceRange: command.priceRange });
              setSearchResults(results);
            } catch (error) {
              console.error('Filter error:', error);
              throw new Error('Unable to filter products');
            } finally {
              setIsSearching(false);
            }
          }
          break;

        case 'clear':
          setItems([]);
          toast({
            title: "List cleared",
            description: "All items removed from your list",
          });
          break;

        default:
          throw new Error(`Unknown command action: ${command.action}`);
      }
    } catch (error) {
      console.error('Command execution failed:', error);
      throw error;
    }
  };

  // Helper functions
  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const toggleComplete = (id: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const addItemFromSearch = (result: SearchResult) => {
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: result.name,
      quantity: 1,
      category: result.category,
      completed: false,
      brand: result.brand,
      size: result.size,
      addedAt: new Date()
    };
    setItems(prev => [...prev, newItem]);
  };

  const clearSearch = () => {
    setSearchResults([]);
    setCurrentSearchQuery('');
    setIsSearching(false);
  };

  const addSuggestion = (suggestion: SmartSuggestion) => {
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: suggestion.name,
      quantity: 1,
      category: suggestion.category,
      completed: false,
      brand: suggestion.brand,
      addedAt: new Date()
    };
    setItems(prev => [...prev, newItem]);
  };

  const refreshSuggestions = () => {
    const newSuggestions = generateSmartSuggestions(items);
    setSuggestions(newSuggestions);
  };

  const clearAllItems = () => {
    setItems([]);
    toast({
      title: "List cleared",
      description: "All items have been removed from your list",
    });
  };

  const handleRetryRecognition = () => {
    resetRecognition();
    setLastError(null);
    toast({
      title: "Voice recognition reset",
      description: "Voice recognition has been reset. Please try again.",
    });
  };

  // Show loading state while language is being initialized
  if (isLanguageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading language preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Language Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Voice Cart Wizard
            </h1>
            <p className="text-gray-600">
              Your multilingual voice-controlled shopping assistant
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Globe className="h-4 w-4" />
              <span>Language:</span>
            </div>
            <LanguageSelector
              currentLanguage={currentLanguage}
              onLanguageChange={handleLanguageChange}
            />
          </div>
        </div>

        {/* Error Display */}
        {lastError && (
          <Card className="p-4 border-red-200 bg-red-50">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-medium text-red-800 mb-1">Voice Command Error</h3>
                <p className="text-sm text-red-700 mb-2">{lastError}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRetryRecognition}
                    className="text-red-700 border-red-300 hover:bg-red-100"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset Recognition
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setLastError(null)}
                    className="text-red-700 border-red-300 hover:bg-red-100"
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Voice Control Section */}
        <Card className="p-6 card-shadow">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Voice Button and Visualizer */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-center">
                <VoiceButton
                  isListening={isListening}
                  isSupported={isSupported}
                  onToggle={toggleListening}
                  size="lg"
                  translations={translations}
                  disabled={!isSupported || errorHistory.length >= maxRetries}
                />
              </div>
              
              <VoiceVisualizer
                isListening={isListening}
                transcript={currentTranscript}
                translations={translations}
                confidence={lastCommand ? 0.85 : undefined} // Mock confidence for demo
              />
            </div>

            {/* Current Language Info */}
            <div className="lg:w-64 space-y-4">
              <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Current Language
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Language:</span>
                    <Badge variant="secondary">{currentLanguage.name}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Native:</span>
                    <span className="text-sm font-medium">{currentLanguage.nativeName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Code:</span>
                    <Badge variant="outline">{currentLanguage.speechRecognitionCode}</Badge>
                  </div>
                </div>
              </Card>

              {/* Language-specific Voice Commands Help */}
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  {translations.voiceCommands}
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1 flex items-center gap-1">
                      <Plus className="h-3 w-3" /> {translations.addingItems}
                    </h4>
                    <ul className="space-y-1 text-gray-600 text-xs">
                      {translations.examples.add.map((example, index) => (
                        <li key={index}>• "{example}"</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1 flex items-center gap-1">
                      <Search className="h-3 w-3" /> {translations.searchingFiltering}
                    </h4>
                    <ul className="space-y-1 text-gray-600 text-xs">
                      {translations.examples.search.map((example, index) => (
                        <li key={index}>• "{example}"</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">{translations.managingList}</h4>
                    <ul className="space-y-1 text-gray-600 text-xs">
                      {translations.examples.manage.map((example, index) => (
                        <li key={index}>• "{example}"</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Card>

        {/* Shopping Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3 card-shadow text-center">
            <div className="text-2xl font-bold text-primary">{items.length}</div>
            <div className="text-xs text-muted-foreground">Total Items</div>
          </Card>
          <Card className="p-3 card-shadow text-center">
            <div className="text-2xl font-bold text-success">{items.filter(item => item.completed).length}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </Card>
        </div>

        {/* Smart Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Smart Suggestions</h3>
              <Button
                variant="outline"
                onClick={refreshSuggestions}
                className="flex items-center gap-2 text-sm"
                size="sm"
              >
                <Sparkles className="h-4 w-4" />
                Refresh
              </Button>
              {items.length > 0 && (
                <Button
                  variant="outline"
                  onClick={clearAllItems}
                  className="flex items-center gap-2 text-sm text-destructive"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </Button>
              )}
            </div>
            
            <SmartSuggestions
              suggestions={suggestions}
              onAddSuggestion={addSuggestion}
            />
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <VoiceSearchResults
            results={searchResults}
            onAddItem={addItemFromSearch}
            onClearSearch={clearSearch}
            searchQuery={currentSearchQuery}
            isSearching={isSearching}
          />
        )}

        {/* Shopping List by Categories */}
        {items.length > 0 ? (
          <div className="space-y-4">
            {categories.map(category => (
              <CategorySection
                key={category}
                category={category}
                items={itemsByCategory[category] || []}
                onToggleComplete={toggleComplete}
                onRemove={removeItem}
              />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center card-shadow">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Start with your voice
                </h3>
                <p className="text-muted-foreground text-sm">
                  Say "Add milk", "Find organic apples", or "Show toothpaste under $5"
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Voice Commands Help - Collapsible */}
        <details className="group">
          <summary className="cursor-pointer">
            <Card className="p-3 card-shadow group-open:mb-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-foreground">{translations.voiceCommands}</h3>
                <span className="text-xs text-muted-foreground group-open:hidden">{translations.tapToExpand}</span>
              </div>
            </Card>
          </summary>
          
          <Card className="p-4 card-shadow">
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-foreground mb-2 flex items-center gap-1">
                  <Plus className="h-3 w-3" /> {translations.addingItems}
                </h4>
                <ul className="space-y-1 text-muted-foreground text-xs">
                  {translations.examples.add.map((example, index) => (
                    <li key={index}>• "{example}"</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-2 flex items-center gap-1">
                  <Search className="h-3 w-3" /> {translations.searchingFiltering}
                </h4>
                <ul className="space-y-1 text-muted-foreground text-xs">
                  {translations.examples.search.map((example, index) => (
                    <li key={index}>• "{example}"</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-2">{translations.managingList}</h4>
                <ul className="space-y-1 text-muted-foreground text-xs">
                  {translations.examples.manage.map((example, index) => (
                    <li key={index}>• "{example}"</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </details>
      </div>
    </div>
  );
};