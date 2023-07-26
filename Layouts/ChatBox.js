import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import Voice from '@react-native-voice/voice';

const ChatScreen = () => {
  // Estados del componente
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [isMessageMode, setIsMessageMode] = useState(true);
  const flatListRef = useRef();
  
  useEffect(() => {
    // Configurar el evento de reconocimiento de voz al montar el componente
    Voice.onSpeechResults = onSpeechResults;
    return () => {
      // Limpiar el evento al desmontar el componente
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startRecording = async () => {
    // Iniciar el reconocimiento de voz
    try {
      await Voice.start('es'); // Iniciar el reconocimiento de voz en español
      setIsRecording(true);
      setRecognizedText('');
      setIsMessageMode(false);
    } catch (error) {
      console.error('Error al iniciar el reconocimiento de voz:', error);
    }
  };

  const stopRecording = async () => {
    // Detener el reconocimiento de voz
    try {
      await Voice.stop();
      setIsRecording(false);
      setIsMessageMode(true);
    } catch (error) {
      console.error('Error al detener el reconocimiento de voz:', error);
    }
  };

  const onSpeechResults = (event) => {
    // Obtener el texto reconocido del resultado del reconocimiento de voz
    const recognizedText = event.value[0];
    setMessage(recognizedText);
  };

  const sendMessage = () => {
    // Enviar un nuevo mensaje
    if (message.trim().length > 0) {
      const newMessage = { text: message, isSent: true };
      setMessages((prevMessages) => [newMessage, ...prevMessages]);
      setMessage('');
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  };

  const renderMicButton = () => {
    // Renderizar el botón del micrófono
    return (
      <TouchableOpacity style={styles.sendButton} onPress={handleMicButtonPress}>
        <Ionicons name="mic" size={24} color="white" />
      </TouchableOpacity>
    );
  };

  const renderSendButton = () => {
    // Renderizar el botón de envío de mensaje
    return (
      <TouchableOpacity style={styles.sendButton} onPress={handleSendButtonPress}>
        <Ionicons name="send" size={24} color="white" />
      </TouchableOpacity>
    );
  };

  const handleMicButtonPress = () => {
    // Manejar el evento de presionar el botón del micrófono (iniciar o detener el reconocimiento de voz)
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleSendButtonPress = () => {
    // Manejar el evento de presionar el botón de envío de mensaje
    setIsMessageMode(true);
    sendMessage();
  };

  const renderSendButtonIcon = () => {
    // Renderizar el ícono del botón de envío (micrófono o flecha de envío)
    if (isRecording) {
      return renderMicButton();
    } else if (isMessageMode && message.trim().length > 0) {
      return renderSendButton();
    } else {
      return renderMicButton();
    }
  };

  const renderMessageItem = ({ item }) => (
    // Renderizar cada elemento de mensaje en la lista (mensaje enviado o recibido)
    <View style={[styles.messageItem, item.isSent ? styles.sentMessage : styles.receivedMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Animación de Lottie */}
      <LottieView
        style={styles.lottieLogo}
        source={require('./src/animation_lkj5w7te.json')}
        autoPlay
        loop
      />
      {/* Lista de mensajes */}
      <FlatList
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContentContainer}
        data={messages.slice().reverse()} // Invertimos el orden del arreglo para mostrar los nuevos mensajes en la parte superior
        renderItem={renderMessageItem}
        keyExtractor={(item, index) => index.toString()}
        ref={flatListRef}
        ListEmptyComponent={() => <Text>No hay mensajes</Text>}
      />
      {/* Cuadro de entrada de mensaje */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu mensaje..."
          value={message}
          onChangeText={setMessage}
        />
        {/* Botón de envío */}
        <TouchableOpacity style={styles.sendButton} onPress={handleMicButtonPress}>
          {renderSendButtonIcon()}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottieLogo: {
    width: 200,
    height: 200,
  },
  chatContainer: {
    flex: 1,
    width: '100%',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  chatContentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end', // Para que los nuevos mensajes se muestren en la parte superior
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 5,
    marginTop: 7,
  },
  sendButton: {
    backgroundColor: '#46b41e',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  messageItem: {
    maxWidth: '80%',
    padding: 10,
    marginBottom: 10,
    borderRadius: 20,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#46b41e',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 20,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f2f2f2',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  messageText: {
    fontSize: 16,
  },
});

export default ChatScreen;
