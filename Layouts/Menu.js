import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Text } from 'react-native';
import ModalContenido from './ModalContenido';
import ModalFacultades from './ModalFacu';
import ModalUsuario from './ModalUsuario'
import { BotonContenido, BotonFacultades, BotonChatBox, BotonUsuarios } from './Components/cardsmenu';
import { useNavigation } from "@react-navigation/native";
const { width } = Dimensions.get('window');

const MenuComple = () => {
  const cardWidthMenu = (width - 70) / 2;
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalFacultadesVisible, setModalFacultadesVisible] = useState(false);
  const [isModalUsuarioVisible, setModalUsuarioVisible] = useState(false);
  const navigation = useNavigation();
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const handleChatBoxPress = () => {
    navigation.navigate("ChatBox");
  };
  const toggleModalFacultades = () => {
    setModalFacultadesVisible(!isModalFacultadesVisible);
  };
  const toggleModalUsuario = () => {
    setModalUsuarioVisible(!isModalUsuarioVisible);
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Menú</Text>
      </View>
      <View style={styles.column}>
        <View style={styles.cardContainer}>
          <BotonContenido onPress={toggleModal} />
        </View>
        <View style={styles.cardContainer}>
          <BotonFacultades onPress={toggleModalFacultades} />
        </View>        
      </View>
      <View style={styles.column}>
        <View style={styles.cardContainer}>
          <BotonChatBox onPress={handleChatBoxPress} />
        </View>
        <View style={styles.cardContainer}>
          <BotonUsuarios onPress={toggleModalUsuario} />
        </View>
                
      </View>
      
      <ModalContenido isVisible={isModalVisible} onClose={toggleModal} cardWidth={cardWidthMenu} />
      <ModalFacultades isVisible={isModalFacultadesVisible} onClose={toggleModalFacultades} />
      <ModalUsuario isVisible={isModalUsuarioVisible} onClose={toggleModalUsuario} />
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
    width:150,
    backgroundColor: '#f5f6fa',
  },
});

export default MenuComple;
