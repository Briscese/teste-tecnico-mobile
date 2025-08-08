import { useState, useRef, useEffect } from 'react';
import { Recorder } from '@react-native-community/audio-toolkit';
import { requestAudioPermission } from '../utils/permissions';
import RNFS from 'react-native-fs';

export const useAudio = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState('00:00');
  
  const recorderRef = useRef<Recorder | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Limpa o gravador ao desmontar o componente
    return () => {
      if (recorderRef.current) {
        recorderRef.current.destroy();
      }
    };
  }, []);

  const startTimer = () => {
    const startTime = Date.now();
    timerIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const minutes = Math.floor(elapsed / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      setRecordTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setRecordTime('00:00');
  };

  const startRecording = async (): Promise<void> => {
    const hasPermission = await requestAudioPermission();
    if (!hasPermission) {
      return;
    }

    const fileName = `voice_note_${new Date().getTime()}.aac`;

    if (recorderRef.current) {
        recorderRef.current.destroy();
    }

    // CORREÇÃO: Removemos o objeto de opções para usar as configurações padrão
    // e evitar o erro de tipagem.
    recorderRef.current = new Recorder(fileName);

    try {
      await recorderRef.current.prepare();
      await recorderRef.current.record();
      setIsRecording(true);
      startTimer();
      console.log('Gravação iniciada com o arquivo:', fileName);
    } catch (error) {
      console.error('Falha ao iniciar a gravação', error);
    }
  };

  const stopRecording = async (): Promise<string | undefined> => {
    if (!recorderRef.current) {
        return undefined;
    }

    try {
      await recorderRef.current.stop();
      setIsRecording(false);
      stopTimer();
      
      const recordingPath = recorderRef.current.fsPath;
      console.log('Gravação finalizada, arquivo em:', recordingPath);

      const fileExists = await RNFS.exists(recordingPath);
      if (fileExists) {
        console.log('VERIFICAÇÃO SUCESSO: O arquivo foi salvo corretamente.');
      } else {
        console.error('VERIFICAÇÃO FALHOU: O arquivo não foi encontrado.');
        return undefined;
      }

      recorderRef.current.destroy();
      recorderRef.current = null;
      
      return recordingPath;
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