import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import RegistroModal from './ModalRegister';
const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isButtonInverted, setButtonInverted] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false); // Estado para controlar la visibilidad del modal

  const handleLogin = () => {
    if (!correo.trim() || !contraseña.trim()) {
      Alert.alert('Campos vacíos', 'Por favor, completa todos los campos.');
      return;
    }

    // Validar formato del correo utilizando una expresión regular
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const allowedDomains = ['uteq.edu.ec', 'gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'outlook.es'];
    const endsWithAllowedDomain = allowedDomains.some((domain) => correo.toLowerCase().endsWith('@' + domain));
    
    if (!emailRegex.test(correo) || !endsWithAllowedDomain) {
      Alert.alert('Correo inválido', 'Por favor, ingresa un correo válido con uno de los siguientes dominios: @uteq.edu.ec, @gmail.com, @hotmail.com, @yahoo.com, @outlook.com');
      return;
    }
  };

  const handleRegisterModal = () => {
    setModalVisible(true);
  };

  const handleRegister = (email, type) => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <ImageBackground
          source={require('./src/Fondo.jpg')}
          resizeMode="cover"
          style={styles.backgroundImage}
        >
          <View style={styles.logoContainer}>
            <ImageBackground
              source={require('./src/UTEQBL.png')}
              resizeMode="contain"
              style={styles.logoImage}
            />
          </View>
          <Text style={styles.title}>APP</Text>

          <View style={[styles.inputContainer, styles.inputWithElevation]}>
            <Icon name="envelope" size={20} color="white" style={styles.inputIcon} />
            <TextInput
              placeholder="Correo"
              placeholderTextColor="white"
              style={styles.textInput}
              onChangeText={setCorreo}
              value={correo}
            />
          </View>

          <View style={[styles.inputContainer]}>
            <Icon name="lock" size={20} color="white" style={styles.inputIcon} />
            <TextInput
              placeholder="Contraseña"
              placeholderTextColor="white"
              style={styles.passwordInput}
              secureTextEntry={!showPassword}
              onChangeText={setContraseña}
              value={contraseña}
            />
            <TouchableOpacity
              style={styles.showPasswordButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Icon
                name={showPassword ? 'eye-slash' : 'eye'}
                size={20}
                color="white"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.loginButton,
              isButtonInverted ? { backgroundColor: '#46b41e' } : { backgroundColor: 'white' },
              styles.buttonWithElevation,
            ]}
            onPress={handleLogin}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.loginButtonText,
                isButtonInverted ? { color: 'white' } : { color: '#46b41e' },
              ]}
            >
              Iniciar Sesión
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleRegisterModal}>
            <Text style={styles.registerText}>Registrarse</Text>
          </TouchableOpacity>

          {/* Mostrar el RegistroModal si isModalVisible es true */}
          <RegistroModal
            visible={isModalVisible}
            onClose={() => setModalVisible(false)}
            onRegister={handleRegister}
          />
        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    height: height,
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
    marginTop: height * -0.02,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'white',
    width: width * 0.9,
    marginTop: height * 0.03,
  },
  inputIcon: {
    marginLeft: width * 0.04,
    marginRight: width * 0.02,
  },
  textInput: {
    flex: 1,
    fontSize: width * 0.05,
    color: 'white',
    paddingVertical: height * 0.02,
  },
  passwordInput: {
    flex: 1,
    fontSize: width * 0.05,
    color: 'white',
    paddingVertical: height * 0.02,
  },
  showPasswordButton: {
    padding: width * 0.02,
    marginRight: width * 0.04,
  },
  loginButton: {
    backgroundColor: 'white',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.2,
    borderRadius: width * 0.1,
    marginTop: height * 0.03,
  },
  buttonWithElevation: {
    elevation: 5,
  },
  loginButtonText: {
    fontSize: width * 0.05,
    color: '#46b41e',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  registerText: {
    fontSize: width * 0.045,
    color: 'white',
    marginTop: height * 0.03,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
