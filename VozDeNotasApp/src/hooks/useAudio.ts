import { useState, useRef } from 'react';
import {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';
import { requestAudioPermission } from '../utils/permissions';
import RNFS from 'react-native-fs';
import { audioService } from '../services/AudioService';

export const useAudio = () => {

  const [isRecording, setIsRecording] = useState(false);
  
  const [recordTime, setRecordTime] = useState('00:00:00');

  
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null); // Guarda o ID do timer de 5 segundos
  const sessionPathRef = useRef(''); // Guarda o caminho da pasta temporária da gravação atual
  const chunkCounterRef = useRef(0); // Conta quantos blocos de 5s foram gravados
  const recordingStartTimeRef = useRef(0); // Guarda o momento em que a gravação começou

  const startRecording = async (): Promise<void> => {
    
    const hasPermission = await requestAudioPermission();
    if (!hasPermission) return;

    // Cria uma pasta temporária única para esta sessão de gravação
    const timestamp = new Date().getTime();
    sessionPathRef.current = `${RNFS.TemporaryDirectoryPath}/recording_${timestamp}`;
    await RNFS.mkdir(sessionPathRef.current);

  
    setIsRecording(true);
    chunkCounterRef.current = 0;
    recordingStartTimeRef.current = Date.now();

    // Inicia o cronômetro que atualiza a UI a cada 100ms
    const timerInterval = setInterval(() => {
      const elapsed = Date.now() - recordingStartTimeRef.current;
      setRecordTime(audioService.mmssss(Math.floor(elapsed)));
    }, 100);

    // Define a função que grava um único bloco de áudio
    const recordNextChunk = async () => {
      chunkCounterRef.current++;
      const chunkPath = `${sessionPathRef.current}/chunk_${chunkCounterRef.current}.mp4`;
      const audioSet = {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        OutputFormatAndroid: OutputFormatAndroidType.MPEG_4,
      };
      try {
        await audioService.startRecorder(chunkPath, audioSet);
        console.log(`Gravando bloco ${chunkCounterRef.current}...`);
      } catch (error) {
        console.error(`Falha ao gravar o bloco ${chunkCounterRef.current}`, error);
      }
    };
    
    // Inicia a gravação do primeiro bloco imediatamente
    recordNextChunk();

    // A cada 5 segundos, para a gravação do bloco atual e inicia a do próximo
    // Esta é a implementação do salvamento em blocos.
    recordingIntervalRef.current = setInterval(async () => {
      await audioService.stopRecorder();
      recordNextChunk();
    }, 5000);

    // Guarda a referência do timer da UI para poder limpá-lo depois
    (recordingIntervalRef.current as any).uiTimer = timerInterval;
  };

  const stopRecording = async (): Promise<string | undefined> => {
    if (!recordingIntervalRef.current) return;

    // Para todos os timers e a gravação do último bloco
    clearInterval(recordingIntervalRef.current);
    clearInterval((recordingIntervalRef.current as any).uiTimer);
    recordingIntervalRef.current = null;
    await audioService.stopRecorder();

    // Reseta os estados da UI
    setIsRecording(false);
    setRecordTime('00:00:00');

    // Define o nome e o caminho da pasta final da gravação
    const finalTimestamp = recordingStartTimeRef.current; // Usa o timestamp do início
    const finalDuration = Date.now() - recordingStartTimeRef.current;
    const finalFolderName = `voice_note_${finalTimestamp}_${finalDuration}`;
    const finalFolderPath = `${RNFS.DocumentDirectoryPath}/recordings/${finalFolderName}`;
    
    try {
      // Move a pasta temporária (com todos os blocos) para a pasta permanente de gravações
      await RNFS.moveFile(sessionPathRef.current, finalFolderPath);
      console.log('Gravação finalizada e movida para:', finalFolderPath);
      return finalFolderPath;
    } catch (error) {
      console.error("Falha ao mover a pasta da sessão", error);
      // Se a movimentação falhar, limpa a pasta temporária para não deixar lixo
      await RNFS.unlink(sessionPathRef.current).catch(() => {});
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