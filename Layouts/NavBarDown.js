import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import AppGestion from "./GestionContenido";
import { Prefer } from "./Preferencias";
import { LoginInic } from "./Login";
import { Contenido } from "./Contenido";
import ViewNotice from "./VisualizarNoticias";
import Home from "./Home";
import NavigationBar from "./NavBarUp";
import MenuComple from "./Menu";
import ViewRevista from './VisualizadorRevista'

const Tab = createBottomTabNavigator();

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
              iconName = focused ? "bars" : "bars"; // Cambiado a "bars" para el icono de menú
            } else if (route.name==="Noticias"){
              iconName = focused ? "news" : "news";
            } 
            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: "green",
          inactiveTintColor: "gray",
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
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
          component={MenuComple}
          options={{
            headerShown: false,
          }}
        />  
        <Tab.Screen
          name="Noticias"
          component={ViewNotice}
          options={{
            headerShown: false,
          }}
        />  
               
      </Tab.Navigator>
    </>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}
