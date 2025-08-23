import { useState, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import RNFS from 'react-native-fs';
import { useFocusEffect } from '@react-navigation/native';
import { audioService } from '../services/AudioService';

export interface Recording {
  name: string; // Nome da pasta
  path: string; // Caminho da pasta
  date: Date;
  duration: number;
}

export const useRecordings = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [nowPlaying, setNowPlaying] = useState<string | null>(null);
  const playbackController = useRef({ isPlaying: false });
  // Ref para garantir que a verificação de arquivos incompletos rode apenas uma vez
  const hasCheckedForIncompleteRef = useRef(false);

  const recordingsDir = `${RNFS.DocumentDirectoryPath}/recordings`;
  const tempDir = RNFS.TemporaryDirectoryPath;

  // Função para carregar as gravações finalizadas da pasta permanente
  const loadRecordings = useCallback(async () => {
    try {
      await RNFS.mkdir(recordingsDir).catch(e => console.log('Diretório já existe'));
      const items = await RNFS.readDir(recordingsDir);
      
      const audioFolders = items
        .filter(item => item.isDirectory() && item.name.startsWith('voice_note_'))
        .map(folder => {
            const parts = folder.name.split('_');
            if (parts.length < 4) return null;
            const timestamp = parseInt(parts[2], 10);
            const duration = parseInt(parts[3], 10);
            if (isNaN(timestamp) || isNaN(duration)) return null;
            return { name: folder.name, path: folder.path, date: new Date(timestamp), duration };
        })
        .filter((item): item is Recording => item !== null)
        .sort((a, b) => b.date.getTime() - a.date.getTime());

      setRecordings(audioFolders);
    } catch (error) {
      console.error('Falha ao carregar as gravações', error);
    }
  }, [recordingsDir]);

  // Função para recuperar uma gravação interrompida
  const recoverRecording = async (sessionPath: string) => {
    try {
      const chunks = await RNFS.readDir(sessionPath);
      const lastChunkIndex = chunks.length;
      // Aproxima a duração com base no número de blocos
      const approxDuration = lastChunkIndex * 5000; 
      
      const timestampMatch = sessionPath.match(/recording_(\d+)/);
      if (!timestampMatch) return;

      const timestamp = timestampMatch[1];
      const finalFolderName = `voice_note_${timestamp}_${approxDuration}`;
      const finalFolderPath = `${recordingsDir}/${finalFolderName}`;
      
      await RNFS.moveFile(sessionPath, finalFolderPath);
      console.log("Gravação recuperada:", finalFolderPath);
      loadRecordings(); // Recarrega a lista para mostrar a gravação recuperada
    } catch (error) {
      console.error("Falha ao recuperar gravação", error);
    }
  };

  // Função para descartar uma gravação interrompida
  const discardRecording = async (sessionPath: string) => {
    await RNFS.unlink(sessionPath).catch(err => console.error("Falha ao descartar gravação", err));
  };

  // Função que verifica a pasta temporária por gravações "órfãs"
  const checkForIncompleteRecordings = useCallback(async () => {
    try {
        const tempItems = await RNFS.readDir(tempDir);
        const incompleteSessions = tempItems.filter(
            item => item.isDirectory() && item.name.startsWith('recording_')
        );

        if (incompleteSessions.length > 0) {
            // Pega a primeira sessão incompleta encontrada
            const sessionToRecover = incompleteSessions[0]; 
            Alert.alert(
                "Gravação Incompleta",
                "Encontramos uma gravação que não foi finalizada. Deseja recuperá-la?",
                [
                    { text: "Descartar", style: "destructive", onPress: () => discardRecording(sessionToRecover.path) },
                    { text: "Recuperar", style: "default", onPress: () => recoverRecording(sessionToRecover.path) }
                ]
            );
        }
    } catch (error) {
        console.error("Falha ao verificar gravações incompletas", error);
    }
  }, [tempDir]);

  // Roda toda vez que a tela ganha foco
  useFocusEffect(useCallback(() => {
    loadRecordings();
    // Roda a verificação de recuperação apenas na primeira vez que o app é carregado
    if (!hasCheckedForIncompleteRef.current) {
        checkForIncompleteRecordings();
        hasCheckedForIncompleteRef.current = true;
    }
  }, [loadRecordings, checkForIncompleteRecordings]));

  // Função para tocar os blocos de uma gravação em sequência
  const playRecording = async (folderPath: string) => {
    if (playbackController.current.isPlaying) {
      await audioService.stopPlayer();
      audioService.removePlayBackListener();
      playbackController.current.isPlaying = false;
      if (nowPlaying === folderPath) {
        setNowPlaying(null);
        return;
      }
    }

    try {
      const chunks = await RNFS.readDir(folderPath);
      const sortedChunks = chunks
        .filter(c => c.isFile())
        .sort((a, b) => {
            const numA = parseInt(a.name.split('_')[1].split('.')[0], 10);
            const numB = parseInt(b.name.split('_')[1].split('.')[0], 10);
            return numA - numB;
        });

      if (sortedChunks.length === 0) return;

      setNowPlaying(folderPath);
      playbackController.current.isPlaying = true;

      const playChunk = async (index: number) => {
        if (index >= sortedChunks.length || !playbackController.current.isPlaying) {
          setNowPlaying(null);
          playbackController.current.isPlaying = false;
          return;
        }
        
        const chunkPath = sortedChunks[index].path;
        await audioService.startPlayer(chunkPath);
        
        audioService.addPlayBackListener((e) => {
          if (e.currentPosition >= e.duration - 50) { // Pequena margem
            audioService.removePlayBackListener();
            playChunk(index + 1); // Toca o próximo bloco
          }
        });
      };

      playChunk(0); // Começa a tocar o primeiro bloco

    } catch (err) {
      console.error('Falha ao reproduzir a gravação', err);
      setNowPlaying(null);
    }
  };

  // Função para deletar uma pasta de gravação inteira
  const deleteRecording = async (folderPath: string) => {
    try {
      if (nowPlaying === folderPath) {
        await audioService.stopPlayer();
        audioService.removePlayBackListener();
        setNowPlaying(null);
        playbackController.current.isPlaying = false;
      }
      await RNFS.unlink(folderPath); // Deleta a pasta inteira
      loadRecordings();
    } catch (error) {
      console.error('Falha ao deletar a gravação', error);
    }
  };

  return {
    recordings,
    nowPlaying,
    playRecording,
    deleteRecording,
  };
};