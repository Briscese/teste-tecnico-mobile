import { useState, useRef } from 'react';
import {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';
import { requestAudioPermission } from '../utils/permissions';
import RNFS from 'react-native-fs';
import { audioService } from '../services/AudioService';

export const useAudio = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState('00:00:00');
  const pathRef = useRef('');
  const chunkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const durationRef = useRef(0); // Para guardar a duração em ms

  const startRecording = async (): Promise<void> => {
    const hasPermission = await requestAudioPermission();
    if (!hasPermission) return;

    const timestamp = new Date().getTime();
    // O nome do arquivo agora é temporário, sem a duração
    const fileName = `voice_note_${timestamp}.mp4`;
    const recordingsDir = `${RNFS.DocumentDirectoryPath}/recordings`;
    await RNFS.mkdir(recordingsDir).catch(e => console.log('Diretório já existe'));
    pathRef.current = `${recordingsDir}/${fileName}`;
    durationRef.current = 0; // Reseta a duração

    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      OutputFormatAndroid: OutputFormatAndroidType.MPEG_4,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
    };

    try {
      const result = await audioService.startRecorder(pathRef.current, audioSet);
      setIsRecording(true);
      console.log('Gravação iniciada:', result);

      audioService.addRecordBackListener((e) => {
        setRecordTime(audioService.mmssss(Math.floor(e.currentPosition)));
        durationRef.current = e.currentPosition; // Atualiza a duração em ms
      });

      chunkIntervalRef.current = setInterval(async () => {
        try {
            const stats = await RNFS.stat(pathRef.current);
            console.log(`[STREAMING SIM] Bloco salvo. Tamanho atual: ${stats.size} bytes.`);
        } catch (error) {
            console.log('[STREAMING SIM] Aguardando criação do arquivo...');
        }
      }, 5000);

    } catch (error) {
      console.error('Falha ao iniciar a gravação', error);
    }
  };

  const stopRecording = async (): Promise<string | undefined> => {
    try {
      if (chunkIntervalRef.current) {
        clearInterval(chunkIntervalRef.current);
        chunkIntervalRef.current = null;
      }

      const oldPath = pathRef.current;
      const finalDurationMs = Math.round(durationRef.current);

      await audioService.stopRecorder();
      audioService.removeRecordBackListener();
      setIsRecording(false);
      setRecordTime('00:00:00');
      
      const timestampMatch = oldPath.match(/voice_note_(\d+)\.mp4/);
      if (!timestampMatch) {
          console.error("Não foi possível extrair o timestamp do nome do arquivo:", oldPath);
          return oldPath; // Retorna o caminho antigo como fallback
      }
      const timestamp = timestampMatch[1];
      
      const newFileName = `voice_note_${timestamp}_${finalDurationMs}.mp4`;
      const newPath = `${RNFS.DocumentDirectoryPath}/recordings/${newFileName}`;
      
      await RNFS.moveFile(oldPath, newPath);
      console.log('Gravação finalizada e renomeada para:', newPath);

      return newPath;
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