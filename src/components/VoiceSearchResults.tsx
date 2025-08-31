import { Search, X, Plus, Tag, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchResult } from '@/types/shopping';
import { getCategoryEmoji, getPriceRangeDisplay } from '@/utils/voiceCommands';

interface VoiceSearchResultsProps {
  results: SearchResult[];
  onAddItem: (result: SearchResult) => void;
  onClearSearch: () => void;
  searchQuery?: string;
  isSearching?: boolean;
}

export const VoiceSearchResults = ({ 
  results, 
  onAddItem, 
  onClearSearch, 
  searchQuery,
  isSearching = false 
}: VoiceSearchResultsProps) => {
  if (!searchQuery && results.length === 0) return null;

  return (
    <Card className="p-4 card-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            {isSearching ? 'Searching...' : 'Search Results'}
          </h3>
          {searchQuery && (
            <Badge variant="outline" className="text-xs">
              "{searchQuery}"
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClearSearch}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {isSearching ? (
        <div className="flex items-center justify-center p-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
            Finding products...
          </div>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-3">
          {results.map(result => (
            <div
              key={result.id}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 transition-smooth"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-lg">{getCategoryEmoji(result.category)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground truncate">
                      {result.name}
                    </h4>
                    {result.brand && (
                      <Badge variant="secondary" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {result.brand}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {result.size && (
                      <span className="text-xs text-muted-foreground">
                        {result.size}
                      </span>
                    )}
                    {result.priceRange && (
                      <Badge variant="outline" className="text-xs">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {getPriceRangeDisplay(result.priceRange)}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {result.description}
                  </p>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => onAddItem(result)}
                className="h-8 w-8 flex-shrink-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-6 text-muted-foreground">
          <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No products found matching your search</p>
          <p className="text-sm mt-1">Try a different search term or brand name</p>
        </div>
      )}
    </Card>
  );
};