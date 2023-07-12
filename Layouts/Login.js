import React, { useState } from 'react';
import {
  View,
  Alert,
  Text,
  ImageBackground,
  Image,
  TextInput,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { getAuth, GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';

import { app } from './Components/FireBaseconfig';
import { IniciarSesion, Google } from './Components/Botones';

const { width, height } = Dimensions.get('window');

export function LoginInic() {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');

  const handleGuestLogin = () => {
    Linking.openURL('https://sga.uteq.edu.ec/loginsga?ret=/');
  };

  const handleCorreoChange = (text) => {
    setCorreo(text);
  };

  const handleGoogleLogin = async () => {
    if (!validateCorreo(correo)) {
      Alert.alert(
        'Correo inválido',
        'Por favor ingresa un correo válido de @uteq.edu.ec'
      );
      return;
    }

    try {
      const authInstance = getAuth(app);
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      await signInWithRedirect(authInstance, provider);
    } catch (error) {
      console.log('Error al iniciar sesión con Google:', error);
      Alert.alert(
        'Error',
        'Error al iniciar sesión con Google. Por favor, inténtalo nuevamente.'
      );
    }
  };

  const validateCorreo = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const endsWithUteq = email.toLowerCase().endsWith('@uteq.edu.ec');
    return regex.test(email) && endsWithUteq;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ImageBackground source={require('./src/Fondo.jpg')} resizeMode='cover' style={styles.backgroundImage}>
          <View style={styles.logoContainer}>
            <Image source={require('./src/UTEQBL.png')} resizeMode='stretch' style={styles.logoImage} />
          </View>
          <Text style={styles.title}>App</Text>
          <Text style={styles.subtitle}>Bienvenidos!</Text>
          <TextInput
            id='txtCorreo'
            placeholder='Correo'
            placeholderTextColor='white'
            style={styles.textInput}
            onChangeText={handleCorreoChange}
          />

          <TextInput
            id='txtPassword'
            placeholder='Contraseña'
            placeholderTextColor='white'
            style={styles.textInput}
            secureTextEntry={true}
            value={contraseña}
            onChangeText={setContraseña}
          />
          <IniciarSesion onGuestLogin={handleGuestLogin} />
          <Google correo={correo} onGoogleLogin={handleGoogleLogin} />
          <TouchableOpacity onPress={handleGuestLogin}>
            <Text style={styles.guestText}>Iniciar como invitado</Text>
          </TouchableOpacity>
          <StatusBar style='auto' />
        </ImageBackground>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  backgroundImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: width * 0.7,
    height: height * 0.13,
    marginBottom: height * 0.03,
    alignItems: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: width * 0.1,
    color: 'white',
    fontWeight: 'bold',
    marginTop: height * -0.05,
  },
  subtitle: {
    fontSize: width * 0.08,
    color: 'white',
    fontWeight: 'bold',
    elevation: 14,
  },
  textInput: {
    fontSize: width * 0.05,
    borderWidth: 1,
    borderColor: 'white',
    color: 'white',
    padding: width * 0.03,
    borderRadius: width * 0.1,
    width: width * 0.9,
    marginTop: height * 0.025,
  },
  guestText: {
    fontSize: width * 0.045,
    color: 'white',
    marginTop: height * 0.05,
    textDecorationLine: 'underline',
  },
});

export default LoginInic;
