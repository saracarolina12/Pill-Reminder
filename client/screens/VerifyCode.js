import { Pressable, View, Image, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, TouchableHighlight } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Color } from '../util/colors';
import { Ionicons } from '@expo/vector-icons';
import { isEnabled } from 'react-native/Libraries/Performance/Systrace';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { URL } from '../util/configurations';
import Alerta from '../components/alert';

export default VerifyCode = ({ route, navigation }) => {
    const [btnColor, setBtnColor] = useState(Color[40]);
    const [code, onChangeCode] = React.useState('', '', '', '');
    const [flexDirection, setflexDirection] = useState('column');
    let [resendEnabled, setResendEnabled] = React.useState(false);

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertHeader, setAlertHeader] = useState("");
    const [alertText, setAlertText] = useState("");
    function triggerAlert(header, text){
        setAlertHeader(header);
        setAlertText(text);
        setAlertVisible(false);
        setAlertVisible(true);
    }
    
    inputRefs = [
        React.createRef(),
        React.createRef(),
        React.createRef(),
        React.createRef()
    ]
    
    function goNext(index){
        if(index < 3){
            // onChangeCode(index ? code );
            inputRefs[index+1].focus()
        }
    }
    const [color,setColor] = useState('gray');
    const changeColor = () => {
        const newColor = color === 'gray' ? '#9D8BE4' : 'gray';
        setColor(newColor);
    };
    
    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor:"white",
            paddingTop: 40,
            flexWrap:'wrap'
        },
        emergentViewContainer: {
            width: '100%',
            alignItems: 'center',
            marginBottom: 0,
            flexWrap:'wrap'
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
        row:{
            flexDirection:'row',
            justifyContent: 'space-evenly'
        },
        input: {
            height: 55,
            margin: 15,
            width:57,
            borderBottomWidth: 1,
            padding: 10,
            borderColor:'#FC709B',
            fontFamily:'M1c-Regular',
            fontSize:28
        },
        underline:{
            textDecorationLine:'underline',
            color : color
        }
    });

    const handleVerify = async () => {
        try {
            if(code.length != 4){
                triggerAlert('Ooops', 'Por favor ingresa el codigo');
                console.log("Please write the code");
                return;
            }
            var verification = parseInt(code.join(""));
            const response = await axios.post(URL + 'verify', {code: verification});

            if (response.status === 200) {
                console.log('Codes match', 'You can change your password!');
                navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'NewPassword' }],
                })
              );
            } else {
                triggerAlert('Mmmmh', 'Ese no es el codigo');
                console.log("Code isn't right");
            }
        }
        catch (error) {
            triggerAlert('Mmmmh', 'Ese no es el codigo');
            console.log("Couldn't send code:", error);
        }
    };
    
    return (
        <LinearGradient colors={['#F8C0D2', '#F4B0C6', '#F497B5']} style={styles.container}>
            <Pressable onPressOut={() => { navigation.navigate('Login')}} style={{ position: 'absolute', top: 10, left: 10,  }}>
                <Ionicons name="chevron-back-outline" style={{ marginTop:40, marginLeft:10, alignSelf:'flex-start' }} size={35} color={Color[50]} />
            </Pressable>
        
            <View style={styles.container_img}>
                <Text style={{ fontFamily: 'M1c-Bold', fontSize: 30, textAlign:'center', color:Color[50], marginBottom:"5%" }}>Verificación</Text>
                <Image
                    source={require("../assets/imgs/forgot.png")}
                    style={styles.imagen}
                />
            </View>
        
            <View style={styles.emergentViewContainer}>
                <View style={styles.emergentView}>
                    <Text style={{fontFamily: 'M1c-Regular', fontSize:20, color:'#A9A9A9', marginBottom:40, marginTop:40, textAlign:'center'}}>Ingresa el código de verificación que enviamos a tu correo</Text>
                    <SafeAreaView style={styles.row}>
                        {this.inputRefs.map((k, idx) => (
                            <TextInput 
                                key={idx}
                                onChange={(text) => {
                                    const newCode = [...code]; 
                                    newCode[idx] = text.nativeEvent.text; // Update the value at the current index
                                    onChangeCode(newCode); // Update the state
                                    goNext(idx);
                                }}
                                ref={r => inputRefs[idx] = r} 
                                style={styles.input} 
                                maxLength={1} 
                                keyboardType = "numeric">
                            </TextInput>
                        ))}
                    </SafeAreaView>       
                    <Pressable
                        style={styles.Button}
                        onPressIn={() => { 
                            setBtnColor(Color[50]) 
                        }} 
                        onPressOut={() => { 
                            // navigation.navigate('NewPassword');
                            handleVerify();
                            setBtnColor(Color[40]);
                        }}
                    >
                        <View style={{ justifyContent: "center", alignItems: "center", flexDirection: 'row'}}>
                            <Text style={{fontSize:15,fontFamily:'M1c-Regular', color:'white', marginLeft:5, marginTop:4 }} >
                                Verificar
                            </Text>
                        </View>
                    </Pressable>
                </View>
            </View>
            {alertVisible && <Alerta header = {alertHeader} text = {alertText}/>}
        </LinearGradient>
        );
    };
    