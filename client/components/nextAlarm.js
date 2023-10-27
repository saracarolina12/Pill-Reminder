import { Pressable, View, Image, StyleSheet, Text, TextInput, ToastAndroid, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Color } from '../util/colors'
import { AntDesign } from '@expo/vector-icons';

export default NextAlarm = ({ url, pill, amount, when}) => {
    const [btnColor, setBtnColor] = useState(Color[40]);

    const styles = StyleSheet.create({
        container: {
            padding: 8,
            borderRadius: 12,
            backgroundColor: 'white',
            flexDirection: 'row', // Cambiamos la dirección a horizontal
            alignItems: 'center', // Centramos verticalmente
            height:90,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 3,
            },
            shadowOpacity: 0.29,
            shadowRadius: 4.65,
            elevation: 5,
            // marginHorizontal:10,
            // marginVertical:5,
            margin:10
        },
        circleContainer: {
            width: 40, // Ancho del círculo
            height: 40, // Altura del círculo
            borderRadius: 20, // La mitad del ancho (para hacerlo circular)
            borderColor: '#A84687', // Color del círculo
            borderWidth:3,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 15,
        },
        textContainer: {
            marginLeft: 30, // Espacio entre el círculo y los textos
        },
        numeroText: {
            color: '#A84687', // Color del número
            fontSize: 25,
            fontFamily:'M1c-Bold'
        },
        text1: {
            fontSize: 20,
            fontFamily: "M1c-Medium"
        },
        text2: {
            fontSize: 15,
            color: '#9D9D9D',
            fontFamily: "M1c-Regular"
        },
        text3: {
            fontSize: 15,
            color: '#9D9D9D',
            fontFamily: "M1c-Regular",
            marginLeft:5
        },
        imagen: {
            width:50,
            height:50,
            marginLeft:10
        },
        clockContainer:{
            flexDirection:"row",
            alignItems:"center"
        }
    });
    
    
    return (
        // <View style={styles.container}>

        //     <Text style={{ fontFamily: 'M1c-Bold', fontSize: 35, color:"#DA5D74", marginBottom:"5%  " }}>Siguientes tomas</Text>

        //     <ScrollView style={styles.scrollView}>
        //         <Text style={styles.text}>
        //         Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        //         eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
        //         minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        //         aliquip ex ea commodo consequat. Duis aute irure dolor in
        //         reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        //         pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
        //         culpa qui officia deserunt mollit anim id est laborum.
        //         </Text>
        //     </ScrollView>
            
        // </View>
        <View style={styles.container}>
            <Image source={url} style={styles.imagen} />
            <View style={styles.textContainer}>
                <Text style={styles.text1}>{pill}</Text> 
                <Text style={styles.text2}>{amount}</Text>
                <View style={styles.clockContainer}>
                    <AntDesign name="clockcircleo" size={15} color="#A28CF5" />
                    <Text style={styles.text3}>{`Próxima ${when}`}</Text>
                </View>
            </View>
        </View>
    );
};

