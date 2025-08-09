import React from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import Button from '../../components/common/Button';
import { useRecordings, Recording } from '../../hooks/useRecordings';
import styles from './styles';

// Formata milissegundos para o formato mm:ss
const formatDuration = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

// Formata a data para um formato amigável, ex: "09/08/2025 11:30"
const formatDate = (date: Date) => {
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { recordings, nowPlaying, playRecording, deleteRecording } = useRecordings();

  const handleNavigateToRecording = () => {
    navigation.navigate('Recording');
  };

  const confirmDelete = (path: string) => {
    Alert.alert(
      "Excluir Gravação",
      "Você tem certeza que deseja excluir esta nota de voz?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => deleteRecording(path) }
      ]
    );
  };

  const renderNote = ({ item }: { item: Recording }) => {
    const isPlaying = nowPlaying === item.path;
    return (
      <View style={styles.noteItem}>
        <TouchableOpacity style={styles.notePlayButton} onPress={() => playRecording(item.path)}>
          <Text style={styles.playIcon}>{isPlaying ? '❚❚' : '▶'}</Text>
          <View style={styles.noteDetails}>
            <Text style={styles.noteDurationText}>{formatDuration(item.duration)}</Text>
            <Text style={styles.noteDateText}>{formatDate(item.date)}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => confirmDelete(item.path)}>
          <Text style={styles.deleteIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={recordings}
        renderItem={renderNote}
        keyExtractor={(item) => item.path}
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhuma nota de voz gravada.</Text>
            </View>
        }
        contentContainerStyle={recordings.length === 0 ? { flex: 1 } : {}}
      />
      <View style={styles.buttonContainer}>
        <Button title="Nova Gravação" onPress={handleNavigateToRecording} />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;