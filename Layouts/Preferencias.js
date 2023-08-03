import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions, FlatList, RefreshControl } from 'react-native';
import { CheckBox } from 'react-native-elements';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export function Prefer() {
  const [checkedItems, setCheckedItems] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://noticias-uteq-4c62c24e7cc5.herokuapp.com/facultades/getall');
      const data = await response.json();
      const facultadesData = data.facultad.map((facultad) => facultad.nombre);
      setFacultades(facultadesData);
    } catch (error) {
      console.error('Error al obtener las facultades:', error);
    }
  };

  const handleCheckboxChange = (item) => {
    if (checkedItems.includes(item)) {
      setCheckedItems(checkedItems.filter((checkedItem) => checkedItem !== item));
    } else {
      if (checkedItems.length < 3) {
        setCheckedItems([...checkedItems, item]);
      }
    }
  };

  const renderCheckbox = ({ item }) => {
    const isChecked = checkedItems.includes(item);
    return (
      <CheckBox
        key={item}
        title={item}
        size={windowHeight * 0.03}
        checked={isChecked}
        checkedColor="#46b41e"
        onPress={() => handleCheckboxChange(item)}
      />
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData(); // Cargar nuevamente los datos
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preferencias</Text>
      <FlatList
        data={facultades}
        renderItem={renderCheckbox}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.checkboxContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#46741e' }]}
        onPress={() => console.log('Opciones seleccionadas:', checkedItems)}
      >
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: windowWidth * 0.05,
    backgroundColor: '#f5f6fa',
  },
  title: {
    fontSize: windowHeight * 0.04,
    fontWeight: 'bold',
    marginBottom: windowHeight * 0.01,
    color: '#46741e',
  },
  checkboxContainer: {
    paddingTop: windowHeight * 0.02,
    paddingBottom: windowHeight * 0.02,
    width: windowWidth * 0.9,
  },
  button: {
    paddingVertical: windowHeight * 0.015,
    paddingHorizontal: windowWidth * 0.05,
    borderRadius: windowHeight * 0.01,
    marginTop: windowHeight * 0.02,
    marginBottom: windowHeight * 0.01,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: windowHeight * 0.025,
  },
});
