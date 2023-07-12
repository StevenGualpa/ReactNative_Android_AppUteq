import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Modal, TextInput, RefreshControl } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { getFirestore, collection, getDocs, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const ContentCard = ({ id, logo, title, description, url, fecha, onPressEdit, onDelete }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description);
  const [editedUrl, setEditedUrl] = useState(url);
  const [originalTitle, setOriginalTitle] = useState(title);
  const [originalDescription, setOriginalDescription] = useState(description);
  const [originalUrl, setOriginalUrl] = useState(url);

  const handleEdit = () => {
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!editedTitle.trim() || !editedDescription.trim() || !isValidUrl(editedUrl)) {
      Alert.alert('Error', 'Por favor, complete todos los campos y asegúrese de ingresar una URL válida.');
      return;
    }

    Alert.alert(
      'Guardar cambios',
      '¿Desea guardar los cambios?',
      [
        {
          text: 'No',
          style: 'cancel',
          onPress: () => {
            setEditedTitle(originalTitle);
            setEditedDescription(originalDescription);
            setEditedUrl(originalUrl);
            setModalVisible(false);
          },
        },
        {
          text: 'Sí',
          onPress: async () => {
            try {
              const db = getFirestore();
              const contentRef = doc(db, 'contenidos', id);
              await updateDoc(contentRef, {
                titulo: editedTitle,
                descripcion: editedDescription,
                url: editedUrl,
                fecha: serverTimestamp(), // Actualiza la fecha con la fecha y hora actual
              });
              Alert.alert('Los datos se modificaron correctamente');
              setModalVisible(false);
              onPressEdit(id, editedTitle, editedDescription, editedUrl);
            } catch (error) {
              console.error('Error al guardar los cambios en Firebase:', error);
            }
          },
        },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      `¿Desea eliminar "${title}"?`,
      '',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Sí',
          onPress: () => onDelete(id),
        },
      ]
    );
  };

  const isValidUrl = (value) => {
    // Expresión regular para validar una URL
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

    return urlRegex.test(value);
  };

  const truncatedDescription = description.length > 50 ? `${description.substring(0, 50)}...` : description;

  const formatDate = (date) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      weekday: 'long',
    };
    return date.toLocaleDateString('es-ES', options);
  };

  return (
    <View style={styles.card}>
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.description}>{truncatedDescription}</Text>
      <Text style={styles.fecha}>{fecha && formatDate(fecha.toDate())}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleEdit}>
          <AntDesign name="edit" size={24} color="#46b41e" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleDelete}>
          <FontAwesome name="trash" size={24} color="red" />
        </TouchableOpacity>
      </View>

      {/* Modal de edición */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Título</Text>
            <TextInput
              style={styles.input}
              placeholder="Título"
              value={editedTitle}
              onChangeText={(text) => setEditedTitle(text)}
            />
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Descripción</Text>
            <TextInput
              style={styles.input}
              multiline
              placeholder="Descripción"
              value={editedDescription}
              onChangeText={(text) => setEditedDescription(text)}
            />
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>URL</Text>
            <TextInput
              style={styles.input}
              placeholder="URL"
              value={editedUrl}
              onChangeText={(text) => setEditedUrl(text)}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const AppGestion = () => {
  const [contentData, setContentData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchContentData = async () => {
      try {
        const db = getFirestore();
        const contentCollection = collection(db, 'contenidos');
        const contentSnapshot = await getDocs(contentCollection);
        const data = contentSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setContentData(data);
      } catch (error) {
        console.error('Error al obtener los contenidos de Firebase:', error);
      }
    };

    fetchContentData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      const db = getFirestore();
      const contentCollection = collection(db, 'contenidos');
      const contentSnapshot = await getDocs(contentCollection);
      const data = contentSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setContentData(data);
    } catch (error) {
      console.error('Error al obtener los contenidos de Firebase:', error);
    }

    setRefreshing(false);
  };

  const handleEditContent = (id, editedTitle, editedDescription, editedUrl) => {
    const updatedData = contentData.map((content) => {
      if (content.id === id) {
        return {
          ...content,
          titulo: editedTitle,
          descripcion: editedDescription,
          url: editedUrl,
        };
      }
      return content;
    });

    setContentData(updatedData);
  };

  const handleDeleteContent = async (id) => {
    try {
      const db = getFirestore();
      const contentRef = doc(db, 'contenidos', id);
      await deleteDoc(contentRef);
      setContentData((prevData) => prevData.filter((content) => content.id !== id));
    } catch (error) {
      console.error('Error al eliminar el contenido de Firebase:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Gestión de contenido</Text>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {contentData.map((content) => (
          <ContentCard
            key={content.id}
            id={content.id}
            logo={require('./iconos/Tiktokicon.png')}
            title={content.titulo}
            description={content.descripcion}
            url={content.url}
            fecha={content.fecha}
            onPressEdit={handleEditContent}
            onDelete={handleDeleteContent}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f6fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: -20,
    marginBottom: 5,
  },
  logo: {
    width: 80,
    height: 100,
    marginRight: 10,
    marginTop: -20,
    marginBottom: -18,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  fecha: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    marginLeft: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AppGestion;
