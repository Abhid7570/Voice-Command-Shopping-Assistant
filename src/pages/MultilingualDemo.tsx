import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/LanguageSelector';
import { VoiceButton } from '@/components/VoiceButton';
import { VoiceVisualizer } from '@/components/VoiceVisualizer';
import { useLanguage } from '@/hooks/useLanguage';
import { getTranslationForLanguage } from '@/utils/translations';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { parseVoiceCommand } from '@/utils/voiceCommands';
import { Globe, Mic, Languages, CheckCircle, AlertCircle } from 'lucide-react';

export const MultilingualDemo = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState('');
  const [commandResult, setCommandResult] = useState<string>('');
  const [isCommandSuccess, setIsCommandSuccess] = useState<boolean | null>(null);

  const translations = getTranslationForLanguage(currentLanguage);

  const handleVoiceResult = (result: { transcript: string; confidence: number; isFinal: boolean }) => {
    if (result.isFinal) {
      const command = parseVoiceCommand(result.transcript, currentLanguage);
      setLastCommand(result.transcript);
      
      if (command) {
        setCommandResult(`Command recognized: ${command.action} - ${command.item || command.searchQuery || 'N/A'}`);
        setIsCommandSuccess(true);
      } else {
        setCommandResult('Command not recognized. Try using the language-specific commands below.');
        setIsCommandSuccess(false);
      }
      setCurrentTranscript('');
    } else {
      setCurrentTranscript(result.transcript);
    }
  };

  const handleVoiceError = (error: string) => {
    setCommandResult(`Error: ${error}`);
    setIsCommandSuccess(false);
  };

  const {
    isListening,
    isSupported,
    toggleListening
  } = useSpeechRecognition({
    onResult: handleVoiceResult,
    onError: handleVoiceError,
    continuous: true,
    language: currentLanguage
  });

  const handleLanguageChange = (newLanguage: any) => {
    changeLanguage(newLanguage);
    setCommandResult('');
    setIsCommandSuccess(null);
    setLastCommand('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Globe className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Multilingual Voice Commands Demo
            </h1>
            <Languages className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience voice-controlled shopping in multiple languages. Switch languages and try voice commands in your preferred language.
          </p>
        </div>

        {/* Language Selection */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Select Your Language</h2>
              <p className="text-gray-600">
                Choose your preferred language for voice commands
              </p>
            </div>
            <LanguageSelector
              currentLanguage={currentLanguage}
              onLanguageChange={handleLanguageChange}
            />
          </div>
        </Card>

        {/* Current Language Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">{currentLanguage.name}</div>
            <div className="text-sm text-gray-600">Language</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">{currentLanguage.nativeName}</div>
            <div className="text-sm text-gray-600">Native Name</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">{currentLanguage.speechRecognitionCode}</div>
            <div className="text-sm text-gray-600">Speech Code</div>
          </Card>
        </div>

        {/* Voice Control Section */}
        <Card className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Voice Input */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Voice Input</h3>
                <VoiceButton
                  isListening={isListening}
                  isSupported={isSupported}
                  onToggle={toggleListening}
                  size="lg"
                  translations={translations}
                />
              </div>
              
              <VoiceVisualizer
                isListening={isListening}
                transcript={currentTranscript}
                translations={translations}
              />
            </div>

            {/* Command Results */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Command Results</h3>
              
              {lastCommand && (
                <Card className="p-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Mic className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Last Command:</span>
                  </div>
                  <p className="text-gray-900 italic">"{lastCommand}"</p>
                </Card>
              )}

              {commandResult && (
                <Card className={`p-4 ${isCommandSuccess ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {isCommandSuccess ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm font-medium text-gray-700">Result:</span>
                  </div>
                  <p className={isCommandSuccess ? 'text-green-800' : 'text-red-800'}>
                    {commandResult}
                  </p>
                </Card>
              )}

              {!lastCommand && !commandResult && (
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <div className="text-center text-blue-800">
                    <p className="text-sm">Start speaking to see command results here</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </Card>

        {/* Language-Specific Commands */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
            Voice Commands in {currentLanguage.name}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Adding Items
              </h4>
              <div className="space-y-2">
                {translations.examples.add.map((example, index) => (
                  <div key={index} className="text-sm bg-gray-50 p-2 rounded border">
                    "{example}"
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Searching
              </h4>
              <div className="space-y-2">
                {translations.examples.search.map((example, index) => (
                  <div key={index} className="text-sm bg-gray-50 p-2 rounded border">
                    "{example}"
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Managing
              </h4>
              <div className="space-y-2">
                {translations.examples.manage.map((example, index) => (
                  <div key={index} className="text-sm bg-gray-50 p-2 rounded border">
                    "{example}"
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Supported Languages */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
            Supported Languages
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh'].map((langCode) => {
              const lang = langCode === 'en' ? 'English' : 
                          langCode === 'es' ? 'Spanish' :
                          langCode === 'fr' ? 'French' :
                          langCode === 'de' ? 'German' :
                          langCode === 'it' ? 'Italian' :
                          langCode === 'pt' ? 'Portuguese' :
                          langCode === 'ja' ? 'Japanese' :
                          langCode === 'ko' ? 'Korean' : 'Chinese';
              
              return (
                <Button
                  key={langCode}
                  variant={currentLanguage.code === langCode ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    const newLang = { code: langCode, name: lang, nativeName: lang, speechRecognitionCode: `${langCode}-${langCode.toUpperCase()}`, voiceCommands: { add: [], search: [], remove: [], complete: [], clear: [], filter: [] } };
                    handleLanguageChange(newLang);
                  }}
                  className="justify-center"
                >
                  {langCode.toUpperCase()}
                </Button>
              );
            })}
          </div>
        </Card>

        {/* Instructions */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Use</h3>
          <div className="space-y-2 text-blue-800 text-sm">
            <p>1. <strong>Select your language</strong> using the language selector above</p>
            <p>2. <strong>Click the microphone button</strong> to start voice recognition</p>
            <p>3. <strong>Speak a command</strong> in your selected language</p>
            <p>4. <strong>View the results</strong> to see if your command was recognized</p>
            <p>5. <strong>Try different languages</strong> to experience multilingual voice control</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
