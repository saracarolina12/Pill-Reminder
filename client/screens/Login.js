import { Pressable, View, Image, StyleSheet, Text, TextInput, ToastAndroid } from 'react-native';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Color } from '../util/colors';
import axios from 'axios';

export default Login = ({ route, navigation }) => {
    const [btnColor, setBtnColor] = useState(Color[40]);
    const [txtColor, setTxtColor] = useState("#B19EF9");
    const [ForgotColor, setForgotColor] = useState("#A9A9A9");
    const [user, onChangeUser] = React.useState('');
    const [password, onChangePassword] = React.useState('');

    const endpooooooooooooooooooooint = "http://dapp.enlacenet.net:8532/"; // TODO: Add An env? 

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
    });

    const handleLogIn = async () => {
        try {
            const formData = {};
            var formComplete = true;
            formData.name = user ? user: formComplete = false;
            formData.password = password ? password: formComplete = false;

            if(!formComplete){
                console.log('Form is not complete'); // TODO: Add notif
                return;
            }
 
            const response = await axios.post(endpooooooooooooooooooooint + 'signin', formData);

            if (response.status === 200) {
                console.log('Sign in Successful', 'You are now logged in!');
            } else {
                console.log('Sign in Failed', 'Please try again.');
            }
        } catch (error) {
            console.log('Error', 'An error occurred while signing in.', error);
        }
    };

    return (
        <LinearGradient
            colors={['#F8C0D2', '#F4B0C6', '#F497B5']}
            style={styles.container}>

            {/* <View style={{alignContent:'center', alignItems:'center', backgroundColor:'red'}}>
                <View style={styles.circle}>
                    <Image
                    source={require("../assets/imgs/heart.png")}
                    style={styles.imagen}
                    />
                </View>
                <Text style={{ fontFamily: 'M1c-Bold', fontSize: 35}}>Pill Reminder</Text>
            </View> */}

            <View style={styles.container_img}>
                <View style={styles.circle}>
                <Image
                    source={require("../assets/imgs/heart.png")}
                    style={styles.imagen}
                />
                </View>
                <Text style={{ fontFamily: 'M1c-Bold', fontSize: 35 }}>Pill Reminder</Text>
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

                    <View style={{backgroundColor:'#E9E9E9', padding:10, color:'#A9A9A9', borderRadius:10, marginTop:10, marginBottom:4, width:"70%"}}>
                        <TextInput
                            secureTextEntry={true}
                            style={styles.input}
                            onChangeText={onChangePassword}
                            value={password}
                            placeholder="Contraseña"
                        />
                    </View>


                    <Pressable
                        style={{ width: "70%" }}
                        onPressIn={() => {
                            setForgotColor("#727272")
                        }}
                        onPressOut={() => {
                            navigation.navigate('Forgot');
                            setForgotColor("#A9A9A9")
                        }
                    }>
                        <Text style={{ fontFamily: "M1c-Regular", color: ForgotColor, textAlign: "right", textDecorationLine: 'underline' }}>
                            Olvidé mi contraseña
                        </Text>
                    </Pressable>

                    <Pressable
                        style={styles.Button}
                        onPressIn={() => {
                            setBtnColor(Color[50])
                        }}
                        onPressOut={() => {
                            handleLogIn();
                            // navigation.navigate("Main")
                            setBtnColor(Color[40])
                        }
                    }>
                        <View style={{ justifyContent: "center", alignItems: "center", flexDirection: 'row'}}>
                            <Text style={{fontSize:15,fontFamily:'M1c-Regular', color:'white', marginLeft:5, marginTop:4 }} >
                                Iniciar Sesión
                            </Text>
                        </View>
                    </Pressable>

                    <Pressable
                        onPressIn={() => {
                            setTxtColor("#8B7DC1")
                        }}
                        onPressOut={() => {
                            navigation.navigate('SignUp');
                            setTxtColor("#B19EF9")
                        }
                    }>
                        <Text style={{fontFamily:"M1c-Regular", color:"#A9A9A9"}}>¿No tienes una cuenta? <Text style={{fontFamily:"M1c-Bold", color:txtColor}}>Crea una</Text> </Text>
                    </Pressable>
                </View>
            </View>
        </LinearGradient>
    );
};

