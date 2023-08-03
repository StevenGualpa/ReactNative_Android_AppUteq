import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const windowWidth = Dimensions.get('window').width;

const formatVideoURL = (url) => {
  // Comprobar si la URL ya tiene el formato correcto (contiene "embed")
  if (url.includes("embed")) {
    return url; // Si ya tiene el formato correcto, simplemente devolvemos la misma URL
  }

  // Verificar si la URL tiene el formato correcto de YouTube
  if (url.includes("youtube.com/watch?v=")) {
    const videoId = url.split("youtube.com/watch?v=")[1].split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  // Si la URL no es válida, simplemente devolvemos la misma URL
  return url;
};

const FacuCreate = () => {
  const [facultadTitulo, setFacultadTitulo] = useState('');
  const [videoURL, setVideoURL] = useState('');
  const [mision, setMision] = useState('');
  const [vision, setVision] = useState('');
  const [carreras, setCarreras] = useState([{ nombre: '', descripcion: '', imagenURL: '' }]);
  const [loading, setLoading] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleAgregarCarrera = () => {
    setCarreras([...carreras, { nombre: '', descripcion: '', imagenURL: '' }]);
  };

  const handleEliminarCarrera = (index) => {
    const updatedCarreras = [...carreras];
    updatedCarreras.splice(index, 1);
    setCarreras(updatedCarreras);
  };

  const isURLValid = async (url) => {
    try {
      const response = await fetch(url);
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    // Cuando el mensaje de confirmación aparezca, ocultar el modal después de unos segundos (3 segundos)
    if (confirmationVisible) {
      setTimeout(() => {
        setModalVisible(false);
      }, 3000);
    }
  }, [confirmationVisible]);

  const handleGuardar = async () => {
    if (facultadTitulo.trim() === '' || videoURL.trim() === '' || mision.trim() === '' || vision.trim() === '') {
      Alert.alert('Error', 'No puedes dejar campos en blanco');
      return;
    }
  
    if (!(await isURLValid(videoURL))) {
      Alert.alert('Error', 'La URL del video promocional no existe o no es válida');
      return;
    }
  
    // Validar las URLs de las carreras antes de guardarlas
    for (const carrera of carreras) {
      if (!(await isURLValid(carrera.imagenURL))) {
        Alert.alert('Error', 'La URL de la imagen de una carrera no existe o no es válida');
        return;
      }
    }
  
    // Formatear la URL del video promocional antes de guardarla
    const formattedVideoURL = formatVideoURL(videoURL);
  
    const facultadData = {
      nombre: facultadTitulo,
      urlVideo: formattedVideoURL,
      mision: mision,
      vision: vision,
    };

    setLoading(true);

    try {
      const formData = new FormData();
      for (const key in facultadData) {
        formData.append(key, facultadData[key]);
      }

      // Realizar la solicitud POST a la API para registrar la facultad
      const responseFacultad = await fetch('https://noticias-uteq-4c62c24e7cc5.herokuapp.com/facultades/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const dataFacultad = await responseFacultad.json();

      if (!responseFacultad.ok) {
        throw new Error(dataFacultad.msg || 'Error al registrar la facultad');
      }

      // Facultad registrada exitosamente, obtener el ID de la facultad
      const facultadID = dataFacultad.facultad.ID;

      // Registro de carreras
      for (const carrera of carreras) {
        const carreraData = {
          nombre: carrera.nombre,
          descripcion: carrera.descripcion,
          imageURL: carrera.imagenURL,
          facultadID: facultadID,
        };

        const carreraFormData = new FormData();
        for (const key in carreraData) {
          carreraFormData.append(key, carreraData[key]);
        }

        const responseCarrera = await fetch('https://noticias-uteq-4c62c24e7cc5.herokuapp.com/carreras/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: carreraFormData,
        });

        const dataCarrera = await responseCarrera.json();

        if (!responseCarrera.ok) {
          throw new Error(dataCarrera.msg || 'Error al registrar la carrera');
        }

        // Mostrar en el log que se está enviando la URL de la imagen de la carrera
        console.log(`URL de imagen de carrera ${carrera.nombre} enviada: ${carrera.imagenURL}`);
      }

      // Mostrar una alerta de éxito
      Alert.alert('Éxito', 'Facultad y carreras registradas correctamente.');
      setFacultadTitulo('');
      setVideoURL('');
      setMision('');
      setVision('');
      setCarreras([{ nombre: '', descripcion: '', imagenURL: '' }]);
    } catch (error) {
      console.error('Error al registrar:', error);
      Alert.alert('Error', error.message || 'Ha ocurrido un error al registrar la facultad y las carreras. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  
  };
  

  const handleCancelar = () => {
    setFacultadTitulo('');
    setVideoURL('');
    setMision('');
    setVision('');
    setCarreras([{ nombre: '', descripcion: '', imagenURL: '' }]);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <ScrollView>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#46741e', marginBottom: 10 }}>Titulo de la facultad</Text>
        <TextInput
          style={{ backgroundColor: '#FFFFFF', borderRadius: 8, padding: 10 }}
          placeholder="Ingrese el titulo de la facultad"
          value={facultadTitulo}
          onChangeText={setFacultadTitulo}
        />

        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#46741e', marginBottom: 10, marginTop: 20 }}>Video promocional (URL)</Text>
        <TextInput
          style={{ backgroundColor: '#FFFFFF', borderRadius: 8, padding: 10 }}
          placeholder="Ingrese la URL del video promocional"
          value={videoURL}
          onChangeText={setVideoURL}
        />

        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#46741e', marginBottom: 10, marginTop: 20 }}>Mision</Text>
        <TextInput
          style={{ backgroundColor: '#FFFFFF', borderRadius: 8, padding: 10 }}
          placeholder="Ingrese la mision"
          multiline
          value={mision}
          onChangeText={setMision}
        />

        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#46741e', marginBottom: 10, marginTop: 20 }}>Vision</Text>
        <TextInput
          style={{ backgroundColor: '#FFFFFF', borderRadius: 8, padding: 10 }}
          placeholder="Ingrese la vision"
          multiline
          value={vision}
          onChangeText={setVision}
        />

        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#46741e', marginBottom: 10, marginTop: 20 }}>Carreras</Text>
        {carreras.map((carrera, index) => (
          <View key={index} style={{ marginBottom: 20 }}>
            <TextInput
              style={{ backgroundColor: '#FFFFFF', borderRadius: 8, padding: 10 }}
              placeholder="Nombre de la carrera"
              value={carrera.nombre}
              onChangeText={(text) => {
                const updatedCarreras = [...carreras];
                updatedCarreras[index].nombre = text;
                setCarreras(updatedCarreras);
              }}
            />
            <TextInput
              style={{ backgroundColor: '#FFFFFF', borderRadius: 8, padding: 10, marginTop: 10 }}
              placeholder="Descripción de la carrera"
              value={carrera.descripcion}
              onChangeText={(text) => {
                const updatedCarreras = [...carreras];
                updatedCarreras[index].descripcion = text;
                setCarreras(updatedCarreras);
              }}
            />
            <TextInput
              style={{ backgroundColor: '#FFFFFF', borderRadius: 8, padding: 10, marginTop: 10 }}
              placeholder="URL de la imagen de la carrera"
              value={carrera.imagenURL}
              onChangeText={(text) => {
                const updatedCarreras = [...carreras];
                updatedCarreras[index].imagenURL = text;
                setCarreras(updatedCarreras);
              }}
            />
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10,
                backgroundColor: '#d32f2f',
                borderRadius: 8,
                width: 32,
                height: 32,
              }}
              onPress={() => handleEliminarCarrera(index)}
            >
              <Icon name="minus" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
            backgroundColor: '#46741e',
            borderRadius: 8,
            width: 32,
            height: 32,
          }}
          onPress={handleAgregarCarrera}
        >
          <Icon name="plus" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#46741e',
            borderRadius: 8,
            paddingVertical: 12,
            paddingHorizontal: 20,
            width: windowWidth * 0.4,
          }}
          onPress={handleGuardar}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" style={{ marginRight: 8 }} />
          ) : (
            <Icon name="save" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          )}
          <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
            Guardar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#d32f2f',
            borderRadius: 8,
            paddingVertical: 12,
            paddingHorizontal: 20,
            width: windowWidth * 0.4,
          }}
          onPress={handleCancelar}
        >
          <Icon name="times" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
            Cancelar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FacuCreate;
