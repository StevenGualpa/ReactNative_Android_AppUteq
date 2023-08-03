import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Linking, RefreshControl, ActivityIndicator } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import moment from 'moment';
import 'moment/locale/es'; 
moment.locale('es');
const ContentCard = () => {
  const [contentData, setContentData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchContentData();
    setRefreshing(false);
  };

  const handleReadMore = (link) => {
    Linking.openURL(link);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.header}>Vista de contenido</Text>
      {loading ? (
        <ActivityIndicator size="large" color="green" style={styles.loadingIndicator} />
      ) : (
        contentData.map((content) => (
          <View key={content.ID} style={styles.card}>
            <View style={styles.logoContainer}>
            <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>{content.titulo}</Text>
              <Image source={{ uri: content.url_imageb }} style={styles.logo} />
            </View>
            <View>
            <Text style={styles.fecha}>{moment(content.UpdatedAt).format('LL')}</Text>
              <Text style={styles.description}>{content.descripcion}</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => handleReadMore(content.url_video)}>
              <Icon name="external-link" size={20} color="white" />
              <Text style={styles.buttonText}>Ver contenido</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
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
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
      width: 120, // Ajusta el ancho de la imagen según tu preferencia
      height: 150, // Ajusta el alto de la imagen según tu preferencia
      borderRadius: 10,
      marginTop:7,
  },
  title: {
    flex: 1, // Permite que el título tome el espacio restante en la misma fila del logo
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
    
  },
  button: {
    backgroundColor: '#46741e',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  description: {
    flex: 1,
    marginVertical: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  fecha:{textAlign:'center',
  marginBottom:6,
  marginTop:4},
});

export default ContentCard;
