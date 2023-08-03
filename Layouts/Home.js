import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Linking, RefreshControl, Animated,ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import 'moment/locale/es'; 
import { BackHandler,Alert  } from 'react-native';

moment.locale('es');
const Home = () => {
  const navigation = useNavigation();

  //declaracion de estados
  const [refreshing, setRefreshing] = useState(false);
  const [contentData, setContentData] = useState([]);
  const [magazineData, setMagazineData] = useState([]);
  const [noticeData, setnoticeData] = useState([]);
  const [loading, setLoading] = useState(true);

  const blockBackButton = () => {
    Alert.alert(
      "Confirmar salida",
      "¿Estás seguro de que quieres salir de la aplicación?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Salir", onPress: () => BackHandler.exitApp() }
      ]
    );
    return true; // Indica que el botón de retroceso está bloqueado
  };

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', blockBackButton);

      // Limpia el listener cuando la pantalla ya no tiene el foco
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', blockBackButton);
      };
    }, [])
  );

  // Función para obtener los contenidos desde heroku
  useEffect(() => {
    fetchContentData();
  }, []);

  const fetchContentData = async () => {
    try {
      const response = await fetch('https://noticias-uteq-4c62c24e7cc5.herokuapp.com/multimedia/getAll');
      const data = await response.json();
      setContentData(data.multimedias);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los contenidos:', error);
      setLoading(false);
    }
  };
 // Función para manejar el evento de "pull to refresh" en la lista de contenidos
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchContentData();
    setRefreshing(false);
  };

  const handleButtonPress = (link) => {
    Linking.openURL(link);
  };
  
  // Función para obtener los datos de las revistas desde la API
  const fetchMagazineData = async () => {
    try {
      const response = await axios.get('https://my-json-server.typicode.com/StevenGualpa/Api_Historial/Revistas'); // La ruta de tu API
      setMagazineData(response.data);
    } catch (error) {
      console.error('Error al obtener los contenidos de la API:', error);
    }
  };

  useEffect(() => {
    fetchMagazineData();
  }, []);


  // Función para obtener los datos de las noticias desde la API
  const fetchnoticeData = async () => {
    try {
      const response = await axios.get('https://my-json-server.typicode.com/StevenGualpa/Api_Historial/Noticias'); // La ruta de tu API
      setnoticeData(response.data);
    } catch (error) {
      console.error('Error al obtener los contenidos de la API:', error);
    }
  };
  useEffect(() => {
    fetchnoticeData();
  }, []);

 
  
  // Función para manejar la acción de presionar una sección
  const handleSectionPress = (section) => {
    if (section === 'Noticias') {
      navigation.navigate("Noticias");
    } else {
      if (section === 'Revistas') {
        navigation.navigate("Revistas");
      } else {
        if (section === 'Contenido') {
          navigation.navigate("Contenido");
        } else {
          console.log(`Redirigiendo a la sección: ${section}`);
        }
      }
    }


  };
  const handleFloatingButtonPress = () => {
    navigation.navigate("ChatBoxito");
    console.log('Botón flotante presionado');
  };
  

  // Función para renderizar las tarjetas de noticias
  const renderNewsCards = () => {
    const visibleNews = noticeData.slice(0, 5); // Mostrar solo los primeros 5 elementos
    return (
      <ScrollView horizontal>
        {visibleNews.map((content) => (
          <View key={content.Titulo} style={styles.cardNoti}>
            <View style={styles.logoContainer}>
              <Image source={{ uri: content.Portada }} style={styles.logo} />
            </View>
            <Text style={styles.title} numberOfLines={2}>{content.Titulo}</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleButtonPress(content.url)}>
              <Text style={styles.buttonText}>Leer más</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    );
  };
  // Función para renderizar las tarjetas de noticias
  const renderMagazineCards = () => {
    const visibleMagazines = magazineData.slice(0, 5); // Mostrar solo los primeros 5 elementos
    return (
      <ScrollView horizontal>
        {visibleMagazines.map((content) => (
          <View key={content.Titulo} style={styles.cardRevis}>
            <View style={styles.logoContainer}>
              <Image source={{ uri: content.Portada }} style={styles.logoRevis} />
            </View>
            <Text style={styles.title} numberOfLines={2}>{content.Titulo}</Text>
            <Text style={styles.category}>{content.date}</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleButtonPress(content.url)}>
              <Text style={styles.buttonText}>Leer más</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    );
  };
  
  // Función para renderizar las tarjetas de contenido
  const renderContentCards = () => {
    const visibleContent = contentData.slice(0, 5); // Mostrar solo los primeros 5 elementos
    return (
      <ScrollView horizontal>
      {loading ? (
        <ActivityIndicator size="large" color="green" style={styles.loadingIndicator} />
      ) : (
        visibleContent.map((content) => (
          <View key={content.id} style={[styles.cardConte, styles.contentCard]}>
            <View style={styles.contentContainer}>
              <Image source={{ uri: content.url_imageb }} style={styles.contentImage} />
              <Text style={styles.titleconte} numberOfLines={1}>{content.titulo}</Text>
              <Text>{moment(content.UpdatedAt).format('DD MMM YYYY')}</Text>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleButtonPress(content.url_video)}
            >
              <Text style={styles.buttonText}>Visualizar</Text>
            </TouchableOpacity>
          </View>
        ))
        )}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {/* Secciones del contenido */}
        <TouchableOpacity style={styles.sectionHeader} onPress={() => handleSectionPress('Noticias')}>
          <Text style={styles.sectionTitle}>Noticias</Text>
        </TouchableOpacity>
        {renderNewsCards()}

        <TouchableOpacity style={styles.sectionHeader} onPress={() => handleSectionPress('Revistas')}>
          <Text style={styles.sectionTitle}>Revistas</Text>
        </TouchableOpacity>
        {renderMagazineCards()}

        <TouchableOpacity style={styles.sectionHeader} onPress={() => handleSectionPress('Contenido')}>
          <Text style={styles.sectionTitle}>Contenido</Text>
        </TouchableOpacity>
        {renderContentCards()}
      </ScrollView>

      {/* Botón flotante */}
      <Animated.View
        style={styles.floatingButton}
      >
        <TouchableOpacity style={styles.floatingButtonTouchable} onPress={handleFloatingButtonPress}>
          <Icon name="comments" size={24} color="#ffffff" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f5f6fa',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#46741e',
    textAlign: 'left',
    marginLeft: 10,
  },
  cardRevis: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginRight: 10,
    height: 350, // Actualiza el valor de height para ajustar la altura de las tarjetas
  },
  cardNoti: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginRight: 10,
    height: 275, // Actualiza el valor de height para ajustar la altura de las tarjetas
  },
  cardConte: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginRight: 10,
    height: 300, // Actualiza el valor de height para ajustar la altura de las tarjetas
  },
  contentCard: {
    marginTop: 12,
    width: 210,
    height: 210, // Ajusta el ancho de la tarjeta de contenido según tus necesidades
    marginBottom: 40
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 160,
    height: 135,
    borderRadius: 15,
    resizeMode: 'stretch'
  },
  logoRevis: {
    width: 195,
    height: 180,
    resizeMode: 'contain'
  },
  contentImage: {
    width: 100,
    height: 100,
  },
  title: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    alignContent:'center'
  },
  titleconte: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: 'bold',

    alignContent:'center',
    textAlign: 'center',
  },
  category: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#46741e',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  titleContainer: {
    height: 48, // Ajusta esta altura según el tamaño de fuente y otros estilos del título
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#46b41e',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  floatingButtonText: {
    fontSize: 30,
    color: '#ffffff',
  },
});


export default Home;
