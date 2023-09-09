import { Pressable, View, Image, StyleSheet, Text, TextInput, ToastAndroid } from 'react-native';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Color } from '../util/colors';
import { Ionicons } from '@expo/vector-icons';

export default NewPassword = ({ route, navigation }) => {
    const [btnColor, setBtnColor] = useState(Color[40]);
    const [mail, onChangeMail] = React.useState('');

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor:"white",
            paddingTop: 40,
        },
        emergentViewContainer: {
            width: '100%',
            alignItems: 'center',
            marginBottom: 0,
        },
        emergentView: {
            backgroundColor: 'white',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            width: '100%',
            paddingVertical: '12%', // Adjust this value to increase the height
            alignItems: 'center',
            paddingHorizontal:"8%",
        },
        Button:{
            backgroundColor: btnColor, 
            transform: btnColor === Color[912]? [{translateY: 0}]: [{translateY: 2}] ,
            textAlign:'center', 
            padding: 10,
            borderRadius:30 ,
            justifyContent: 'center',
            alignItems: 'center',
            elevation:10,
            shadowColor: "#000",
            width:180,
            shadowOpacity: 0.3,
            shadowRadius: 3,
            shadowOffset: {
                height: 5,
                width: 5
            },
            alignContent: 'center',
            marginTop:18,
            textAlign: 'center',
            justifyContent:'center',
            textAlignVertical:'center',
            marginBottom:18
        },
        container_img: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        imagen: {
            width: 150, 
            height: 150, 
            marginTop:5,
            marginBottom:"-5%"
        },
        container_pill: {
            flex: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor:'green'
        },
        circle: {
            width: 95, 
            height: 95, 
            borderRadius: 55,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        icon: {
            marginRight: 10, // Ajusta este valor según sea necesario
        },
    });
    
    
    return (
        <LinearGradient
            colors={['#F8C0D2', '#F4B0C6', '#F497B5']}
            style={styles.container}>

            <Pressable onPressOut={() => { navigation.navigate('Login')}} style={{ position: 'absolute', top: 10, left: 10,  }}>
                    <Ionicons name="chevron-back-outline" style={{ marginTop:40, marginLeft:10, alignSelf:'flex-start' }} size={35} color={Color[50]} />
            </Pressable>

            <View style={styles.container_img}>
                <Text style={{ fontFamily: 'M1c-Bold', fontSize: 30, textAlign:'center', color:Color[50], marginBottom:"5%" }}>¿Olvidaste tu contraseña?</Text>
                <Image
                    source={require("../assets/imgs/forgot.png")}
                    style={styles.imagen}
                />
            </View>

            <View style={styles.emergentViewContainer}>
                <View style={styles.emergentView}>
                    <Text style={{fontFamily: 'M1c-Medium', fontSize:24, color:'#4E4E4E', textAlign:'center'}}>Ingresa el correo asociado a tu cuenta</Text>
                    <Text style={{fontFamily: 'M1c-Regular', fontSize:16, color:'#A9A9A9', marginBottom:40, textAlign:'center'}}>Te enviaremos un código a tu correo para recuperar tu contraseña</Text>

                    <View style={{backgroundColor:'#E9E9E9', padding:10, color:'#A9A9A9', borderRadius:10, marginBottom:"5%",marginTop:"0%", width:"80%"}}>
                        <TextInput
                            style={styles.input}
                            onChangeText={onChangeMail}
                            value={mail}
                            placeholder="ejemplo@gmail.com"
                        />
                    </View>

                    
                    <Pressable
                        style={styles.Button}
                        onPressIn={() => { 
                            setBtnColor(Color[50]) 
                        }} 
                        onPressOut={() => { 
                            setBtnColor(Color[40]);
                            navigation.navigate("Login");
                        }
                    }>
                        <View style={{ justifyContent: "center", alignItems: "center", flexDirection: 'row'}}>
                            <Text style={{fontSize:15,fontFamily:'M1c-Regular', color:'white', marginLeft:5, marginTop:4 }} >
                                Guardar
                            </Text>
                        </View>
                    </Pressable>

                </View>
            </View>
        </LinearGradient>
    );
};

