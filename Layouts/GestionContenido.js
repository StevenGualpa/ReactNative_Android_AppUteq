import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Modal, TextInput, ActivityIndicator,RefreshControl } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import 'moment/locale/es'; 
moment.locale('es');
const ContentCard = ({ id, title, description, fecha,url,url_imagen, onPressEdit, onDelete }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description);
  const [editedUrl, setEditedUrl] = useState(url);
  const [editeUrlima, setEditeUrlima] = useState(url_imagen);
  const [originalTitle, setOriginalTitle] = useState(title);
  const [originalDescription, setOriginalDescription] = useState(description);
  const [originalUrl, setOriginalUrl] = useState(url);
  const [originakima, setOriginalima]=useState(url_imagen);


  // Función para manejar la acción de editar contenido
  const handleEdit = () => {
    setModalVisible(true);
  };

  // Función para manejar la acción de guardar los cambios al editar contenido
  const handleSave = async () => {
    // Validar campos vacíos y URL válida
    if (!editedTitle.trim() || !editedDescription.trim() || !isValidUrl(editedUrl) || !editeUrlima.trim() ) {
      Alert.alert('Error', 'Por favor, complete todos los campos y asegúrese de ingresar una URL válida.');
      return;
    }

    // Mostrar confirmación antes de guardar los cambios
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
            setEditeUrlima(originakima)
            setModalVisible(false);
          },
        },
        {
          text: 'Sí',
          onPress: async () => {
            try {
              const editedData = {
                titulo: editedTitle,
                descripcion: editedDescription,
                url_video: editedUrl,
                url_imageb: editeUrlima,
                usuario_id: 1,
              };
              // Actualizar el documento con los datos editados
              await fetch(`https://noticias-uteq-4c62c24e7cc5.herokuapp.com/multimedia/update/${id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedData),
              })

              // Mostrar mensaje de éxito y actualizar la información en la lista
              Alert.alert('Los datos se modificaron correctamente');
              setModalVisible(false);
              onPressEdit(id, editedData);
            } catch (error) {
              console.error('Error al guardar los cambios:', error);

            }
          },
        },
      ]
    );
  };

  // Función para manejar la acción de eliminar contenido
  const handleDelete = () => {
    // Mostrar confirmación antes de eliminar el contenido
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

  // Función para manejar la acción de cancelar la edición
  const handleCancel = () => {
    // Restaurar los valores originales y ocultar el modal de edición
    setEditedTitle(title);
    setEditedDescription(description);
    setEditedUrl(url);
    setModalVisible(false);
    setEditeUrlima(url_imagen);
  };

  // Función para validar si una URL es válida
  const isValidUrl = (value) => {
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlRegex.test(value);
  };
 

  // Restringir la descripción a un máximo de 50 caracteres para mostrar en la tarjeta
  const truncatedDescription = description.length > 50 ? `${description.substring(0, 50)}...` : description;

  return (
    
    <View style={styles.card}>
      <View style={styles.imageContainer}>
      <Text style={styles.title}>{title}</Text>
        <Image source={{ uri: editeUrlima }} style={styles.logo} />
      </View>
      <Text style={styles.fecha}>{moment(fecha).format('LL')}</Text>
      <Text style={styles.description}>{truncatedDescription}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleEdit}>
          <AntDesign name="edit" size={24} color="#46741e" />
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
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Imagen</Text>
            <TextInput
              style={styles.input}
              placeholder="Imagen"
              value={editeUrlima}
              onChangeText={(text) => setEditeUrlima(text)}
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

const AppGestion = () => {
  const [contentData, setContentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Función para manejar el evento de "pull to refresh" en la lista de contenidos
  const onRefresh = async () => {
    setRefreshing(true);
    // Limpiar los datos existentes al hacer refresh
    setContentData([]);
    try {
      // Obtener los nuevos datos actualizados
      await fetchContentData();
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchContentData = () => {
    setLoading(true);
    fetch('https://noticias-uteq-4c62c24e7cc5.herokuapp.com/multimedia/getAll')
      .then((response) => response.json())
      .then((data) =>
        setContentData(
          data.multimedias.map((item) => ({
            id: item.ID,
            titulo: item.titulo,
            descripcion: item.descripcion,
            url: item.url_video,
            url_imagen: item.url_imageb,
          }))
        )
      )
      .catch((error) => console.error('Error:', error))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchContentData();
  }, []);

  // Función para manejar la acción de editar contenido en la lista
  const handleEditContent = (id, editedData) => {
    // Actualizar la información en la lista de contenido
    const updatedData = contentData.map((content) => {
      if (content.id === id) {
        return {
          ...content,
          ...editedData, // Desestructuramos el objeto editedData para actualizar los campos modificados
        };
      }
      return content;
    });

    // Establecer la nueva información en el estado
    setContentData(updatedData);
  };

  // Función para manejar la acción de eliminar contenido en la lista
  const handleDeleteContent = async (id) => {
    try {
      // Eliminar el documento correspondiente al contenido
      await fetch(`https://noticias-uteq-4c62c24e7cc5.herokuapp.com/multimedia/Delete/${id}`, {
        method: 'DELETE',
      });

      // Actualizar la lista de contenido en el estado
      setContentData((prevData) => prevData.filter((content) => content.id !== id));
    } catch (error) {
      console.error('Error al eliminar el contenido:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Gestión de contenido</Text>
      {loading ? (
        <ActivityIndicator size="large" color="green" style={styles.loadingIndicator} />
      ) : (
      <ScrollView  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {contentData.map((content) => (
          <ContentCard
            key={content.id}
            id={content.id}
            title={content.titulo}
            fecha={content.UpdatedAt}
            description={content.descripcion}
            url={content.url}
            url_imagen={content.url_imagen}
            onPressEdit={handleEditContent}
            onDelete={handleDeleteContent}
          />
        ))}
      </ScrollView>
      )}
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
    color: '#46741e',
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
  imageContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 120, // Ajusta el ancho de la imagen según tu preferencia
    height: 150, // Ajusta el alto de la imagen según tu preferencia
    borderRadius: 10,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    marginBottom:12,
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
    color: 'black',
  },
  fecha:{textAlign:'center',
  marginBottom:6,
  marginTop:4},

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 23,
  },
  button: {
    marginLeft: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  modalButton: {
    backgroundColor: '#46741e',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
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
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectImageButton: {
    backgroundColor: '#46741e',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 10,
    width:150,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  selectImageButtonText: {
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  uploadIcon: {
    marginRight: 8,
  },
});

export default AppGestion;
