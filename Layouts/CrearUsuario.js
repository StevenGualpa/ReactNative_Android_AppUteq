import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions, ScrollView } from 'react-native';

const AppUsuario = () => {
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');

    const handleGuardarUsuario = () => {
        // Validar campos vacíos
        if (!nombre.trim() || !apellidos.trim() || !correo.trim() || !contrasena.trim()) {
            Alert.alert('Campos vacíos', 'Por favor, complete todos los campos antes de guardar el usuario.');
            return;
        }

        // Validar que no se ingresen números en nombre y apellidos
        const regex = /\d/;
        if (regex.test(nombre) || regex.test(apellidos)) {
            Alert.alert('Nombre o apellidos inválidos', 'Por favor, no ingrese números en el nombre o apellidos.');
            return;
        }

        // Validar el formato del correo
        const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!correoRegex.test(correo)) {
            Alert.alert('Correo inválido', 'Por favor, ingrese un correo válido.');
            return;
        }
  
        // Validar que el correo sea de dominio @uteq.edu.ec
        if (!correo.endsWith('@uteq.edu.ec')) {
            Alert.alert('Correo inválido', 'Por favor, ingrese un correo con dominio @uteq.edu.ec.');
            return;
        }

        // Aquí puedes realizar el guardado del usuario en tu base de datos o realizar la acción necesaria
        console.log('Guardar Usuario');
        // Limpia los campos después de guardar
        setNombre('');
        setApellidos('');
        setCorreo('');
        setContrasena('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Agregar Usuario</Text>
            <View style={{ width: 340, marginBottom: 5 }}>
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <View style={styles.form}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldTitle}>Nombre</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ingrese Nombre"
                                value={nombre}
                                onChangeText={setNombre}
                            />
                        </View>
                        <Text style={styles.textSeparator} />
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldTitle}>Apellidos</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ingrese Apellidos"
                                value={apellidos}
                                onChangeText={setApellidos}
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
                            <TextInput
                                style={styles.input}
                                placeholder="Ingrese Contraseña"
                                multiline
                                value={contrasena}
                                onChangeText={setContrasena}
                            />
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
        width: '100%'
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
        color: '#black',
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

export default AppUsuario;
