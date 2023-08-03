import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity, Dimensions, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';

const ProfileScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatNewPassword, setRepeatNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatNewPassword, setShowRepeatNewPassword] = useState(false);

  const handleSavePassword = () => {
    if (!currentPassword || !newPassword || !repeatNewPassword) {
      Alert.alert('Error', 'Ninguno de los campos puede estar vacío.');
      return;
    }

    if (!isValidPassword(newPassword)) {
      Alert.alert(
        'Error',
        'La contraseña nueva debe tener entre 8 y 15 caracteres y contener una combinación de mayúsculas, minúsculas, números y caracteres especiales.'
      );
      return;
    }

    if (newPassword !== repeatNewPassword) {
      Alert.alert('Error', 'Las contraseñas nuevas no coinciden.');
      return;
    }

    // Aquí puedes implementar la lógica para guardar la nueva contraseña
    // Por ejemplo, enviarla al servidor o almacenarla localmente
    // También puedes cerrar el modal después de guardar la contraseña:
    setModalVisible(false);
  };

  const handleLogout = () => {
    // Aquí puedes implementar la lógica para cerrar sesión
    // Por ejemplo, limpiar el estado y redirigir a la pantalla de inicio de sesión
  };

  const isValidPassword = (password) => {
    // Expresión regular para validar la contraseña
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
    return passwordRegex.test(password);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('./src/perfiluteq.jpeg')}
        style={styles.backgroundImage}
      >
        <View style={styles.profileContainer}>
          <Image
            source={require('./src/LogoUteq.png')}
            style={styles.profilePicture}
          />
          <Text style={styles.label}>Nombre:</Text>
          <Text style={styles.text}>John Doe</Text>

          <Text style={styles.label}>Correo:</Text>
          <Text style={styles.text}>johndoe@example.com</Text>

          {/* Botón "Cambiar Clave" */}
          <TouchableOpacity style={styles.changePasswordButton} onPress={() => setModalVisible(true)}>
            <Icon name="key" size={windowWidth * 0.05} color="#FFFFFF" />
            <Text style={styles.buttonText}>Cambiar Clave</Text>
          </TouchableOpacity>

          {/* Botón "Cerrar Sesión" */}
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Icon name="sign-out" size={windowWidth * 0.05} color="#FFFFFF" />
            <Text style={styles.buttonText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* Modal para editar la clave */}
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Editar Clave</Text>
          <Text style={styles.modalLabel}>Nombre:</Text>
          <Text style={styles.modalText}>John Doe</Text>

          <Text style={styles.modalLabel}>Correo:</Text>
          <Text style={styles.modalText}>johndoe@example.com</Text>

          <Text style={styles.modalLabel}>Clave Actual:</Text>
          <View style={styles.modalInputContainer}>
            <TextInput
              style={styles.modalInput}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={!showCurrentPassword}
            />
            <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
              <Icon name={showCurrentPassword ? 'eye-slash' : 'eye'} size={windowWidth * 0.05} color="#000" />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalLabel}>Clave Nueva:</Text>
          <View style={styles.modalInputContainer}>
            <TextInput
              style={styles.modalInput}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
            />
            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
              <Icon name={showNewPassword ? 'eye-slash' : 'eye'} size={windowWidth * 0.05} color="#000" />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalLabel}>Repetir Clave Nueva:</Text>
          <View style={styles.modalInputContainer}>
            <TextInput
              style={styles.modalInput}
              value={repeatNewPassword}
              onChangeText={setRepeatNewPassword}
              secureTextEntry={!showRepeatNewPassword}
            />
            <TouchableOpacity onPress={() => setShowRepeatNewPassword(!showRepeatNewPassword)}>
              <Icon name={showRepeatNewPassword ? 'eye-slash' : 'eye'} size={windowWidth * 0.05} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Botón "Guardar" */}
          <TouchableOpacity style={styles.modalSaveButton} onPress={handleSavePassword}>
            <Icon name="save" size={windowWidth * 0.05} color="#FFFFFF" />
            <Text style={styles.buttonText}>Guardar</Text>
          </TouchableOpacity>

          {/* Botón "Cancelar" */}
          <TouchableOpacity style={styles.modalCancelButton} onPress={() => setModalVisible(false)}>
            <Icon name="close" size={windowWidth * 0.05} color="#FFFFFF" />
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#46741e',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: windowWidth * 0.05,
    margin: windowWidth * 0.05,
    borderRadius: windowWidth * 0.02,
  },
  profilePicture: {
    resizeMode:'stretch',
    width: windowWidth * 0.4,
    height: windowWidth * 0.5,
    marginBottom: windowHeight * 0.02,
  },
  label: {
    fontSize: windowWidth * 0.04,
    fontWeight: 'bold',
    color: '#46b41e',
    marginBottom: windowHeight * 0.01,
  },
  text: {
    fontSize: windowWidth * 0.04,
    marginBottom: windowHeight * 0.02,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  changePasswordButton: {
    backgroundColor: '#007bff', // Cambiamos el color del botón a azul
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  // Estilos para el modal
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 200,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  modalInput: {
    flex: 1,
  },
  modalSaveButton: {
    backgroundColor: '#46741e',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  modalCancelButton: {
    backgroundColor: '#d32f2f',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

export default ProfileScreen;
