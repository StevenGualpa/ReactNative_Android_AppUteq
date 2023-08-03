import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const RegistroModal = ({ visible, onClose }) => {
  const [email, setEmail] = useState('');
  const [selectedType, setSelectedType] = useState('institucional');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [clave, setClave] = useState('');
  const [claveRepetida, setClaveRepetida] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [userId, setUserId] = useState(null);
  const [openVerificationModal, setOpenVerificationModal] = useState(false);
  const modalRef = useRef(null);

  const handleRadioButtonPress = (type) => {
    setSelectedType(type);
    setMessage('');
  };

  const isValidName = (value) => {
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    return regex.test(value);
  };

  const isValidApellido = (value) => {
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    return regex.test(value);
  };

  const isValidEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const isValidPassword = (value) => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+,\-./:;<=>?@[\\\]^_`{|}~]).{8,15}$/;
    return regex.test(value);
  };

  const renderPublicoFields = () => {
    if (selectedType === 'publico') {
      return (
        <>
          <View style={styles.inputContainer}>
            <Icon name="user" size={20} color="gray" style={styles.inputIcon} />
            <TextInput
              placeholder="Nombre"
              placeholderTextColor="gray"
              style={styles.textInput}
              onChangeText={(value) => {
                if (isValidName(value)) {
                  setNombre(value);
                }
              }}
              value={nombre}
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="user" size={20} color="gray" style={styles.inputIcon} />
            <TextInput
              placeholder="Apellido"
              placeholderTextColor="gray"
              style={styles.textInput}
              onChangeText={(value) => {
                if (isValidApellido(value)) {
                  setApellido(value);
                }
              }}
              value={apellido}
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="envelope" size={20} color="gray" style={styles.inputIcon} />
            <TextInput
              placeholder="Correo"
              placeholderTextColor="gray"
              style={styles.textInput}
              onChangeText={setEmail}
              value={email}
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="gray" style={styles.inputIcon} />
            <TextInput
              placeholder="Clave"
              placeholderTextColor="gray"
              style={styles.textInput}
              secureTextEntry={!showPassword}
              onChangeText={setClave}
              value={clave}
            />
            <TouchableOpacity
              style={styles.showPasswordButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Icon name={showPassword ? 'eye-slash' : 'eye'} size={20} color="gray" />
            </TouchableOpacity>
          </View>
        </>
      );
    } else if (selectedType === 'institucional') {
      return (
        <>
          <View style={styles.inputContainer}>
            <Icon name="envelope" size={20} color="gray" style={styles.inputIcon} />
            <TextInput
              placeholder="Correo"
              placeholderTextColor="gray"
              style={styles.textInput}
              onChangeText={setEmail}
              value={email}
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="gray" style={styles.inputIcon} />
            <TextInput
              placeholder="Clave"
              placeholderTextColor="gray"
              style={styles.textInput}
              secureTextEntry={!showPassword}
              onChangeText={setClave}
              value={clave}
            />
            <TouchableOpacity
              style={styles.showPasswordButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Icon name={showPassword ? 'eye-slash' : 'eye'} size={20} color="gray" />
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="gray" style={styles.inputIcon} />
            <TextInput
              placeholder="Repetir Clave"
              placeholderTextColor="gray"
              style={styles.textInput}
              secureTextEntry={!showPassword}
              onChangeText={setClaveRepetida}
              value={claveRepetida}
            />
          </View>
        </>
      );
    }
    return null;
  };

  const handleRegister = () => {
    setMessage('');

    if (!isValidEmail(email)) {
      setMessage('Por favor, ingresa un correo válido.');
      return;
    }
    if (!email.trim()) {
      setMessage('Por favor, ingresa un correo válido.');
      return;
    }

    if (selectedType === 'publico') {
      // Validaciones para el registro público
      if (!nombre.trim() || !apellido.trim() || !clave.trim()) {
        setMessage('Por favor, completa todos los campos.');
        return;
      }

      const allowedDomains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'outlook.es'];
      const endsWithAllowedDomain = allowedDomains.some((domain) =>
        email.toLowerCase().endsWith('@' + domain)
      );
      if (!endsWithAllowedDomain) {
        setMessage(
          'El correo público debe tener uno de los siguientes dominios: @gmail.com, @hotmail.com, @yahoo.com, @outlook.com, @outlook.es'
        );
        return;
      }

      const isValidPublicoPassword = isValidPassword(clave);
      if (!isValidPublicoPassword) {
        setMessage(
          'La clave debe tener entre 8 y 15 caracteres y contener letras mayúsculas, minúsculas, números y caracteres especiales.'
        );
        return;
      }

      //AQUI REGISTRAR COMO INVITADO
      // Realizar el registro público mediante POST al web service
      const endpoint = 'https://noticias-uteq-4c62c24e7cc5.herokuapp.com/usuarios/register';
      const data = {
        nombre,
        apellido,
        email,
        password: clave,
        rol: 'invitado',
        verificado: true,
      };

      axios
        .post(endpoint, data)
        .then((response) => {
          
          Alert.alert("Informacion","Usted se ha registrado con exito",[{ text: 'Aceptar', onPress: handleCloseAllModals }])
        
          console.log('Registro exitoso:', response.data);
        })
        .catch((error) => {
          console.error('Error al registrar:', error);
          setMessage('Error al registrar. Por favor, inténtalo de nuevo.');
        });
    } else if (selectedType === 'institucional') {
      // Validaciones para el registro institucional
      if (!clave.trim() || !claveRepetida.trim()) {
        setMessage('Por favor, completa todos los campos.');
        return;
      }

      const isValidInstitucionalPassword = isValidPassword(clave);
      if (!isValidInstitucionalPassword) {
        setMessage(
          'La clave debe tener entre 8 y 15 caracteres y contener letras mayúsculas, minúsculas, números y caracteres especiales.'
        );
        return;
      }

      if (clave !== claveRepetida) {
        setMessage('Las claves no coinciden.');
        return;
      }

      //ESTO NO TOCAR SINO NO REGISTRA INSTITUCIONAL
      const data = {
        email,
        password: clave,
        rol: 'Institucional',
      };
    
      axios
        .post('https://noticias-uteq-4c62c24e7cc5.herokuapp.com/usuarios/registercorreocode', data)
        .then((response) => {
          console.log('Registro exitoso:', response.data);
          const userId = response.data.data.ID;
          setUserId(userId);
          setOpenVerificationModal(true);
        })
        .catch((error) => {
          console.error('Error al registrar:', error);
          setMessage('Error al registrar. Por favor, inténtalo de nuevo.');
        });
    }
  };

  const handleVerification = () => {
    if (!verificationCode.trim()) {
      setMessage('Por favor, ingresa el código de verificación.');
      return;
    }

    axios
      .put(`https://noticias-uteq-4c62c24e7cc5.herokuapp.com/usuarios/verifyUser/${userId}/${verificationCode}`)
      .then((response) => {
        console.log('Usuario verificado exitosamente:', response.data);
        // Aquí puedes realizar acciones adicionales en caso de que el usuario haya sido verificado exitosamente.
        // Por ejemplo, redireccionar a otra pantalla, mostrar un mensaje de éxito, etc.
        Alert.alert('Éxito', 'Usuario verificado exitosamente.', [{ text: 'Aceptar', onPress: handleCloseAllModals }]);
      })
      .catch((error) => {
        console.error('Error al verificar usuario:', error);
        setMessage('Código de verificación incorrecto. Por favor, inténtalo de nuevo.');
      });
  };

  const handleCloseAllModals = () => {
    // Cerrar todos los modales
    modalRef.current?.close();
    setOpenVerificationModal(false);

    // Limpiar todos los campos y estados
    setEmail('');
    setSelectedType('institucional');
    setNombre('');
    setApellido('');
    setClave('');
    setClaveRepetida('');
    setShowPassword(false);
    setMessage('');
    setVerificationCode('');
    setUserId(null);

    // Cerrar el modal principal (RegistroModal)
    onClose();
  };

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Registro</Text>
              <View style={styles.radioContainer}>
                <TouchableOpacity
                  style={[styles.radio, selectedType === 'institucional' && styles.radioSelected]}
                  onPress={() => handleRadioButtonPress('institucional')}
                >
                  {selectedType === 'institucional' && <View style={styles.radioInner} />}
                </TouchableOpacity>
                <Text style={styles.radioLabel}>Institucional</Text>
                <TouchableOpacity
                  style={[styles.radio, selectedType === 'publico' && styles.radioSelected]}
                  onPress={() => handleRadioButtonPress('publico')}
                >
                  {selectedType === 'publico' && <View style={styles.radioInner} />}
                </TouchableOpacity>
                <Text style={styles.radioLabel}>Público</Text>
              </View>
              {renderPublicoFields()}
              {message ? <Text style={styles.errorMessage}>{message}</Text> : null}
              <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Icon name="user-plus" size={20} color="white" style={styles.registerButtonIcon} />
                <Text style={styles.registerButtonText}>Registrar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Icon name="times" size={20} color="white" style={styles.closeButtonIcon} />
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
      {/* Modal de verificación */}
      <Modal visible={openVerificationModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Verificación de Usuario</Text>
            <View style={styles.inputContainer}>
              <Icon name="key" size={20} color="gray" style={styles.inputIcon} />
              <TextInput
                placeholder="Código de verificación"
                placeholderTextColor="gray"
                style={styles.textInput}
                onChangeText={setVerificationCode}
                value={verificationCode}
              />
            </View>
            {message ? <Text style={styles.errorMessage}>{message}</Text> : null}
            <TouchableOpacity style={styles.registerButton} onPress={handleVerification}>
              <Text style={styles.registerButtonText}>Validar Usuario</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    width: width * 0.9,
    maxHeight: height * 1,
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioSelected: {
    borderColor: '#46b41e',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#46b41e',
  },
  radioLabel: {
    fontSize: 16,
    color: 'gray',
    marginRight: 25,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'gray',
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: 'black',
    paddingVertical: 10,
  },
  showPasswordButton: {
    padding: 10,
    marginRight: 5,
  },
  registerButton: {
    backgroundColor: '#46b41e',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  registerButtonIcon: {
    marginRight: 5,
  },
  closeButton: {
    backgroundColor: 'gray',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeButtonIcon: {
    marginRight: 5,
  },
  errorMessage: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RegistroModal;
