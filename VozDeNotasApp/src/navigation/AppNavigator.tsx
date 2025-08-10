import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import RecordingScreen from '../screens/RecordingScreen';
//import TranscriptionScreen from '../screens/TranscriptionScreen'; // Importar nova tela

export type RootStackParamList = {
  Home: { refresh?: boolean } | undefined;
  Recording: undefined;
  //Transcription: undefined; // Adicionar nova rota
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1C1C1E' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: 'bold' },
      }}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Notas de Voz' }} />
      <Stack.Screen name="Recording" component={RecordingScreen} options={{ title: 'Gravando...' }} />
      
      
    </Stack.Navigator>
  );
};

export default AppNavigator;