import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/FontAwesome";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Prefer } from "./Preferencias";
import LoginScreen from "./InicioSesion";
import ContentCard from "./VisualizadorContenidos";
import ViewNotice from "./VisualizarNoticias";
import Home from "./Home";
import NavigationBar from "./NavBarUp";
import MenuComple from "./Menu";
import ViewRevista from './VisualizadorRevista'
import ChatScreen from "./ChatBox";
import Contenido from "./Contenido";
import App from "./CrearFacultad";
import AppUsuario from "./CrearUsuario";
import AppGestion from "./GestionContenido";
import FacultadCard from "./GestionFacu";
import ProfileCard from "./GestionesUsusario";
import ProfileScreen from "./Perfil";
import FacuDetails from "./Mostrarfacultad";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const stack2 = createStackNavigator();
const stack3 = createStackNavigator();

function Perfiles() {
  return (
    <stack3.Navigator>
      <stack3.Screen
        name="perfil"
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <stack2.Screen
        name="out"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />

    </stack3.Navigator>

  );
}
function Chatboxito() {
  return (
    <stack2.Navigator>
      <stack2.Screen
        name="Menu"
        component={MenuComple}
        options={{
          headerShown: false,
        }}
      />
      <stack2.Screen
        name="ChatBox"
        component={ChatScreen}
        options={{
          headerShown: false,
        }}
      />
      <stack2.Screen
        name="Conten"
        component={Contenido}
        options={{
          headerShown: false,
        }}
      />
      <stack2.Screen
        name="ContenG"
        component={AppGestion}
        options={{
          headerShown: false,
        }}
      />
      <stack2.Screen
        name="Facul"
        component={App}
        options={{
          headerShown: false,
        }}
      />
      <stack2.Screen
        name="FaculG"
        component={FacultadCard}
        options={{
          headerShown: false,
        }}
      />
      <stack2.Screen
        name="User"
        component={AppUsuario}
        options={{
          headerShown: false,
        }}
      />
      <stack2.Screen
        name="UserG"
        component={ProfileCard}
        options={{
          headerShown: false,
        }}
      />
    </stack2.Navigator>
  );
}
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Noticias"
        component={ViewNotice}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Revistas"
        component={ViewRevista}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Contenido"
        component={ContentCard}
        options={{
          headerShown: false,
        }}
      />
      <stack2.Screen
        name="ChatBoxito"
        component={ChatScreen}
        options={{
          headerShown: false,
        }}
      />
      <stack2.Screen name="facultades"
      component={FacuDetails}
      options={{headerShown:false}}/>
    </Stack.Navigator>
  );
}

function MyTabs() {
  return (
    <>
      <NavigationBar />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = focused ? "home" : "home";
            } else if (route.name === "Preferencias") {
              iconName = focused ? "gear" : "gear";
            } else if (route.name === "Menu") {
              iconName = focused ? "bars" : "bars";
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: "#46741e",
          inactiveTintColor: "#d5d3e0",
        }}
      >
        <Tab.Screen
          name="Inicio"
          component={HomeStack} // Utilizamos el stack que contiene Home, Noticias y ViewRevista
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Preferencias"
          component={Prefer}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Menu"
          component={Chatboxito}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Perfil"
          component={Perfiles}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account" color={color} size={26} />
            ),
          }}
        />


      </Tab.Navigator>
    </>
  );
}

export default function Navigation() {
  const userIsAuthenticated = true;
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
      <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="NavigationBar" component={MyTabs} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
