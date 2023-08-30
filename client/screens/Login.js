import { Pressable, View, Image, StyleSheet, Text, TextInput, ToastAndroid } from 'react-native';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Color } from '../util/colors'

export default Login = ({ route, navigation }) => {
    const [btnColor, setBtnColor] = useState(Color[40]);
    const [user, onChangeUser] = React.useState('');
    const [password, onChangePassword] = React.useState('');

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'pink',
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
            paddingVertical: '20%', // Adjust this value to increase the height
            alignItems: 'center',
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
        }
    });
    
    
    return (
        <LinearGradient
            colors={['#F8C0D2', '#F4B0C6', '#F497B5']}
            style={styles.container}>
            <View>
                <Text style={{ fontFamily: 'M1c-Bold', fontSize: 36, marginBottom: 20 }}>Pill Reminder</Text>
            </View>
            <View style={styles.emergentViewContainer}>
                <View style={styles.emergentView}>
                    <Text style={{fontFamily: 'M1c-Medium', fontSize:26}}>¡Hola de nuevo!</Text>
                    <Text style={{fontFamily: 'M1c-Regular', fontSize:16, color:'#A9A9A9', marginBottom:40}}>Inicia sesión para continuar</Text>

                    <View style={{backgroundColor:'#E9E9E9', padding:10, color:'#A9A9A9', borderRadius:10, margin:10, width:"70%"}}>
                        <TextInput
                            style={styles.input}
                            onChangeText={onChangeUser}
                            value={user}
                            placeholder="Usuario"
                        />
                    </View>

                    <View style={{backgroundColor:'#E9E9E9', padding:10, color:'#A9A9A9', borderRadius:10, margin:10, width:"70%"}}>
                        <TextInput
                            secureTextEntry={true}
                            style={styles.input}
                            onChangeText={onChangePassword}
                            value={password}
                            placeholder="Contraseña"
                        />
                    </View>

                    <Text style={{fontFamily:"M1c-Regular", color:'#A9A9A9', width:"70%", textAlign:'left', backgroundColor:'red'}}>Olvidé mi contraseña</Text>

                    <Pressable
                        style={styles.Button}
                        onPressIn={() => { 
                            console.log("pressed in");
                            setBtnColor(Color[50]) 
                        }} 
                        onPressOut={() => { 
                            console.log("pressed out");
                            setBtnColor(Color[40]) 
                        }
                    }>
                        <View style={{ justifyContent: "center", alignItems: "center", flexDirection: 'row'}}>
                            <Text style={{fontSize:15,fontFamily:'M1c-Regular', color:'white', marginLeft:5, marginTop:4 }} >
                                Iniciar Sesión
                            </Text>
                        </View>
                    </Pressable>

                    <Text style={{fontFamily:"M1c-Regular", color:'#A9A9A9'}}>¿No tienes una cuenta?</Text>
                </View>
            </View>
        </LinearGradient>
    );
};

