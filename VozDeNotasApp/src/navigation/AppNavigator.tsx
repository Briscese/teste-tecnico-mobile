import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import RecordingScreen from '../screens/RecordingScreen';

export type RootStackParamList = {
  Home: { refresh?: boolean } | undefined;
  Recording: undefined; // A tela Recording também não
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1C1C1E', // Cor de fundo do cabeçalho
        },
        headerTintColor: '#FFFFFF', // Cor do texto e ícones do cabeçalho
        headerTitleStyle: {
          fontWeight: 'bold',
        }, // Não mostra o texto de "voltar" no iOS
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Notas de Voz' }}
      />
      <Stack.Screen
        name="Recording"
        component={RecordingScreen}
        options={{ title: 'Gravando...' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;

