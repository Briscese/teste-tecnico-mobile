import { useState, useEffect } from 'react';
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';

export const useTranscription = () => {
  const [isListening, setIsListening] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const onSpeechStart = () => setIsListening(true);
    const onSpeechEnd = () => setIsListening(false);
    const onSpeechError = (e: SpeechErrorEvent) => setError(JSON.stringify(e.error));
    const onSpeechResults = (e: SpeechResultsEvent) => setResults(e.value || []);

    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    try {
      setResults([]);
      setError('');
      await Voice.start('pt-BR');
    } catch (e) {
      console.error("Erro ao iniciar a transcrição:", e);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error("Erro ao parar a transcrição:", e);
    }
  };

  return {
    isListening,
    results,
    error,
    startListening,
    stopListening,
  };
};