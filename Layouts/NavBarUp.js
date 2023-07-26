import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions, Modal, Pressable,Linking, ImageBackground, StatusBar, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const Dropdown = ({ title, options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionSelect = (option) => {
    setIsOpen(false);
    onSelect(option);
  };

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={styles.dropdownHeader}>
        <Text style={styles.dropdownTitle}>{title}</Text>
        <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={20} color="#ffffff" />
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.dropdownContent}>
          <ScrollView>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownOption}
                onPress={() => handleOptionSelect(option)}
              >
                <Text style={styles.dropdownOptionText}>{option.nombre}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const NavigationBar = () => {
  
  const [searchText, setSearchText] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [selectedFacultad, setSelectedFacultad] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noResultsFound, setNoResultsFound] = useState(false); // Variable de estado para controlar si no se encontraron resultados

  useEffect(() => {
    const fetchFacultades = async () => {
      try {
        const db = getFirestore();
        const facultadesCollection = collection(db, 'Facultades');
        const facultadesSnapshot = await getDocs(facultadesCollection);
        const facultadesData = facultadesSnapshot.docs.map((doc) => doc.data());
        setFacultades(facultadesData);
      } catch (error) {
        console.error('Error al obtener las facultades:', error);
      }
    };

    fetchFacultades();
  }, []);

  const handlelinkview=(link)=>{
    Linking.openURL(link);
  }
  const handleSearch = async () => {
    if (!searchText.trim()) {
      return;
    }

    console.log('Buscar:', searchText);
    // Cerrar cualquier modal abierto antes de abrir el modal de búsqueda de resultados
    setIsModalOpen(false);

    // Simulación de búsqueda con datos de ejemplo
    try {
      const response = await axios.get('https://my-json-server.typicode.com/StevenGualpa/Api_Historial/Revistas');
      setSearchResults(response.data);
      setIsSearchModalOpen(true);
      setIsModalOpen(true); // Abrir el modal de búsqueda de resultados
      
    } catch (error) {
      console.error('Error al realizar la búsqueda:', error);
    }
  };

  const handleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCloseSearchModal = () => {
    setIsSearchModalOpen(false);
    setSearchResults([]);
    setSearchText('');
  };
  

  const handleFacultadSelect = (facultad) => {
    setSelectedFacultad(facultad);
    setIsMenuOpen(false);
  };

  const handleModalClose = () => {
    setSelectedFacultad(null);
    setIsModalOpen(false); // Cerrar cualquier modal abierto
  };

  const renderModalContent = () => {
    if (selectedFacultad) {
      return (
        <View style={styles.modalContentContainer}>
          <Text style={styles.modalTitle}>{selectedFacultad.nombre}</Text>
          <Text style={styles.modalSubtitle}>Misión:</Text>
          <Text style={styles.modalText}>{selectedFacultad.mision}</Text>
          <Text style={styles.modalSubtitle}>Visión:</Text>
          <Text style={styles.modalText}>{selectedFacultad.vision}</Text>
          <TouchableOpacity style={styles.modalCloseButton} onPress={handleModalClose}>
            <Text style={styles.modalCloseButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      );
    }
    else if (searchResults.length === 0) {
      return (
        <View style={styles.searchResultsContainer}>
          <Text style={styles.modalTitle}>No se encontraron resultados</Text>
          <TouchableOpacity style={styles.modalCloseButton} onPress={handleCloseSearchModal}>
            <Text style={styles.modalCloseButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <ScrollView style={styles.searchResultsContainer}>
          {searchResults.map((result) => (
            <TouchableOpacity
              key={result.id}
              style={styles.searchResultCard} // Utilizamos el estilo de tarjeta
              onPress={() => {
                if (result.url) {
                  handlelinkview(result.url);
                }
              }}
            >
              <View style={styles.logoContainer}>
                <Image source={{ uri: result.Portada }} style={styles.logo} />
              </View>
              <Text style={styles.searchResultItem}>{result.Titulo}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={handleCloseSearchModal} style={styles.closeSearchModalButton}>
            <Icon name="times" size={20} color="#ffffff" />
          </TouchableOpacity>
        </ScrollView>
      );
    }
  };

  return (
    <>
      <StatusBar backgroundColor="#f2f2f2" barStyle="dark-content" />

      <View style={styles.container}>
        <Modal visible={isMenuOpen} animationType="slide" transparent={true}>
          <ImageBackground source={require('./src/Fondo.jpg')} style={styles.menuContainer}>
            <Image source={require('./src/perfiluteq.jpeg')} style={styles.menuImage} />
            <Text style={styles.menuTitle}>Menú</Text>
            <Pressable onPress={handleMenu} style={styles.closeButton}>
              <Icon name="times" size={20} color="#ffffff" />
            </Pressable>

            <View style={styles.menuOptionsContainer}>
              <Dropdown title=" Facultades " options={facultades} onSelect={handleFacultadSelect} />
            </View>
          </ImageBackground>
        </Modal>

        <TouchableOpacity onPress={handleMenu} style={styles.menuButton}>
          <Icon name="bars" size={20} color="#000000" />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar..."
            onChangeText={text => setSearchText(text)}
            value={searchText}
          />

          <TouchableOpacity
            onPress={handleSearch}
            style={[styles.searchButton, { backgroundColor: 'green' }]}
            disabled={!searchText.trim()} // Deshabilitar el botón si el campo está vacío
          >
            <Icon name="search" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={isSearchModalOpen && isModalOpen} animationType="slide" transparent={true}>
        <View style={styles.searchModalContainer}>
          {renderModalContent()}
          <TouchableOpacity onPress={handleCloseSearchModal} style={styles.closeSearchModalButton}>
            <Icon name="times" size={20} color="#ffffff" />
          </TouchableOpacity>
          
        </View>
      </Modal>

      <Modal visible={selectedFacultad !== null && isModalOpen} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <ImageBackground source={require('./src/Fondo.jpg')} style={styles.modalBackground}>
            {renderModalContent()}
          </ImageBackground>
        </View>
      </Modal>
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 60,
    paddingHorizontal: 10,
    backgroundColor: '#f5f6fa',
  },
  menuButton: {
    paddingHorizontal: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  searchButton: {
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'cover',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    width: width * 0.8,
    height: height,
    borderRadius: 10,
  },
  menuImage: {
    width: '100%',
    height: '30%',
    resizeMode: 'cover',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  menuOptionsContainer: {
    flex:1,
  },
  menuOptions: {
    alignItems: 'flex-start',
    paddingHorizontal: 10,
  },
  menuItemContainer: {
    marginBottom: 10,
  },
  menuItem: {
    fontSize: 18,
    color: 'white',
  },
  searchModalContainer: {    
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  closeSearchModalButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  searchResultsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    width: width * 0.95,
    maxHeight: height * 0.8,
  },
  searchResultItem: {
    fontSize: 18,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBackground: {
    flex: 1,
    resizeMode: 'cover',
    width: width,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContentContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 50,
    padding: 20,
    width: width * 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalCloseButton: {
    backgroundColor: '#46b41e',
    borderRadius: 8,
    padding: 10,
    alignSelf: 'center',
    marginTop: 20,
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdownContainer: {
    width:width*0.75,
    backgroundColor: '#46b41e',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth:3,
    borderColor:'#46741e',
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  dropdownTitle: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  dropdownContent: {
    maxHeight: 200,
    paddingHorizontal: 10,
  },
  dropdownOption: {
    paddingVertical: 12,
  },
  dropdownOptionText: {
    fontSize: 16,
    color: 'black',
  },
  searchResultsScrollView: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchResultItemContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  searchResultImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  searchResultItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  searchResultButton: {
    marginTop: 10,
    backgroundColor: '#46b41e',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  searchResultButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchResultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 165,
    height: 135,    
    borderRadius:15,
    resizeMode:'stretch'
  },
});

export default NavigationBar;
