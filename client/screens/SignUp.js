import { Pressable, View, Image, StyleSheet, Text, TextInput, ToastAndroid } from 'react-native';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Color } from '../util/colors'
import { Ionicons } from '@expo/vector-icons';

export default SignUp = ({ route, navigation }) => {
    const [btnColor, setBtnColor] = useState(Color[40]);
    const [txtColor, setTxtColor] = useState("#B19EF9");
    const [ForgotColor, setForgotColor] = useState("#A9A9A9");
    const [user, onChangeUser] = React.useState('');
    const [password, onChangePassword] = React.useState('');

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            // backgroundColor: 'red',
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
        },
        container_img: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        imagen: {
            width: 75, 
            height: 75, 
            marginTop:5
            // backgroundColor:'red'
        },
        circle: {
            width: 95, 
            height: 95, 
            borderRadius: 55,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
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
                <View style={styles.circle}>
                <Image
                    source={require("../assets/imgs/heart.png")}
                    style={styles.imagen}
                />
                </View>
                <Text style={{ fontFamily: 'M1c-Bold', fontSize: 35 }}>Crear cuenta</Text>
            </View>

            <View style={styles.emergentViewContainer}>
                <View style={styles.emergentView}>
                    <View style={{backgroundColor:'#E9E9E9', padding:10, color:'#A9A9A9', borderRadius:10, margin:10, width:"70%"}}>
                        <TextInput
                            style={styles.input}
                            onChangeText={onChangeUser}
                            value={user}
                            placeholder="Ingrese el usuario deseado"
                        />
                    </View>

                    <View style={{backgroundColor:'#E9E9E9', padding:10, color:'#A9A9A9', borderRadius:10, marginTop:10, marginBottom:4, width:"70%"}}>
                        <TextInput
                            secureTextEntry={true}
                            style={styles.input}
                            onChangeText={onChangePassword}
                            value={password}
                            placeholder="Ingrese su correo"
                        />
                    </View>

                    <View style={{backgroundColor:'#E9E9E9', padding:10, color:'#A9A9A9', borderRadius:10, marginTop:10, marginBottom:4, width:"70%"}}>
                        <TextInput
                            secureTextEntry={true}
                            style={styles.input}
                            onChangeText={onChangePassword}
                            value={password}
                            placeholder="Ingrese la contraseña"
                        />
                    </View>

                    <View style={{backgroundColor:'#E9E9E9', padding:10, color:'#A9A9A9', borderRadius:10, marginTop:10, marginBottom:4, width:"70%"}}>
                        <TextInput
                            secureTextEntry={true}
                            style={styles.input}
                            onChangeText={onChangePassword}
                            value={password}
                            placeholder="Ingrese nuevamente la contraseña"
                        />
                    </View>

                    <Pressable
                        style={styles.Button}
                        onPressIn={() => { 
                            setBtnColor(Color[50]) 
                        }} 
                        onPressOut={() => { 
                            setBtnColor(Color[40]) 
                        }
                    }>
                        <View style={{ justifyContent: "center", alignItems: "center", flexDirection: 'row'}}>
                            <Text style={{fontSize:15,fontFamily:'M1c-Regular', color:'white', marginLeft:5, marginTop:4 }} >
                                Crear cuenta
                            </Text>
                        </View>
                    </Pressable>
                </View>
            </View>
        </LinearGradient>
    );
};

