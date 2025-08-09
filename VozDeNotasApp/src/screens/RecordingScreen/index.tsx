import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useAudio } from '../../hooks/useAudio';
import { useNavigation } from '@react-navigation/native';
import styles from './styles'; 
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type RecordingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Recording'>;

const RecordingScreen = () => {
  const { isRecording, recordTime, startRecording, stopRecording } = useAudio();
  const navigation = useNavigation<RecordingScreenNavigationProp>();

  const handleToggleRecording = async () => {
    if (isRecording) {
      const audioPath = await stopRecording();
      if (audioPath) {
        console.log(`Áudio salvo em: ${audioPath}`);
        navigation.navigate('Home'); 
      }
    } else {
      await startRecording();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{recordTime}</Text>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.recordButton} onPress={handleToggleRecording}>
          <View style={isRecording ? styles.recordIconStop : styles.recordIconStart} />
        </TouchableOpacity>
      </View>

      <View style={styles.footerContainer}>
        <Text style={styles.instructions}>
            {isRecording ? 'Pressione para parar' : 'Pressione para gravar'}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default RecordingScreen;