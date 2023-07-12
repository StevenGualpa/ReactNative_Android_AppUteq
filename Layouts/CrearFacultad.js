import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions, ScrollView } from 'react-native';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const App = () => {
  const [nombre, setNombre] = useState('');
  const [mision, setMision] = useState('');
  const [vision, setVision] = useState('');

  const handleGuardar = async () => {
    if (nombre.trim() === '' || mision.trim() === '' || vision.trim() === '') {
      Alert.alert('Error', 'No puedes dejar campos en blanco');
      return;
    }

    try {
      const db = getFirestore();
      const facultadesCollection = collection(db, 'Facultades');
      const nuevaFacultad = {
        nombre,
        mision,
        vision,
        timestamp: serverTimestamp(),
      };
      await addDoc(facultadesCollection, nuevaFacultad);
      console.log('Facultad guardada en Firebase:', nuevaFacultad);

      setNombre('');
      setMision('');
      setVision('');

      Alert.alert('Éxito', 'Facultad guardada correctamente');
    } catch (error) {
      console.error('Error al guardar la facultad en Firebase:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Agregar facultad</Text>
      <View style={{width:340, marginBottom:5}}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.form}>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldTitle}>Nombre:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese el nombre"
              value={nombre}
              onChangeText={setNombre}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldTitle}>Misión:</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Ingrese la misión"
              multiline
              value={mision}
              onChangeText={setMision}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldTitle}>Visión:</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Ingrese la visión"
              multiline
              value={vision}
              onChangeText={setVision}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleGuardar}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      </View>
     
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#46b41e',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width:'100%'
  },
  form: {
    width: '100%',
  },
  fieldContainer: {
    marginBottom: 10,
  },
  fieldTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#46b41e',
    marginBottom: 2,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 14,
    padding: 10,
  },
  textarea: {
    height: 100,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#46b41e',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    width: windowWidth * 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default App;
