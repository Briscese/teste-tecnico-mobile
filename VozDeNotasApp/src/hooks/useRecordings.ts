import { useState, useCallback, useRef } from 'react';
import RNFS from 'react-native-fs';
import { useFocusEffect } from '@react-navigation/native';
import { audioService } from '../services/AudioService'; // Importa o serviço

export interface Recording {
  name: string;
  path: string;
}

export const useRecordings = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [nowPlaying, setNowPlaying] = useState<string | null>(null);

  const recordingsDir = `${RNFS.DocumentDirectoryPath}/recordings`;

  const loadRecordings = useCallback(async () => {
    try {
      await RNFS.mkdir(recordingsDir).catch(e => console.log('Diretório já existe'));
      const files = await RNFS.readDir(recordingsDir);
      const audioFiles = files
        .filter(file => file.isFile() && file.name.endsWith('.mp4'))
        .map(file => ({ name: file.name, path: file.path }))
        .sort((a, b) => b.name.localeCompare(a.name));
      setRecordings(audioFiles);
    } catch (error) {
      console.error('Falha ao carregar as gravações', error);
    }
  }, [recordingsDir]);

  useFocusEffect(useCallback(() => {
    loadRecordings();
  }, [loadRecordings]));

  const playRecording = async (path: string) => {
    if (nowPlaying) {
      await audioService.stopPlayer();
      audioService.removePlayBackListener();
      if (nowPlaying === path) {
        setNowPlaying(null);
        return;
      }
    }

    try {
      await audioService.startPlayer(path);
      setNowPlaying(path);
      audioService.addPlayBackListener((e) => {
        if (e.currentPosition >= e.duration - 100) { // Pequena margem para o final
          audioService.stopPlayer();
          audioService.removePlayBackListener();
          setNowPlaying(null);
        }
      });
    } catch (err) {
      console.error('Falha ao reproduzir o áudio', err);
      setNowPlaying(null);
    }
  };

  const deleteRecording = async (path: string) => {
    try {
      if (nowPlaying === path) {
        await audioService.stopPlayer();
        audioService.removePlayBackListener();
        setNowPlaying(null);
      }
      await RNFS.unlink(path);
      loadRecordings();
    } catch (error) {
      console.error('Falha ao deletar o arquivo', error);
    }
  };

  return {
    recordings,
    nowPlaying,
    playRecording,
    deleteRecording,
  };
};