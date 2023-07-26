import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');

const RegistroModal = ({ visible, onClose, onRegister }) => {
  const [email, setEmail] = useState('');
  const [selectedType, setSelectedType] = useState('institucional');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [clave, setClave] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  const handleRegister = () => {
    if (!email.trim()) {
      setMessage('Por favor, ingresa un correo válido.');
      return;
    }

    if (selectedType === 'institucional' && !email.toLowerCase().endsWith('@uteq.edu.ec')) {
      setMessage('El correo institucional debe terminar con @uteq.edu.ec');
      return;
    }

    if (selectedType === 'publico') {
      if (!nombre.trim() || !apellido.trim() || !clave.trim()) {
        setMessage('Por favor, completa todos los campos.');
        return;
      }

      const allowedDomains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'outlook.es'];
      const endsWithAllowedDomain = allowedDomains.some((domain) => email.toLowerCase().endsWith('@' + domain));

      if (!endsWithAllowedDomain) {
        setMessage('El correo público debe tener uno de los siguientes dominios: @gmail.com, @hotmail.com, @yahoo.com, @outlook.com, @outlook.es');
        return;
      }
    }

    setMessage('');
    onRegister(email, selectedType, nombre, apellido, clave);
    setEmail('');
    setSelectedType('institucional');
    setNombre('');
    setApellido('');
    setClave('');
    setShowPassword(false);
  };

  const isValidName = (value) => {
    // Expresión regular para validar que no contenga números
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    return regex.test(value);
  };

  const isValidApellido = (value) => {
    // Expresión regular para validar que no contenga números
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
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
              <Icon
                name={showPassword ? 'eye-slash' : 'eye'}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>
        </>
      );
    }
    return null;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Registro</Text>
          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={[styles.radio, selectedType === 'institucional' && styles.radioSelected]}
              onPress={() => setSelectedType('institucional')}
            >
              {selectedType === 'institucional' && <View style={styles.radioInner} />}
            </TouchableOpacity>
            <Text style={styles.radioLabel}>Institucional</Text>
            <TouchableOpacity
              style={[styles.radio, selectedType === 'publico' && styles.radioSelected]}
              onPress={() => setSelectedType('publico')}
            >
              {selectedType === 'publico' && <View style={styles.radioInner} />}
            </TouchableOpacity>
            <Text style={styles.radioLabel}>Público</Text>
          </View>
          {renderPublicoFields()}
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
      </View>
    </Modal>
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
    maxHeight: height * 0.8,
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
});

export default RegistroModal;
