import { Plus, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SmartSuggestion } from '@/types/shopping';
import { getCategoryEmoji } from '@/utils/voiceCommands';

interface SmartSuggestionsProps {
  suggestions: SmartSuggestion[];
  onAddSuggestion: (suggestion: SmartSuggestion) => void;
}

export const SmartSuggestions = ({ suggestions, onAddSuggestion }: SmartSuggestionsProps) => {
  if (suggestions.length === 0) return null;

  return (
    <Card className="p-4 card-shadow">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-5 w-5 text-accent" />
        <h3 className="text-lg font-semibold text-foreground">Smart Suggestions</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {suggestions.map(suggestion => (
          <div
            key={suggestion.id}
            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/50 hover:bg-muted transition-smooth"
          >
            <div className="flex items-center gap-2 flex-1">
              <span className="text-sm">{getCategoryEmoji(suggestion.category)}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground truncate">
                  {suggestion.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {suggestion.reason}
                </p>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => onAddSuggestion(suggestion)}
              className="h-7 w-7 flex-shrink-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};