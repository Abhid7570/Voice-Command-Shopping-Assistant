import { Mic, MicOff, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UIText } from '@/utils/translations';

interface VoiceButtonProps {
  isListening: boolean;
  isSupported: boolean;
  onToggle: () => void;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  translations: UIText;
}

export const VoiceButton = ({ 
  isListening, 
  isSupported, 
  onToggle,
  size = 'default',
  translations
}: VoiceButtonProps) => {
  if (!isSupported) {
    return (
      <Button variant="outline" size={size} disabled>
        <MicOff className="h-4 w-4" />
        {translations.notSupported}
      </Button>
    );
  }

  return (
    <Button
      variant={isListening ? "voice-active" : "voice"}
      size={size}
      onClick={onToggle}
      className={isListening ? "voice-pulse" : ""}
    >
      {isListening ? (
        <>
          <Volume2 className="h-4 w-4" />
          {translations.listening}
        </>
      ) : (
        <>
          <Mic className="h-4 w-4" />
          {translations.startVoice}
        </>
      )}
    </Button>
  );
};