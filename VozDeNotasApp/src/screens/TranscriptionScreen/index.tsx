import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useTranscription } from '../../hooks/useTranscription';
import styles from './styles';

const TranscriptionScreen = () => {
  const { isListening, results, error, startListening, stopListening } = useTranscription();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Transcrição ao Vivo</Text>
      <ScrollView style={styles.resultsContainer}>
        {results.map((result, index) => (
          <Text key={`result-${index}`} style={styles.resultText}>
            {result}
          </Text>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[styles.micButton, isListening && styles.micButtonActive]}
        onPress={isListening ? stopListening : startListening}
      >
        <Text style={styles.micIcon}>🎤</Text>
      </TouchableOpacity>

      <Text style={styles.statusText}>
        {isListening ? 'Ouvindo...' : 'Pressione o microfone para começar'}
      </Text>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </SafeAreaView>
  );
};

export default TranscriptionScreen;