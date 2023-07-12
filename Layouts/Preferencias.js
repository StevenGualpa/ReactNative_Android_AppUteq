import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export function Prefer() {
  const [checkedItems, setCheckedItems] = useState([]);
  const [facultades, setFacultades] = useState([]);

  useEffect(() => {
    const fetchFacultades = async () => {
      try {
        const db = getFirestore();
        const facultadesCollection = collection(db, 'Facultades');
        const facultadesSnapshot = await getDocs(facultadesCollection);
        const facultadesData = facultadesSnapshot.docs.map((doc) => doc.data().nombre);
        setFacultades(facultadesData);
      } catch (error) {
        console.error('Error al obtener las facultades:', error);
      }
    };

    fetchFacultades();
  }, []);

  const handleCheckboxChange = (item) => {
    if (checkedItems.includes(item)) {
      setCheckedItems(checkedItems.filter((checkedItem) => checkedItem !== item));
    } else {
      if (checkedItems.length < 3) {
        setCheckedItems([...checkedItems, item]);
      }
    }
  };

  const renderCheckbox = (item) => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preferencias</Text>
      <ScrollView contentContainerStyle={styles.checkboxContainer}>
        {facultades.map((facultad) => renderCheckbox(facultad))}
      </ScrollView>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#46b41e' }]}
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
    color: '#46b41e',
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
