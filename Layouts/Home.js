import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Linking,RefreshControl  } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import axios from 'axios';
import { useNavigation } from "@react-navigation/native";


const Home = () => {
  const navigation = useNavigation();

  //declaracion de estados
  const [refreshing, setRefreshing] = useState(false);
  const [contentData, setContentData] = useState([]);
  const [magazineData, setMagazineData] = useState([]);
  const [noticeData, setnoticeData] = useState([]);
  
  // Función para obtener los contenidos desde Firebase
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
   
  // Función para manejar la acción de presionar un botón
  const handleButtonPress = (link) => {
    Linking.openURL(link);
  };
// Función para manejar el evento de "pull to refresh" en la lista de contenidos
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
// Función para renderizar las tarjetas de noticias
  const renderNewsCards = () => {
    const visibleNews = noticeData.slice(0, 5); // Mostrar solo los primeros 5 elementos
    return (
      <ScrollView horizontal>
        {visibleNews.map((content) => (
          <View key={content.Titulo} style={styles.card}>
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
          <View key={content.Titulo} style={styles.card}>
            <View style={styles.logoContainer}>
              <Image source={{ uri: content.Portada }} style={styles.logo} />
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
        {visibleContent.map((content) => (
          <View key={content.id} style={[styles.card, styles.contentCard]}>
            <View style={styles.contentContainer}>
              <Image source={require('./iconos/Tiktokicon.png')} style={styles.contentImage} />
            </View>
            <Text style={styles.title} numberOfLines={1}>{content.titulo}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleButtonPress(content.url)}
            >
              <Text style={styles.buttonText}>Visualizar</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    color: 'green',
    textAlign: 'left',
    marginLeft: 10,
  },
  card: {
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
    height: 150, // Ajusta el ancho de la tarjeta de contenido según tus necesidades
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
    width: 165,
    height: 135,    
    borderRadius:15,
    resizeMode:'stretch'
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
  },
  category: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#46b41e',
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
});

export default Home;
