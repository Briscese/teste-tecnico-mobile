import React from 'react';
import { View, Text, SafeAreaView, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import Button from '../../components/common/Button';
import styles from './styles';

// Dados de exemplo. No futuro, virão do armazenamento do celular.
const MOCK_NOTES = [
  { id: '1', title: 'Gravação 001', duration: '0:35' },
  { id: '2', title: 'Ideia para o projeto', duration: '1:12' },
  { id: '3', title: 'Lembrete reunião', duration: '0:15' },
];

// Tipando o hook de navegação para ter autocomplete e segurança de tipos
type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleNavigateToRecording = () => {
    navigation.navigate('Recording');
  };

  const renderNote = ({ item }: { item: typeof MOCK_NOTES[0] }) => (
    <View style={styles.noteItem}>
      <Text style={styles.noteTitle}>{item.title}</Text>
      <Text style={styles.noteDuration}>{item.duration}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={MOCK_NOTES}
        renderItem={renderNote}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhuma nota de voz gravada.</Text>
            </View>
        }
      />
      <View style={styles.buttonContainer}>
        <Button title="Nova Gravação" onPress={handleNavigateToRecording} />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;