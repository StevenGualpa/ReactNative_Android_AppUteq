import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Modal, TextInput, RefreshControl, Dimensions } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const cardWidth = width - 40;

const ProfileCard = ({ Nombre, Apellidos, Correo, Contraseña, onEdit }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editNombre, setEditNombre] = useState(Nombre);
  const [editApellidos, setEditApellidos] = useState(Apellidos);
  const [editCorreo, setEditCorreo] = useState(Correo);
  const [editPass, setEditPass] = useState(Contraseña);

  // Función para manejar la acción de edición
  const handleEdit = () => {
    setModalVisible(true);
    onEdit();
  };

  // Función para manejar la acción de cancelar edición
  const handleCancel = () => {
    // Restaurar los valores originales
    setEditNombre(Nombre);
    setEditApellidos(Apellidos);
    setEditCorreo(Correo);
    setEditPass(Contraseña);
    setModalVisible(false);
  };
  
  // Función para manejar la acción de guardar cambios
  const handleSave = () => {
    // Validar campos vacíos
    if (!editNombre.trim() || !editApellidos.trim() || !editCorreo.trim() || !editPass.trim()) {
      Alert.alert('Campos vacíos', 'Por favor, complete todos los campos antes de guardar los cambios.');
      return;
    }

    // Validar que no se ingresen números en nombre y apellidos
    const regex = /\d/;
    if (regex.test(editNombre) || regex.test(editApellidos)) {
      Alert.alert('Nombre o apellidos inválidos', 'Por favor, no ingrese números en el nombre o apellidos.');
      return;
    }

    // Validar el formato del correo
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoRegex.test(editCorreo)) {
      Alert.alert('Correo inválido', 'Por favor, ingrese un correo válido.');
      return;
    }

    // Validar que el correo sea de dominio @uteq.edu.ec
    if (!editCorreo.endsWith('@uteq.edu.ec')) {
      Alert.alert('Correo inválido', 'Por favor, ingrese un correo con dominio @uteq.edu.ec.');
      return;
    }

    // Aquí puedes realizar la lógica para guardar los cambios en tu base de datos o realizar la acción necesaria
    console.log('Guardar cambios');
    setModalVisible(false);
  };
  
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Perfil de Usuario</Text>
      <View style={styles.profileInfo}>
        <Text style={styles.label}>Nombre:</Text>
        <Text style={styles.value}>{Nombre}</Text>
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.label}>Apellidos:</Text>
        <Text style={styles.value}>{Apellidos}</Text>
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.label}>Correo:</Text>
        <Text style={styles.value}>{Correo}</Text>
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.label}>Contraseña:</Text>
        <Text style={styles.value}>{Contraseña}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleEdit}>
          <AntDesign name="edit" size={24} color="#46b41e" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} /*onPress={handleDelete}*/>
          <FontAwesome name="trash" size={24} color="red" />
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Usuario</Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Nombre</Text>
            <TextInput
              style={styles.modalInput}
              value={editNombre}
              onChangeText={setEditNombre}
              placeholder="Nombre"
            />
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Apellidos</Text>
            <TextInput
              style={styles.modalInput}
              value={editApellidos}
              onChangeText={setEditApellidos}
              multiline
              placeholder="Apellidos"
            />
            <Text style={{ fontSize: 20, fontWeight: 'bold', borderRadius: 14 }}>Correo</Text>
            <TextInput
              style={styles.modalInput}
              value={editCorreo}
              onChangeText={setEditCorreo}
              placeholder="Correo"
            />
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Contraseña</Text>
            <TextInput
              style={styles.modalInput}
              value={editPass}
              onChangeText={setEditPass}
              placeholder="Contraseña"
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={handleSave}>
                <Text style={styles.modalButtonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleCancel}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const AppUser = () => {
  return (
    <View style={styles.titleContainer}>
      <Text style={styles.title}>Gestión de Usuario</Text>
      <ScrollView contentContainerStyle={styles.container}>
        <ProfileCard
          Nombre='Jhon'
          Apellidos='Dhon'
          Correo='Example@email.com'
          Contraseña='**********'
          onEdit={() => {}}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
  },
  card: {
    backgroundColor: '#fff',
    width: cardWidth,
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  titleContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color:'#46741e'
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  value: {
    flex: 2,
    fontSize: 16,
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    marginTop: 20,
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalInput: {
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: '#46b41e',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AppUser;
