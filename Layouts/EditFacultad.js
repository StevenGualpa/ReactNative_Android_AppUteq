import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal } from 'react-native';

const EditFacultadModal = ({ visible, onSave, onCancel, facultadData, carrerasData }) => {
  const [editedNombre, setEditedNombre] = useState(facultadData.nombre);
  const [editedMision, setEditedMision] = useState(facultadData.mision);
  const [editedVision, setEditedVision] = useState(facultadData.vision);
  const [editedVideoURL, setEditedVideoURL] = useState(facultadData.urlVideo);
  const [editedImagenURL, setEditedImagenURL] = useState(facultadData.imagenURL);
  const [editedCarreras, setEditedCarreras] = useState(facultadData.carreras);

  useEffect(() => {
    setEditedNombre(facultadData.nombre);
    setEditedMision(facultadData.mision);
    setEditedVision(facultadData.vision);
    setEditedVideoURL(facultadData.urlVideo);
    setEditedImagenURL(facultadData.imagenURL);
    setEditedCarreras(facultadData.carreras);
  }, [facultadData]);

  const handleAgregarCarrera = () => {
    setEditedCarreras([...editedCarreras, { nombre: '', descripcion: '', imagenURL: '' }]);
  };

  const handleEliminarCarrera = (index) => {
    const updatedCarreras = [...editedCarreras];
    updatedCarreras.splice(index, 1);
    setEditedCarreras(updatedCarreras);
  };

  const handleSave = async () => {
    // Validar campos vacíos
    if (!editedNombre.trim() || !editedMision.trim() || !editedVision.trim() || !editedVideoURL.trim() || !editedImagenURL.trim()) {
      Alert.alert('Error', 'Por favor, complete todos los campos');
      return;
    }

    // ... (código para guardar la facultad y carreras)

    const editedFacultad = {
      id: facultadData.id,
      nombre: editedNombre,
      mision: editedMision,
      vision: editedVision,
      carreras: editedCarreras,
      urlVideo: editedVideoURL,
      imagenURL: editedImagenURL,
    };
    onSave(editedFacultad);

    // Mostrar mensaje de éxito y ocultar el modal de edición
    Alert.alert('Facultad actualizada', 'Los datos de la facultad se han actualizado correctamente');
    onCancel();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.modalContainer}>
        <ScrollView contentContainerStyle={styles.modalContent}>
          <Text style={styles.modalTitle}>Editar Facultad</Text>

          <Text style={styles.modalLabel}>Nombre de la Facultad</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Nombre de la facultad"
            value={editedNombre}
            onChangeText={setEditedNombre}
          />

          <Text style={styles.modalLabel}>Misión</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Misión"
            multiline
            value={editedMision}
            onChangeText={setEditedMision}
          />

          <Text style={styles.modalLabel}>Visión</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Visión"
            multiline
            value={editedVision}
            onChangeText={setEditedVision}
          />

          <Text style={styles.modalLabel}>URL del Video Promocional</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="URL del video promocional"
            value={editedVideoURL}
            onChangeText={setEditedVideoURL}
          />

          <Text style={styles.modalLabel}>URL de la Imagen</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="URL de la imagen"
            value={editedImagenURL}
            onChangeText={setEditedImagenURL}
          />

          <Text style={styles.modalSubTitle}>Carreras</Text>
          {editedCarreras.map((carrera, index) => (
            <View key={index} style={styles.carreraItem}>
              <TextInput
                style={styles.modalInput}
                placeholder="Nombre de la carrera"
                value={carrera.nombre}
                onChangeText={(text) => {
                  const updatedCarreras = [...editedCarreras];
                  updatedCarreras[index].nombre = text;
                  setEditedCarreras(updatedCarreras);
                }}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Descripción de la carrera"
                value={carrera.descripcion}
                onChangeText={(text) => {
                  const updatedCarreras = [...editedCarreras];
                  updatedCarreras[index].descripcion = text;
                  setEditedCarreras(updatedCarreras);
                }}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="URL de la imagen de la carrera"
                value={carrera.imagenURL}
                onChangeText={(text) => {
                  const updatedCarreras = [...editedCarreras];
                  updatedCarreras[index].imagenURL = text;
                  setEditedCarreras(updatedCarreras);
                }}
              />
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleEliminarCarrera(index)}
              >
                <Text style={styles.modalButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            style={styles.modalButton}
            onPress={handleAgregarCarrera}
          >
            <Text style={styles.modalButtonText}>Agregar Carrera</Text>
          </TouchableOpacity>

          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={{ ...styles.modalButton, backgroundColor: '#46741e' }}
              onPress={handleSave}
            >
              <Text style={styles.modalButtonText}>Guardar Cambios</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.modalButton, backgroundColor: '#d32f2f' }}
              onPress={onCancel}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    maxHeight: '90%',
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
    marginTop: 10,
  },
  modalSubTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
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
    backgroundColor: '#46741e',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  carreraItem: {
    marginBottom: 10,
  },
});

export default EditFacultadModal;
