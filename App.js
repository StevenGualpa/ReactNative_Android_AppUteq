
import { StyleSheet, Text, View } from 'react-native';
import { LoginInic } from './Layouts/Login';//LOGIN 
import { Prefer } from './Layouts/Preferencias';//PREFERENCIAS
import AppNavigator from './Layouts/NavBarDown';//BARRA DE NAVEGACION INFERIOR
import { Contenido } from './Layouts/Contenido';//CREACION DE CONTENIDO
import ProfileScreen from './Layouts/Perfil';
import NavigationBar from './Layouts/NavBarUp';
import Home from './Layouts/Home';
import AppGestion from './Layouts/GestionContenido';
import ContentCard from './Layouts/VisualizadorContenidos';
export default function App() {
  return (
      <AppNavigator/>
  );
}
