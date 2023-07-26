import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions, ScrollView } from 'react-native';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const App = () => {
  const [nombre, setNombre] = useState('');
  const [mision, setMision] = useState('');
  const [vision, setVision] = useState('');
 
  // Función para manejar la acción de guardar la facultad
  const handleGuardar = async () => {
    // Validar campos vacíos
    if (nombre.trim() === '' || mision.trim() === '' || vision.trim() === '') {
      Alert.alert('Error', 'No puedes dejar campos en blanco');
      return;
    }

    try {
      // Obtener la instancia de Firestore
      const db = getFirestore();

      // Obtener la colección "Facultades"
      const facultadesCollection = collection(db, 'Facultades');

      // Crear un nuevo objeto para la nueva facultad con la información ingresada
      const nuevaFacultad = {
        nombre,
        mision,
        vision,
        timestamp: serverTimestamp(),
      };

      // Agregar el nuevo objeto a la colección "Facultades"
      await addDoc(facultadesCollection, nuevaFacultad);

      // Mostrar un mensaje de éxito y limpiar los campos
      console.log('Facultad guardada en Firebase:', nuevaFacultad);
      setNombre('');
      setMision('');
      setVision('');
      Alert.alert('Éxito', 'Facultad guardada correctamente');
    } catch (error) {
      // En caso de error, mostrar un mensaje de error en la consola
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
            <Text style={styles.fieldTitle}>Nombre</Text>
            <TextInput
            style={styles.input}
            placeholder="Ingrese el nombre"
            value={nombre}
            onChangeText={setNombre}
            />
          </View>
          <Text style={styles.textSeparator} />
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldTitle}>Misión</Text>
            <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Ingrese la misión"
            multiline
            value={mision}
            onChangeText={setMision}
            />
          </View>
          <Text style={styles.textSeparator} />
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldTitle}>Visión</Text>
            <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Ingrese la visión"
            multiline
            value={vision}
            onChangeText={setVision}
            />
          </View>
          <Text style={styles.textSeparator} />
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
    marginBottom: 15,
    color: '#46741e',
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
    color: 'black',
    marginBottom: 2,
    marginTop: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 14,
    padding: 10,
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
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
  textSeparator: {
    height: 20, // Ajusta el valor para el espacio deseado entre los Text
  },
});

export default App;
