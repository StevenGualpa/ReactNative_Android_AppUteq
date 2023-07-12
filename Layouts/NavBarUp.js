import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions, Modal, Pressable, ImageBackground, StatusBar, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');

const NavigationBar = () => {
  const [searchText, setSearchText] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = () => {
    console.log('Buscar:', searchText);
    // Simulación de búsqueda con datos de ejemplo
    const results = ['Resultado 1', 'Resultado 2', 'Resultado 3'];
    setSearchResults(results);
    setIsSearchModalOpen(true);
  };

  const handleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCloseSearchModal = () => {
    setIsSearchModalOpen(false);
    setSearchResults([]);
    setSearchText('');
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
            <ScrollView style={styles.menuOptionsContainer}>
              <View style={styles.menuOptions}>
                <Text style={styles.menuItem}>Facultad de Ciencias de la Salud</Text>
                <Text style={styles.menuItem}>Facultad de Ciencias de la Educación</Text>
                <Text style={styles.menuItem}>Facultad de Ciencias de la Ingeniería</Text>
                <Text style={styles.menuItem}>Facultad de Ciencias de la Industria y Producción</Text>
                <Text style={styles.menuItem}>Facultad de Ciencias Agrarias y Forestales</Text>
                <Text style={styles.menuItem}>Facultad de Ciencias Sociales, Económicas y Financieras</Text>
                <Text style={styles.menuItem}>Facultad de Ciencias Empresariales</Text>
                <Text style={styles.menuItem}>Facultad de Ciencias Pecuarias y Biológicas</Text>
              </View>
            </ScrollView>
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

          <TouchableOpacity onPress={handleSearch} style={[styles.searchButton, { backgroundColor: 'green' }]}>
            <Icon name="search" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de búsqueda */}
      <Modal visible={isSearchModalOpen} animationType="slide" transparent={true}>
        <View style={styles.searchModalContainer}>
          <TouchableOpacity onPress={handleCloseSearchModal} style={styles.closeSearchModalButton}>
            <Icon name="times" size={20} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.searchResultsContainer}>
            {searchResults.map((result, index) => (
              <Text key={index} style={styles.searchResultItem}>{result}</Text>
            ))}
          </View>
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
    backgroundColor: '#f2f2f2',
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
  menuOptions: {
    marginTop: height * 0.07,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderRadius: 10,
  },
  menuItem: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
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
    width: width * 0.8,
    maxHeight: height * 0.6,
  },
  searchResultItem: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default NavigationBar;
