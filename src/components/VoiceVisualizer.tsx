import { UIText } from '@/utils/translations';

interface VoiceVisualizerProps {
  isListening: boolean;
  transcript?: string;
  translations: UIText;
}

export const VoiceVisualizer = ({ isListening, transcript, translations }: VoiceVisualizerProps) => {
  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-voice-background rounded-xl border border-voice-active/20">
      {/* Voice Wave Animation */}
      <div className="flex items-end justify-center space-x-1 h-12">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`bg-voice-active rounded-full transition-all duration-300 ${
              isListening ? 'voice-wave' : ''
            }`}
            style={{
              width: '4px',
              height: isListening ? `${20 + (i % 3) * 15}px` : '8px',
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
      </div>
      
      {/* Status Text */}
      <div className="text-center">
        {isListening ? (
          <div className="space-y-2">
            <p className="text-voice-active font-semibold">{translations.listeningStatus}</p>
            {transcript && (
              <div className="max-w-md">
                <p className="text-sm text-muted-foreground mb-1">{translations.youSaid}</p>
                <p className="text-foreground bg-card p-3 rounded-lg border italic">
                  "{transcript}"
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground">
            {translations.clickMicrophone}
          </p>
        )}
      </div>
    </div>
  );
};