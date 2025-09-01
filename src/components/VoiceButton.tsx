import { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UIText } from '@/utils/translations';

interface VoiceButtonProps {
  isListening: boolean;
  isSupported: boolean;
  onToggle: () => void;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  translations: UIText;
  disabled?: boolean;
  className?: string;
}

export const VoiceButton = ({ 
  isListening, 
  isSupported, 
  onToggle,
  size = 'default',
  translations,
  disabled = false,
  className = ''
}: VoiceButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle loading state when starting/stopping
  useEffect(() => {
    if (isListening !== isPressed) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        setIsPressed(isListening);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isListening, isPressed]);

  // Handle button press for better UX
  const handlePress = () => {
    if (disabled || !isSupported) return;
    
    setIsPressed(true);
    onToggle();
  };

  const handleRelease = () => {
    if (disabled || !isSupported) return;
    setIsPressed(false);
  };

  // Keyboard accessibility
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handlePress();
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleRelease();
    }
  };

  if (!isSupported) {
    return (
      <Button 
        variant="outline" 
        size={size} 
        disabled 
        className={`opacity-60 cursor-not-allowed ${className}`}
        aria-label={translations.notSupported}
        title={translations.notSupported}
      >
        <MicOff className="h-4 w-4" />
        {size !== 'icon' && translations.notSupported}
      </Button>
    );
  }

  const getButtonVariant = () => {
    if (disabled) return 'outline';
    if (isListening) return 'voice-active';
    return 'voice';
  };

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {size !== 'icon' && (isListening ? translations.listening : translations.startVoice)}
        </>
      );
    }

    if (isListening) {
      return (
        <>
          <Volume2 className="h-4 w-4" />
          {size !== 'icon' && translations.listening}
        </>
      );
    }

    return (
      <>
        <Mic className="h-4 w-4" />
        {size !== 'icon' && translations.startVoice}
      </>
    );
  };

  const getButtonClasses = () => {
    const baseClasses = className;
    const stateClasses = isListening ? 'voice-pulse shadow-voice-active' : '';
    const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed' : '';
    
    return `${baseClasses} ${stateClasses} ${disabledClasses}`.trim();
  };

  return (
    <Button
      variant={getButtonVariant()}
      size={size}
      onClick={handlePress}
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      onMouseLeave={handleRelease}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      disabled={disabled}
      className={getButtonClasses()}
      aria-label={isListening ? translations.listening : translations.startVoice}
      aria-pressed={isListening}
      aria-busy={isLoading}
      role="button"
      tabIndex={disabled ? -1 : 0}
      title={isListening ? translations.listening : translations.startVoice}
    >
      {getButtonContent()}
    </Button>
  );
};