import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { LanguageConfig, SUPPORTED_LANGUAGES } from '@/types/languages';

interface LanguageSelectorProps {
  currentLanguage: LanguageConfig;
  onLanguageChange: (language: LanguageConfig) => void;
}

export const LanguageSelector = ({ currentLanguage, onLanguageChange }: LanguageSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageSelect = (language: LanguageConfig) => {
    onLanguageChange(language);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 min-w-[140px] justify-between"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{currentLanguage.name}</span>
        <span className="sm:hidden">{currentLanguage.code.toUpperCase()}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <Card className="absolute top-full left-0 mt-2 w-64 max-h-80 overflow-y-auto z-50 shadow-lg border-2">
          <div className="p-2">
            <div className="text-sm font-medium text-muted-foreground px-2 py-1 mb-2">
              Select Language
            </div>
            {SUPPORTED_LANGUAGES.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language)}
                className={`w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors flex items-center justify-between ${
                  currentLanguage.code === language.code ? 'bg-accent' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {language.code.toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{language.name}</div>
                    <div className="text-xs text-muted-foreground">{language.nativeName}</div>
                  </div>
                </div>
                {currentLanguage.code === language.code && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
