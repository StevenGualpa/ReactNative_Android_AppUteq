import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { CheckBox } from 'react-native-elements';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export function Prefer() {
  const [checkedItems, setCheckedItems] = useState([]);

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
        {renderCheckbox('Facultad de Ciencias de la Salud')}
        {renderCheckbox('Facultad de Ciencias de la Educación')}
        {renderCheckbox('Facultad de Ciencias de la Ingeniería')}
        {renderCheckbox('Facultad de Ciencias de la Industria y Producción')}
        {renderCheckbox('Facultad de Ciencias Agrarias y Forestales')}
        {renderCheckbox('Facultad de Ciencias Sociales, Económicas y Financieras')}
        {renderCheckbox('Facultad de Ciencias Empresariales')}
        {renderCheckbox('Facultad de Ciencias Pecuarias y Biológicas')}
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
