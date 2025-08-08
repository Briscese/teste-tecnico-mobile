import { PermissionsAndroid, Platform } from 'react-native';

export const requestAudioPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Permissão para Usar o Microfone',
          message: 'Este aplicativo precisa de acesso ao seu microfone para gravar notas de voz.',
          buttonPositive: 'OK',
          buttonNegative: 'Cancelar',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permissão de áudio concedida');
        return true;
      } else {
        console.log('Permissão de áudio negada');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};