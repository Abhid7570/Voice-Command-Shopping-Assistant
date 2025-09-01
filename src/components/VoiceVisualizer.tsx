import { useEffect, useRef } from 'react';
import { UIText } from '@/utils/translations';

interface VoiceVisualizerProps {
  isListening: boolean;
  transcript?: string;
  translations: UIText;
  confidence?: number;
}

export const VoiceVisualizer = ({ 
  isListening, 
  transcript, 
  translations,
  confidence
}: VoiceVisualizerProps) => {
  const transcriptRef = useRef<HTMLDivElement>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcript to bottom when new content arrives
  useEffect(() => {
    if (transcriptRef.current && transcript) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  // Announce transcript changes to screen readers
  useEffect(() => {
    if (liveRegionRef.current && transcript && isListening) {
      liveRegionRef.current.textContent = transcript;
    }
  }, [transcript, isListening]);

  // Generate wave animation data
  const generateWaveData = () => {
    const waves = 5;
    const baseHeight = 8;
    const maxHeight = 32;
    
    return Array.from({ length: waves }, (_, i) => {
      const height = isListening 
        ? baseHeight + Math.sin(Date.now() * 0.01 + i * 0.5) * (maxHeight - baseHeight) * 0.5
        : baseHeight;
      
      return {
        height: Math.max(baseHeight, Math.min(maxHeight, height)),
        delay: i * 0.1
      };
    });
  };

  const waveData = generateWaveData();

  return (
    <div 
      className="flex flex-col items-center space-y-4 p-6 bg-voice-background rounded-xl border border-voice-active/20"
      role="region"
      aria-label="Voice recognition status"
    >
      {/* Hidden live region for screen readers */}
      <div
        ref={liveRegionRef}
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />
      
      {/* Voice Wave Animation */}
      <div 
        className="flex items-end justify-center space-x-1 h-12"
        role="img"
        aria-label={isListening ? "Voice waves indicating active listening" : "Voice waves in idle state"}
      >
        {waveData.map((wave, i) => (
          <div
            key={i}
            className={`bg-voice-active rounded-full transition-all duration-300 ${
              isListening ? 'voice-wave' : ''
            }`}
            style={{
              width: '4px',
              height: `${wave.height}px`,
              animationDelay: `${wave.delay}s`
            }}
            aria-hidden="true"
          />
        ))}
      </div>
      
      {/* Status Text */}
      <div className="text-center">
        {isListening ? (
          <div className="space-y-2">
            <p 
              className="text-voice-active font-semibold"
              aria-live="polite"
            >
              {translations.listeningStatus}
            </p>
            
            {transcript && (
              <div className="max-w-md">
                <p className="text-sm text-muted-foreground mb-1">
                  {translations.youSaid}:
                </p>
                <div
                  ref={transcriptRef}
                  className="text-foreground bg-card p-3 rounded-lg border italic max-h-32 overflow-y-auto"
                  role="log"
                  aria-label="Voice transcript"
                >
                  "{transcript}"
                </div>
                
                {/* Confidence indicator */}
                {confidence !== undefined && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    <span>Confidence: </span>
                    <span className={`font-medium ${
                      confidence > 0.8 ? 'text-green-600' :
                      confidence > 0.6 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {Math.round(confidence * 100)}%
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <p 
            className="text-muted-foreground"
            aria-live="polite"
          >
            {translations.clickMicrophone}
          </p>
        )}
      </div>

      {/* Additional accessibility information */}
      <div className="sr-only">
        {isListening 
          ? `Voice recognition is active. ${transcript ? `You said: ${transcript}` : 'Listening for voice input...'}`
          : 'Voice recognition is inactive. Click the microphone button to start.'
        }
      </div>
    </div>
  );
};