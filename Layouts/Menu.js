import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ModalContenido from './ModalContenido';
import ModalFacultades from './ModalFacu';

const { width } = Dimensions.get('window');
const MenuComple = () => {
  const cardWidthMenu = (width - 70) / 2; // El ancho de cada tarjeta se ajusta según el tamaño de la pantalla
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalFacultadesVisible, setModalFacultadesVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleModalFacultades = () => {
    setModalFacultadesVisible(!isModalFacultadesVisible);
  };

  const Card = ({ iconName, title, onPress }) => (
    <TouchableOpacity style={[styles.card, { width: cardWidthMenu, height: cardWidthMenu }]} onPress={onPress}>
      <Ionicons name={iconName} size={60} color="#46b41e" />
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Menú</Text>
      </View>
      <View style={styles.column}>
        <View style={styles.cardContainer}>
          <Card iconName="md-document" title="Contenido" onPress={toggleModal} />
        </View>
        <View style={styles.cardContainer}>
          <Card iconName="md-school" title="Facultades" onPress={toggleModalFacultades} />
        </View>
      </View>
      <ModalContenido isVisible={isModalVisible} onClose={toggleModal} cardWidth={cardWidthMenu} />
      <ModalFacultades isVisible={isModalFacultadesVisible} onClose={toggleModalFacultades} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexDirection: 'column',
    backgroundColor: '#f5f6fa',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#46b41e',
  },
  column: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  cardContainer: {
    marginBottom: 20,
    backgroundColor: '#f5f6fa', // Espacio vertical entre las tarjetas
  },
  card: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f5f6fa',
    elevation: 10,
    backgroundColor: '#f5f6fa',
  },
  title: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MenuComple;
