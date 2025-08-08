import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RecordingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela de Gravação</Text>
      <Text style={styles.subtext}>Em breve, um gravador aqui!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
    },
    text: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtext: {
        color: '#8E8E93',
        fontSize: 16,
        marginTop: 10,
    }
});

export default RecordingScreen;