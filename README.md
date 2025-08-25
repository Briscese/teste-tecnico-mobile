# App de Notas de Voz

Este é um aplicativo móvel desenvolvido em **React Native (CLI)** que permite ao usuário gravar, gerenciar e reproduzir notas de voz.  
O projeto foi desenvolvido como parte de um teste técnico, com foco no uso de funcionalidades nativas do Android, sem a necessidade de um backend.

## 📌 Funcionalidades Implementadas

- **Gravação de Áudio**: O usuário pode iniciar e parar a gravação de áudio através de uma interface simples.
- **Armazenamento Local**: Todas as notas de voz são salvas localmente no armazenamento interno do dispositivo.
- **Listagem e Reprodução**: A tela inicial exibe uma lista de todas as gravações, mostrando a duração, data e hora de cada uma. O usuário pode reproduzir qualquer áudio diretamente da lista.
- **Exclusão de Notas**: É possível excluir gravações de forma individual.
- **Simulação de Streaming**: Durante a gravação, o aplicativo cria uma pasta temporaria para a gravação atual, e se for interrompida a gravação fica gravada para quando o usuario abrir o aplicativo novamente e queira recuprerar o audio e envia para uma parte de gravações definitivas, se ele parar a gravação pelo botão de parar, a gravação vai direto para a pasta definitivas. (São gravados blocos de 5 em 5 segundos)

## 🛠 Tecnologias e Bibliotecas Principais

- **React Native (CLI)**: Estrutura principal para o desenvolvimento do aplicativo.
- **TypeScript**: Para tipagem estática e um desenvolvimento mais seguro.
- **React Navigation**: Para o gerenciamento da navegação entre as telas.
- **react-native-audio-recorder-player**: Biblioteca principal utilizada para a gravação e reprodução de áudio.
- **react-native-fs**: Para o gerenciamento de arquivos e diretórios no armazenamento do dispositivo.

## 📂 Estrutura do Projeto

```
src/
├── assets/         # Fontes e imagens
├── components/     # Componentes reutilizáveis (ex: Botão)
├── hooks/          # Hooks customizados para a lógica de negócio (useAudio, useRecordings)
├── navigation/     # Configuração da navegação
├── screens/        # Telas da aplicação
├── services/       # Serviços compartilhados (ex: AudioService)
└── types/          # Definições de tipos do TypeScript
```

## 📋 Pré-requisitos

- Node.js (versão >= 18)
- JDK 17
- Ambiente de desenvolvimento Android configurado (Android Studio, SDK, etc.)
- Um emulador Android ou um dispositivo físico

## 🚀 Como Rodar o Projeto

1. **Clone o repositório**
   ```bash
   git clone https://github.com/Briscese/teste-tecnico-mobile.git
   cd VozDeNotasApp
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Inicie o servidor Metro**
   ```bash
   npm start
   ```

4. **Execute o aplicativo no Android**
   ```bash
   npm run android
   ```

   > 💡 **Solução de problemas**:  
   > Se o comando acima falhar ao abrir o app (um bug conhecido do CLI), use:
   > ```bash
   > npx react-native run-android --main-activity='.MainActivity'
   > ```

## 🧪 Ambiente de Teste

- **IDE**: Android Studio Narwhal Feature Drop | 2025.1.2
- **Emulador**: Pixel 4 (API 35)
- **Dispositivo Físico**: Samsung Galaxy A55

## 📦 APK para Instalação

Um arquivo APK de teste está disponível para instalação direta em um dispositivo Android.

- **[Link para Download](https://drive.google.com/file/d/1AW32brWXput3zjSKYD4WvEMs3kgGdjjC/view?usp=sharing)**: VozDeNotasApp APK via Google Drive

> **Observação**: Pode ser necessário habilitar a opção *"Instalar apps de fontes desconhecidas"* nas configurações de segurança do seu Android.

> **Observação**: Como é um APK de teste, deve estar ligado por cabo no celular para funcionar.
