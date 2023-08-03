import React, { useState } from 'react'; // Asegúrate de importar useState
import { View, Text, TouchableOpacity, ScrollView, Dimensions, StyleSheet, Modal, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios'; // Asegúrate de importar axios si aún no lo has hecho

const windowWidth = Dimensions.get('window').width;

const FacuDetails = ({ facultad, onGoBack }) => {
  const [activeTab, setActiveTab] = useState('mision');
  const [selectedCarrera, setSelectedCarrera] = useState(null);
  const [carrerasData, setCarreras] = useState([]); // Estado para almacenar las carreras

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    if (tab === 'carreras') {
      fecthCarreras(); // Llamar al fetchCarreras solo cuando la pestaña es "carreras"
    }
  };
  const handleGoBack = () => {
    onGoBack(); // Llamamos a la función onGoBack pasada como prop
  };
  const handleCarreraPress = (carrera) => {
    setSelectedCarrera(carrera);
  };

  const fecthCarreras = async () => {
    try {
      const response = await axios.get(`https://noticias-uteq-4c62c24e7cc5.herokuapp.com/carreras/getall?facultadId=${facultad.ID}`);
      const carrerasData = response.data.carreras.map((carrera) => ({
        id: carrera.id,
        nombre: carrera.nombre,
        descripcion: carrera.descripcion,
        imageURL: carrera.imageURL, // Agregar la propiedad urlImagen
      }));
      console.log('Carreras:', carrerasData); // Mostrar las carreras en el log
      setCarreras(carrerasData);
    } catch (error) {
      console.error('Error al obtener las carreras:', error);
    }
  };
  const renderCarreras = () => {
    return (
      <ScrollView  contentContainerStyle={styles.carrerasContainer}>
        {carrerasData.map((carrera) => (
          <TouchableOpacity
            key={carrera.id}
            style={styles.carreraCard}
            onPress={() => handleCarreraPress(carrera)}
          >
            <Text style={styles.carreraCardTitle}>{carrera.nombre}</Text>
            <Image source={{ uri: carrera.imageURL }} style={styles.carreraCardImage} />
            <Text>{carrera.descripcion}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderMision = () => {
    // Aquí puedes obtener la información de la misión desde donde sea necesario
   

    return (
      <View style={styles.tabContent}>
        <Text style={styles.tabTitle}>Misión</Text>
        <Text>{facultad.mision}</Text>
      </View>
    );
  };

  const renderVision = () => {
    // Aquí puedes obtener la información de la visión desde donde sea necesario
    return (
      <View style={styles.tabContent}>
        <Text style={styles.tabTitle}>Visión</Text>
        <Text>{facultad.vision}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
     
      <Text style={styles.facultyTitle}>{facultad.nombre}</Text>

     
      <View style={styles.videoContainer}>
        <WebView
          source={{ uri: facultad.urlVideo }} 
          style={styles.video}
        />
      </View>

  
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'carreras' ? styles.activeTab : {}]}
          onPress={() => handleTabPress('carreras')}
        >
          <Icon name="book-outline" size={24} color={activeTab === 'carreras' ? '#FFFFFF' : '#000000'} />
          <Text style={[styles.tabButtonText, activeTab === 'carreras' ? styles.activeTabText : {}]}>Carreras</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'mision' ? styles.activeTab : {}]}
          onPress={() => handleTabPress('mision')}
        >
          <Icon name="newspaper-outline" size={24} color={activeTab === 'mision' ? '#FFFFFF' : '#000000'} />
          <Text style={[styles.tabButtonText, activeTab === 'mision' ? styles.activeTabText : {}]}>Misión</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'vision' ? styles.activeTab : {}]}
          onPress={() => handleTabPress('vision')}
        >
          <Icon name="eye-outline" size={24} color={activeTab === 'vision' ? '#FFFFFF' : '#000000'} />
          <Text style={[styles.tabButtonText, activeTab === 'vision' ? styles.activeTabText : {}]}>Visión</Text>
        </TouchableOpacity>
      </View>

      {/* Información de cada pestaña */}
      {activeTab === 'carreras' && renderCarreras()}
      {activeTab === 'mision' && renderMision()}
      {activeTab === 'vision' && renderVision()}

     
      <Modal
        visible={selectedCarrera !== null}
        transparent={true}
        onRequestClose={() => setSelectedCarrera(null)}
      >
        <View style={styles.modalContainer}>
          {selectedCarrera && (
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedCarrera.nombre}</Text>
              <Image
                source={{ uri: selectedCarrera.imageURL }}
                style={styles.modalImage}
              />
              <Text style={styles.modalDescription}>{selectedCarrera.descripcion}</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setSelectedCarrera(null)}
              >
                <Icon name="close-outline" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
     
      <TouchableOpacity onPress={handleGoBack} style={styles.goBackButton}>
        <Icon name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  facultyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: '#ffffff',
  },
  videoContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  video: {
    width: windowWidth - 40,
    height: (windowWidth - 40) * 9 / 16,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 20,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#46741e',
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  tabContent: {
    margin: 10,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  tabTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  carrerasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  carreraCard: {
    width: '48%',
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  carreraCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#46741e',
    padding: 8,
    borderRadius: 20,
  },
  goBackButton: {
    position: 'absolute',
    borderRadius: 20,
  },
  carreraCardImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
});

export default FacuDetails;
