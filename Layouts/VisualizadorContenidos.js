import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Linking, RefreshControl, ActivityIndicator } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import Icon from "react-native-vector-icons/FontAwesome";

const ContentCard = () => {
  const [contentData, setContentData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContentData();
  }, []);

  const fetchContentData = async () => {
    try {
      const db = getFirestore();
      const contentCollection = collection(db, 'contenidos');
      const contentSnapshot = await getDocs(contentCollection);
      const data = contentSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setContentData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los contenidos de Firebase:', error);
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
      <Text style={styles.header}>Visualizador de contenido</Text>
      {loading ? (
        <ActivityIndicator size="large" color="green" style={styles.loadingIndicator} />
      ) : (
        contentData.map((content) => (
          <View key={content.id} style={styles.card}>
            <View style={styles.logoContainer}>
              <Image source={require('./iconos/Tiktokicon.png')} style={styles.logo} />
              <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>{content.titulo}</Text>
            </View>
            <View>
              <Text style={styles.description}>{content.descripcion}</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => handleReadMore(content.url)}>
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
    color: 'green',
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
    marginLeft: 5,
  },
  button: {
    backgroundColor: '#46b41e',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
  },
  description: {
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
});

export default ContentCard;
