import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Keyboard, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import axios from 'axios';

const ChatScreen = () => {
  // Estados del componente
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef();

  // Configurar el interceptor para manejar errores de respuesta
  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('Error al enviar el mensaje al web service:', error);
        return Promise.reject('Error al enviar el mensaje. Por favor, inténtalo nuevamente.');
      }
    );

    return () => {
      // Limpiar el interceptor al desmontar el componente
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const sendMessageAndGetResponse = async (message) => {
    try {
      const response = await axios.get(`https://cristianzambranovega.pythonanywhere.com/query`, {
        params: {
          text: message,
        },
      });

      return response.data.respuesta || '';
    } catch (error) {
      console.error('Error al enviar el mensaje al web service:', error);
      return 'Error al enviar el mensaje. Por favor, inténtalo nuevamente.';
    }
  };

  const sendMessage = async () => {
    // Enviar un nuevo mensaje
    if (message.trim().length > 0) {
      const newMessage = { text: message, isSent: true };
      setMessages((prevMessages) => [newMessage, ...prevMessages]);
      setMessage('');

      // Mostrar la pregunta en el log
      console.log('Pregunta:', message);

      // Enviar el mensaje al web service utilizando el método GET
      const responseText = await sendMessageAndGetResponse(message);

      // Agregar la respuesta al chat
      const respuestaMessage = { text: responseText, isSent: false };
      setMessages((prevMessages) => [respuestaMessage, ...prevMessages]);
      flatListRef.current.scrollToEnd({ animated: true });

      // Ocultar el teclado después de enviar el mensaje
      Keyboard.dismiss();
    }
  };

  const handleSendButtonPress = () => {
    // Manejar el evento de presionar el botón de envío de mensaje
    sendMessage();
  };

  const renderMessageItem = ({ item }) => (
    // Renderizar cada elemento de mensaje en la lista (mensaje enviado o recibido)
    <View style={[styles.messageItem, item.isSent ? styles.sentMessage : styles.receivedMessage]}>
      <Text style={[styles.messageText, item.isSent ? styles.sentMessageText : styles.receivedMessageText]}>{item.text}</Text>
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
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item, index) => index.toString()}
        ref={flatListRef}
        ListEmptyComponent={() => <Text></Text>}
        inverted // Mostrar los nuevos mensajes en la parte inferior
      />
      {/* Cuadro de entrada de mensaje */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Escribe tu mensaje..."
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={handleSendButtonPress} // Ocultar el teclado al presionar enviar
        />
        {/* Botón de envío */}
        <TouchableOpacity style={styles.sendButton} onPress={handleSendButtonPress}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
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
    backgroundColor: '#46741e',
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
    borderWidth: 1,
    borderColor: '#ddd', // Color del borde de la burbuja de chat
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
  sentMessageText: {
    color: 'white', // Color del texto de mensaje enviado
  },
  receivedMessageText: {
    color: 'black', // Color del texto de mensaje recibido
    fontWeight: 'bold', // Puedes ajustar otros estilos según tus preferencias
  },
});

export default ChatScreen;
