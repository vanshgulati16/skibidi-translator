'use client';
import React, { useState, useRef, useEffect } from 'react';
import { 
  Volume2, 
  Copy, 
  Mic,  
  RefreshCcw, 
  Loader2,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from 'next/link';
import MemeDisplay from './MemeDisplay';

const Translator = () => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [translationMode, setTranslationMode] = useState('toSkibidi');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showMeme, setShowMeme] = useState(false);

  const translateText = async (text, mode) => {
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, mode }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      return data.translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return 'Translation error occurred';
    }
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      inputRef.current?.focus();
      return;
    }

    setIsLoading(true);
    try {
      const translated = await translateText(inputText, translationMode);
      setTranslatedText(translated);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (translatedText) {
      const utterance = new SpeechSynthesisUtterance(translatedText);
      
      // Add event handlers for speech start and end
      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    // Set listening state to true when starting
    setIsListening(true);

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please allow microphone access to use voice input.');
      } else {
        alert('Speech recognition error. Please try again.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    // Start recognition
    try {
      recognition.start();
    } catch (error) {
      console.error('Speech recognition start error:', error);
      setIsListening(false);
    }
  };

  const clearInput = () => {
    setInputText('');
    setTranslatedText('');
    inputRef.current?.focus();
  };

  useEffect(() => {
    // Load voices when component mounts
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };

    loadVoices();
    
    // Some browsers need this event to load voices
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
        window.speechSynthesis.cancel(); // Stop any ongoing speech
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white p-4">
      <main className="max-w-4xl mx-auto pt-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span>→</span>
          <span>Translators</span>
        </div>

        {/* Title Section */}
        <div className="flex flex-col items-center text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Brainrot Language Translator</h1>
          <p className="text-gray-600">Translate from Normal Language into Brainrot Language</p>
        </div>

        <Card className="w-full border rounded-xl shadow-sm overflow-hidden">
          <CardContent className="p-0">
            {/* Mode Selector - Updated Design */}
            <div className="flex justify-center p-4 bg-gray-50 border-b">
              <div className="inline-flex rounded-lg p-1 bg-white border shadow-sm">
                <button
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                    translationMode === 'toSkibidi'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setTranslationMode('toSkibidi')}
                >
                  Normal → Brainrot
                </button>
                <button
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                    translationMode === 'fromSkibidi'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setTranslationMode('fromSkibidi')}
                >
                  Brainrot → Normal
                </button>
              </div>
            </div>

            {/* Translation Areas */}
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
              {/* Input Area */}
              <div className="relative p-6">
                <textarea
                  ref={inputRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    translationMode === 'toSkibidi'
                      ? "Enter text to translate..."
                      : "Enter brainrot text to translate..."
                  }
                  className="w-full h-[200px] resize-none border-0 bg-transparent focus:outline-none text-lg placeholder:text-gray-400"
                />
                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearInput}
                    className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  >
                    <RefreshCcw className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleVoiceInput}
                    disabled={isListening}
                    className={`h-8 w-8 relative transition-all duration-200
                      ${isListening 
                        ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <Mic className={`w-4 h-4 ${isListening ? 'animate-pulse' : ''}`} />
                    {isListening && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                    )}
                  </Button>
                </div>
              </div>

              {/* Output Area */}
              <div className="relative p-6 bg-gray-50">
                {translatedText && (
                  <div className="mb-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowMeme(!showMeme)}
                      className="w-full"
                    >
                      {showMeme ? 'Hide Meme' : 'Show as Meme'}
                    </Button>
                    {showMeme && (
                      <MemeDisplay
                        text={translatedText}
                        originalText={inputText}
                      />
                    )}
                  </div>
                )}
                <div className="h-[200px] overflow-auto">
                  {isLoading ? (
                    <div className="h-full flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <p className="text-lg whitespace-pre-wrap text-gray-700">
                      {translatedText}
                    </p>
                  )}
                </div>
                {translatedText && (
                  <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleSpeak}
                      className={`h-8 w-8 transition-all duration-200 ${
                        isSpeaking 
                          ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigator.clipboard.writeText(translatedText)}
                      className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Translate Button */}
            <div className="p-4 border-t bg-gray-50">
              <Button
                onClick={handleTranslate}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                disabled={isLoading || !inputText.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Translating...
                  </>
                ) : (
                  'Translate'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Translator;