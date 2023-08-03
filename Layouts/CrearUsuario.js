import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const AppUsuario = () => {
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [rcontrasena, setrContrasena] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordText, setShowPasswordText] = useState(true);
    const [showrPasswordText, setShowrPasswordText] = useState(true);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
   
    const alertMessageStyles = { textAlign: 'center' };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
        setShowPasswordText(!showPasswordText);
    };
    const toggleShowRepeatPassword = () => {
        setShowRepeatPassword(!showRepeatPassword);
        setShowrPasswordText(!showrPasswordText); 
    };
  
   //AQUI PREGUNTAMOS SI DESEA GENERAR U NUEVO CODIGO DE VERIFICACION
   const handleGenerateVerificationCode = () => {
    if (generatedCode !== '') {
      Alert.alert(
        'Generar nuevo código de verificación',
        '¿Estás seguro de que deseas generar un nuevo código de verificación?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Generar',
            onPress: () => {
              generateVerificationCode();
            },
          },
        ],
        { cancelable: true }
      );
    } else {
      generateVerificationCode();
    }
  };

    //VALIDACION DE LOS NOMBRE Y APELLIDOS SIN NUMEROS
    const isValidName = (value) => {
        const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
        return regex.test(value);
    };

    const isValidApellido = (value) => {
        const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
        return regex.test(value);
    };
    //VALIDACION PARA LA CQUE LA CLAVE DEBA CONTENER MAYUSCULAS, MINUSCULAS, NUMERO Y CARACTERES ESPECIALES DE 8 A 15
  const isValidPassword = (value) => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+,\-./:;<=>?@[\\\]^_`{|}~]).{8,15}$/;
    return regex.test(value);
  };
  
  const generateVerificationCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    console.log(code);
  };

    const handleGuardarUsuario = () => {

        // Validar campos vacíos
        if (!nombre.trim() || !apellidos.trim() || !correo.trim() || !contrasena.trim() || !rcontrasena.trim()|| !verificationCode.trim() ) {
            Alert.alert('Campos vacíos', 'Por favor, complete todos los campos antes de guardar el usuario.');
            return;
        }

        // Validar que no se ingresen números en nombre y apellidos
        const regex = /\d/;
        if (regex.test(nombre) || regex.test(apellidos)) {
            Alert.alert('Nombre o apellidos inválidos', 'Por favor, no ingrese números en el nombre o apellidos.',[{ text: 'OK'}],
            {  multiline: true, style: alertMessageStyles });
            return;
        }
        const isValidInstitucionalPassword = isValidPassword(contrasena);
      if (!isValidInstitucionalPassword) {
        Alert.alert('Contraseña','La clave debe tener entre 8 y 15 caracteres y contener letras mayúsculas, minúsculas, números y caracteres especiales.',[{ text: 'OK'}],
        {  multiline: true, style: alertMessageStyles }
        );
        return;
      }

        // Validar el formato del correo
        const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!correoRegex.test(correo)) {
            Alert.alert('Correo inválido', 'Por favor, ingrese un correo válido.',[{ text: 'OK'}],
            {  multiline: true, style: alertMessageStyles });
            return;
        }

        // Validar que el correo sea de dominio @uteq.edu.ec
        if (!correo.endsWith('@uteq.edu.ec')) {
            Alert.alert('Correo inválido', 'Por favor, ingrese un correo con dominio @uteq.edu.ec.',[{ text: 'OK'}],
            {  multiline: true, style: alertMessageStyles });
            return;
        }
        if (contrasena !== rcontrasena) {
            Alert.alert('Repetir contraseña','Las contraseñas no coinciden.',[{ text: 'OK'}],
            {  multiline: true, style: alertMessageStyles });
            return;
          }
          if (verificationCode !== generatedCode) {
            Alert.alert('Codigo de verificación','Código de verificación incorrecto. Por favor, inténtalo de nuevo.',[{ text: 'OK'}],
            {  multiline: true, style: alertMessageStyles });
            return;
          }
        
        // Aquí puedes realizar el guardado del usuario en tu base de datos o realizar la acción necesaria
        console.log('Guardar Usuario');
        // Limpia los campos después de guardar
        setNombre('');
        setApellidos('');
        setCorreo('');
        setContrasena('');
        setrContrasena('');
        setVerificationCode('');

    };
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Agregar Usuario</Text>
            <View style={{ width: 340, marginBottom: 35 }}>
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <View style={styles.form}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldTitle}>Nombre</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ingrese Nombre"
                                value={nombre}
                                onChangeText={(value) => {
                                    if (isValidName(value)) {
                                      setNombre(value);
                                    }
                                  }}
                            />
                        </View>
                        <Text style={styles.textSeparator} />
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldTitle}>Apellidos</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ingrese Apellidos"
                                value={apellidos}
                                onChangeText={(value) => {
                                    if (isValidApellido(value)) {
                                      setApellidos(value);
                                    }
                                  }}
                            />
                        </View>
                        <Text style={styles.textSeparator} />
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldTitle}>Correo</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ingrese Correo electrinico"
                                multiline
                                value={correo}
                                onChangeText={setCorreo}
                            />
                        </View>
                        <Text style={styles.textSeparator} />
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldTitle}>Contraseña</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ingrese Contraseña"
                                    value={contrasena}
                                    secureTextEntry={showPasswordText}
                                    onChangeText={setContrasena}
                                />
                                <TouchableOpacity
                                    style={styles.showPasswordButton}
                                    onPress={toggleShowPassword}
                                >
                                    <Icon
                                        name={showPassword ? 'eye-slash' : 'eye'}
                                        size={20}
                                        color="gray"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text style={styles.textSeparator} />
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldTitle}> Repetir Contraseña</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Repetir Contraseña"
                                    value={rcontrasena}
                                    secureTextEntry={showrPasswordText}
                                    onChangeText={setrContrasena}
                                />
                                <TouchableOpacity
                                    style={styles.showPasswordButton}
                                    onPress={toggleShowRepeatPassword}
                                >
                                    <Icon
                                        name={showRepeatPassword  ? 'eye-slash' :'eye'}
                                        size={20}
                                        color="gray"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text style={styles.textSeparator} />
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldTitle}> codigo de verificación</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ingresar el codigo de verificacion"
                                    value={verificationCode}
                                    onChangeText={setVerificationCode}
                                />
                                <TouchableOpacity
                                    style={styles.showPasswordButton}
                                    onPress={handleGenerateVerificationCode}
                                >
                                    <Icon name="refresh" size={20} color="gray" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Text style={styles.textSeparator} />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={handleGuardarUsuario}>
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
        width: '100%',
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
    passwordContainer: {
        position: 'relative',
    },
    showPasswordButton: {
        position: 'absolute',
        top: 5,
        right: 10,
        padding: 10,
    },
    buttonContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#46741e',
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

export default AppUsuario;
