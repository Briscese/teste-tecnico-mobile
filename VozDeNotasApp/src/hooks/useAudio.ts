import { useState, useRef } from 'react';
import {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';
import { requestAudioPermission } from '../utils/permissions';
import RNFS from 'react-native-fs';
import { audioService } from '../services/AudioService'; // Importa o serviço

export const useAudio = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState('00:00:00');
  const pathRef = useRef('');

  const startRecording = async (): Promise<void> => {
    const hasPermission = await requestAudioPermission();
    if (!hasPermission) return;

    const timestamp = new Date().getTime();
    const fileName = `voice_note_${timestamp}.mp4`;
    const recordingsDir = `${RNFS.DocumentDirectoryPath}/recordings`;
    await RNFS.mkdir(recordingsDir).catch(e => console.log('Diretório já existe'));
    pathRef.current = `${recordingsDir}/${fileName}`;

    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      OutputFormatAndroid: OutputFormatAndroidType.MPEG_4,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
    };

    try {
      // Usa o serviço compartilhado
      const result = await audioService.startRecorder(pathRef.current, audioSet);
      setIsRecording(true);
      console.log('Gravação iniciada:', result);

      audioService.addRecordBackListener((e) => {
        setRecordTime(audioService.mmssss(Math.floor(e.currentPosition)));
      });
    } catch (error) {
      console.error('Falha ao iniciar a gravação', error);
    }
  };

  const stopRecording = async (): Promise<string | undefined> => {
    try {
      // Usa o serviço compartilhado
      const result = await audioService.stopRecorder();
      audioService.removeRecordBackListener();
      setIsRecording(false);
      setRecordTime('00:00:00');
      console.log('Gravação finalizada:', result);
      return result;
    } catch (error) {
      console.error('Falha ao parar a gravação', error);
      return undefined;
    }
  };

  return {
    isRecording,
    recordTime,
    startRecording,
    stopRecording,
  };
};