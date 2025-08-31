import { useState, useEffect, useCallback } from 'react';
import { LanguageConfig } from '@/types/languages';

// Extend Window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

interface UseSpeechRecognitionProps {
  onResult: (result: SpeechRecognitionResult) => void;
  onError?: (error: string) => void;
  continuous?: boolean;
  language: LanguageConfig;
}

export const useSpeechRecognition = ({
  onResult,
  onError,
  continuous = true,
  language
}: UseSpeechRecognitionProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageConfig>(language);

  // Update recognition when language changes
  useEffect(() => {
    if (recognition && currentLanguage.code !== language.code) {
      recognition.stop();
      setIsListening(false);
      setCurrentLanguage(language);
      
      // Recreate recognition with new language
      if (typeof window !== 'undefined') {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (SpeechRecognition) {
          const newRecognition = new SpeechRecognition();
          newRecognition.continuous = continuous;
          newRecognition.interimResults = true;
          newRecognition.lang = language.speechRecognitionCode;
          
          newRecognition.onresult = (event: any) => {
            for (let i = event.resultIndex; i < event.results.length; i++) {
              const result = event.results[i];
              onResult({
                transcript: result[0].transcript,
                confidence: result[0].confidence,
                isFinal: result.isFinal
              });
            }
          };
          
          newRecognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            onError?.(event.error);
            setIsListening(false);
          };
          
          newRecognition.onend = () => {
            setIsListening(false);
          };
          
          setRecognition(newRecognition);
        }
      }
    }
  }, [language, recognition, continuous, onResult, onError]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        setIsSupported(true);
        
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = continuous;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = language.speechRecognitionCode;
        
        recognitionInstance.onresult = (event: any) => {
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            onResult({
              transcript: result[0].transcript,
              confidence: result[0].confidence,
              isFinal: result.isFinal
            });
          }
        };
        
        recognitionInstance.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          onError?.(event.error);
          setIsListening(false);
        };
        
        recognitionInstance.onend = () => {
          setIsListening(false);
        };
        
        setRecognition(recognitionInstance);
        setCurrentLanguage(language);
      } else {
        setIsSupported(false);
        onError?.('Speech recognition not supported in this browser');
      }
    }
  }, [onResult, onError, continuous, language]);

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        onError?.('Failed to start voice recognition');
      }
    }
  }, [recognition, isListening, onError]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      try {
        recognition.stop();
        setIsListening(false);
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  }, [recognition, isListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    isSupported,
    currentLanguage,
    startListening,
    stopListening,
    toggleListening
  };
};