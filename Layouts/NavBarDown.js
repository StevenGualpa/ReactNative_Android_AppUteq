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
            } else if (route.name === "Gestión") {
              iconName = focused ? "folder" : "folder";
            } else if (route.name === "Crear") {
              iconName = focused ? "plus" : "plus";
            } else if (route.name === "Noticias") {
              iconName = focused ? "newspaper-o" : "newspaper-o";
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
          name="Gestión"
          component={AppGestion}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Crear"
          component={Contenido}
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
