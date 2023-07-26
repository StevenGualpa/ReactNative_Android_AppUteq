import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View,TextInput, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

export function Contenido() {
  const tituloRef = useRef(null);
  const descripcionRef = useRef(null);
  const urlRef = useRef(null);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [url, setUrl] = useState('');

  const handlePublicar = async () => {
    if (!titulo || !descripcion || !url) {
      Alert.alert('Campos vacíos', 'Por favor, completa todos los campos antes de publicar.', [
        {
          text: 'OK',
          onPress: () => {
            if (!titulo) tituloRef.current?.focus();
            else if (!descripcion) descripcionRef.current?.focus();
            else urlRef.current?.focus();
          },
        },
      ]);
      return;
    }

    if (!validateURL(url)) {
      Alert.alert('URL inválida', 'Por favor, ingresa una URL válida.');
      urlRef.current?.focus();
      return;
    }

    try {
      const db = getFirestore();
      const contenidoCollection = collection(db, 'contenidos');
      const nuevoContenido = {
        titulo,
        descripcion,
        url,
        fecha: serverTimestamp() // Agrega la fecha actual al campo "fecha"
      };
      await addDoc(contenidoCollection, nuevoContenido);
      console.log('Datos guardados en Firebase:', nuevoContenido);

      // Mostrar el mensaje de éxito y limpiar los campos
      Alert.alert(
        'Éxito',
        'Contenido agregado correctamente.',
        [
          {
            text: 'Aceptar',
            onPress: () => {
              setTitulo('');
              setDescripcion('');
              setUrl('');
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error al guardar los datos en Firebase:', error);
    }
  };

  const validateURL = (url) => {
    const regex = /^(ftp|http|https):\/\/[^ "]+$/;
    return regex.test(url);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View id="Encabezado" style={styles.container2}>
        <Text style={styles.tituloTexto}>Contenido</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.label}>Titulo</Text>
        <View style={styles.textBoxContainer}>
          <TextInput
          placeholder="Ingrese el titulo"
            ref={tituloRef}
            style={styles.textBox}
            value={titulo}
            onChangeText={(text) => setTitulo(text)}
          />
        </View>
        <Text style={styles.label}>Descripción</Text>
        <View style={styles.textBoxContainer}>
          <TextInput
           placeholder="Ingrese descripcion"
            ref={descripcionRef}
            multiline
            style={styles.textBoxDescri}
            value={descripcion}
            onChangeText={(text) => setDescripcion(text)}
          />
        </View>
        <Text style={styles.label}>Url</Text>
        <View style={styles.textBoxContainer}>
          <TextInput
           placeholder="Ingrese el Url"
            ref={urlRef}
            style={styles.textBoxUrl}
            value={url}
            onChangeText={(text) => setUrl(text)}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.publicarButton} onPress={handlePublicar}>
        <Text style={styles.publicarButtonText}>Publicar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f6fa',
    alignItems: 'center',
    paddingTop: height * 0.05,
    paddingBottom: height * 0.1, // Ajustar el espacio inferior
  },
  container2: {
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  encabezadoTexto: {
    fontSize: width * 0.04,
    color: '#d5d3e0',
  },
  tituloTexto: {
    fontSize: width * 0.09,
    color: '#46741e',
    fontWeight: 'bold',
    marginTop: height * 0.01,
  },
  contentContainer: {
    width: width * 0.9,
    marginTop: height * 0.002,
  },
  label: {
    fontSize: width * 0.05,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: height * 0.02,
    marginTop: height*0.03,
  },
  textBoxContainer: {
    backgroundColor: 'white',
    borderRadius: 7,
    marginTop: height * 0.001,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textBox: {
    fontSize: width * 0.04,
    borderWidth: 0,
    color: 'black',
    padding: width * 0.03,
    borderRadius: width * 0.1,
  },
  textBoxDescri: {
    fontSize: width * 0.04,
    color: 'black',
    padding: width * 0.03,
    borderRadius: width * 0.1,
    height: height * 0.2,
    textAlignVertical: 'top',
  },
  textBoxUrl: {
    fontSize: width * 0.04,
    borderWidth: 0,
    color: 'black',
    padding: width * 0.03,
    borderRadius: width * 0.1,
  },
  publicarButton: {
    backgroundColor: '#46741e',
    borderRadius: width * 0.1,
    width: width * 0.5,
    alignSelf: 'center',
    marginTop: height * 0.05,
    paddingVertical: height * 0.02,
  },
  publicarButtonText: {
    fontSize: width * 0.05,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Contenido;
