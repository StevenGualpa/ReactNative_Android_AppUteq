import React from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ProfileScreen = () => {
  
  
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('./src/perfiluteq.jpeg')}
        style={styles.backgroundImage}
      >
        <TouchableOpacity style={styles.button}>
          <Icon name="arrow-left" size={windowWidth * 0.05} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.profileContainer}>
          <Image
            source={require('./iconos/Tiktokicon.png')}
            style={styles.profilePicture}
          />
          <Text style={styles.label}>Nombre:</Text>
          <Text style={styles.text}>John Doe</Text>

          <Text style={styles.label}>Correo:</Text>
          <Text style={styles.text}>johndoe@example.com</Text>

        </View>
      </ImageBackground>
    </View>
  );
};
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  button: {
    position: 'absolute',
    top: windowHeight * 0.03,
    left: windowWidth * 0.03,
    zIndex: 1,
    backgroundColor: '#46741e',
    borderRadius: windowWidth * 0.05,
    padding: windowWidth * 0.03,
  },
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: windowWidth * 0.05,
    margin: windowWidth * 0.05,
    borderRadius: windowWidth * 0.02,
  },
  profilePicture: {
    width: windowWidth * 0.3,
    height: windowWidth * 0.3,
    borderRadius: (windowWidth * 0.3) / 2,
    marginBottom: windowHeight * 0.02,
  },
  label: {
    fontSize: windowWidth * 0.04,
    fontWeight: 'bold',
    color:'#46b41e',
    marginBottom: windowHeight * 0.01,
  },
  text: {
    fontSize: windowWidth * 0.04,
    marginBottom: windowHeight * 0.02,
  },
});

export default ProfileScreen;

