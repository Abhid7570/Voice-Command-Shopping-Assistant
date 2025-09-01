import { useState, useEffect, useCallback, useRef } from 'react';
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
  maxRetries?: number;
}

interface RecognitionError {
  error: string;
  timestamp: number;
  retryCount: number;
}

export const useSpeechRecognition = ({
  onResult,
  onError,
  continuous = true,
  language,
  maxRetries = 3
}: UseSpeechRecognitionProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageConfig>(language);
  const [errorHistory, setErrorHistory] = useState<RecognitionError[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  
  const recognitionRef = useRef<any>(null);
  const isInitializedRef = useRef(false);

  // Create recognition instance with error handling
  const createRecognitionInstance = useCallback((lang: LanguageConfig) => {
    if (typeof window === 'undefined') return null;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    try {
      const instance = new SpeechRecognition();
      instance.continuous = continuous;
      instance.interimResults = true;
      instance.lang = lang.speechRecognitionCode;
      instance.maxAlternatives = 1;

      // Enhanced error handling
      instance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        
        const errorInfo: RecognitionError = {
          error: event.error,
          timestamp: Date.now(),
          retryCount: retryCount
        };
        
        setErrorHistory(prev => [...prev, errorInfo]);
        setIsListening(false);
        
        // Handle specific error types
        let userFriendlyError = 'Voice recognition error occurred';
        switch (event.error) {
          case 'no-speech':
            userFriendlyError = 'No speech detected. Please try speaking again.';
            break;
          case 'audio-capture':
            userFriendlyError = 'Microphone access issue. Please check your microphone permissions.';
            break;
          case 'not-allowed':
            userFriendlyError = 'Microphone access denied. Please allow microphone access and try again.';
            break;
          case 'network':
            userFriendlyError = 'Network error. Please check your internet connection.';
            break;
          case 'service-not-allowed':
            userFriendlyError = 'Speech recognition service not available.';
            break;
          case 'bad-grammar':
            userFriendlyError = 'Speech recognition grammar error.';
            break;
          case 'language-not-supported':
            userFriendlyError = `Language ${lang.name} is not supported by your browser.`;
            break;
        }
        
        onError?.(userFriendlyError);
      };

      instance.onend = () => {
        setIsListening(false);
        // Auto-restart if continuous mode and not manually stopped
        if (continuous && isInitializedRef.current) {
          setTimeout(() => {
            if (continuous && !isInitializedRef.current) {
              startListening();
            }
          }, 100);
        }
      };

      instance.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          onResult({
            transcript: result[0].transcript,
            confidence: result[0].confidence,
            isFinal: result.isFinal
          });
        }
      };

      return instance;
    } catch (error) {
      console.error('Failed to create speech recognition instance:', error);
      return null;
    }
  }, [continuous, onResult, onError, retryCount]);

  // Update recognition when language changes
  useEffect(() => {
    if (recognition && currentLanguage.code !== language.code) {
      recognition.stop();
      setIsListening(false);
      setCurrentLanguage(language);
      
      const newRecognition = createRecognitionInstance(language);
      if (newRecognition) {
        setRecognition(newRecognition);
        recognitionRef.current = newRecognition;
      }
    }
  }, [language, recognition, createRecognitionInstance]);

  // Initialize recognition
  useEffect(() => {
    const instance = createRecognitionInstance(language);
    if (instance) {
      setIsSupported(true);
      setRecognition(instance);
      recognitionRef.current = instance;
      setCurrentLanguage(language);
      isInitializedRef.current = true;
    } else {
      setIsSupported(false);
      onError?.('Speech recognition not supported in this browser');
    }
  }, [createRecognitionInstance, language, onError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.warn('Error stopping recognition on cleanup:', error);
        }
      }
    };
  }, []);

  const startListening = useCallback(async () => {
    if (!recognitionRef.current || isListening) return;

    try {
      // Reset retry count on successful start
      setRetryCount(0);
      await recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      
      // Implement retry logic
      if (retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          startListening();
        }, 1000 * (retryCount + 1)); // Exponential backoff
      } else {
        onError?.('Failed to start voice recognition after multiple attempts');
      }
    }
  }, [isListening, retryCount, maxRetries, onError]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return;

    try {
      recognitionRef.current.stop();
      setIsListening(false);
      isInitializedRef.current = false;
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  }, [isListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const resetRecognition = useCallback(() => {
    stopListening();
    setRetryCount(0);
    setErrorHistory([]);
    
    const newInstance = createRecognitionInstance(currentLanguage);
    if (newInstance) {
      setRecognition(newInstance);
      recognitionRef.current = newInstance;
      isInitializedRef.current = true;
    }
  }, [stopListening, createRecognitionInstance, currentLanguage]);

  return {
    isListening,
    isSupported,
    currentLanguage,
    startListening,
    stopListening,
    toggleListening,
    resetRecognition,
    errorHistory,
    retryCount,
    maxRetries
  };
};