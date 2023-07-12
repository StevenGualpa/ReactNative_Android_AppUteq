import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Linking,RefreshControl } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const ContentCard = ({ logo, title }) => {
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
  


  const handleReadMore = (link) => {
    Linking.openURL(link);
  };

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <Text style={styles.header}>Visualizador de contenido</Text>
    {contentData.map((content) => (
    <View key={content.id} style={styles.card}>
      <View style={styles.logoContainer}>
        <Image source={require('./iconos/Tiktokicon.png')} style={styles.logo} />
        <Text style={styles.title}>{content.titulo}</Text>
      </View>
      <View>
      <Text style={styles.description}>{content.descripcion}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => handleReadMore(content.url)}>
        <Text style={styles.buttonText}>Ver contenido</Text>
      </TouchableOpacity>
    </View>
    ))}
    </ScrollView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f6fa', // Cambia el fondo del interfaz a #f5f6fa
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 20,
    textAlign: 'center', // Centra el encabezado
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 45,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 70,
    height: 50,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  button: {
    backgroundColor: '#46b41e',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 1,
    width: '100%',
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default ContentCard;
