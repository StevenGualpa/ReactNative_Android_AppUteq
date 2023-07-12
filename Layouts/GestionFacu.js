import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Alert, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getFirestore, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore/lite';

const { width } = Dimensions.get('window');

const cardWidth = width - 75;

const FacultadCard = ({ id, title, mision, vision }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedMision, setEditedMision] = useState(mision);
  const [editedVision, setEditedVision] = useState(vision);

  const handleEdit = () => {
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!editedTitle.trim() || !editedMision.trim() || !editedVision.trim()) {
      Alert.alert('Error', 'Por favor, complete todos los campos');
      return;
    }

    try {
      const db = getFirestore();
      const facultadesCollection = collection(db, 'Facultades');
      const facultadDoc = doc(facultadesCollection, id);
      await updateDoc(facultadDoc, {
        nombre: editedTitle,
        mision: editedMision,
        vision: editedVision,
      });
      Alert.alert('Facultad actualizada', 'Los datos de la facultad se han actualizado correctamente');
      setModalVisible(false);
    } catch (error) {
      console.error('Error al actualizar la facultad:', error);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Eliminar Facultad',
      `¿Estás seguro de eliminar la facultad "${title}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              const db = getFirestore();
              const facultadesCollection = collection(db, 'Facultades');
              const facultadDoc = doc(facultadesCollection, id);
              await deleteDoc(facultadDoc);
              Alert.alert('Facultad eliminada', `Facultad "${title}" eliminada correctamente`);
            } catch (error) {
              console.error('Error al eliminar la facultad:', error);
            }
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    setEditedTitle(title);
    setEditedMision(mision);
    setEditedVision(vision);
    setModalVisible(false);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleEdit}>
          <Ionicons name="pencil" size={24} color="#FFFFFF" />
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleDelete}>
          <Ionicons name="trash" size={24} color="#FFFFFF" />
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de edición */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Facultad</Text>
            <Text style={styles.modalLabel}>Título:</Text>
            <TextInput
              style={styles.modalInput}
              value={editedTitle}
              onChangeText={(text) => setEditedTitle(text)}
            />
            <Text style={styles.modalLabel}>Misión:</Text>
            <TextInput
              style={styles.modalInput}
              multiline
              value={editedMision}
              onChangeText={(text) => setEditedMision(text)}
            />
            <Text style={styles.modalLabel}>Visión:</Text>
            <TextInput
              style={styles.modalInput}
              multiline
              value={editedVision}
              onChangeText={(text) => setEditedVision(text)}
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

const GestiFacu = () => {
  const [facultades, setFacultades] = useState([]);

  // Obtener las facultades desde Firebase y almacenarlas en el estado
  const fetchFacultades = async () => {
    try {
      const db = getFirestore();
      const facultadesCollection = collection(db, 'Facultades');
      const facultadesSnapshot = await getDocs(facultadesCollection);
      const facultadesData = facultadesSnapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().nombre,
        mision: doc.data().mision,
        vision: doc.data().vision,
      }));
      setFacultades(facultadesData);
    } catch (error) {
      console.error('Error al obtener las facultades:', error);
    }
  };

  useEffect(() => {
    fetchFacultades();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Gestión de facultades</Text>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {facultades.map((facultad) => (
          <FacultadCard
            key={facultad.id}
            id={facultad.id}
            title={facultad.title}
            mision={facultad.mision}
            vision={facultad.vision}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#46b41e',
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
  card: {
    width: cardWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 35,
    padding: 16,
    marginBottom: 20,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#46b41e',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    marginLeft: 8,
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

export default GestiFacu;
