import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Linking, Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // Importar los iconos necesarios

const { width } = Dimensions.get('window');
const cardWidth = width * 0.9; // Ancho de la tarjeta del 90% del ancho de la pantalla

const NewsCard = ({ image, title, category }) => {
  const handleReadMore = () => {
    Linking.openURL('https://www.uteq.edu.ec/comunicacion/noticia/convocatoria-a-concurso-de-cortometraje-crear-conciencia-ambiental');
  };

  return (
    <View style={styles.card}>
      <Image source={image} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.category}>{category}</Text>
      <TouchableOpacity style={styles.button} onPress={handleReadMore}>
        <View style={styles.buttonContent}>
          <Image source={require('./iconos/leer mas.png')} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Leer más</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const ViewNotice = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Vista de revistas</Text>
      <ScrollView>
        <NewsCard
          image={require('./iconos/refresh.png')}
          title="Título de la revista 1"
          category="Categoría 1"
        />
        <NewsCard
          image={require('./iconos/refresh.png')}
          title="Título de la revista 2"
          category="Categoría 2"
        />
        {/* Agrega más tarjetas de noticias aquí */}
      </ScrollView>
    </View>
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
    color: '#46741e',
    marginBottom: 20,
    textAlign: 'center', // Centra el encabezado
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
    width: cardWidth, // Ancho de la tarjeta
    alignSelf: 'center', // Centra la tarjeta horizontalmente
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
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
    backgroundColor: '#46741e',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ViewNotice;
