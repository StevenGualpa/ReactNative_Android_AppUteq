import React, {useCallback} from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert} from "react-native";
import { LoginInic } from "../Login";

export function IniciarSesion() {
    return (
      <TouchableOpacity style={styles.IniciarSe} id="btnInicio">
        <Text style={{ textAlign: 'center', color: '#46b41e', fontWeight: '900', fontSize: 20 }}>
          Iniciar sesión
        </Text>
      </TouchableOpacity>
    );
  }
  export function Google({ correo, onGoogleLogin }) {
    const handleGoogleLogin = () => {
      if (!validateCorreo(correo)) {
        Alert.alert('Correo inválido', 'Por favor ingresa un correo válido de @uteq.edu.ec');
        return;
      }
      onGoogleLogin();
    };
  
    const validateCorreo = (email) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const endsWithUteq = email.toLowerCase().endsWith('@uteq.edu.ec');
      return regex.test(email) && endsWithUteq;
    };
  
    return (
      <TouchableOpacity style={styles.Goog} id="btnGoogle" onPress={handleGoogleLogin}>
        <Text style={{ textAlign: 'center', color: '#46b41e', fontWeight: '900', fontSize: 20 }}>
          Iniciar con Google
        </Text>
      </TouchableOpacity>
    );
  }
  
export function Cerrar(){
    return(
        <TouchableOpacity style={styles.CerrarSe}id="btnCerrar" onPress={()=>cerrarSesion()} >
            <Text style={{textAlign:'center', color:'white', fontWeight:'900', fontSize:20}}>
                Cerrar sesión
            </Text>            
        </TouchableOpacity>
    )
}

const cerrarSesion=()=>{
   <IniciarSesion/>
}
const styles=StyleSheet.create({
    IniciarSe:{
        marginTop:'5%',
        backgroundColor:'white',
        borderRadius:25,
        width:'80%',
        padding:15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 11,
        },
        shadowOpacity: 0.55,
        shadowRadius: 14.78,
        elevation: 22,
    },
    Goog:{
        marginTop:'7%',
        backgroundColor:'white',
        borderRadius:25,
        width:'80%',
        padding:15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 11,
        },
        shadowOpacity: 0.55,
        shadowRadius: 14.78,
        elevation: 22,
    },
    CerrarSe:{
        marginTop:'5%',
        marginLeft:'10%',
        backgroundColor:'red',
        borderRadius:25,
        width:'80%',
        padding:15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 11,
        },
        shadowOpacity: 0.55,
        shadowRadius: 14.78,
        elevation: 33,
    }
})