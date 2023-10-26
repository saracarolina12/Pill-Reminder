import { Pressable, View, Image, StyleSheet, Text, TextInput, ToastAndroid } from 'react-native';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Color } from '../util/colors'
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { URL } from '../util/configurations';

// TOOD: EVITAR QUE SE REGRESE A ESTA PANTALLA

export default SignUp = ({ route, navigation }) => {
    const [btnColor, setBtnColor] = useState(Color[40]);
    const [user, onChangeUser] = React.useState('');
    const [password, onChangePassword] = React.useState('');
    const [email, onChangeEmail] = React.useState('');
    const [confirmPassword, onChangeConfirmPassword] = React.useState('');
    
    
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
        Form: {
            transform: btnColor === Color[912]? [{translateY: 0}]: [{translateY: 2}] ,
            textAlign:'center', 
            padding: 3,
            borderRadius:20, 
            justifyContent: 'center',
            alignItems: 'center',
            width:270,
            alignContent: 'center',
            textAlign: 'center',
            justifyContent:'center',
            textAlignVertical:'center',
            marginTop:15
        },
        input: {
            height: 45,
            borderWidth: 1,
            padding: 10,
            borderRadius:15,
            width:250,
            paddingBottom:3
            // borderColor:'red'
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
    
    const handleSignUp = async () => {
        try {
            const formData = {};
            var formComplete = true;
            formData.name = user ? user: formComplete = false;
            formData.email = email ? email: formComplete = false;
            formData.password = password ? password: formComplete = false;

            if(!formComplete){  
                console.log('Form is not complete'); 
                return;
            }
            if(password != confirmPassword){
                console.log('Passwords don"t match');
                return;
            }

            const response = await axios.post(URL + 'signup', formData);
            
            if (response.status === 200) {
                console.log('Sign Up Successful', 'You are now registered!');
            } else {
                console.log('Sign Up Failed', 'Please try again later.');
            }
        } catch (error) {
            console.log('Error', 'An error occurred while signing up.', error);
        }
    };
    
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
                    <Pressable style={styles.Form} >
                        <View style={{paddingLeft:10, paddingRight:10, position:'absolute',backgroundColor:'white', zIndex:1, top:-7, left:20}}>
                            <Text style={{fontSize:13,/*fontFamily:'PopRegular'*/}}>Usuario</Text>
                        </View>
                        <View style={{ justifyContent: "center", alignItems: "center", flexDirection: 'row',}}>
                            <TextInput
                                onChangeText={onChangeUser}
                                value={user}
                                style={styles.input}
                                placeholder="Ingrese el usuario deseado"
                            />
                        </View>
                    </Pressable>

                    <Pressable style={styles.Form} >
                        <View style={{paddingLeft:10, paddingRight:10,position:'absolute',backgroundColor:'white', zIndex:1, top:-7, left:20}}>
                            <Text style={{fontSize:13,/*fontFamily:'PopRegular'*/}}>Correo</Text>
                        </View>
                        <View style={{ justifyContent: "center", alignItems: "center", flexDirection: 'row',}}>
                            <TextInput
                                onChangeText={onChangeEmail}
                                value={email}
                                style={styles.input}
                                placeholder="Ingrese un correo"
                            />
                        </View>
                    </Pressable>

                    <Pressable style={styles.Form} >
                        <View style={{paddingLeft:10, paddingRight:10,position:'absolute',backgroundColor:'white', zIndex:1, top:-7, left:20}}>
                            <Text style={{fontSize:13,/*fontFamily:'PopRegular'*/}}>Contraseña</Text>
                        </View>
                        <View style={{ justifyContent: "center", alignItems: "center", flexDirection: 'row',}}>
                            <TextInput
                                secureTextEntry
                                onChangeText={onChangePassword}
                                value={password}
                                style={styles.input}
                                placeholder="Ingrese la contraseña"
                            />
                        </View>
                    </Pressable>

                    <Pressable style={styles.Form} >
                        <View style={{paddingLeft:10, paddingRight:10,position:'absolute',backgroundColor:'white', zIndex:1, top:-7, left:20}}>
                            <Text style={{fontSize:13,/*fontFamily:'PopRegular'*/}}>Confirmar contraseña</Text>
                        </View>
                        <View style={{ justifyContent: "center", alignItems: "center", flexDirection: 'row',}}>
                            <TextInput
                                secureTextEntry
                                onChangeText={onChangeConfirmPassword}
                                value={confirmPassword}
                                style={styles.input}
                                placeholder="Ingrese nuevamente la contraseña"
                            />
                        </View>
                    </Pressable>

                    <Pressable
                        style={styles.Button}
                        onPressIn={() => { 
                            setBtnColor(Color[50]) 
                        }} 
                        onPressOut={() => { 
                            setBtnColor(Color[40]) 
                            handleSignUp();
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

